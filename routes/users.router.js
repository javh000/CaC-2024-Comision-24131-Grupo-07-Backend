const express = require("express");
const router = express.Router();

const controller = require("../controllers/users.controller");
const middleware = require("../middleware/auth.middleware");

router.post("/register", controller.registerUser);
router.post("/logIn", controller.logInUser);
router.get("/getAllUsers",controller.getAllUsers);
router.get("/getUser/:id",controller.getUser);
router.delete("/delete/:id",controller.deleteUser);
router.put("/updateUser",controller.updateUser);

router.get("/protected",middleware,controller.protected)

module.exports = router;
