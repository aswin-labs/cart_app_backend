import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

// Add Product - POST
const addProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    const product = await Product.create({ name, price });
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding Product", error });
  }
};

// Get All Products - GET
const getAllProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Get user's cart
    const cart = await Cart.findOne({ userId });

    // Create a map of productId -> quantity
    const cartMap = new Map();
    if (cart) {
      cart.items.forEach(item => {
        cartMap.set(item.productId.toString(), item.quantity);
      });
    }

    // Fetch all products
    const products = await Product.find();

    // Add alreadyInCart and count to each product
    const updatedProducts = products.map(product => {
      const quantity = cartMap.get(product._id.toString()) || 0;
      return {
        ...product.toObject(),
        alreadyInCart: quantity > 0,
        count: quantity
      };
    });

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get Product by ID - GET
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId });

    // Check if product is in the cart
    let alreadyInCart = false;
    let count = 0;

    if (cart) {
      const cartItem = cart.items.find(
        (item) => item.productId.toString() === id
      );
      if (cartItem) {
        alreadyInCart = true;
        count = cartItem.quantity;
      }
    }

    // Return product with cart info
    res.status(200).json({
      ...product.toObject(),
      alreadyInCart,
      count,
    });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    res.status(500).json({ message: "Server error", error });
  }
};

export { addProduct, getAllProducts, getSingleProduct };
