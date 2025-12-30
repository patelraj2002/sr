// src/app/components/admin/dashboard/StatsCard.jsx
export default function StatsCard({ title, value, subStats, icon }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-primary-600">{value}</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            {icon}
          </div>
        </div>
        {subStats && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(subStats).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }