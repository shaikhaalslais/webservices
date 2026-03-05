import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let mcpClient: Client | null = null;
let availableTools: any[] = [];
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the On Pilates Lane assistant in Leeds, UK. Help with classes, bookings, studio info and client queries. Be warm and concise. Never give medical advice.`;

async function initMCP() {
  try {
    const args = (process.env.MCP_ARGS || '').split(',');
    const transport = new StdioClientTransport({ command: process.env.MCP_COMMAND || 'python', args });
    mcpClient = new Client({ name: 'opl-bridge', version: '1.0.0' }, { capabilities: {} });
    await mcpClient.connect(transport);
    const result = await mcpClient.listTools();
    availableTools = result.tools;
    console.log(`✅ MCP connected — ${availableTools.length} tools loaded`);
  } catch (e) {
    console.error('MCP failed:', e);
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: message }];
    const tools: Anthropic.Tool[] = availableTools.map(t => ({ name: t.name, description: t.description || '', input_schema: t.inputSchema }));
    let iterations = 0;
    while (iterations < 10) {
      iterations++;
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
        ...(tools.length > 0 && { tools }),
      });
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
    return res.json({ reply: 'Sorry, something went wrong.' });
 } catch (e: any) {
    console.error('Chat error:', e);
    res.status(500).json({ reply: 'Something went wrong. Please try again.' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok', mcpConnected: !!mcpClient, tools: availableTools.length }));

async function start() {
  await initMCP();
  app.listen(process.env.PORT || 8787, () => console.log(`🚀 Chat bridge on port ${process.env.PORT || 8787}`));
}
start();
