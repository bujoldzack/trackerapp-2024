const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.signup = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const errors = {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.name = 'Name is required and must be a valid string.';
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.name = 'Name must contain only letters and spaces.';
    }
    if (!username || typeof username!== 'string' ||!username.trim()) {
      errors.username = 'Username is required and must be a valid string.';
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.username = 'Username must contain only letters and numbers.';
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      errors.password = 'Password is required and must be a valid string.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      errors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      name
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token, user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


