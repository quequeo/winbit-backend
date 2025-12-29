'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';

interface TopInvestor {
  name: string;
  balance: number;
}

interface TopInvestorsChartProps {
  data: TopInvestor[];
}

export function TopInvestorsChart({ data }: TopInvestorsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full flex items-center justify-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="h-64 w-full" style={{ minHeight: '256px', minWidth: '0' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#888" style={{ fontSize: '12px' }} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#888"
            style={{ fontSize: '12px' }}
            width={100}
          />
          <Tooltip
            formatter={(value: number | undefined) => `$${(value || 0).toLocaleString('en-US')}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="balance" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => {
              // Gradiente de colores: del más claro al más oscuro
              const colors = [
                '#58b098', // Verde principal (más claro)
                '#4a9d87', // Verde medio-claro
                '#3d8a76', // Verde medio
                '#2f7765', // Verde medio-oscuro
                '#256454', // Verde oscuro (más oscuro)
              ];
              return (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

