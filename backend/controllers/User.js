const User = require("../models/User");

exports.createUser = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = new User(req.body);
        const doc = await user.save();
        res.status(201).json({ doc });
    } catch (err) {
        res.status(400).send(err);
    }
}