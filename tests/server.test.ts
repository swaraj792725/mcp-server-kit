import { describe, it, expect } from 'vitest';
import { createMCPServer } from '../src/index.js';

describe('mcp-server-kit', () => {
  it('handles MCP initialize request', async () => {
    const server = createMCPServer({ name: 'test-server', version: '1.2.3' });

    const response = await server.handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {}
    });

    expect(response.result.serverInfo.name).toBe('test-server');
    expect(response.result.serverInfo.version).toBe('1.2.3');
    expect(response.result.protocolVersion).toBe('2024-11-05');
  });

  it('registers tools and handles tools/list and tools/call', async () => {
    const server = createMCPServer({ name: 'test-server', version: '1.0.0' });

    server.registerTool({
      name: 'addNumbers',
      description: 'Adds two numbers together',
      inputSchema: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } } },
      handler: ({ a, b }) => a + b
    });

    // 1. List tools
    const listRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    });

    expect(listRes.result.tools.length).toBe(1);
    expect(listRes.result.tools[0].name).toBe('addNumbers');

    // 2. Call tool
    const callRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'addNumbers',
        arguments: { a: 10, b: 25 }
      }
    });

    expect(callRes.result.content[0].text).toBe('35');
  });
});
