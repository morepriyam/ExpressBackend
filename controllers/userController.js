// Import necessary modules and libraries
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = "NOTESAPI";

// Controller for user signup
const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user with the given email already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const result = await userModel.create({
      email: email,
      password: hashedPassword,
    });

    // Generate a JSON Web Token for the new user
    const token = jwt.sign({ email: result.email, id: result._id }, secret_key);

    // Respond with user data and token
    res.status(200).json({ user: result, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Controller for user signin
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user with the given email
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Compare the provided password with the stored hashed password
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Generate a JSON Web Token for the authenticated user
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret_key
    );

    // Respond with user data and token
    res.status(200).json({ user: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Middleware to authenticate using JWT
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret_key, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach the user object to the request
      next(); // Move to the next middleware/controller
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Controller to fetch user details
const me = async (req, res) => {
  const user = req.user; // User object attached by the authenticateJwt middleware
  res.status(200).json({ email: user.email });
};

// Export all the controllers and middleware
module.exports = { signup, signin, me, authenticateJwt };
