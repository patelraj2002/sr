// src/app/components/dashboard/OwnerNavigation.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function OwnerNavigation({ userId }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      href: `/dashboard/owner/${userId}`,
      icon: '🏠'
    },
    {
      label: 'Properties',
      href: `/dashboard/owner/${userId}/properties`,
      icon: '🏢'
    },
    {
      label: 'Inquiries',
      href: `/dashboard/owner/${userId}/inquiries`,
      icon: '📫'
    },
    {
      label: 'Profile',
      href: `/dashboard/owner/${userId}/profile`,
      icon: '👤'
    }
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${pathname === item.href
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          
          <button
            onClick={signOut}
            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}