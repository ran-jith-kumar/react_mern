const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '30d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '30d' });
            res.json({ token, user });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
