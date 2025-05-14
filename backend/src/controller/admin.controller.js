import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "cloudinary";


//helper function to upload files to cloudinary
const uploadtoCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadtoCloudinary", error);
        throw new Error("Error uploading to cloudinary");

    }
}

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files." });
        }
        const { title, artist, albumId, duration } = req.body
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadtoCloudinary(audioFile);
        const imageUrl = await uploadtoCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        })
        await song.save();
        //if song belongs to an album, push the song id to the album's songs array
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            })
        }
        res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong", error);
        next(error);
    }
}