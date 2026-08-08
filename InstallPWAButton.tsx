import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallPWAButtonProps {
  variant?: 'desktop' | 'mobile';
}

export const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ variant = 'desktop' }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  if (!isInstallable || isInstalled) return null;

  if (variant === 'mobile') {
    return (
      <button
        onClick={promptInstall}
        className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/50 border border-[#FFD700]/40 text-yellow-300 text-xs font-semibold flex items-center space-x-1.5"
        title="Install App"
      >
        <Download className="w-4 h-4 text-[#FFD700]" />
        <span>Install App</span>
      </button>
    );
  }

  return (
    <button
      onClick={promptInstall}
      className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/40 border border-[#FFD700]/30 text-yellow-300 text-xs font-semibold hover:border-[#FFD700] hover:bg-[#0B6E4F]/70 transition-all flex items-center space-x-1.5 shadow-sm hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
      title="Install this app on your device"
    >
      <Download className="w-4 h-4 text-[#FFD700]" />
      <span>Install App</span>
    </button>
  );
};
