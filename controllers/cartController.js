import Cart from "../models/cartModel.js";

// Add to global cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Get the single cart, or create if none exists
    let cart = await Cart.findOne();
    if (!cart) cart = new Cart({ items: [] });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    return res.json({
      success: true,
      message: "Product added to cart successfully",
      addedProductId: productId,
      quantity: existingItem ? existingItem.quantity : 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while adding item to cart" });
  }
};

// Get global cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.productId", "name price");

    if (!cart) {
      return res.json({ items: [] });
    }

    const itemsWithDetails = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    res.json({ items: itemsWithDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from global cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    return res.json({
      success: true,
      message: "Product removed from cart successfully",
      removedProductId: productId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

export { addToCart, getCart, removeFromCart };
