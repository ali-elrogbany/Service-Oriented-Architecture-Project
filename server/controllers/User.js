const bcrypt = require("bcrypt");

const User = require("../models/User");

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const requestedUser = await User.findOne({ username }).exec();
        if (!requestedUser) {
            return res.json({ authenticated: false, reason: "Invalid Username" });
        }

        const match = await bcrypt.compare(password, requestedUser.password);
        if (match) {
            res.json({ authenticated: true });
        } else {
            res.json({ authenticated: false, reason: "Incorrect Password" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const Register = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 1);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        createdAt: req.body.createdAt,
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.send(err);
    }
};

const ForgetPassword = async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;

        const requestedUser = await User.findOne({ username }).exec();
        if (!requestedUser) {
            return res.json({ accepted: false, reason: "Invalid Username" });
        }

        const match = await bcrypt.compare(oldPassword, requestedUser.password);
        if (match) {
            const hashedPassword = await bcrypt.hash(newPassword, 1);
            const updatedUser = await User.findOneAndUpdate(
                { _id: requestedUser._id },
                {
                    $set: {
                        password: hashedPassword,
                    },
                }
            );
            res.json({ accepted: true, user: updatedUser });
        } else {
            res.json({ accepted: false, reason: "Incorrect Password" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports = {
    Login,
    Register,
    ForgetPassword,
};
