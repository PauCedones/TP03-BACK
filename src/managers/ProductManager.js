import { readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

export default class ProductManager {
  constructor(filePath) {
    this.filePath = filePath; // Ruta a products.json en la raíz del proyecto
  }

  async _read() {
    try {
      const data = await readFile(this.filePath, "utf-8");
      return JSON.parse(data || "[]");
    } catch {
      return [];
    }
  }

  async _write(data) {
    await writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._read();
  }

  async addProduct(p) {
    const products = await this._read();

    // Validaciones mínimas
    if (!p.title || !p.code || !p.price) {
      throw new Error("Faltan campos: title, code, price");
    }

    const newP = {
      id: randomUUID(),
      title: String(p.title),
      description: p.description ? String(p.description) : "",
      code: String(p.code),
      price: Number(p.price),
      stock: p.stock ? Number(p.stock) : 0,
      category: p.category ? String(p.category) : "",
    };

    products.push(newP);
    await this._write(products);
    return newP;
  }

  async deleteProduct(id) {
    const products = await this._read();
    const updated = products.filter((p) => String(p.id) !== String(id));
    await this._write(updated);
    return products.length !== updated.length;
  }
}
