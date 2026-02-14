
import { StoreData } from '../store';

export const snapshotTemplate = (store: StoreData) => {
  const packageJson = {
    name: `mcp-server-${store.id}`,
    version: "1.0.0",
    type: "module",
    scripts: {
      "start": "node index.js",
      "refresh": "node scripts/refresh-data.js"
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^0.6.0",
      "zod": "^3.22.4",
      "node-fetch": "^3.3.2" // Added for refresh script
    }
  };

  const readme = `# ${store.name} MCP Server (Snapshot)

This is an auto-generated Model Context Protocol (MCP) server for **${store.name}**.
It uses a **static snapshot** of your inventory data.

## 🚀 Usage

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

3. Connect to Claude Desktop:
   - Go to Settings > Developer > Edit Config
   - Add this server:
     \`\`\`json
     "commercehub-${store.id}": {
       "command": "node",
       "args": ["/path/to/this/directory/index.js"]
     }
     \`\`\`

## 🔄 Refreshing Data

Since this is a snapshot server, data is static. To update it:
1. Run \`npm run refresh\` (if you configured a data source URL)
2. Or manually replace \`data/inventory.json\`

## 🛠 Tools Included
- \`search_products\`: Semantic search for products (in-memory).
- \`get_inventory\`: Check stock level.
`;

  const indexJs = `#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load Inventory from JSON file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'data', 'inventory.json');
let INVENTORY = [];

try {
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  INVENTORY = JSON.parse(rawData);
  console.error(\`Loaded \${INVENTORY.length} products from snapshot.\`);
} catch (error) {
  console.error("Failed to load inventory snapshot:", error);
}

const server = new Server(
  {
    name: "${store.name.toLowerCase().replace(/\\s+/g, '-')}",
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
        description: "Search for products in the ${store.name} catalog",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (e.g., 'red dress')" },
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

  if (name === "search_products") {
    const query = String(args.query).toLowerCase();
    const results = INVENTORY.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }

  if (name === "get_inventory") {
    const product = INVENTORY.find(p => p.id === args.productId);
    if (!product) {
      return { content: [{ type: "text", text: "Product not found" }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify({ id: product.id, stock: product.stock }, null, 2) }],
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("${store.name} MCP Server running on stdio");
`;

  return { packageJson, readme, indexJs };
};
