import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

export const cartsRouter = Router();

/** GET /api/carts/:cid  -> populate products */
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate(
      "products.product"
    );
    if (!cart)
      return res.status(404).json({ status: "error", error: "Cart not found" });
    res.json({ status: "success", payload: cart });
  } catch {
    res.status(400).json({ status: "error", error: "Invalid id" });
  }
});

/** POST /api/carts/:cid/products/:pid -> agregar (o sumar) */
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  const cart = await CartModel.findById(cid);
  if (!cart)
    return res.status(404).json({ status: "error", error: "Cart not found" });

  const prod = await ProductModel.findById(pid);
  if (!prod)
    return res
      .status(404)
      .json({ status: "error", error: "Product not found" });

  const idx = cart.products.findIndex((p) => p.product.toString() === pid);
  if (idx === -1) cart.products.push({ product: pid, quantity });
  else cart.products[idx].quantity += Number(quantity);

  await cart.save();
  res.json({ status: "success", payload: cart });
});

/** DELETE /api/carts/:cid/products/:pid */
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart)
    return res.status(404).json({ status: "error", error: "Cart not found" });

  cart.products = cart.products.filter((p) => p.product.toString() !== pid);
  await cart.save();
  res.json({ status: "success", payload: cart });
});

/** PUT /api/carts/:cid -> reemplaza arreglo completo [{product, quantity}] */
cartsRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ status: "error", error: "products must be an array" });
  }
  const ids = products.map((p) => p.product);
  const count = await ProductModel.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) {
    return res
      .status(400)
      .json({ status: "error", error: "Some product ids do not exist" });
  }

  const cart = await CartModel.findByIdAndUpdate(
    cid,
    {
      products: products.map((p) => ({
        product: p.product,
        quantity: p.quantity ?? 1,
      })),
    },
    { new: true }
  );
  if (!cart)
    return res.status(404).json({ status: "error", error: "Cart not found" });
  res.json({ status: "success", payload: cart });
});

/** PUT /api/carts/:cid/products/:pid -> actualiza SOLO la cantidad */
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const qty = Number(req.body.quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    return res
      .status(400)
      .json({ status: "error", error: "quantity must be >= 1" });
  }

  const cart = await CartModel.findById(cid);
  if (!cart)
    return res.status(404).json({ status: "error", error: "Cart not found" });

  const idx = cart.products.findIndex((p) => p.product.toString() === pid);
  if (idx === -1)
    return res
      .status(404)
      .json({ status: "error", error: "Product not in cart" });

  cart.products[idx].quantity = qty;
  await cart.save();
  res.json({ status: "success", payload: cart });
});

/** DELETE /api/carts/:cid -> vacía carrito */
cartsRouter.delete("/:cid", async (req, res) => {
  const cart = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products: [] },
    { new: true }
  );
  if (!cart)
    return res.status(404).json({ status: "error", error: "Cart not found" });
  res.json({ status: "success", payload: cart });
});
