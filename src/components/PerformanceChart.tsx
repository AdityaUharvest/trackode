'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function PerformanceChart({ chartData }:any) {
  return (
    <div className="bg-gray-800 text-gray-50 p-6 rounded-lg shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Performance Trend</h2>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            <span>Your Score</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#6b7280' }}
              stroke="#d1d5db"
            />
            <YAxis 
              unit="%"
              tick={{ fill: '#6b7280' }}
              stroke="#d1d5db"
            />
            <Tooltip 
  contentStyle={{
    background: '#fff',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    color: '#111827'
  }}
  formatter={(value, name, props) => {
    // Show both quiz name and percentage in one line
    return [`${props.payload.quiz}: Score: ${value}%`, name];
  }}
  labelFormatter={(label) => `Date: ${label}`}
/>
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              name="Quiz"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}