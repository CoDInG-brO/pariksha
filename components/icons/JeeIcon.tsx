import React from 'react';

export default function JeeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="12" width="3" height="8" rx="0.5" fill="currentColor" />
      <rect x="9" y="8" width="3" height="12" rx="0.5" fill="currentColor" />
      <rect x="15" y="4" width="3" height="16" rx="0.5" fill="currentColor" />
    </svg>
  );
}
