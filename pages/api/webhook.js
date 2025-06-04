import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gbfurbunillueaowtqbb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZnVyYnVuaWxsdWVhb3d0cWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODM2NjQsImV4cCI6MjA2NDU1OTY2NH0.DELr29HF54qMvI8V41xdzGSDrvyclyHQn3iLD8JVAts'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { cliente, email, produto, valor } = req.body;

  if (!cliente || !email || !produto || !valor) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  const { error } = await supabase.from('vendas').insert([
    {
      cliente,
      email,
      produto,
      valor,
      data: new Date().toISOString().split('T')[0],
    },
  ]);

  if (error) {
    return res.status(500).json({ message: 'Erro ao salvar no Supabase', error });
  }

  return res.status(200).json({ message: 'Venda registrada com sucesso' });
}