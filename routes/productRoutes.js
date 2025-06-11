import express from "express";
import { addProduct, getAllProducts, getSingleProduct } from "../controllers/productController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/", authMiddleware, addProduct);
// router.get("/", authMiddleware, getAllProducts);
// router.get("/:id",authMiddleware, getSingleProduct);

router.post("/", addProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);


export default router;
