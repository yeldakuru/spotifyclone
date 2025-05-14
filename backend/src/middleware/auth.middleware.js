import { clerkClient } from "@clerk/express";

//kullanıcının giriş yapıp yapmadığını kontrol eden middleware
export const protectRoute = async (req, res, next) => {//req.auth.userId varsa ➜ devam eder (next() ile).
    if (!req.auth.userId) {
        res.status(401).json({ message: "Unauthorized - you must be logged in" });
        return;
    }
    next();

}
// admin olup olmadığını kontrol eden middleware
export const requireAdmin = async (req, res, next) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);//req.auth.userId ile kullanıcının bilgilerini al
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;// admin olup olmadığını kontrol et

        if (!isAdmin) {
            return res.status(403).json({ message: "Unauthorized - you must be an admin" });
        }

        next();//if admin ise sonraki fonksiyona geç(admin.route sırasında createSong fonksiyonu)
    } catch (error) {
        next(error);//hata varsa error handling middleware'e geç
    }
};