import express from "express";
import { addProduct, getAllProducts } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addProduct);
router.get("/", authMiddleware, getAllProducts);

export default router;
