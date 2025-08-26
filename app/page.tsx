
"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  usePrimaryButton,
  useNotification,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { PaperUploader } from "./components/PaperUploader";
import { PaperList } from "./components/PaperList";
import { AgentConfigurationForm } from "./components/AgentConfigurationForm";
import { SimulationResultDisplay } from "./components/SimulationResultDisplay";
import { SocialShareButton } from "./components/SocialShareButton";

interface Paper {
  paperId: string;
  title: string;
  status: 'uploading' | 'parsing' | 'ready' | 'error';
  uploadedAt: string;
  parsedContent?: any;
}

interface AgentConfig {
  agentConfigId: string;
  paperId: string;
  agentType: string;
  parameters: any;
  status: 'configuring' | 'running' | 'complete' | 'error';
  simulatedResultUrl?: string;
}

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [currentView, setCurrentView] = useState<'papers' | 'agent' | 'results'>('papers');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const sendNotification = useNotification();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Sample data initialization
  useEffect(() => {
    const samplePaper: Paper = {
      paperId: 'sample-1',
      title: 'Quantum Entanglement in Photonic Crystals',
      status: 'ready',
      uploadedAt: new Date().toISOString(),
      parsedContent: {
        methodology: 'Monte Carlo simulation of photonic band gaps',
        parameters: { latticeConstant: 0.5, refractiveIndex: 3.4 },
        equations: ['E = ħω', 'k·r = nπ']
      }
    };
    setPapers([samplePaper]);
  }, []);

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame();
    setFrameAdded(Boolean(result));
    if (result) {
      console.log('Frame added:', result.url, result.token);
    }
  }, [addFrame]);

  const handlePaperUpload = useCallback(async (file: File) => {
    const newPaper: Paper = {
      paperId: Date.now().toString(),
      title: file.name.replace('.pdf', ''),
      status: 'uploading',
      uploadedAt: new Date().toISOString(),
    };
    
    setPapers(prev => [...prev, newPaper]);
    
    // Simulate processing
    setTimeout(() => {
      setPapers(prev => prev.map(p => 
        p.paperId === newPaper.paperId 
          ? { ...p, status: 'parsing' }
          : p
      ));
    }, 1000);
    
    setTimeout(async () => {
      setPapers(prev => prev.map(p => 
        p.paperId === newPaper.paperId 
          ? { 
              ...p, 
              status: 'ready',
              parsedContent: {
                methodology: 'Extracted methodology from paper',
                parameters: { param1: 1.0, param2: 2.5 },
                equations: ['Sample equation']
              }
            }
          : p
      ));
      
      // Send notification
      try {
        await sendNotification({
          title: 'Paper Parsing Complete! 📄',
          body: `${newPaper.title} is ready for AI agent generation.`
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }, 3000);
  }, [sendNotification]);

  const handleGenerateAgent = useCallback(async (paper: Paper, config: any) => {
    const newAgentConfig: AgentConfig = {
      agentConfigId: Date.now().toString(),
      paperId: paper.paperId,
      agentType: config.agentType,
      parameters: config.parameters,
      status: 'running',
    };
    
    setAgentConfig(newAgentConfig);
    setCurrentView('results');
    
    // Simulate simulation
    setTimeout(async () => {
      const results = {
        success: true,
        outputData: [1, 2, 3, 4, 5],
        validationScore: 0.87,
        executionTime: '2.3s',
        parameters: config.parameters,
      };
      
      setSimulationResults(results);
      setAgentConfig(prev => prev ? { ...prev, status: 'complete' } : null);
      
      // Send notification
      try {
        await sendNotification({
          title: 'Simulation Complete! 🎯',
          body: `AI agent finished running simulation for ${paper.title}.`
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }, 4000);
  }, [sendNotification]);

  // Primary button configuration
  usePrimaryButton(
    {
      text: selectedPaper && selectedPaper.status === 'ready' 
        ? 'Generate AI Agent' 
        : agentConfig?.status === 'running' 
        ? 'Running Simulation...' 
        : 'Upload Paper'
    },
    () => {
      if (selectedPaper && selectedPaper.status === 'ready') {
        setCurrentView('agent');
      } else if (!selectedPaper) {
        setCurrentView('papers');
      }
    }
  );

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          onClick={handleAddFrame}
          className="flex items-center space-x-1 text-sm font-medium text-accent hover:text-primary transition-colors"
        >
          <span>+</span>
          <span>Save</span>
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-green-600 animate-fade-in">
          <span>✓</span>
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text">
      <div className="container-app py-4">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-display text-primary">PaperSim AI</h1>
            <p className="text-secondary-text text-sm">Physics research validation platform</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Wallet>
              <ConnectWallet>
                <Name className="text-inherit" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
            {saveFrameButton}
          </div>
        </header>

        <nav className="flex space-x-1 mb-6 bg-surface rounded-lg p-1 border border-border">
          {[
            { key: 'papers', label: 'Papers', icon: '📄' },
            { key: 'agent', label: 'Agent Config', icon: '🤖' },
            { key: 'results', label: 'Results', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentView(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-base ease-smooth ${
                currentView === tab.key 
                  ? 'bg-primary text-white shadow-card' 
                  : 'text-secondary-text hover:text-primary hover:bg-muted'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="animate-fade-in">
          {currentView === 'papers' && (
            <div className="space-y-6">
              <PaperUploader onUpload={handlePaperUpload} />
              <PaperList 
                papers={papers} 
                selectedPaper={selectedPaper}
                onSelectPaper={setSelectedPaper}
              />
            </div>
          )}

          {currentView === 'agent' && selectedPaper && (
            <AgentConfigurationForm 
              paper={selectedPaper}
              onGenerateAgent={handleGenerateAgent}
            />
          )}

          {currentView === 'results' && (
            <div className="space-y-6">
              {agentConfig && (
                <SimulationResultDisplay 
                  agentConfig={agentConfig}
                  results={simulationResults}
                />
              )}
              {simulationResults && selectedPaper && (
                <div className="flex space-x-4">
                  <SocialShareButton 
                    variant="farcaster"
                    paper={selectedPaper}
                    results={simulationResults}
                  />
                  <SocialShareButton 
                    variant="weave"
                    paper={selectedPaper}
                    results={simulationResults}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-8 pt-4 flex justify-center border-t border-border">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-secondary-text text-xs hover:text-primary transition-colors"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
