# Clyde Command Center

> Mission Control Dashboard for AI Workforce Management

A real-time dashboard for monitoring and managing your AI assistant collaboration. Inspired by Jon Tsai's OpenClaw Command Center but tailored for personal productivity workflows.

## 🎯 Features

### Real-Time Monitoring
- **Session Tracking** - Active AI sessions with token usage, costs, and context
- **Task Management** - Visual task board with status tracking and completion metrics  
- **System Health** - Gateway status, API connections, heartbeat monitoring
- **Cost Intelligence** - Real-time spend tracking with daily/weekly/monthly insights

### AI Workforce Coordination
- **Active Task Board** - Resume crashed sessions, track work-in-progress
- **Build Queue Management** - Deploy apps, manage development pipeline
- **Quick Actions** - Spawn sub-agents, generate reports, system controls
- **Performance Metrics** - Token efficiency, cost per task, productivity insights

## 🚀 Quick Start

```bash
cd command-center
node server.js
```

Open `http://localhost:3030` to view the dashboard.

## 🎨 Interface Design

**Mission Control Aesthetic:**
- Dark theme optimized for extended use
- Monospace fonts for technical precision  
- Real-time updates via Server-Sent Events
- Mobile-responsive grid layout
- Cyberpunk-inspired color scheme

**Dashboard Panels:**
1. **Sessions** - Active AI instances and resource usage
2. **Tasks** - Work items from active-tasks.md with status tracking
3. **System** - Health checks and API status
4. **Costs** - Spend tracking and budget management
5. **Builds** - Recent projects and deployment queue
6. **Actions** - Quick controls for common operations

## 🔧 Architecture

**Zero-Dependency Philosophy:**
- Pure Node.js server (no frameworks)
- Vanilla JavaScript frontend
- Server-Sent Events for real-time updates
- File-based data sources (active-tasks.md, memory files)

**Security:**
- Localhost-only by default
- No external dependencies
- No telemetry or tracking
- Local file system access only

## 📊 Data Sources

**Task Tracking:**
- `memory/active-tasks.md` - Primary task state
- `memory/pl-log.md` - Cost and performance data
- `memory/daily/*.md` - Historical context

**System Integration:**
- `clawdbot status` - Gateway and session info
- Heartbeat state monitoring
- Real-time token usage tracking

## 🎪 Use Cases

**Daily Workflow:**
- Monitor overnight autonomous building progress
- Track cost efficiency across projects  
- Resume interrupted work after crashes
- Coordinate multi-agent task execution

**Project Management:**
- Visual task board for complex builds
- Cost tracking for budget management
- Performance optimization insights
- Build queue and deployment management

## 🔄 Real-Time Features

**Live Updates (2-second intervals):**
- Session token consumption
- Task status changes
- System health metrics
- Cost accumulation

**Interactive Controls:**
- Deploy next build in queue
- Spawn specialized sub-agents
- Generate performance reports
- Emergency system controls

## 📱 Mobile Optimized

Responsive design works on phones and tablets for monitoring on-the-go:
- Touch-friendly button sizes
- Optimized grid layouts
- Essential metrics prioritized
- Quick action accessibility

## 🎯 Productivity Impact

**Before:** Manual task tracking, no visibility into AI resource usage, crash recovery issues
**After:** Real-time coordination, cost optimization, seamless session recovery

**Key Metrics:**
- Session uptime and efficiency
- Cost per completed task
- Build deployment frequency  
- System resource utilization

## 🔮 Future Enhancements

- **Multi-Agent Orchestration** - Coordinate specialized AI workers
- **Voice Control** - STT/TTS integration for hands-free management
- **Advanced Scheduling** - Cron job management with conflict resolution
- **Performance Analytics** - Historical trends and optimization suggestions

## 📄 License

MIT License - Build your own mission control interface

---

*Built during quiet hours by Clyde for enhanced human-AI collaboration*