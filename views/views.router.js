import { Router } from "express";

export const viewsRouter = Router();

viewsRouter.get("/", (req, res) => res.render("home"));

viewsRouter.get("/products", async (req, res) => {
  const api = `${req.protocol}://${req.get(
    "host"
  )}/api/products?${new URLSearchParams(req.query)}`;
  const data = await (await fetch(api)).json();
  res.render("products", { data });
});

viewsRouter.get("/products/:pid", async (req, res) => {
  const api = `${req.protocol}://${req.get("host")}/api/products/${
    req.params.pid
  }`;
  const data = await (await fetch(api)).json();
  if (data.status !== "success") return res.status(404).render("404");
  res.render("product", { product: data.payload });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const api = `${req.protocol}://${req.get("host")}/api/carts/${
    req.params.cid
  }`;
  const data = await (await fetch(api)).json();
  if (data.status !== "success") return res.status(404).render("404");
  res.render("cart", { cart: data.payload });
});
