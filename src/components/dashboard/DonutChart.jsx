import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function DonutChart({ data }) {
  if (!data?.length) {
    return (
      <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by category</h2>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No expenses this month yet
        </div>
      </div>
    )
  }

  return (
    <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Spending by category</h2>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="total"
              nameKey="name"
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-2">
        {data.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-gray-700">
                {cat.icon} {cat.name}
              </span>
            </div>
            <span className="text-gray-500 font-medium">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
