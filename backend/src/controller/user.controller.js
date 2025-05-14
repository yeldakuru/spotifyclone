import { User } from "../models/user.model.js";


export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;//req.auth.userId ile gelen id'yi al
        const users = await User.find({ clerkId: { $ne: currentUserId } });// MongoDB'de clerkId'si currentUserId olmayan kullanıcıları bul
        // $ne = not equal
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

