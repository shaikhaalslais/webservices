import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

let mcpClient: Client | null = null;
let availableTools: any[] = [];

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the On Pilates Lane (OPL) assistant based in Leeds, UK. 
You help with class schedules, bookings, and studio info.
Be warm, friendly and concise. Never give medical advice.`;

async function initializeMCP() {
  try {
    const command = process.env.MCP_COMMAND || 'python';
    const args = (process.env.MCP_ARGS || '').split(',');
    console.log(`Connecting to MCP: ${command} ${args.join(' ')}`);
    const transport = new StdioClientTransport({ command, args });
    mcpClient = new Client({ name: 'opl-chat-bridge', version: '1.0.0' }, { capabilities: {} });
    await mcpClient.connect(transport);
    const toolsResult = await mcpClient.listTools();
    availableTools = toolsResult.tools;
    console.log(`Loaded ${availableTools.length} tools:`, availableTools.map(t => t.name).join(', '));
  } catch (error) {
    console.error('MCP init failed:', error);
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: message }];
    const tools: Anthropic.Tool[] = availableTools.map(t => ({
      name: t.name,
      description: t.description || '',
      input_schema: t.inputSchema,
    }));

    let iterations = 0;
    while (iterations < 10) {
      iterations++;
      const params: Anthropic.MessageCreateParams = {
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
        ...(tools.length > 0 && { tools }),
      };

      const response = await anthropic.messages.create(params);

      if (response.stop_reason === 'end_turn') {
        const text = response.content.find(c => c.type === 'text');
        return res.json({ reply: text?.text || 'Sorry, I could not process that.' });
      }

      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });
        const results: Anthropic.ToolResultBlockParam[] = [];
        for (const block of response.content) {
          if (block.type === 'tool_use') {
            try {
              const result = await mcpClient!.callTool({ name: block.name, arguments: block.input as Record<string, unknown> });
              results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result.content) });
            } catch (e: any) {
              results.push({ type: 'tool_result', tool_use_id: block.id, content: `Error: ${e.message}`, is_error: true });
            }
          }
        }
        messages.push({ role: 'user', content: results });
        continue;
      }
      break;
    }
    return res.json({ reply: 'Sorry, something went wrong. Please try again.' });
  } catch (e: any) {
    console.error('Chat error:', e);
    res.status(500).json({ reply: 'Something went wrong. Please try again.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', mcpConnected: !!mcpClient, tools: availableTools.length });
});

async function start() {
  await initializeMCP();
  app.listen(PORT, () => console.log(`Chat bridge running on http://localhost:${PORT}`));
}

start();
