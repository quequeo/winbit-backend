'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useEffect, useState } from 'react';

interface RequestData {
  month: string;
  deposits: number;
  withdrawals: number;
}

interface RequestsOverTimeChartProps {
  data: RequestData[];
}

export function RequestsOverTimeChart({ data }: RequestsOverTimeChartProps) {
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#888" style={{ fontSize: '12px' }} />
          <YAxis stroke="#888" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="deposits"
            stroke="#58b098"
            strokeWidth={2}
            name="Depósitos"
            dot={{ fill: '#58b098', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="withdrawals"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Retiros"
            dot={{ fill: '#f59e0b', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

