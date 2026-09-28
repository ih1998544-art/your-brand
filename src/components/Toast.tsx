import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 bottom-6 -translate-x-1/2 z-50 bg-neutral-950 text-white text-xs font-medium py-2.5 px-6 shadow-2xl transition-all duration-300 pointer-events-none tracking-wide border border-neutral-800 animate-in fade-in slide-in-from-bottom-2"
    >
      {message}
    </div>
  );
};
