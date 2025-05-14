import express from 'express';
import dotenv from 'dotenv';
import path from 'path';//import path module to use __dirname
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from "@clerk/express";
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statsRoutes from './routes/stats.route.js';
import { use } from 'react';



dotenv.config();
const __dirname = path.resolve(); // Get the current directory name
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //to parse json data (req.body)

app.use(clerkMiddleware());//this will add auth to req obj => req.auth.
app.use(fileUpload({//this will add file upload to req obj => req.files
    useTempFiles: true,//this will use temp files
    tempFileDir: path.join(__dirname, '/temp'),//dosyaların nereye geçici olarak kaydedileceğini belirtir
    //__dirname mevcut dosyanın bulunduğu klasörü temsil eder
    //geçici dosyalar projenizin içinde /temp klasörüne yazılır
    createParentPath: true,//eğer temp klasörü yoksa oluşturur
    limits: {
        fileSize: 10 * 1024 * 1024 //10mb max file size
    },
}));



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);

//error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
