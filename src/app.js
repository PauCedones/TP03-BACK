// src/app.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import { connectMongo } from "./db/mongo.js";

// ⬇️ Usa SIEMPRE named exports (como te pasé en los routers del TP03)
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRouter } from "./routes/views.router.js";

// Si aún usás ProductManager por archivo para la vista realtime, lo dejamos (no afecta Mongo)
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(rootDir, "views"));

// 🔌 Conexión Mongo (antes de montar routers está ok)
await connectMongo();

// APIs (montadas UNA sola vez)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vistas
app.use("/", viewsRouter);

// ---- SOCKETS (opcional, tu realtime por archivo) ----
const productManager = new ProductManager(path.join(rootDir, "products.json"));

app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {
    products,
    title: "Productos en tiempo real",
  });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products, title: "Realtime" });
});

io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.emit("updateProducts", await productManager.getProducts());

  socket.on("newProduct", async (product) => {
    try {
      await productManager.addProduct(product);
      io.emit("updateProducts", await productManager.getProducts());
    } catch (err) {
      console.error("Error add:", err);
      socket.emit("errorMessage", "No se pudo agregar el producto");
    }
  });

  socket.on("deleteProduct", async ({ id }) => {
    try {
      await productManager.deleteProduct(id);
      io.emit("updateProducts", await productManager.getProducts());
    } catch (err) {
      console.error("Error delete:", err);
      socket.emit("errorMessage", "No se pudo eliminar el producto");
    }
  });
});

// Server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor listo en http://localhost:${PORT}`);
});
