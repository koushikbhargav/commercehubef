
import { StoreData } from '../store';

export const woocommerceTemplate = (store: StoreData) => {
  const credentials = store.credentials || {};
  const wooUrl = credentials.WOO_URL || 'https://your-wordpress-site.com';
  const wooKey = credentials.WOO_CONSUMER_KEY || 'ck_xxxxxxxxxxxxxxxx';
  const wooSecret = credentials.WOO_CONSUMER_SECRET || 'cs_xxxxxxxxxxxxxxxx';

  const packageJson = {
    name: `mcp-server-${store.id}`,
    version: "1.0.0",
    type: "module",
    scripts: {
      "start": "node index.js"
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^0.6.0",
      "zod": "^3.22.4",
      "@woocommerce/woocommerce-rest-api": "^1.0.1",
      "dotenv": "^16.4.1"
    }
  };

  const readme = `# ${store.name} MCP Server (WooCommerce Live)

This is an auto-generated Model Context Protocol (MCP) server for **${store.name}**.
It connects **LIVE** to your WooCommerce store using the REST API.

## 🔑 Configuration

1. Create a \`.env\` file in this directory:
   \`\`\`env
   WOO_URL=${wooUrl}
   WOO_CONSUMER_KEY=${wooKey}
   WOO_CONSUMER_SECRET=${wooSecret}
   \`\`\`

## 🚀 Usage

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the server:
   \`\`\`bash
   npm start
   \`\`\`
`;

  const indexJs = `#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Note: might require partial import depending on version
import dotenv from 'dotenv';
dotenv.config();

// Initialize WooCommerce Client
// @ts-ignore
const WooCommerce = WooCommerceRestApi.default || WooCommerceRestApi; 

let api;
if (process.env.WOO_URL && process.env.WOO_CONSUMER_KEY) {
  api = new WooCommerce({
    url: process.env.WOO_URL,
    consumerKey: process.env.WOO_CONSUMER_KEY,
    consumerSecret: process.env.WOO_CONSUMER_SECRET,
    version: 'wc/v3'
  });
  console.error("Connected to WooCommerce:", process.env.WOO_URL);
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
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_inventory",
        description: "Get stock level for a product ID",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "WooCommerce Product ID" },
          },
          required: ["id"],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!api) {
    return { 
      content: [{ type: "text", text: "Error: WooCommerce credentials not configured." }], 
      isError: true 
    };
  }

  try {
    if (name === "search_products") {
       const response = await api.get("products", { search: args.query, per_page: 5 });
       
       const simplified = response.data.map((p: any) => ({
         id: p.id,
         name: p.name,
         price: p.price,
         status: p.status,
         stock_quantity: p.stock_quantity
       }));

       return {
         content: [{ type: "text", text: JSON.stringify(simplified, null, 2) }],
       };
    }

    if (name === "get_inventory") {
      const response = await api.get(\`products/\${args.id}\`);
      return {
        content: [{ type: "text", text: JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          stock: response.data.stock_quantity,
          status: response.data.status
        }, null, 2) }],
      };
    }
  } catch (error: any) {
    return { 
      content: [{ type: "text", text: \`WooCommerce API Error: \${error.message}\` }],
      isError: true 
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
