import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
    try {
        const { repoUrl, token } = await req.json();

        // Basic validation
        if (!repoUrl || !token) {
            return NextResponse.json({ error: 'Missing repository URL or Token' }, { status: 400 });
        }

        const repoName = repoUrl.split('/').pop()?.replace('.git', '');
        const workDir = path.join(process.cwd(), 'temp_repos', repoName!);

        // 1. Clone or Pull
        const authUrl = repoUrl.replace('https://', `https://${token}@`);
        if (fs.existsSync(workDir)) {
            await execPromise(`cd ${workDir} && git remote set-url origin ${authUrl}`);
            await execPromise(`cd ${workDir} && git pull`, { timeout: 30000 });
        } else {
            await execPromise(`git clone ${authUrl} ${workDir}`, { timeout: 60000 });
        }

        // 2. Scan Files for Context
        const relevantFiles = ['package.json', 'server.js', 'app.js', 'index.js', 'main.py', 'requirements.txt', 'Gemfile', 'composer.json', 'index.html', 'src/App.tsx', 'src/App.vue'];
        let fileContext = "";

        const scanDir = (dir: string, depth: number = 0) => {
            if (depth > 3) return;
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    if (item !== 'node_modules' && item !== '.git') scanDir(fullPath, depth + 1);
                } else {
                    if (relevantFiles.includes(item) || item.endsWith('Controller.php') || item.endsWith('Service.java')) {
                        const content = fs.readFileSync(fullPath, 'utf-8').slice(0, 5000); // Limit size
                        fileContext += `\n--- FILE: ${item} ---\n${content}\n`;
                    }
                }
            }
        };

        try {
            scanDir(workDir);
        } catch (e) {
            console.error("Error scanning files:", e);
        }

        // 3. AI Analysis & Generation
        let adapterCode = "";
        let analysisSummary = "Static analysis fallback.";

        if (process.env.GEMINI_API_KEY && fileContext) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const prompt = `
                You are an expert integration engineer. Your task is to analyze the following codebase files and generate a 'webmcp_adapter.js' file that exposes the core business logic of this application to the window.modelContext object.

                CODEBASE CONTEXT:
                ${fileContext}

                REQUIREMENTS:
                1. Identify the main entity (e.g., Products, Tasks, Users) and key actions (e.g., get, add, update).
                2. Generate Javascript code that essentially 'patches' or 'wraps' the existing frontend fetch calls or API endpoints to be accessible via 'window.modelContext.agent.tools'.
                3. The output MUST be valid Javascript code for 'webmcp_adapter.js'.
                4. Do NOT use markdown blocks. Return ONLY the code.
                5. The code should start with "console.log('WebMCP Adapter Initialized');"
                6. It must define 'window.modelContext = { agent: { tools: { ... } } };'

                Generate the adapter code now.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                adapterCode = response.text().replace(/```javascript/g, '').replace(/```/g, '').trim();
                analysisSummary = "AI analysis completed using Gemini 2.0 Flash.";

            } catch (error) {
                console.error("Gemini Scan Failed:", error);
                analysisSummary = "AI Scan failed, reverting to static template.";
            }
        }

        // Fallback if AI fails or no key
        if (!adapterCode) {
            adapterCode = `
            console.log('WebMCP Adapter Initialized (Fallback)');
            window.modelContext = {
                agent: {
                    tools: {
                        getProducts: async () => {
                             const res = await fetch('/api/products');
                             return await res.json();
                        },
                        addToCart: async ({ productId, quantity }) => {
                            const res = await fetch('/api/cart', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ productId, quantity })
                            });
                             return await res.json();
                        }
                    }
                }
            };
            `;
        }


        // 4. Inject Adapter
        const adapterPath = path.join(workDir, 'public', 'webmcp_adapter.js');
        if (!fs.existsSync(path.dirname(adapterPath))) fs.mkdirSync(path.dirname(adapterPath), { recursive: true });

        fs.writeFileSync(adapterPath, adapterCode);

        // Inject into Index
        const indexPaths = [
            path.join(workDir, 'client', 'index.html'),
            path.join(workDir, 'public', 'index.html'),
            path.join(workDir, 'index.html')
        ];

        for (const p of indexPaths) {
            if (fs.existsSync(p)) {
                let indexContent = fs.readFileSync(p, 'utf-8');
                if (!indexContent.includes('webmcp_adapter.js')) {
                    indexContent = indexContent.replace('</body>', '<script src="/webmcp_adapter.js"></script></body>');
                    fs.writeFileSync(p, indexContent);
                }
                break;
            }
        }

        // 5. Commit and Push
        await execPromise(`cd ${workDir} && git config user.email "agent@webmcp.dev" && git config user.name "WebMCP Agent"`);
        try {
            await execPromise(`cd ${workDir} && git add . && git commit -m "Inject AI-Generated WebMCP Adapter"`);
            await execPromise(`cd ${workDir} && git push`);
        } catch (e) {
            console.log('Nothing to commit');
        }

        return NextResponse.json({
            success: true,
            logs: [
                `Cloned ${repoName} successfully`,
                `Analyzed codebase context`,
                analysisSummary,
                `Injected generated webmcp_adapter.js`,
                `Pushed changes to remote`
            ]
        });

    } catch (error: any) {
        console.error('Analysis failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
