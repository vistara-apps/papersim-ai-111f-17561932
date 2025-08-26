
"use client";

import { formatDistanceToNow } from "date-fns";

interface Paper {
  paperId: string;
  title: string;
  status: 'uploading' | 'parsing' | 'ready' | 'error';
  uploadedAt: string;
  parsedContent?: any;
}

interface PaperListProps {
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
}

export function PaperList({ papers, selectedPaper, onSelectPaper }: PaperListProps) {
  const getStatusIcon = (status: Paper['status']) => {
    switch (status) {
      case 'uploading': return '⏳';
      case 'parsing': return '🔄';
      case 'ready': return '✅';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  const getStatusText = (status: Paper['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'parsing': return 'Parsing...';
      case 'ready': return 'Ready';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: Paper['status']) => {
    switch (status) {
      case 'uploading': return 'text-yellow-600';
      case 'parsing': return 'text-blue-600';
      case 'ready': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-secondary-text';
    }
  };

  if (papers.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-heading mb-2">No papers uploaded yet</h3>
        <p className="text-secondary-text">
          Upload your first physics research paper to get started with AI-powered simulation replication.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-heading mb-4">Your Papers</h2>
      
      <div className="space-y-3">
        {papers.map((paper) => (
          <div
            key={paper.paperId}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-base ease-smooth ${
              selectedPaper?.paperId === paper.paperId
                ? 'border-accent bg-accent/5 shadow-card'
                : 'border-border hover:border-accent hover:bg-muted'
            }`}
            onClick={() => onSelectPaper(paper)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getStatusIcon(paper.status)}</span>
                  <h3 className="text-heading truncate">{paper.title}</h3>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-secondary-text">
                  <span className={getStatusColor(paper.status)}>
                    {getStatusText(paper.status)}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(paper.uploadedAt), { addSuffix: true })}
                  </span>
                </div>
                
                {paper.parsedContent && (
                  <div className="mt-3 p-3 bg-surface rounded-md border border-border">
                    <p className="text-sm text-secondary-text mb-1">Extracted methodology:</p>
                    <p className="text-sm">{paper.parsedContent.methodology}</p>
                  </div>
                )}
              </div>
              
              {paper.status === 'parsing' && (
                <div className="animate-pulse-subtle">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
