
"use client";

import { useState, useRef } from "react";

interface PaperUploaderProps {
  onUpload: (file: File) => void;
}

export function PaperUploader({ onUpload }: PaperUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      onUpload(pdfFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card">
      <h2 className="text-heading mb-4">Upload Research Paper</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-base ease-smooth ${
          isDragging 
            ? 'border-accent bg-accent/5' 
            : 'border-border hover:border-accent hover:bg-muted'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="space-y-4">
          <div className="text-4xl">📄</div>
          <div>
            <p className="text-heading mb-2">Drop your physics paper here</p>
            <p className="text-secondary-text text-sm">
              or click to browse (PDF files only, max 10MB)
            </p>
          </div>
          <button className="btn-primary">
            Choose File
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <p className="text-sm text-secondary-text">
          <strong>Supported formats:</strong> PDF files containing physics research papers with methodologies, equations, and experimental data.
        </p>
      </div>
    </div>
  );
}
