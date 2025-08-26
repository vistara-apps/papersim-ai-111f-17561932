import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// For build purposes, we'll use a dummy key if none is provided
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || 'sk-dummy-key-for-build-purposes-only';

const openai = new OpenAI({
  apiKey,
  baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const { message, papers } = await request.json();

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY ? "google/gemini-2.0-flash-001" : "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are PaperSim AI, an expert physics research assistant. You help users understand and replicate physics simulations from research papers.

Available papers: ${JSON.stringify(papers)}

You can help with:
1. Analyzing research paper methodologies
2. Extracting simulation parameters
3. Configuring AI agents for physics simulations
4. Interpreting simulation results
5. Validating against known physics principles

Respond helpfully about physics research and simulation replication.`
        },
        {
          role: "user",
          content: message
        }
      ],
      functions: [
        {
          name: "analyze_paper",
          description: "Analyze a physics research paper and extract key information",
          parameters: {
            type: "object",
            properties: {
              paperId: { type: "string", description: "ID of the paper to analyze" },
              focus: { type: "string", enum: ["methodology", "parameters", "equations", "validation"] }
            },
            required: ["paperId", "focus"]
          }
        },
        {
          name: "configure_agent",
          description: "Configure an AI agent for physics simulation",
          parameters: {
            type: "object",
            properties: {
              paperId: { type: "string", description: "ID of the source paper" },
              agentType: { type: "string", enum: ["monte-carlo", "molecular-dynamics", "finite-element", "quantum-simulation"] },
              parameters: { type: "object", description: "Simulation parameters" }
            },
            required: ["paperId", "agentType"]
          }
        }
      ],
      function_call: "auto"
    });

    return NextResponse.json({ response: response.choices[0] });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
