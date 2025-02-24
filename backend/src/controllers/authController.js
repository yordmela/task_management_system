import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        

        const newUser = await User.create({ name, email, password });


        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
          }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId=req.user.id;
        const user= await User.findById(userId).select("-password"); // exclude password
        if (!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message: "User found", user});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id; // Get the user ID from the request params
        const user = await User.findById(id).select("-password"); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User found",
            user, // Return the user object (without password)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


