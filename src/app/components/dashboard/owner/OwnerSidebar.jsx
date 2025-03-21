// src/app/components/dashboard/owner/OwnerSidebar.jsx
import Link from 'next/link';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  InboxIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

export default function OwnerSidebar({ ownerId }) {
  const menuItems = [
    {
      name: 'Dashboard',
      href: `/dashboard/owner/${ownerId}`,
      icon: HomeIcon,
    },
    {
      name: 'Properties',
      href: `/dashboard/owner/${ownerId}/properties`,
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Inquiries',
      href: `/dashboard/owner/${ownerId}/inquiries`,
      icon: InboxIcon,
    },
    {
      name: 'Profile',
      href: `/dashboard/owner/${ownerId}/profile`,
      icon: UserCircleIcon,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          PropertyFinder
        </Link>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}