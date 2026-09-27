#!/usr/bin/env node

import * as process from 'node:process';
import { createMCPServer } from './server.js';

function printHelp() {
  console.log(`
@swaraj792725/mcp-server-kit - Zero-dependency Model Context Protocol (MCP) server creation kit

Usage:
  mcp-server-kit [options]

Options:
  --help      Show help message

Example:
  import { createMCPServer } from '@swaraj792725/mcp-server-kit';

  const server = createMCPServer({ name: 'my-tools', version: '1.0.0' });
  server.registerTool({
    name: 'ping',
    description: 'Ping server',
    inputSchema: { type: 'object', properties: {} },
    handler: () => 'pong'
  });
  server.listenStdio();
`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // Demo MCP server
  const server = createMCPServer({ name: 'demo-mcp-server', version: '1.0.0' });
  server.registerTool({
    name: 'echo',
    description: 'Echoes input message back to Claude',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to echo' }
      },
      required: ['message']
    },
    handler: ({ message }) => `Echo: ${message}`
  });

  server.listenStdio();
}

main().catch(err => {
  console.error('Error running mcp-server-kit CLI:', err);
  process.exit(1);
});
