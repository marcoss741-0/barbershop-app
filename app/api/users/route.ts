import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../users/_actions/creating-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    try {
      const newUser = await createUser(name, email, password);
      return res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error.message);
      return res.status(400).json({ error: error.message }); // Retorna o erro específico
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido.` });
  }
}
