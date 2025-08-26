"use client";

import { useState } from "react";

interface AgentConfigurationFormProps {
  paper: {
    paperId: string;
    title: string;
    status: 'uploading' | 'parsing' | 'ready' | 'error';
    uploadedAt: string;
    parsedContent?: any;
  };
  onGenerateAgent: (paper: any, config: any) => Promise<void>;
}

interface Parameters {
  [key: string]: string | number;
}

export function AgentConfigurationForm({
  paper,
  onGenerateAgent,
}: AgentConfigurationFormProps) {
  const [parameters, setParameters] = useState<Parameters>({
    temperature: 0.7,
    iterations: 100,
    timeStep: 0.01,
  });
  const [agentType, setAgentType] = useState("physics-simulation");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleParameterChange = (key: string, value: string) => {
    setParameters((prev: Parameters) => ({
      ...prev,
      [key]: isNaN(Number(value)) ? value : Number(value)
    }));
  };

  const handleGenerateAgentClick = async () => {
    setIsGenerating(true);
    try {
      const config = {
        agentType,
        parameters,
      };
      
      // Simulate agent generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onGenerateAgent(paper, config);
    } catch (error) {
      console.error("Error generating agent:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg p-lg shadow-card">
      <h3 className="heading mb-md">Configure AI Agent</h3>
      
      <div className="space-y-md">
        <div>
          <label className="block body text-secondary-text mb-sm">
            Agent Type
          </label>
          <select
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
            className="input-field w-full"
          >
            <option value="physics-simulation">Physics Simulation</option>
            <option value="molecular-dynamics">Molecular Dynamics</option>
            <option value="quantum-mechanics">Quantum Mechanics</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {Object.entries(parameters).map(([key, value]) => (
            <div key={key}>
              <label className="block body text-secondary-text mb-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleParameterChange(key, e.target.value)}
                className="input-field w-full"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerateAgentClick}
          disabled={isGenerating}
          className="btn-primary w-full"
        >
          {isGenerating ? "Generating Agent..." : "Generate AI Agent"}
        </button>
      </div>
    </div>
  );
}
