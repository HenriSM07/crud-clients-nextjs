import mongoose from "mongoose";
import { ClienteModel } from "./models/Cliente";

const uri = process.env.MONGO_URI || "";

async function connect() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(uri);
    console.log("Conectado ao MongoDB");
  }
  return { ClienteModel };
}

export default connect;
