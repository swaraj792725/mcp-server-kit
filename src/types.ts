export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id?: number | string;
  method: string;
  params?: Record<string, any>;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id?: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPTool<TArgs = any, TResult = any> {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: (args: TArgs) => Promise<TResult> | TResult;
}

export interface MCPServerOptions {
  name: string;
  version: string;
  protocolVersion?: string;
}
