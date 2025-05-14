import { User } from "../models/user.model.js";
export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;//istekten gelen verileri al


        const user = await User.findOne({ clerkId: id });//clerkId ile veritabanında kullanıcı var mı kontrol et
        if (!user) {// kullanıcı yoksa olustur signup

            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            });
        }
        res.status(200).json({ success: true })
    } catch (error) {
        console.log("error in auth callback", error);
        res.status(500).json({ message: "Internal server error", error })
        next(error);
    }
}