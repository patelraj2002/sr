// src/app/components/common/AuthPrompt.jsx
import Link from 'next/link';

export default function AuthPrompt({ message, userType }) {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <p className="text-primary-700">{message}</p>
        <Link
          href={`/auth/signin?type=${userType}`}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}