import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: true }, // disponibilidad
    category: { type: String, index: true },
    thumbnails: { type: [String], default: [] },
    code: { type: String, unique: true, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, status: 1, price: 1 });
productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("Product", productSchema);
