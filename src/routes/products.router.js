import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { buildPaginatedResponse } from "../utils/pagination.js";

export const productsRouter = Router();

/**
 * GET /api/products
 * Query:
 *  - limit=10, page=1
 *  - sort: asc|desc (por price)
 *  - query: "category:<val>" o "status:true|false"
 */
productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro
    let filter = {};
    if (query) {
      const [key, rawValue] = String(query).split(":");
      if (key && rawValue !== undefined) {
        if (key === "category") filter.category = rawValue;
        if (key === "status") filter.status = rawValue === "true";
      }
    }

    // Ordenamiento por precio
    let sortOpt = {};
    if (sort === "asc") sortOpt.price = 1;
    else if (sort === "desc") sortOpt.price = -1;

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sortOpt,
    };

    const result = await ProductModel.paginate(filter, options);
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    return res.json(buildPaginatedResponse(result, baseUrl, req.query));
  } catch (err) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

/** (Opcional, útil para la vista detalle) */
productsRouter.get("/:pid", async (req, res) => {
  try {
    const prod = await ProductModel.findById(req.params.pid);
    if (!prod)
      return res
        .status(404)
        .json({ status: "error", error: "Product not found" });
    res.json({ status: "success", payload: prod });
  } catch {
    res.status(400).json({ status: "error", error: "Invalid id" });
  }
});
