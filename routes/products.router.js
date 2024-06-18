const express = require("express");
const router = express.Router();

const controller = require("../controllers/products.controller");

router.get("/", controller.getAllProducts);
router.get("/:id", controller.showProduct);
router.post("/", controller.storeProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
