const fastify = require("fastify")({ logger: true, ignoreTrailingSlash: true });
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Register CORS
fastify.register(require("@fastify/cors"), {
    origin: ["http://localhost:3000"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});

dotenv.config();

const PORT = 8000;

fastify.register(require("./router"));

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("Connected to MongoDB");

        fastify.listen({ port: PORT }, (err, address) => {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            console.log(`Server Listening at ${address}`);
        });
    })
    .catch((err) => {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    });
