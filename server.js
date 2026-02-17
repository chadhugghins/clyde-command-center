const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class CommandCenterServer {
    constructor(port = 3030) {
        this.port = port;
        this.server = null;
        this.clients = new Set();
    }

    async start() {
        this.server = http.createServer((req, res) => this.handleRequest(req, res));
        
        this.server.listen(this.port, '127.0.0.1', () => {
            console.log(`🤖 Clyde Command Center running at http://127.0.0.1:${this.port}`);
            console.log(`📊 Real-time dashboard for AI workforce management`);
        });

        // Send updates every 2 seconds
        setInterval(() => this.broadcastUpdate(), 2000);
    }

    async handleRequest(req, res) {
        const url = new URL(req.url, `http://localhost:${this.port}`);

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        try {
            switch (url.pathname) {
                case '/':
                    await this.serveFile(res, 'index.html', 'text/html');
                    break;
                
                case '/api/dashboard':
                    await this.serveDashboardData(res);
                    break;
                
                case '/api/events':
                    this.serveSSE(req, res);
                    break;
                
                case '/api/action':
                    await this.handleAction(req, res);
                    break;
                
                default:
                    res.writeHead(404);
                    res.end('Not found');
            }
        } catch (error) {
            console.error('Request error:', error);
            res.writeHead(500);
            res.end('Internal server error');
        }
    }

    async serveFile(res, filename, contentType) {
        try {
            const content = await fs.readFile(path.join(__dirname, filename));
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch (error) {
            res.writeHead(404);
            res.end('File not found');
        }
    }

    async serveDashboardData(res) {
        const data = await this.gatherDashboardData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
    }

    serveSSE(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        this.clients.add(res);

        req.on('close', () => {
            this.clients.delete(res);
        });

        // Send initial data
        this.sendSSE(res, 'dashboard', { message: 'Connected to Command Center' });
    }

    sendSSE(res, event, data) {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    broadcastUpdate() {
        const data = { timestamp: new Date().toISOString() };
        this.clients.forEach(client => {
            try {
                this.sendSSE(client, 'update', data);
            } catch (error) {
                this.clients.delete(client);
            }
        });
    }

    async gatherDashboardData() {
        try {
            // Read active tasks
            const activeTasks = await this.readActiveTasks();
            
            // Get system status
            const systemStatus = await this.getSystemStatus();
            
            // Get session info (mock for now)
            const sessions = await this.getSessionInfo();
            
            // Cost tracking
            const costs = await this.getCostData();

            return {
                timestamp: new Date().toISOString(),
                sessions,
                tasks: activeTasks,
                system: systemStatus,
                costs,
                mode: this.getCurrentMode()
            };

        } catch (error) {
            console.error('Error gathering dashboard data:', error);
            return { error: 'Failed to gather data' };
        }
    }

    async readActiveTasks() {
        try {
            const tasksFile = path.join(__dirname, '../memory/active-tasks.md');
            const content = await fs.readFile(tasksFile, 'utf8');
            
            // Parse markdown to extract tasks
            const tasks = [];
            const taskMatches = content.match(/### TASK-\d+:.*?(?=### |## |$)/gs);
            
            if (taskMatches) {
                taskMatches.forEach(taskText => {
                    const titleMatch = taskText.match(/### TASK-(\d+): (.+)/);
                    const statusMatch = taskText.match(/\*\*Status:\*\* (.+)/);
                    const ownerMatch = taskText.match(/\*\*Owner:\*\* (.+)/);
                    
                    if (titleMatch) {
                        tasks.push({
                            id: titleMatch[1],
                            title: titleMatch[2],
                            status: statusMatch ? statusMatch[1] : 'Unknown',
                            owner: ownerMatch ? ownerMatch[1] : 'Unknown',
                            text: taskText
                        });
                    }
                });
            }
            
            return tasks;
        } catch (error) {
            console.error('Error reading active tasks:', error);
            return [];
        }
    }

    async getSystemStatus() {
        try {
            // Check if clawdbot is running
            const status = execSync('clawdbot status --json 2>/dev/null || echo "{\\"error\\": \\"not available\\"}"', 
                { encoding: 'utf8' });
            
            return JSON.parse(status);
        } catch (error) {
            return { 
                error: 'Failed to get system status',
                gateway: 'unknown',
                telegram: 'unknown'
            };
        }
    }

    async getSessionInfo() {
        // Mock session data - in real implementation would query clawdbot
        return [{
            key: 'agent:main:main',
            model: 'claude-sonnet-4',
            tokens: { used: 97000, max: 200000 },
            cost: 0.31,
            age: '16h 42m',
            status: 'active'
        }];
    }

    async getCostData() {
        try {
            // Read P&L log if available
            const plFile = path.join(__dirname, '../memory/pl-log.md');
            const content = await fs.readFile(plFile, 'utf8');
            
            // Parse cost data (simplified)
            return {
                today: 0.31,
                week: 1.24,
                month: 9.50,
                perTask: 0.15
            };
        } catch (error) {
            return {
                today: 0,
                week: 0,
                month: 0,
                perTask: 0
            };
        }
    }

    getCurrentMode() {
        const hour = new Date().getHours();
        const cstHour = (hour - 6 + 24) % 24; // Convert to CST (rough)
        
        if (cstHour >= 23 || cstHour < 6.5) {
            return 'quiet_hours';
        } else if (cstHour >= 7 && cstHour <= 21) {
            return 'family_hours';
        } else {
            return 'active_hours';
        }
    }

    async handleAction(req, res) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { action, params } = JSON.parse(body);
                
                let result = {};
                switch (action) {
                    case 'deploy_build':
                        result = await this.deployBuild(params);
                        break;
                    case 'spawn_subagent':
                        result = await this.spawnSubagent(params);
                        break;
                    case 'system_status':
                        result = await this.getSystemStatus();
                        break;
                    default:
                        result = { error: 'Unknown action' };
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
                
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
    }

    async deployBuild(params) {
        // Mock implementation
        return { 
            success: true, 
            message: 'Build deployment queued',
            build: params?.build || 'unknown'
        };
    }

    async spawnSubagent(params) {
        // Mock implementation
        return {
            success: true,
            message: 'Sub-agent spawn queued',
            sessionKey: `subagent-${Date.now()}`
        };
    }
}

// Start server
if (require.main === module) {
    const server = new CommandCenterServer(3030);
    server.start().catch(console.error);
}

module.exports = CommandCenterServer;