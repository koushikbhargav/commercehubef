
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: __dirname
});

const send = (msg) => {
    const json = JSON.stringify(msg);
    // console.log('Sending:', json);
    server.stdin.write(json + '\n');
};

let buffer = '';

server.stdout.on('data', (data) => {
    const str = data.toString();
    buffer += str;
    // console.log('Received chunk:', str);

    // Simple JSON parsing logic for stream
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const msg = JSON.parse(line);
            if (msg.result && msg.result.capabilities) {
                console.log('✅ Handshake Success');
                // Now list tools
                send({
                    jsonrpc: "2.0",
                    id: 2,
                    method: "tools/list"
                });
            }
            if (msg.result && msg.result.tools) {
                const toolNames = msg.result.tools.map(t => t.name);
                console.log('✅ Tools Found:', toolNames.join(', '));
                if (toolNames.includes('search_products') && toolNames.includes('get_inventory')) {
                    console.log('🎉 VERIFICATION PASSED: Snapshot Server is fully functional');
                    process.exit(0);
                }
            }
        } catch (e) {
            console.log('Non-JSON output:', line);
        }
    }
});

// 1. Initialize
send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
    }
});

// Close after 5s if no success
setTimeout(() => {
    console.error('❌ Timeout: Server did not respond correctly');
    server.kill();
    process.exit(1);
}, 5000);
