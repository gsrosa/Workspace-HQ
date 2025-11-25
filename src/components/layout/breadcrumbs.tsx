'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight as ChevronRightIcon, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

    // Skip orgId and show only the final route (Tasks, Users, etc.)
    if (pathname.includes('/tasks')) {
      breadcrumbs.push({ label: 'Tasks', href: pathname });
    } else if (pathname.includes('/users')) {
      breadcrumbs.push({ label: 'Users', href: pathname });
    } else if (pathname.includes('/orgs/new')) {
      breadcrumbs.push({ label: 'New Organization', href: pathname });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2', className)}>
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.href} className="flex items-center">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center text-muted-400 hover:text-text-100 transition-colors',
                    isLast && 'text-text-100'
                  )}
                >
                  <HomeIcon className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRightIcon className="w-4 h-4 text-muted-400 mx-2" />
                  {isLast ? (
                    <span className="text-text-100 font-medium">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-muted-400 hover:text-text-100 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

