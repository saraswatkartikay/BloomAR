const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (error) {
    console.error('Could not read db.json:', error);
    return { filters: [], comments: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// API
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'BloomAR API', time: new Date().toISOString() });
});

app.get('/api/filters', (_req, res) => {
  res.json(readDB().filters || []);
});

app.get('/api/comments', (_req, res) => {
  const comments = (readDB().comments || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  res.json(comments);
});

app.post('/api/comments', (req, res) => {
  const name = String(req.body?.name || '').trim();
  const text = String(req.body?.text || '').trim();

  if (!name || !text) {
    return res.status(400).json({ error: 'name and text are required' });
  }
  if (name.length > 24 || text.length > 240) {
    return res.status(400).json({ error: 'name or comment is too long' });
  }

  const db = readDB();
  const comment = {
    id: makeId(),
    name,
    text,
    likes: 0,
    createdAt: new Date().toISOString()
  };
  db.comments = db.comments || [];
  db.comments.push(comment);
  writeDB(db);
  res.status(201).json(comment);
});

app.post('/api/comments/:id/like', (req, res) => {
  const db = readDB();
  const comment = (db.comments || []).find(c => c.id === req.params.id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  comment.likes = Number(comment.likes || 0) + 1;
  writeDB(db);
  res.json(comment);
});

app.get('/api/stats', (_req, res) => {
  const db = readDB();
  const comments = db.comments || [];
  res.json({
    totalComments: comments.length,
    totalLikes: comments.reduce((sum, c) => sum + Number(c.likes || 0), 0),
    totalFilters: (db.filters || []).length,
    activeFilters: (db.filters || []).filter(f => f.status === 'active').length
  });
});

// Frontend/static files
app.use(express.static(__dirname));

app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(PORT, () => {
  console.log(`BloomAR running at http://localhost:${PORT}`);
});
