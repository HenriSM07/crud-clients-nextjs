import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { rows } = await pool.query('SELECT id, nome, idade, email, telefone, cep FROM clientes');
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
}