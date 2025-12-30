// src/app/components/dashboard/StatsCard.jsx
import Link from 'next/link';

export default function StatsCard({ title, value, icon, href }) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Link>
  );
}