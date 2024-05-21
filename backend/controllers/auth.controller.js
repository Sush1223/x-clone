import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, userName } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email is not valid",
      });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        error: "User name already taken",
      });
    }

    const existingEmail = await User.findOne({ userName });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already taken",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userName,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        userName: newUser.userName,
        followers: newUser.followers,
        following: newUser.following,
        profileImge: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || "" // use  empty string for avoiding error when password is undefined when it is compared by bcrypt
    );
    if (!user || !isPasswordValid) {
      return res.status(400).json({
        error: "Invalid Username or Password",
      });
    }

    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      followers: user.followers,
      following: user.following,
      profileImge: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: " Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    return res.status(200).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      followers: user.followers,
      following: user.following,
      profileImge: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
