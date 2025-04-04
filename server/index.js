const express = require("express");
const cors = require("cors");
const router = require("./router");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = 8000;

const app = express();

app.listen(PORT, async () => {
    console.log(`server up on port ${PORT}`);
});

//should be added before express bytargem el data bt3t el post for decoding
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });
