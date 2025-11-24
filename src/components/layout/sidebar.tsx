'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  LayoutDashboard as LayoutDashboardIcon,
  CheckSquare as CheckSquareIcon,
  Users as UsersIcon,
  Plus as PlusIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelectedOrg } from '@/features/orgs';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  onLinkClick?: () => void;
}

export const Sidebar = ({ onLinkClick }: SidebarProps) => {
  const pathname = usePathname();
  const { selectedOrg } = useSelectedOrg();

  const mainNavItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      name: 'Tasks',
      href: selectedOrg ? `/orgs/${selectedOrg.id}/tasks` : '/dashboard',
      icon: CheckSquareIcon,
    },
    {
      name: 'Users',
      href: selectedOrg ? `/orgs/${selectedOrg.id}/users` : '/dashboard',
      icon: UsersIcon,
    },
  ];

  const orgNavItems: NavItem[] = [
    {
      name: 'Create Organization',
      href: '/orgs/new',
      icon: PlusIcon,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (href === '/orgs/new') {
      return pathname === '/orgs/new';
    }
    return pathname.startsWith(href);
  };

  const navSections: NavSection[] = [
    {
      items: mainNavItems,
    },
    {
      title: 'Organizations',
      items: orgNavItems,
    },
  ];

  return (
    <aside className="w-64 bg-surface-700 border-r border-border-300 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border-300">
        <Link href="/dashboard" className="flex items-center space-x-2" onClick={onLinkClick}>
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-xl font-bold text-text-100">WorkspaceHQ</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-muted-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                      'text-sm font-medium group',
                      active
                        ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                        : 'text-muted-400 hover:bg-surface-600 hover:text-text-100'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0',
                          active ? 'text-accent-400' : 'text-muted-400 group-hover:text-text-100'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs rounded-full',
                          active
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-surface-600 text-muted-400'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

      </nav>
    </aside>
  );
};

