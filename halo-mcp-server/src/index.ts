import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load Inventory from JSON file
// Using process.cwd() for simplicity in this dev environment test
const dataPath = path.join(process.cwd(), 'data', 'inventory.json');
let INVENTORY: any[] = [];

try {
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    INVENTORY = JSON.parse(rawData);
    console.error(`Loaded ${INVENTORY.length} products from snapshot.`);
  } else {
    console.error(`No inventory file found at ${dataPath}`);
    // Fallback for test
    INVENTORY = [
      { id: 'test-1', name: 'Test Product', category: 'Test', price: 100, stock: 10 }
    ];
  }
} catch (error) {
  console.error("Failed to load inventory snapshot:", error);
}

const server = new Server(
  {
    name: "sandbox-snapshot-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_products",
        description: "Search for products in the catalog",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_inventory",
        description: "Get stock level for a specific product ID",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "The ID of the product" },
          },
          required: ["productId"],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // @ts-ignore
  const queryArgs = args as { query?: string; productId?: string };

  if (name === "search_products") {
    const query = String(queryArgs.query || '').toLowerCase();
    const results = INVENTORY.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }

  if (name === "get_inventory") {
    const product = INVENTORY.find(p => p.id === queryArgs.productId);
    if (!product) {
      return { content: [{ type: "text", text: "Product not found" }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify({ id: product.id, stock: product.stock }, null, 2) }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Sandbox Snapshot Server running on stdio");
