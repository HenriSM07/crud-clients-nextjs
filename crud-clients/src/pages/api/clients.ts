import { NextApiRequest, NextApiResponse } from "next";
import connect from "@lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ClienteModel } = await connect();

  try {
    if (req.method === "GET") {
      const { search } = req.query;
      const deviceType = req.query.device || req.headers["device-type"] || "desktop";

      let fieldsToInclude = ["_id", "nome", "idade", "sexo", "email", "telefone"];
      if (deviceType === "tablet") {
        fieldsToInclude = fieldsToInclude.filter((field) => field !== "telefone");
      } else if (deviceType === "mobile") {
        fieldsToInclude = fieldsToInclude.filter(
          (field) => !["telefone", "email"].includes(field)
        );
      }

      const projection = fieldsToInclude.reduce((acc: any, field: any) => {
        acc[field] = 1;
        return acc;
      }, {});

      const query = search ? { nome: { $regex: search, $options: "i" } } : {};
      const clientes = await ClienteModel.find(query, projection).exec();
      return res.status(200).json(clientes);
    }

    if (req.method === "POST") {
      try {
        const novoCliente = req.body;
        const clienteCriado = await ClienteModel.create(novoCliente);
        return res.status(201).json(clienteCriado);
      } catch (error: any) {
        if (error.code === 11000) {
          return res.status(400).json({ error: "E-mail já cadastrado!" });
        }
        throw error;
      }
    }

    if (req.method === "PUT") {
      const { _id, ...dadosAtualizados } = req.body;
      if (!_id) return res.status(400).json({ error: "ID do cliente é obrigatório" });

      await ClienteModel.findByIdAndUpdate(_id, dadosAtualizados).exec();
      return res.status(200).json({ message: "Cliente atualizado com sucesso" });
    }

    if (req.method === "DELETE") {
      const { _id } = req.body;
      console.log("ID recebido para exclusão:", _id);
    
      if (!_id) {
        return res.status(400).json({ error: "ID do cliente é obrigatório" });
      }
    
      try {
        const result = await ClienteModel.findByIdAndDelete(_id).exec();
        if (!result) {
          return res.status(404).json({ error: "Cliente não encontrado" });
        }
    
        return res.status(200).json({ message: "Cliente excluído com sucesso" });
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        return res.status(500).json({ error: "Erro ao excluir cliente" });
      }
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
