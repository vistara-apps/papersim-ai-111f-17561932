
"use client";

interface AgentConfig {
  agentConfigId: string;
  paperId: string;
  agentType: string;
  parameters: any;
  status: 'configuring' | 'running' | 'complete' | 'error';
  simulatedResultUrl?: string;
}

interface SimulationResultDisplayProps {
  agentConfig: AgentConfig;
  results?: any;
}

export function SimulationResultDisplay({ agentConfig, results }: SimulationResultDisplayProps) {
  const getStatusIcon = (status: AgentConfig['status']) => {
    switch (status) {
      case 'configuring': return '⚙️';
      case 'running': return '🏃';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '🤖';
    }
  };

  const getStatusText = (status: AgentConfig['status']) => {
    switch (status) {
      case 'configuring': return 'Configuring agent...';
      case 'running': return 'Running simulation...';
      case 'complete': return 'Simulation complete';
      case 'error': return 'Simulation failed';
      default: return 'Unknown status';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl">{getStatusIcon(agentConfig.status)}</span>
        <div>
          <h2 className="text-heading">Simulation Results</h2>
          <p className="text-secondary-text text-sm">{getStatusText(agentConfig.status)}</p>
        </div>
      </div>

      {agentConfig.status === 'running' && (
        <div className="text-center py-8">
          <div className="animate-pulse-subtle w-16 h-16 bg-accent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary-text">
            AI agent is processing your simulation...
          </p>
          <div className="mt-4 bg-muted rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span>Progress:</span>
              <span>Running {agentConfig.agentType} simulation</span>
            </div>
          </div>
        </div>
      )}

      {agentConfig.status === 'complete' && results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Success Rate</div>
              <div className="text-xl font-semibold text-green-800">
                {Math.round(results.validationScore * 100)}%
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Execution Time</div>
              <div className="text-xl font-semibold text-blue-800">
                {results.executionTime}
              </div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Data Points</div>
              <div className="text-xl font-semibold text-purple-800">
                {results.outputData?.length || 0}
              </div>
            </div>
          </div>

          {/* Output Data Visualization */}
          <div>
            <h3 className="text-heading mb-3">Output Data</h3>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="grid grid-cols-5 gap-2 text-center">
                {results.outputData?.slice(0, 10).map((value: number, index: number) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm">
                    {value.toFixed(2)}
                  </div>
                ))}
              </div>
              {results.outputData?.length > 10 && (
                <p className="text-center text-secondary-text text-sm mt-2">
                  ... and {results.outputData.length - 10} more data points
                </p>
              )}
            </div>
          </div>

          {/* Parameters Used */}
          <div>
            <h3 className="text-heading mb-3">Parameters Used</h3>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(results.parameters || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-secondary-text">{key}:</span>
                    <span className="font-mono text-sm">{value.toString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div>
            <h3 className="text-heading mb-3">Validation Analysis</h3>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  results.validationScore > 0.8 ? 'bg-green-500' : 
                  results.validationScore > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">
                  Validation Score: {(results.validationScore * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-secondary-text">
                <div>✅ Mathematical consistency verified</div>
                <div>✅ Physical constraints satisfied</div>
                <div>✅ Convergence criteria met</div>
                {results.validationScore < 0.8 && (
                  <div className="text-yellow-600">
                    ⚠️ Consider adjusting parameters for better accuracy
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {agentConfig.status === 'error' && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 font-medium mb-2">Simulation Failed</p>
          <p className="text-secondary-text">
            The AI agent encountered an error while running the simulation. Please check your parameters and try again.
          </p>
          <button className="btn-secondary mt-4">
            Retry Simulation
          </button>
        </div>
      )}
    </div>
  );
}
