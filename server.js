import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import cors from "cors"


dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use(cors())

app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart",cartRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 4000;
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
