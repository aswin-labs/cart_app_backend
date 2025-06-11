import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/add", authMiddleware, addToCart);
// router.get("/", authMiddleware, getCart);
// router.delete("/:productId", authMiddleware, removeFromCart);

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/:productId", removeFromCart);

export default router;
