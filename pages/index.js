import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const supabase = createClient('https://gbfurbunillueaowtqbb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

export default function PainelVendas() {
  const [vendas, setVendas] = useState([]);
  const [resumo, setResumo] = useState([]);

  useEffect(() => {
    fetchVendas();
  }, []);

  async function fetchVendas() {
    const { data, error } = await supabase.from('vendas').select('*').order('created_at', { ascending: false });
    if (!error) {
      setVendas(data);
      const mapa = {};
      data.forEach(v => {
        mapa[v.produto] = mapa[v.produto] || { produto: v.produto, total: 0, valor: 0 };
        mapa[v.produto].total++;
        mapa[v.produto].valor += parseFloat(v.valor);
      });
      setResumo(Object.values(mapa));
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">🚀 Painel de Vendas - Canvatop</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Resumo por Produto</h2>
          <ul>
            {resumo.map((item) => (
              <li key={item.produto} className="flex justify-between text-sm text-gray-300 mb-2">
                <span>{item.produto}</span>
                <span className="text-green-400">{item.total} vendas - R$ {item.valor.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Gráfico de Vendas</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="#ccc" />
                <YAxis dataKey="produto" type="category" stroke="#ccc" width={100} />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Bar dataKey="valor" fill="#34D399" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
