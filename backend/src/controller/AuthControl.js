import { auth } from "../config/firebase_config.js";
import { User } from "../models/User.js";


const findOrCreateUser = async ({ uid, email, name }) => {
  let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
  if (!user) {
    let username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
    }
    user = new User({
      firebaseUid: uid,
      email,
      name,
      username,
    });
    await user.save();
  }
  user.isActive = true;
  return user;
};


export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;


    if (!idToken) {
      return res.status(400).json({ error: "Missing Google ID token" });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;


    let user = await findOrCreateUser({ uid, email, name });
    const expiresIn = 60 * 60 * 24 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });


    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });


    res.cookie("uid", uid, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });


    res.cookie("picture", picture, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });


    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res
      .status(401)
      .json({ error: "Authentication failed", details: error.message });
  }
};


export const logout = async (req, res) => {
  const sessionCookie = req.cookies.session || "";
  const cookie_uid = req.cookies.uid;
  if (cookie_uid) {
    const user = await User.findOne({ firebaseUid: cookie_uid });
    if (user) {
      user.isActive = false;
      await user.save();
    }
  }
  res.clearCookie("session", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
  res.clearCookie("uid", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
  res.clearCookie("picture", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
  
  if (sessionCookie) {
    try {
      const auth = auth();
      const decodedClaims = await auth.verifySessionCookie(
        sessionCookie,
        true
      );
      await auth.revokeRefreshTokens(decodedClaims.uid);
    } catch (error) {
 
    }
  }
  return res.status(200).json({ message: "Logout successful" });
};