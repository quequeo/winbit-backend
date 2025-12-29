'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RequestsByTypeChartProps {
  depositCount: number;
  withdrawalCount: number;
}

const COLORS = ['#58b098', '#f59e0b'];

export function RequestsByTypeChart({
  depositCount,
  withdrawalCount,
}: RequestsByTypeChartProps) {
  const data = [
    { name: 'Depósitos', value: depositCount },
    { name: 'Retiros', value: withdrawalCount },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

