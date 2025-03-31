import mongoose, { Schema, Document } from "mongoose";

export interface ICliente extends Document {
  _id: mongoose.Types.ObjectId;
  nome: string;
  idade: number;
  sexo: string;
  email: string;
  telefone: string;
}

const ClienteSchema: Schema = new Schema<ICliente>(
  {
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    sexo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
  },
  { timestamps: true }
);

export const ClienteModel =
  mongoose.models.Cliente || mongoose.model<ICliente>("Cliente", ClienteSchema);
