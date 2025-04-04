const router = require("express").Router();
const { Login, Register, ForgetPassword } = require("./controllers/User");

router.get("/", (req, res) => {
    res.send("Let's build a CRUD API!");
});

router.post("/auth/login/", Login);
router.post("/auth/register/", Register);
router.put("/auth/forget-password/", ForgetPassword);

module.exports = router;
