import { JSONRPCRequest, JSONRPCResponse, MCPTool, MCPServerOptions } from './types.js';

export class MCPServer {
  public readonly name: string;
  public readonly version: string;
  public readonly protocolVersion: string;
  private tools = new Map<string, MCPTool>();

  constructor(options: MCPServerOptions) {
    this.name = options.name;
    this.version = options.version;
    this.protocolVersion = options.protocolVersion || '2024-11-05';
  }

  /**
   * Registers a new tool with the MCP server.
   */
  public registerTool<TArgs = any, TResult = any>(tool: MCPTool<TArgs, TResult>): this {
    this.tools.set(tool.name, tool);
    return this;
  }

  /**
   * Processes an incoming JSON-RPC 2.0 MCP request and produces a valid response object.
   */
  public async handleRequest(req: JSONRPCRequest): Promise<JSONRPCResponse> {
    const { id, method, params } = req;

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: this.protocolVersion,
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: this.name,
            version: this.version
          }
        }
      };
    }

    if (method === 'notifications/initialized') {
      return { jsonrpc: '2.0', id, result: {} };
    }

    if (method === 'tools/list') {
      const toolList = Array.from(this.tools.values()).map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }));
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: toolList }
      };
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      const tool = this.tools.get(toolName);
      if (!tool) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Tool not found: ${toolName}`
          }
        };
      }

      try {
        const output = await tool.handler(toolArgs);
        const contentText = typeof output === 'string' ? output : JSON.stringify(output, null, 2);

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: contentText
              }
            ]
          }
        };
      } catch (err: any) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32603,
            message: `Execution error in tool '${toolName}': ${err.message || String(err)}`
          }
        };
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method not supported: ${method}`
      }
    };
  }

  /**
   * Starts listening for line-delimited JSON-RPC requests on stdio for Claude Desktop / AI Agents.
   */
  public listenStdio(): void {
    let buffer = '';

    process.stdin.on('data', async chunk => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const req: JSONRPCRequest = JSON.parse(line);
          const res = await this.handleRequest(req);
          if (res.id !== undefined) {
            process.stdout.write(JSON.stringify(res) + '\n');
          }
        } catch {
          // Ignore invalid JSON-RPC lines
        }
      }
    });
  }
}

export function createMCPServer(options: MCPServerOptions): MCPServer {
  return new MCPServer(options);
}
