const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        }, 
        userId: user._id // ✅ Include userId in the response
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  



exports.getAllUserNames = async (req, res) => {
    try {
      const users = await User.find({}, "name"); // Fetch only 'name' field
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
