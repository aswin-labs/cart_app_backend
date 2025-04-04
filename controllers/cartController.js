import Cart from "../models/cartModel.js";

const addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.userId })
            .populate("items.productId", "name price");

        if (!cart) {
            return res.json({ items: [] });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.userId });

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();
    res.json(cart);
};

export {addToCart, getCart, removeFromCart}
