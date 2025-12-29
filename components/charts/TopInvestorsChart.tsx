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
} from 'recharts';

interface TopInvestor {
  name: string;
  balance: number;
}

interface TopInvestorsChartProps {
  data: TopInvestor[];
}

export function TopInvestorsChart({ data }: TopInvestorsChartProps) {
  return (
    <div className="h-64">
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
            formatter={(value: number) => `$${value.toLocaleString('en-US')}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="balance" fill="#58b098" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

