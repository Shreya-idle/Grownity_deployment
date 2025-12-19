import { auth } from "../config/firebase_config.js";
import { User } from "../models/User.js";

export const checkSessionCookie = async (req, res, next) => {
  const sessionCookie = req.cookies.session ;
  if (!sessionCookie) {
    return res.status(401).json({ error: "Unauthorized: No session cookie" });
  }

  try {    
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Session Verification Error:", error);
    res.clearCookie("session", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("uid", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("picture", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
    res
      .status(401)
      .json({ error: "Unauthorized: Invalid session cookie", details: error.message });
  }
};


export const checkSuperUser = async (req, res, next) => {
  try {
      const cookie_uid = req.cookies.uid;
      console.log(cookie_uid)
      if (!cookie_uid) {
          return res.status(401).json({
              message: "User not authenticated. Please log in.",
          });
      }

    
      const user = await User.findOne({ firebaseUid: cookie_uid });
      if (!user) {
          return res.status(404).json({
              message: "User not found.",
          });
      }

      if (user.isSuperUser !== true) {
          return res.status(403).json({
              message: "Forbidden: You do not have administrative privileges.",
          });
      }

      next();
  } catch (error) {
      console.error("Super user check error:", error);
      res.status(500).json({
          message: "Error verifying user permissions.",
          error: error.message,
      });
  }
};

 
export const checkCommunityAdmin = async (req, res, next) => {
  try {
      const cookie_uid = req.cookies.uid;
      if (!cookie_uid) {
          return res.status(401).json({
              message: "User not authenticated. Please log in.",
          });
      }

      const user = await User.findOne({ firebaseUid: cookie_uid });

      if (!user) {
          return res.status(404).json({
              message: "User not found.",
          });
      }

      if (!user.communityAdmin.includes(req.params.communityId)) {
          return res.status(403).json({
              message: "Forbidden: You do not have administrative privileges for this community.",
          });
      }

      next();
  } catch (error) {
      console.error("Community admin check error:", error);
      res.status(500).json({
          message: "Error verifying user permissions.",
          error: error.message,
      });
  }
};

