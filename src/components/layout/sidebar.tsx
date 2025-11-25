'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  LayoutDashboard as LayoutDashboardIcon,
  CheckSquare as CheckSquareIcon,
  Users as UsersIcon,
  Plus as PlusIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelectedOrg, useOrgs } from '@/features/orgs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OrgForm } from '@/features/orgs';

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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({ onLinkClick, collapsed = false, onToggleCollapse }: SidebarProps) => {
  const pathname = usePathname();
  const { selectedOrg, setSelectedOrg } = useSelectedOrg();
  const { orgs } = useOrgs();
  const [isOrgModalOpen, setIsOrgModalOpen] = React.useState(false);

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

  const handleCreateOrg = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOrgModalOpen(true);
    if (onLinkClick) onLinkClick();
  };

  const orgNavItems: NavItem[] = [
    {
      name: 'Create Organization',
      href: '#',
      icon: PlusIcon,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    // For Tasks and Users, check if pathname matches the pattern
    if (href.includes('/tasks')) {
      return pathname.includes('/tasks');
    }
    if (href.includes('/users')) {
      return pathname.includes('/users');
    }
    return pathname.startsWith(href);
  };

  const handleOrgClick = async (orgId: string, e: React.MouseEvent) => {
    e.preventDefault();
    await setSelectedOrg(orgId);
    if (onLinkClick) onLinkClick();
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
    <aside
      className={cn(
        'bg-surface-700 border-r border-border-300 flex flex-col h-full transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border-300 flex items-center justify-between">
        <Link
          href="/dashboard"
          className={cn('flex items-center space-x-2', collapsed && 'justify-center')}
          onClick={onLinkClick}
        >
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          {!collapsed && <span className="text-xl font-bold text-text-100">WorkspaceHQ</span>}
        </Link>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1.5 rounded-lg hover:bg-surface-600 transition-colors',
              'text-muted-400 hover:text-text-100',
              collapsed && 'mx-auto'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && !collapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-muted-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const isCreateOrg = item.name === 'Create Organization';

                if (isCreateOrg) {
                  return (
                    <button
                      key={item.name}
                      onClick={handleCreateOrg}
                      className={cn(
                        'flex items-center justify-between rounded-lg transition-colors w-full',
                        'text-sm font-medium group',
                        collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                        active
                          ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                          : 'text-muted-400 hover:bg-surface-600 hover:text-text-100'
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <div className={cn('flex items-center', collapsed ? 'justify-center' : 'space-x-3')}>
                        <Icon
                          className={cn(
                            'w-5 h-5 flex-shrink-0',
                            active ? 'text-accent-400' : 'text-muted-400 group-hover:text-text-100'
                          )}
                        />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(
                      'flex items-center justify-between rounded-lg transition-colors',
                      'text-sm font-medium group',
                      collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                      active
                        ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                        : 'text-muted-400 hover:bg-surface-600 hover:text-text-100'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className={cn('flex items-center', collapsed ? 'justify-center' : 'space-x-3')}>
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0',
                          active ? 'text-accent-400' : 'text-muted-400 group-hover:text-text-100'
                        )}
                      />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && item.badge && (
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

        {/* Organizations List */}
        {!collapsed && orgs.length > 0 && (
          <div className="mt-6">
            <h3 className="px-4 mb-2 text-xs font-semibold text-muted-400 uppercase tracking-wider">
              My Organizations
            </h3>
            <div className="space-y-1">
              {orgs.map((org: { id: string; name: string; role?: string }) => {
                const isSelected = selectedOrg?.id === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={(e) => handleOrgClick(org.id, e)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors',
                      'text-sm font-medium group',
                      isSelected
                        ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                        : 'text-muted-400 hover:bg-surface-600 hover:text-text-100'
                    )}
                  >
                    <span className="truncate flex-1 text-left">{org.name}</span>
                    {org.role && (
                      <span
                        className={cn(
                          'ml-2 px-2 py-0.5 text-xs rounded-full flex-shrink-0',
                          isSelected
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-surface-600 text-muted-400'
                        )}
                      >
                        {org.role}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {collapsed && orgs.length > 0 && (
          <div className="mt-6 space-y-1">
            {orgs.slice(0, 3).map((org: { id: string; name: string }) => {
              const isSelected = selectedOrg?.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={(e) => handleOrgClick(org.id, e)}
                  className={cn(
                    'w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors',
                    'text-sm font-medium group',
                    isSelected
                      ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                      : 'text-muted-400 hover:bg-surface-600 hover:text-text-100'
                  )}
                  title={org.name}
                >
                  <div className="w-6 h-6 bg-accent-500/20 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent-400">
                      {org.name[0]?.toUpperCase()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </nav>

      {/* Create Organization Modal */}
      <Dialog open={isOrgModalOpen} onOpenChange={setIsOrgModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to get started
            </DialogDescription>
          </DialogHeader>
          <OrgForm onSuccess={() => setIsOrgModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </aside>
  );
};

