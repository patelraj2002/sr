// src/app/components/admin/dashboard/ChartCard.jsx
export default function ChartCard({ title, children }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    );
  }