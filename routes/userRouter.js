const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    //validation
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: 'Not all fields have been entered' });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: 'the password must be 5 characters long' });
    if (password !== passwordCheck)
      return res.status(400).json({ msg: 'Passwords do not match' });
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'account with this email already exists' });
    }
    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
