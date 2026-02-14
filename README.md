# Halo MCP

Halo MCP is an Agentic MCP (Model Context Protocol) Studio designed to turn any inventory into an AI-accessible API. It allows AI agents to browse and purchase products from your catalog.

## Project Structure

This repository consists of two main components:

1.  **`halo-mcp-server`**: A standalone MCP server for Merchant Inventory.
2.  **`next-dashboard`**: A Next.js dashboard for managing the agentic commerce platform.

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/koushikbhargav/halo-mcp.git
cd halo-mcp
```

### 2. Install Dependencies

You need to install dependencies for both the MCP server and the Dashboard.

```bash
# Install root dependencies (if any)
npm install

# Install Halo MCP Server dependencies
cd halo-mcp-server
npm install

# Install Next Dashboard dependencies
cd ../next-dashboard
npm install
```

## Configuration

### Next Dashboard

Create a `.env.local` file in the `next-dashboard` directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** For local development, ensure your Supabase project has `http://localhost:3000/**` added to the Redirect URLs in the Authentication > URL Configuration settings.

## Running the Application

### Start the Halo MCP Server

```bash
cd halo-mcp-server
npm run build
# The server can be run with:
# npm start
```

### Start the Dashboard

```bash
cd next-dashboard
npm run dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1.  Open the dashboard to upload your inventory data.
2.  The system will generate an MCP server for your inventory.
3.  AI agents can then connect to this server to query products and place orders.

---

## WebMCP Demos (Agentic Commerce)

This repository includes a suite of demos showing how to make **any website** AI-Agent ready using WebMCP.

| Demo | Path | Description |
| :--- | :--- | :--- |
| **1. Basic POC** | `webmcp_poc/` | Simple HTML site with WebMCP built-in. |
| **2. Converter Tool** | `webmcp_demo/` | Tool to auto-transform static sites. |
| **3. Universal Bridge** | `webmcp_complex_demo/` | Bridging complex React/Stateful apps. |
| **4. AI Configurator** | `webmcp_advanced_demo/` | **Gemini 2.5** analyzes legacy code to generate adapters. |
| **5. Network Interceptor** | `webmcp_network_demo/` | Captures data from `fetch()` calls (Backend Agnostic). |
| **6. Large Codebase** | `webmcp_large_demo/` | Handles multi-file apps via Context Bundling. |

See `walkthrough.md` for full verification details.
