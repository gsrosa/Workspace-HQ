'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-100 mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-400 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

