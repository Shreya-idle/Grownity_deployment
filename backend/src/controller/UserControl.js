import { User } from "../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

export const getUser = async (req, res) => {
  try {
    const cookie_uid = req.cookies.uid;
    let user = await User.findOne({firebaseUid: cookie_uid });
    if (user) {
      user.isActive = true;
      user.lastActive = new Date();
      await user.save();
    }

    const profileImage = req.cookies.picture

    let userObj = user.toObject();


    userObj.profileImage = profileImage;

    if (!userObj.isSuperUser){
      delete userObj.isSuperUser;
    }

    return res.status(200).json({
      message: "User found.",
      user: userObj,
    });
  } catch (error) {
    return res.status(404).json({
      message: `Error occured ${error.message}`,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const cookie_uid = req.cookies.uid;
    if (!cookie_uid) {
      return res.status(401).json({
        message: "User not authenticated. Please log in.",
      });
    }

    const { name, username, description } = req.body;

    if (!name && !username && !description) {
      return res.status(400).json({
        message: "At least one updatable field (name, username, or description) must be provided.",
      });
    }


    const user = await User.findOne({ firebaseUid: cookie_uid });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }


    if (name !== undefined) {
      user.name = name;
    }
    if (username !== undefined) {

      const existingUsername = await User.findOne({
        username,
        firebaseUid: { $ne: cookie_uid }
      });
      if (existingUsername) {
        return res.status(409).json({
          message: "Username already exists.",
        });
      }
      user.username = username;
    }
    if (description !== undefined) {
      user.description = description;
    }


    user.lastActive = new Date();

    await user.save();


    const { firebaseUid, email, ...safeUser } = user.toObject();
    res.status(200).json({
      message: "User updated successfully.",
      user: safeUser,
    });

  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Error updating user.",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ rolesHaving: "admin" }).lean();
    console.log(users)
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

