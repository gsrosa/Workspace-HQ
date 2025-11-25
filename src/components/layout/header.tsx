'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  LogOut as LogOutIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  Menu as MenuIcon,
  X as XIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { OrgSwitcher } from '@/features/orgs';
import { useAuth } from '@/features/auth';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export const Header = ({ onMenuToggle, menuOpen }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Don't show header on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="h-auto bg-surface-700 border-b border-border-300">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Mobile menu button */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className={cn(
                'lg:hidden p-2 rounded-lg',
                'bg-surface-600 border border-border-300',
                'text-text-100',
                'hover:bg-surface-600/80',
                'focus:outline-none focus:ring-2 focus:ring-accent-500',
                'transition-colors flex-shrink-0'
              )}
              aria-label="Toggle sidebar"
            >
              {menuOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <OrgSwitcher />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* User menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg',
                  'bg-surface-600 border border-border-300',
                  'text-text-100 text-sm font-medium',
                  'hover:bg-surface-600/80',
                  'focus:outline-none focus:ring-2 focus:ring-accent-500',
                  'transition-colors'
                )}
              >
                <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-muted-400 truncate">
                    {user?.email}
                  </div>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-muted-400 flex-shrink-0 hidden sm:block" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  'min-w-[220px] bg-surface-600 border border-border-300 rounded-lg',
                  'shadow-lg p-1 z-50',
                  'data-[state=open]:animate-in data-[state=closed]:animate-out',
                  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
                )}
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md',
                    'text-sm text-text-100',
                    'hover:bg-surface-500 focus:bg-surface-500',
                    'focus:outline-none cursor-pointer'
                  )}
                  disabled
                >
                  <UserIcon className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user?.name || 'User'}</div>
                    <div className="text-xs text-muted-400 truncate">{user?.email}</div>
                  </div>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-border-300 my-1" />

                <DropdownMenu.Item
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md',
                    'text-sm text-text-100',
                    'hover:bg-surface-500 focus:bg-surface-500',
                    'focus:outline-none cursor-pointer'
                  )}
                  onSelect={() => router.push('/dashboard')}
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-border-300 my-1" />

                <DropdownMenu.Item
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md',
                    'text-sm text-danger-500',
                    'hover:bg-danger-500/10 focus:bg-danger-500/10',
                    'focus:outline-none cursor-pointer'
                  )}
                  onSelect={handleSignOut}
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="px-4 lg:px-6 pb-3">
        <Breadcrumbs />
      </div>
    </header>
  );
};

