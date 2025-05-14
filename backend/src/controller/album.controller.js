import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) => {//bu fonksiyon, tüm albümleri getirir
    try {
        const albums = await Album.find()//albümleri bul bütün albumleri getir;
        res.status(200).json(albums);//200 durum kodu ile albümleri döner
    } catch (error) {

        next(error);//this will call the error handling middleware
    }
}

export const getAlbumById = async (req, res, next) => {
    try {
        const { albumId } = req.params;//req.params ile gelen id'yi al
        const album = await Album.findById(albumId).populate("songs");//albumId değişkenine karşılık gelen albümü MongoDB'den bulur.Ardından .populate("songs") ile referans olarak tutulan şarkı (song) verilerini de getirir.
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.status(200).json(album);
    } catch (error) {
        next(error);//this will call the error handling middleware
    }
}