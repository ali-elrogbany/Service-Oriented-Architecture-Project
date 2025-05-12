const bcrypt = require("bcryptjs");

const User = require("../models/User");

const Login = async (request, reply) => {
    try {
        const { username, password } = request.body;

        const requestedUser = await User.findOne({ username }).exec();
        if (!requestedUser) {
            return reply.send({ authenticated: false, reason: "Invalid Username" });
        }

        const match = await bcrypt.compare(password, requestedUser.password);
        if (match) {
            return reply.send({ authenticated: true, userId: requestedUser._id, email: requestedUser.email });
        } else {
            return reply.send({ authenticated: false, reason: "Incorrect Password" });
        }
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send(err);
    }
};

const Register = async (request, reply) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: request.body.username }).exec();
        if (existingUser) {
            return reply.status(400).send({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(request.body.password, 1);

        const user = new User({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
            createdAt: request.body.createdAt,
        });

        const savedUser = await user.save();
        return reply.send(savedUser);
    } catch (err) {
        return reply.status(500).send({ message: "Error registering user", error: err });
    }
};

const ForgetPassword = async (request, reply) => {
    try {
        const { username, oldPassword, newPassword } = request.body;

        const requestedUser = await User.findOne({ username }).exec();
        if (!requestedUser) {
            return reply.send({ accepted: false, reason: "Invalid Username" });
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
            return reply.send({ accepted: true, user: updatedUser });
        } else {
            return reply.send({ accepted: false, reason: "Incorrect Password" });
        }
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send(err);
    }
};

module.exports = {
    Login,
    Register,
    ForgetPassword,
};
