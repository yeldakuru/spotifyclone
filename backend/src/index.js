import express from 'express';
import dotenv from 'dotenv';
import path from 'path';//import path module to use __dirname

import fileUpload from 'express-fileupload';//import express-fileupload module to use file upload
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from "@clerk/express";

import cors from 'cors';//import cors module to use cors
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statsRoutes from './routes/stat.route.js';




dotenv.config();//bu satır, .env dosyasındaki değişkenleri process.env nesnesine yükler


const app = express(); //bu satır, express uygulamasını başlatır
const PORT = process.env.PORT || 5000; //bu satır, PORT değişkenini alır, eğer yoksa 5000 olarak ayarlar
const __dirname = path.resolve(); // Get the current directory name

app.use(cors(
    {
        origin: "http://localhost:3000",//bu satır, cors'u ayarlar. sadece bu domain'den gelen isteklere izin verir

    }
));
app.use(express.json()); //bu satır, gelen isteklerin json formatında olduğunu belirtir to parse json data (req.body)

app.use(clerkMiddleware());//bu satır, clerk middleware'ini kullanır. Bu middleware, kullanıcı kimlik doğrulamasını sağlar.
//this will add auth to req obj => req.auth.

//bu file upload middleware'i, gelen isteklerdeki dosyaları req.files objesine ekler
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
app.use("/api/stat", statsRoutes);

//error handling middleware
app.use((err, req, res, next) => {//bu mddleware, next(error) kullanıldıgında çağrılır
    //her fonksiyona yazmaktansa tek bir yerde yazılır
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });//eğer node env production ise sadece "Internal server error" mesajını döner
});

app.listen(PORT, () => {//bu satır, uygulamanın belirtilen portta dinlemeye başlamasını sağlar
    console.log(`Server is running on port ${PORT}`);//bu satır, uygulamanın hangi portta çalıştığını konsola yazdırır
    connectDB();//bu satır, veritabanına bağlanır
})
