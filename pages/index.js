// Painel de Vendas - Canvatop
// Framework: React + TailwindCSS + Supabase (Dark Theme + Visual Moderno + Responsivo)

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const supabaseUrl = 'https://gbfurbunillueaowtqbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZnVyYnVuaWxsdWVhb3d0cWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODM2NjQsImV4cCI6MjA2NDU1OTY2NH0.DELr29HF54qMvI8V41xdzGSDrvyclyHQn3iLD8JVAts';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PainelVendas() {
  const [vendas, setVendas] = useState([]);
  const [resumo, setResumo] = useState([]);

  useEffect(() => {
    fetchVendas();
  }, []);

  async function fetchVendas() {
    const { data, error } = await supabase
      .from('vendas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vendas:', error);
    } else {
      setVendas(data);
      gerarResumo(data);
    }
  }

  function gerarResumo(data) {
    const mapa = {};
    data.forEach((venda) => {
      if (!mapa[venda.produto]) {
        mapa[venda.produto] = { produto: venda.produto, total: 0, valor: 0 };
      }
      mapa[venda.produto].total += 1;
      mapa[venda.produto].valor += parseFloat(venda.valor);
    });
    setResumo(Object.values(mapa));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 font-sans">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-6 text-center text-white">🚀 Painel de Vendas - Canvatop</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Resumo por Produto</h2>
          <ul className="space-y-3">
            {resumo.map((item) => (
              <li key={item.produto} className="flex justify-between text-sm sm:text-base text-gray-300">
                <span className="font-medium text-white">{item.produto}</span>
                <span className="text-green-400">{item.total} vendas - R$ {item.valor.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Gráfico de Vendas</h2>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="#ccc" />
                <YAxis dataKey="produto" type="category" stroke="#ccc" width={120} />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Bar dataKey="valor" fill="#34D399" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-900 p-4 rounded-xl shadow-xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">🧾 Lista de Vendas</h2>
        <table className="min-w-full text-xs sm:text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="px-2 sm:px-4 py-2">Cliente</th>
              <th className="px-2 sm:px-4 py-2">Email</th>
              <th className="px-2 sm:px-4 py-2">Produto</th>
              <th className="px-2 sm:px-4 py-2">Valor</th>
              <th className="px-2 sm:px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-2 sm:px-4 py-2 break-words max-w-[150px]">{venda.cliente}</td>
                <td className="px-2 sm:px-4 py-2 break-words max-w-[180px]">{venda.email}</td>
                <td className="px-2 sm:px-4 py-2">{venda.produto}</td>
                <td className="px-2 sm:px-4 py-2 text-green-400">R$ {venda.valor.toFixed(2)}</td>
                <td className="px-2 sm:px-4 py-2">{new Date(venda.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}