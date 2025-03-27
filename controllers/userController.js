import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    console.log("The request body is:", req.body);
    const { username, email, password } = req.body;

    // Validate request body
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All Fields required" }); // ✅ RETURN ADDED
    }

    // Check if email is already in use
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res.status(400).json({ message: "Email already in use" }); // ✅ RETURN ADDED
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password: ${hashedPassword}`);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT Token
    const token = jwt.sign({ userid: user._id }, process.env.SECRET, {
    //   expiresIn: "1h",
    });

    // Return success response
    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Ensure no duplicate response
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message }); // ✅ RETURN ADDED
    }
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if all fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT Token
    const token = jwt.sign({ userid: user._id }, process.env.SECRET);
    // Return success response
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerUser, loginUser };
