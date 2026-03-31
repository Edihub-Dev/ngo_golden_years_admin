'use client';

import { 
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';

const sidebarItems = [
  { icon: HomeIcon, label: 'Dashboard', href: '/admin' },
  { icon: ChatBubbleBottomCenterTextIcon, label: 'Inquiries', href: '/admin/inquiries' },
  { icon: DocumentTextIcon, label: 'Manage Blogs', href: '/admin/blogs' },
  { icon: UsersIcon, label: 'Users', href: '/admin/users' },
  { icon: DocumentTextIcon, label: 'Service Requests', href: '/admin/requests' },
  { icon: UserGroupIcon, label: 'Staff', href: '/admin/staff' },
  { icon: BanknotesIcon, label: 'Payments', href: '/admin/payments' },
  { icon: Cog6ToothIcon, label: 'Settings', href: '/admin/settings' },
];

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    const auth = AuthManager.getInstance();
    auth.setRouter(router);
    auth.logout();
  };

  return (
    <div className={`w-64 bg-white shadow-md flex flex-col h-screen sticky top-0 ${className}`}>
      <div className="p-6">
        <Link href="/admin" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">Golden Years Admin</span>
        </Link>
      </div>
      
      <nav className="mt-6 flex-1">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center space-x-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase ring-2 ring-white">
            {AuthManager.getInstance().getUser()?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">
              {AuthManager.getInstance().getUser()?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-gray-400 capitalize">
              {AuthManager.getInstance().getUser()?.role || 'Admin'} Panel
            </p>
          </div>
        </div>

        <a 
          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ngocareoldfrontend.vercel.app'}/dashboard`}
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors mb-1"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          User Dashboard
        </a>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
