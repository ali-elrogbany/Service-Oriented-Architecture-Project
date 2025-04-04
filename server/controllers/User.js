const User = require("../models/User");

const getUsers = async (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.send(err));
};

const createUser = async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        createdAt: req.body.createdAt,
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.send(err);
    }
};

const updateUser = async (req, res) => {
    try {
        console.log(`Updating`);
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userID },
            {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    user_name: req.body.user_name,
                    email: req.body.email,
                    password: req.body.password,
                    createdAt: req.body.createdAt,
                },
            },
            { new: true }
        );
        console.log(`Updated`);
        res.json(updatedUser);
    } catch (err) {
        console.log(`Not Updated`);
        res.send(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log("Deleteing");
        await User.deleteOne({ _id: req.params.userID });
        res.json({ message: `User ${req.params.userID} Deleted` });
    } catch (err) {
        res.send(err);
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
