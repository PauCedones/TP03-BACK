import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/coder-tp03";
  await mongoose.connect(uri, { dbName: "coder-tp03" });
  console.log("✅ MongoDB conectado");
}
