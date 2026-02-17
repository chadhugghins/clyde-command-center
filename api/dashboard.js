// Vercel API route for dashboard data
export default function handler(req, res) {
    // Mock data for demo since we can't read local files on Vercel
    const mockData = {
        timestamp: new Date().toISOString(),
        sessions: [{
            key: 'agent:main:main',
            model: 'claude-sonnet-4',
            tokens: { used: 97000, max: 200000 },
            cost: 0.31,
            age: '16h 42m',
            status: 'active'
        }],
        tasks: [
            { id: '004', title: 'Command Center Interface', status: 'COMPLETED', owner: 'Clyde' },
            { id: '005', title: 'Personal AI Cost Tracker', status: 'COMPLETED', owner: 'Clyde' },
            { id: '006', title: 'Command Center Deployment', status: 'IN PROGRESS', owner: 'Clyde' }
        ],
        system: {
            gateway: 'Running',
            telegram: 'Connected',
            webSearch: 'Active'
        },
        costs: {
            today: 0.31,
            week: 1.24,
            month: 9.50,
            perTask: 0.15
        },
        mode: 'active_hours'
    };

    res.json(mockData);
}