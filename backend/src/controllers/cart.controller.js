import {
  increamentProductQuantity,
  addNewProductToCart,
  findCartByUser,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
} from "../dao/cart.dao.js";
import {
  findProductById,
  getProductById,
  updateProduct,
} from "../dao/product.dao.js";

export async function addToCartController(req, res) {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await findProductById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    let cart = await increamentProductQuantity(userId, productId, quantity);

    if (!cart) {
      cart = await addNewProductToCart(userId, productId, quantity);
    }

    res.status(201).json({
      message: "Product added to cart.",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getCartController(req, res) {
  try {
    const userId = req.user._id;
    const cart = await findCartByUser(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        message: "Cart is empty",
        items: [],
        totalAmount: 0,
      });
    }

    const cartItems = cart.items.map((item) => {
      const product = item.product;
      const quantity = item.quantity;

      return {
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url || null,
        price: product.price,
        quantity,
        itemTotal: product.price * quantity,
      };
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    );

    res.status(200).json({
      message: "Cart fetched successfully.",
      items: cartItems,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
}

export async function updateCartQuantityController(req, res) {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const product = await getProductById(productId);

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "ProductId and quantity are required" });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }
    const updatedCart = await updateProductQuantity(
      userId,
      productId,
      quantity
    );
    if (!updatedCart) {
      return res.status(404).json({
        message: "Cart or product not found",
      });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      updatedCart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

export async function removeProductFromCartController(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    const updatedCart = await removeProductFromCart(userId, productId);

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    res.status(200).json({
      message: "Product removed successfully.",
      updatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

export async function clearCartController(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).json({ message: "User ID is required." });
    }
    const updatedCart = await clearCart(userId);

    if (!updatedCart) {
      return res.status(404).json({ message: "cart not found!" });
    }
    res.status(200).json({
      message: "Cart cleared successfully.",
      updatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
