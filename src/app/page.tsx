import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-100 mb-4">WorkspaceHQ</h1>
        <p className="text-muted-400 mb-8">Modern workspace management platform</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-400 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-border-300 text-text-100 rounded-lg hover:bg-surface-600 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

