
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = 10000;

app.use(cors({ 
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 1. IN-MEMORY DATABASE
const db = {
  users: [],
  messages: [], // { id, fromId, toId, content, timestamp }
  ratings: []   // { fromId, toId, trust, skill, vibe, timestamp }
};

// DOM: The Myspace Tom of Wolfpack
const DOM_PROFILE = {
    id: "dom_default",
    name: "Dom",
    role: "sales",
    tagline: "I connect visionaries to reality.",
    avatar: "https://ui-avatars.com/api/?name=Dom&background=FFD700&color=000",
    distance: "Global",
    location: "Global",
    skills: ["Vision", "Community", "Strategy"],
    stats: { build: 85, fund: 90, connect: 99 },
    hunting: "Builders ready to disrupt industries.",
    linkedin: "https://www.linkedin.com/in/dominique-harris-396b0058"
};

const MOCK_WOLVES = [
    DOM_PROFILE,
    { 
        id: "w1", 
        name: "Sarah Jenkins", 
        role: "finance", 
        tagline: "I scale ads to 5x ROAS.", 
        avatar: "https://i.pravatar.cc/150?u=w1", 
        distance: "2 miles",
        location: "New York",
        skills: ["Accounting", "Forecasting", "Fundraising"],
        stats: { build: 40, fund: 95, connect: 70 },
        hunting: "A technical founder with a working MVP."
    },
    { 
        id: "w2", 
        name: "Marcus Thorne", 
        role: "labor", 
        tagline: "I build MVPs in weekends.", 
        avatar: "https://i.pravatar.cc/150?u=w2", 
        distance: "5 miles",
        location: "San Francisco",
        skills: ["React", "Node.js", "System Design"],
        stats: { build: 98, fund: 20, connect: 30 },
        hunting: "Capital to scale my SaaS prototype."
    },
    { 
        id: "w3", 
        name: "Elena Rodriguez", 
        role: "sales", 
        tagline: "I can sell ice to eskimos.", 
        avatar: "https://i.pravatar.cc/150?u=w3", 
        distance: "1 mile",
        location: "Miami",
        skills: ["Cold Calling", "Negotiation", "CRM"],
        stats: { build: 30, fund: 60, connect: 95 },
        hunting: "A product that actually works."
    },
    { 
        id: "w4", 
        name: "David Chen", 
        role: "labor", 
        tagline: "Full-stack wizard. React/Node expert.", 
        avatar: "https://i.pravatar.cc/150?u=w4", 
        distance: "3 miles",
        location: "Austin",
        skills: ["Python", "AI", "Cloud"],
        stats: { build: 95, fund: 10, connect: 20 },
        hunting: "A non-technical founder with funding."
    },
    { 
        id: "w9", 
        name: "Gavin Belson", 
        role: "finance", 
        tagline: "Making the world a better place.", 
        avatar: "https://i.pravatar.cc/150?u=w9", 
        distance: "Silicon Valley",
        location: "Palo Alto",
        skills: ["Acquisitions", "Hool", "Management"],
        stats: { build: 50, fund: 100, connect: 40 },
        hunting: "IP ownership."
    },
    { 
        id: "w10", 
        name: "Richard Hendricks", 
        role: "labor", 
        tagline: "Middle-out compression.", 
        avatar: "https://i.pravatar.cc/150?u=w10", 
        distance: "Silicon Valley",
        location: "Palo Alto",
        skills: ["Compression", "Algorithms", "C++"],
        stats: { build: 100, fund: 10, connect: 5 },
        hunting: "A new internet."
    },
    { 
        id: "w11", 
        name: "Russ Hanneman", 
        role: "finance", 
        tagline: "ROI. Radio on Internet.", 
        avatar: "https://i.pravatar.cc/150?u=w11", 
        distance: "Las Vegas",
        location: "Vegas",
        skills: ["Angel Investing", "Marketing", "Cars"],
        stats: { build: 10, fund: 99, connect: 80 },
        hunting: "The next billion dollar idea."
    }
];

const GAME_BOARD_IDS = Array.from({ length: 40 }, (_, i) => i + 1);

// HELPER: User Store (Synchronous Mock)
const UserStore = {
  findOne: (query, callback) => {
    try {
      const user = db.users.find(u => {
        if (query.email) return u.email === query.email;
        if (query._id) return u._id === query._id;
        if (query.id) return u.id === query.id;
        if (query.$or) {
          return query.$or.some(q => 
            (q.email && u.email === q.email) ||
            (q._id && u._id === q._id) ||
            (q.id && u.id === q.id)
          );
        }
        return false;
      });
      callback(null, user);
    } catch (e) {
      callback(e, null);
    }
  },
  insert: (doc, callback) => {
    try {
      const newUser = { ...doc, _id: doc._id || Math.random().toString(36).substr(2, 9) };
      db.users.push(newUser);
      callback(null, newUser);
    } catch (e) {
      callback(e, null);
    }
  },
  update: (query, updateCmd, options, callback) => {
    try {
      const userIdx = db.users.findIndex(u => {
        if (query._id) return u._id === query._id;
         if (query.$or) {
          return query.$or.some(q => 
            (q.email && u.email === q.email) ||
            (q._id && u._id === q._id) ||
            (q.id && u.id === q.id)
          );
        }
        return false;
      });

      if (userIdx !== -1) {
        if (updateCmd.$set) {
          db.users[userIdx] = { ...db.users[userIdx], ...updateCmd.$set };
        }
        if (updateCmd.$push) {
            for (const key in updateCmd.$push) {
                if (!db.users[userIdx][key]) db.users[userIdx][key] = [];
                db.users[userIdx][key].push(updateCmd.$push[key]);
            }
        }
        callback(null, 1);
      } else {
        callback(null, 0);
      }
    } catch (e) {
      callback(e, null);
    }
  }
};

const io = new Server(server, { cors: { origin: "*" } });

// --- ROUTES ---

app.get('/api/health', (req, res) => res.send('OK'));

app.get('/api/cards', (req, res) => {
    res.json([
        { id: "c1", type: "labor", name: "The Builder", description: "I get things done." },
        { id: "c2", type: "finance", name: "The Capital", description: "I fund the vision." },
        { id: "c3", type: "sales", name: "The Connector", description: "I connect the dots." }
    ]);
});

// SELECT CARD (Identity)
app.post('/api/cards/select', (req, res) => {
    const { userId, cardId } = req.body;
    
    UserStore.findOne({ $or: [{ email: userId }, { _id: userId }, { id: userId }] }, (err, existingUser) => {
        if (err) return res.status(500).json({ error: "Database error" });

        // Default Stats based on class
        const baseStats = 
            cardId === 'c1' ? { build: 80, fund: 20, connect: 20 } :
            cardId === 'c2' ? { build: 20, fund: 80, connect: 30 } :
                              { build: 30, fund: 30, connect: 80 };

        if (existingUser) {
            UserStore.update(
                { _id: existingUser._id },
                { $set: { 
                    selected_card_id: cardId, 
                    selfStats: baseStats, 
                    // Don't auto-advance to step 1 yet, we need profile setup
                    // onboardingStep: Math.max(existingUser.onboardingStep || 0, 1), 
                    updatedAt: new Date() 
                }},
                {},
                (updateErr) => {
                    if (updateErr) return res.status(500).json({ error: "Failed to update user" });
                    UserStore.findOne({ _id: existingUser._id }, (e, u) => res.json(u));
                }
            );
        } else {
            // New User Fallback
            const newUser = {
                _id: userId,
                email: userId.includes('@') ? userId : undefined,
                selected_card_id: cardId,
                selected_product_id: null,
                ivp: 0,
                tasks: [],
                wolfpack: [DOM_PROFILE],
                events: [],
                pace: 'walk',
                homebase: 'The Daily Grind',
                selfStats: baseStats,
                publicStats: { build: 0, fund: 0, connect: 0 }, 
                onboardingStep: 0, // Still at 0 until profile is filled
                roleHistory: {
                    labor: { grind: 0, kill: 0, efficiency: 0, rating: 0 },
                    finance: { grind: 0, kill: 0, efficiency: 0, rating: 0 },
                    sales: { grind: 0, kill: 0, efficiency: 0, rating: 0 },
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            UserStore.insert(newUser, (insertErr, doc) => {
                if (insertErr) return res.status(500).json({ error: "Failed to create user" });
                res.json(doc);
            });
        }
    });
});

// UPDATE PROFILE (Onboarding Step)
app.post('/api/user/profile', (req, res) => {
    const { userId, name, location, skills, bio } = req.body;
    
    UserStore.findOne({ _id: userId }, (err, user) => {
        if (!user) return res.status(404).json({ error: "User not found" });

        UserStore.update(
            { _id: userId },
            { $set: { 
                name, location, skills, bio,
                onboardingStep: Math.max(user.onboardingStep || 0, 1) // Now we advance
            }},
            {},
            () => UserStore.findOne({ _id: userId }, (e, u) => res.json(u))
        );
    });
});

// SELECT STARTUP
app.post('/api/startup/select', (req, res) => {
    const { userId, productId, customProduct } = req.body;
    
    UserStore.findOne({ $or: [{ _id: userId }, { email: userId }] }, (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });

        const initialTasks = GAME_BOARD_IDS.map(id => ({
            id,
            status: 'todo',
            assignedTo: null,
            method: null,
            budget: Math.floor(Math.random() * 500) + 100, // Mock budget
            deadline: new Date(Date.now() + (Math.random() * 10 + 2) * 24 * 60 * 60 * 1000).toISOString(), // Mock deadline 2-12 days out
            grindCount: 0
        }));

        const updates = { 
            tasks: initialTasks,
            ivp: 100, // Start with some funding
            onboardingStep: Math.max(user.onboardingStep || 0, 2),
            updatedAt: new Date() 
        };

        if (customProduct) {
             updates.selected_product_id = -1; // Flag for custom
             updates.alphaPitch = { 
                 headline: customProduct.title, 
                 strategy: `${customProduct.targetMarket} | ${customProduct.price} | ${customProduct.marketingChannels}` 
             }; 
        } else {
            updates.selected_product_id = productId;
        }

        UserStore.update(
            { _id: user._id },
            { $set: updates },
            {},
            () => {
                UserStore.findOne({ _id: user._id }, (e, u) => res.json(u));
            }
        );
    });
});

// MATCHMAKING ALGORITHM
app.post('/api/matches', (req, res) => {
    const { role, userId, targetRole } = req.body;
    
    UserStore.findOne({ _id: userId }, (err, currentUser) => {
        let candidates = MOCK_WOLVES;
        
        // Filter by targetRole if specified
        if (targetRole) {
            candidates = candidates.filter(c => c.role === targetRole);
        }

        // Score candidates
        const scoredCandidates = candidates.map(candidate => {
            let score = 0;
            // ROLE COMPLEMENTARITY
            if (role && candidate.role !== role) score += 50;

            // LOCATION PROXIMITY
            if (currentUser && currentUser.location && candidate.location) {
                if (currentUser.location.toLowerCase() === candidate.location.toLowerCase()) {
                    score += 30;
                } else {
                    score += 5;
                }
            }

            // SKILL MATCHING
            if (candidate.skills && candidate.skills.length > 0) score += 10;

            return { ...candidate, score };
        });

        // Sort by Score
        scoredCandidates.sort((a, b) => b.score - a.score);

        // Always ensure Dom is there if filtering allows it (Dom is Sales)
        if (!scoredCandidates.find(c => c.id === 'dom_default')) {
             if (!targetRole || targetRole === 'sales') {
                 scoredCandidates.unshift(DOM_PROFILE);
             }
        }

        res.json(scoredCandidates);
    });
});

// MESSAGING
app.post('/api/messages/send', (req, res) => {
    const { fromId, toId, content } = req.body;
    const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        fromId,
        toId,
        content,
        timestamp: new Date().toISOString()
    };
    db.messages.push(newMessage);
    res.json(newMessage);
});

app.get('/api/messages/history', (req, res) => {
    const { userId, otherId } = req.query;
    const history = db.messages.filter(m => 
        (m.fromId === userId && m.toId === otherId) || 
        (m.fromId === otherId && m.toId === userId)
    ).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json(history);
});

// PEER RATINGS
app.post('/api/ratings/submit', (req, res) => {
    const { fromId, toId, trust, skill, vibe } = req.body;
    
    db.ratings.push({ fromId, toId, trust, skill, vibe, timestamp: new Date().toISOString() });
    
    UserStore.findOne({ _id: toId }, (err, targetUser) => {
        if (targetUser) {
            const avgRating = (trust + skill + vibe) / 3; // 0-100
            const oldConnect = targetUser.publicStats.connect;
            const newConnect = (oldConnect + avgRating) / 2; // Moving average
            
            UserStore.update(
                { _id: toId },
                { $set: { "publicStats.connect": newConnect } },
                {},
                () => {}
            );
        }
    });

    res.json({ success: true, message: "Rating submitted privately." });
});

// THE GRIND (Increment Inputs)
app.post('/api/tasks/grind', (req, res) => {
    const { userId, taskId } = req.body;
    
    UserStore.findOne({ _id: userId }, (err, user) => {
        if (!user) return res.status(404).json({ error: "User not found" });

        const tasks = user.tasks || [];
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) return res.status(404).json({ error: "Task not found" });

        // Update Task State
        task.grindCount = (task.grindCount || 0) + 1;

        // Update Global Stats (WOLF MATH)
        const role = task.assignedTo || 'labor'; // Default to labor if unassigned
        const roleStats = user.roleHistory[role];
        roleStats.grind += 1;
        
        // Recalculate Efficiency: (Kill / Grind) * 100.
        const kills = roleStats.kill || 0;
        const grinds = roleStats.grind || 1;
        roleStats.efficiency = Math.round((kills / grinds) * 100);
        
        // Small bump to Public Rating just for grinding (effort), capped at 50
        const mapping = { labor: 'build', finance: 'fund', sales: 'connect' };
        if (user.publicStats[mapping[role]] < 50) {
             user.publicStats[mapping[role]] += 0.5; 
        }

        UserStore.update(
            { _id: userId },
            { $set: { tasks: tasks, roleHistory: user.roleHistory, publicStats: user.publicStats } },
            {},
            () => {
                UserStore.findOne({ _id: userId }, (e, u) => res.json(u));
            }
        );
    });
});

// THE KILL (Complete Task & Calculate Score)
app.post('/api/tasks/update', (req, res) => {
    const { userId, taskId, status, assignedTo, method, actualCost, deadline, budget } = req.body;
    
    UserStore.findOne({ _id: userId }, (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });
        
        const tasks = user.tasks || [];
        const task = tasks.find(t => t.id === taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        const oldStatus = task.status;
        
        // Update Basic Fields
        if (status) task.status = status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;
        if (method !== undefined) task.method = method;
        if (actualCost !== undefined) task.actualCost = actualCost;
        if (deadline !== undefined) task.deadline = deadline;
        if (budget !== undefined) task.budget = budget;

        let ivpChange = 0;

        // --- WOLF MATH LOGIC ---
        if (status === 'done' && oldStatus !== 'done') {
            const role = task.assignedTo || 'labor';
            const roleStats = user.roleHistory[role];
            
            // 1. Update The Kill
            roleStats.kill += 1;
            
            // 2. Base IVP Score
            ivpChange += 100; // Base completion

            // 3. Deadline Bonus
            if (task.deadline) {
                const deadlineTime = new Date(task.deadline).getTime();
                const nowTime = new Date().getTime();
                if (nowTime < deadlineTime) {
                    ivpChange += 20; // On time/Early bonus
                } else {
                    ivpChange -= 10; // Late penalty
                }
            }

            // 4. Budget Bonus
            if (task.budget && actualCost) {
                if (actualCost <= task.budget) {
                    ivpChange += 30; // Under budget
                } else {
                    ivpChange -= 20; // Over budget
                }
            }

            // 5. Update Efficiency
            const kills = roleStats.kill;
            const grinds = Math.max(1, roleStats.grind);
            roleStats.efficiency = Math.round((kills / grinds) * 100);
            
            // 6. Update Public Stats (Performance Score)
            const mapping = { labor: 'build', finance: 'fund', sales: 'connect' };
            const statKey = mapping[role];
            const experienceBonus = Math.min(20, kills * 2); 
            user.publicStats[statKey] = Math.min(100, roleStats.efficiency + experienceBonus);
        }
        
        // Revert if moving back to todo (Undo Kill)
        if (status !== 'done' && oldStatus === 'done') {
            ivpChange = -100; 
            const role = task.assignedTo || 'labor';
            const roleStats = user.roleHistory[role];
            roleStats.kill = Math.max(0, roleStats.kill - 1);
            roleStats.efficiency = Math.round((roleStats.kill / Math.max(1, roleStats.grind)) * 100);
        }

        const newIvp = (user.ivp || 0) + ivpChange;

        UserStore.update(
            { _id: userId },
            { $set: { 
                tasks: tasks, 
                ivp: newIvp, 
                roleHistory: user.roleHistory, 
                publicStats: user.publicStats,
                updatedAt: new Date() 
            }},
            {},
            () => UserStore.findOne({ _id: userId }, (e, u) => res.json(u))
        );
    });
});

app.post('/api/wolfpack/add', (req, res) => {
    const { userId, friend } = req.body;
    UserStore.findOne({ _id: userId }, (err, user) => {
        if (!user) return res.status(404).json({ error: "User not found" });
        const currentPack = user.wolfpack || [];
        if (currentPack.length >= 12) return res.status(400).json({ error: "Pack full" });
        if (currentPack.some(p => p.id === friend.id)) return res.json(user);
        
        UserStore.update(
            { _id: userId },
            { $set: { wolfpack: [...currentPack, friend] } },
            {},
            () => UserStore.findOne({ _id: userId }, (e, u) => res.json(u))
        );
    });
});

app.post('/api/calendar/schedule', (req, res) => {
    const { userId, event } = req.body;
    UserStore.findOne({ _id: userId }, (err, user) => {
        if (!user) return res.status(404).json({ error: "User not found" });
        
        const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
        UserStore.update(
            { _id: userId },
            { $push: { events: newEvent } },
            {},
            () => UserStore.findOne({ _id: userId }, (e, u) => res.json(u))
        );
    });
});

app.post('/api/user/settings', (req, res) => {
    const { userId, pace, homebase } = req.body;
    const updates = {};
    if (pace) updates.pace = pace;
    if (homebase) updates.homebase = homebase;
    UserStore.update({ _id: userId }, { $set: updates }, {}, () => res.json({ success: true }));
});

app.post('/api/user/update', (req, res) => {
    const { userId, email, password, selfStats, onboardingStep, alphaPitch } = req.body;
    UserStore.findOne({ _id: userId }, (err, user) => {
        if (!user) return res.status(404).json({ error: "User not found" });
        const updates = { updatedAt: new Date() };
        if (email) updates.email = email;
        if (password) updates.password = password; 
        if (selfStats) updates.selfStats = selfStats;
        if (alphaPitch) updates.alphaPitch = alphaPitch;
        if (onboardingStep !== undefined) updates.onboardingStep = onboardingStep;
        UserStore.update({ _id: userId }, { $set: updates }, {}, () => UserStore.findOne({ _id: userId }, (e, u) => res.json(u)));
    });
});

app.post('/api/auth/login', (req, res) => {
    UserStore.findOne({ email: req.body.email }, (err, user) => {
        if (user) res.json({ user: user, token: "mock-" + user._id });
        else res.status(404).json({ error: "Wolf not found." });
    });
});

app.post('/api/auth/register', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    UserStore.findOne({ email: email }, (err, existingUser) => {
        if (existingUser) return res.status(409).json({ error: "Account exists." });

        const newUser = { 
            ...req.body, 
            createdAt: new Date(), 
            selected_card_id: null,
            selected_product_id: null,
            ivp: 0,
            tasks: [],
            wolfpack: [DOM_PROFILE], 
            events: [],
            pace: 'walk',
            homebase: 'The Daily Grind',
            onboardingStep: 0,
            // Detailed Stats Structure
            selfStats: { build: 50, fund: 50, connect: 50 },
            publicStats: { build: 0, fund: 0, connect: 0 },
            roleHistory: {
                labor: { grind: 0, kill: 0, efficiency: 0, rating: 0 },
                finance: { grind: 0, kill: 0, efficiency: 0, rating: 0 },
                sales: { grind: 0, kill: 0, efficiency: 0, rating: 0 },
            }
        };
        
        UserStore.insert(newUser, (insertErr, doc) => {
            if (insertErr) return res.status(500).json({ error: "Failed to create account" });
            res.json({ user: doc, token: "mock-" + doc._id });
        });
    });
});

server.listen(PORT, '0.0.0.0', () => console.log(`🐺 Wolfpack Server running on port ${PORT}`));
