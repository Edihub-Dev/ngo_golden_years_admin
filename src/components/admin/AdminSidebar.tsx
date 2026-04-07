'use client';

import { 
  BarChart3Icon,
  UsersIcon,
  NewspaperIcon,
  GroupIcon,
  CreditCardIcon,
  MessageSquareIcon,
  Settings2Icon,
  LogOutIcon,
  ExternalLinkIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';
import { useEffect, useState } from 'react';

const navItems = [
  { icon: BarChart3Icon, label: 'Dashboard', href: '/admin', roles: ['admin', 'subadmin'] },
  { icon: UsersIcon, label: 'Users', href: '/admin/users', roles: ['admin', 'subadmin'] },
  { icon: MessageSquareIcon, label: 'Service Requests', href: '/admin/requests', roles: ['admin', 'subadmin'] },
  { icon: MessageSquareIcon, label: 'Inquiries', href: '/admin/inquiries', roles: ['admin', 'subadmin'] },
  { icon: NewspaperIcon, label: 'Manage Blogs', href: '/admin/blogs', roles: ['admin'] },
  { icon: GroupIcon, label: 'Membership', href: '/admin/membership', roles: ['admin', 'subadmin'] },
  { icon: UsersIcon, label: 'Manage Staff', href: '/admin/staff', roles: ['admin'] },
  { icon: CreditCardIcon, label: 'Payments', href: '/admin/payments', roles: ['admin', 'subadmin'] },
  { icon: Settings2Icon, label: 'Settings', href: '/admin/settings', roles: ['admin'] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(AuthManager.getInstance().getUser());
  }, []);

  const handleLogout = () => {
    const auth = AuthManager.getInstance();
    auth.setRouter(router);
    auth.logout();
  };

  const filteredItems = navItems.filter(item => 
    !user || item.roles.includes(user.role || 'subadmin')
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 right-6 z-[60] p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-[55] w-72 bg-[#0F172A] text-slate-300 flex flex-col transition-transform duration-500 ease-out border-r border-slate-800
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-8 border-b border-slate-800/50 bg-slate-900/20">
          <Link href="/admin" className="flex items-center gap-4 group">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-600/30 group-hover:scale-110 transition-transform">G</div>
            <span className="text-2xl font-black text-white tracking-tighter">Golden Admin</span>
          </Link>
        </div>
        
        {/* Primary Navigation */}
        <nav className="mt-10 flex-1 px-6 space-y-2 overflow-y-auto hide-scrollbar">
          {filteredItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-5 py-4 text-sm font-black rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'text-white bg-blue-600 shadow-2xl shadow-blue-600/30 -translate-y-0.5'
                    : 'hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile & Action Section */}
        <div className="p-6 mt-auto bg-slate-900/40 border-t border-slate-800/50">
          <div className="px-4 py-3 bg-slate-800/30 rounded-[1.5rem] flex items-center space-x-3 mb-6 ring-2 ring-slate-800/50 hover:bg-slate-800/50 transition-colors">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-2xl ring-2 ring-white/10 
              ${user?.role === 'admin' ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-900/30' : 
                user?.role === 'subadmin' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-900/30' : 
                'bg-gradient-to-br from-slate-500 to-slate-700 shadow-slate-900/30'}`}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate leading-tight">{user?.name || 'Administrator'}</p>
              <p className="text-[8px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">{user?.role || 'System Root'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <a 
              href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ngocareoldfrontend.vercel.app'}/dashboard`}
              className="flex items-center w-full px-5 py-3.5 text-[11px] font-black text-slate-400 hover:text-white hover:bg-blue-600/10 rounded-2xl transition-all group uppercase tracking-widest"
            >
              <ExternalLinkIcon className="h-4 w-4 mr-4 text-slate-500 group-hover:text-blue-400" />
              Web Platform
            </a>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-5 py-3.5 text-[11px] font-black text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all group uppercase tracking-widest"
            >
              <LogOutIcon className="h-4 w-4 mr-4 text-slate-500 group-hover:text-rose-400" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
