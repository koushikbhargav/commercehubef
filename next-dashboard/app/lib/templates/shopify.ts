
import { StoreData } from '../store';

export const shopifyTemplate = (store: StoreData) => {
  const credentials = store.credentials || {};
  const shopName = credentials.SHOPIFY_SHOP_NAME || 'your-shop-name';
  const accessToken = credentials.SHOPIFY_ACCESS_TOKEN || 'shpat_xxxxxxxxxxxxxxxx';

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
      "shopify-api-node": "^3.12.0",
      "dotenv": "^16.4.1"
    }
  };

  const readme = `# ${store.name} MCP Server (Shopify Live)

This is an auto-generated Model Context Protocol (MCP) server for **${store.name}**.
It connects **LIVE** to your Shopify store api.

## 🔑 Configuration

1. Create a \`.env\` file in this directory (we may have pre-filled this for you):
   \`\`\`env
   SHOPIFY_SHOP_NAME=${shopName}
   SHOPIFY_ACCESS_TOKEN=${accessToken}
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

3. Connect to Claude:
   - Add to Claude Desktop config with the path to this directory.
`;

  const indexJs = `#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import Shopify from 'shopify-api-node';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Shopify Client
const shopName = process.env.SHOPIFY_SHOP_NAME;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

let shopify;
if (shopName && accessToken) {
  shopify = new Shopify({
    shopName: shopName,
    accessToken: accessToken
  });
  console.error("Connected to Shopify store:", shopName);
} else {
  console.error("WARNING: Missing Shopify credentials in .env file");
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
        description: "Search for products in the ${store.name} Shopify catalog",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_product",
        description: "Get product details by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Shopify Product ID" },
          },
          required: ["id"],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!shopify) {
    return { 
      content: [{ type: "text", text: "Error: Shopify credentials not configured in MCP server." }],
      isError: true 
    };
  }

  try {
    if (name === "search_products") {
       // Using GraphQL or REST to search
       const products = await shopify.product.list({ title: args.query, limit: 5 });
       
       const simplified = products.map(p => ({
         id: p.id,
         title: p.title,
         vendor: p.vendor,
         product_type: p.product_type,
         price: p.variants[0]?.price,
         inventory_quantity: p.variants.reduce((acc, v) => acc + v.inventory_quantity, 0)
       }));

       return {
         content: [{ type: "text", text: JSON.stringify(simplified, null, 2) }],
       };
    }

    if (name === "get_product") {
      const product = await shopify.product.get(Number(args.id));
      return {
        content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      };
    }
  } catch (error) {
    return { 
      content: [{ type: "text", text: \`Shopify API Error: \${error.message}\` }],
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
