import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gbfurbunillueaowtqbb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método não permitido' });

  const { cliente, email, produto, valor } = req.body;
  if (!cliente || !email || !produto || !valor) return res.status(400).json({ message: 'Dados incompletos' });

  const { error } = await supabase.from('vendas').insert({ cliente, email, produto, valor, created_at: new Date().toISOString() });
  if (error) return res.status(500).json({ message: 'Erro ao salvar no Supabase', error });

  return res.status(200).json({ message: 'Venda registrada com sucesso!' });
}
