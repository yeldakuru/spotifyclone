import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "cloudinary";


//helper function to upload files to cloudinary
const uploadtoCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {//cloudinary'e yükle
            resource_type: "auto",//resource type otomatik olarak belirlenir
        });
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadtoCloudinary", error);
        throw new Error("Error uploading to cloudinary");

    }
}

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {//eğer dosyalar yoksa
            return res.status(400).json({ message: "Please upload all files." });
        }
        const { title, artist, albumId, duration } = req.body//req.body ile gelen verileri al
        const audioFile = req.files.audioFile;//req.files ile gelen dosyaları al
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadtoCloudinary(audioFile);//audio dosyasını cloudinary'e yükle
        const imageUrl = await uploadtoCloudinary(imageFile);

        const song = new Song({//bu satır, yeni bir şarkı nesnesi oluşturur
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        })
        await song.save();
        //if song belongs to an album, push the song id to the album's songs array
        if (albumId) {//eğer şarkı bir albüme ait ise , albümün şarkılar dizisine şarkı id'sini ekle
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            })
        }
        res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong", error);
        next(error);//this will call the error handling middleware
    }
}

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;//req.params ile gelen id'yi al
        const song = await Song.findById(id);//id ile şarkıyı bul
        if (song.albumId) {//eğer şarkı bir albüme ait ise , albümün şarkılar dizisinden şarkı id'sini sil
            await Album.findByIdAndUpdate(song.albumId, {//albumId ile albümü bul
                $pull: { songs: song._id }//şarkı id'sini albümün şarkılar dizisinden sil
            })
        }
        await Song.findByIdAndDelete(id);//id ile şarkıyı bul ve sil
        res.status(200).json({ message: "Song deleted successfully" });//şarkı silindi mesajını döner
    } catch (error) {
        console.log("Error in deleteSong", error);
        next(error);//this will call the error handling middleware
    }
}

export const createAlbum = async (req, res, next) => {
    try {

        const { title, artist, releaseYear } = req.body//req.body ile gelen verileri al
        const { imageFile } = req.files

        const imageUrl = await uploadtoCloudinary(imageFile);//image dosyasını cloudinary'e yükle

        const album = new Album({//bu satır, yeni bir albüm nesnesi oluşturur
            title,
            artist,
            imageUrl,
            releaseYear
        })
        await album.save();
        res.status(201).json(album);//albüm oluşturuldu mesajını döner

    } catch (error) {
        console.log("Error in createAlbum", error);
        next(error);//this will call the error handling middleware
    }
}

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;//req.params ile gelen id'yi al
        await Song.deleteMany({ albumId: id });//id ile albümü bul ve sil
        await Album.findByIdAndDelete(id);//id ile albümü bul ve sil
        res.status(200).json({ message: "Album deleted successfully" });//albüm silindi mesajını döner
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);//this will call the error handling middleware
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true });//admin kontrolü başarılı mesajını döner
}