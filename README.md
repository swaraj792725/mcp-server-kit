# `@swaraj792725/mcp-server-kit`

> **Zero-dependency, lightweight Model Context Protocol (MCP) server creation kit and JSON-RPC stdio transport engine for Claude Desktop and AI agents.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Packages](https://img.shields.io/badge/registry-GitHub_Packages-green.svg)](https://github.com/swaraj792725?tab=packages)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)

---

## 🌟 Overview

Anthropic's **Model Context Protocol (MCP)** is the open standard for connecting AI tools, data sources, and servers to Claude Desktop and autonomous AI agents.

`@swaraj792725/mcp-server-kit` is an ultra-fast, zero-dependency Node.js toolkit for building production-grade MCP servers in 5 lines of code.

### Key Features
- ⚡ **Zero External Dependencies**: Ultra-fast stdio transport with native Node.js JSON-RPC 2.0 parsing.
- 🛠️ **Type-Safe Tool Registration**: Built-in handlers for `initialize`, `tools/list`, and `tools/call`.
- 🔌 **Claude Desktop Compatible**: Directly connects to `claude_desktop_config.json`.
- 📦 **Dual ESM/CJS Compliant**: Ultra-lightweight build with TypeScript declaration types included.

---

## 📦 Installation

```bash
npm install @swaraj792725/mcp-server-kit --registry=https://npm.pkg.github.com
```

---

## 🚀 Quickstart: Build an MCP Server in 5 Lines

```typescript
import { createMCPServer } from '@swaraj792725/mcp-server-kit';

const server = createMCPServer({ name: 'my-custom-tools', version: '1.0.0' });

server.registerTool({
  name: 'calculateTax',
  description: 'Calculates tax for an amount',
  inputSchema: { type: 'object', properties: { amount: { type: 'number' } } },
  handler: ({ amount }) => amount * 0.2
});

server.listenStdio();
```

---

## 📜 License

MIT © [Swaraj](https://github.com/swaraj792725)
