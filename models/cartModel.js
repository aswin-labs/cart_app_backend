import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: String,
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product" // reference to Product model
            },
            quantity: Number
        }
    ]
});

export default mongoose.model("Cart", cartSchema);
