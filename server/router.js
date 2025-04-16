const router = require("express").Router();
const { Login, Register, ForgetPassword } = require("./controllers/User");
const TransactionController = require("./controllers/Transaction");
const CourierController = require("./controllers/Courier");

router.get("/", (req, res) => {
    res.send("Let's build a CRUD API!");
});

router.post("/auth/login/", Login);
router.post("/auth/register/", Register);
router.put("/auth/forget-password/", ForgetPassword);

router.post("/transactions", TransactionController.createTransaction);
router.get("/transactions/:userId", TransactionController.getUserTransactions);
router.get("/transactions/details/:transactionId", TransactionController.getTransactionById);

router.post("/couriers", CourierController.createCourier);
router.get("/couriers/:id", CourierController.getCourierById);
router.put("/couriers/:id", CourierController.updateCourier);
router.delete("/couriers/:id", CourierController.deleteCourier);

module.exports = router;
