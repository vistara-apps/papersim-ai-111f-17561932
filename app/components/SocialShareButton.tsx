
"use client";

import { useOpenUrl } from "@coinbase/onchainkit/minikit";

interface Paper {
  paperId: string;
  title: string;
}

interface SocialShareButtonProps {
  variant: 'farcaster' | 'weave';
  paper: Paper;
  results: any;
}

export function SocialShareButton({ variant, paper, results }: SocialShareButtonProps) {
  const openUrl = useOpenUrl();

  const getShareText = () => {
    const score = Math.round(results.validationScore * 100);
    return `🧪 Just replicated "${paper.title}" with AI agents!\n\n✅ Validation Score: ${score}%\n⚡ Execution Time: ${results.executionTime}\n\nBuilt with PaperSim AI 🚀`;
  };

  const handleShare = () => {
    const text = encodeURIComponent(getShareText());
    
    if (variant === 'farcaster') {
      openUrl(`https://warpcast.com/~/compose?text=${text}`);
    } else if (variant === 'weave') {
      openUrl(`https://weave.sh/share?text=${text}`);
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'farcaster': return '🟪';
      case 'weave': return '🧵';
      default: return '📱';
    }
  };

  const getLabel = () => {
    switch (variant) {
      case 'farcaster': return 'Share on Farcaster';
      case 'weave': return 'Share on Weave';
      default: return 'Share';
    }
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'farcaster': return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'weave': return 'bg-blue-600 hover:bg-blue-700 text-white';
      default: return 'btn-primary';
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-base ease-smooth shadow-card ${getButtonStyle()}`}
    >
      <span>{getIcon()}</span>
      <span className="text-sm font-medium">{getLabel()}</span>
    </button>
  );
}
