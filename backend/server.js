const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

// Middleware to verify Role
const authorize = (role) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send("Unauthorized");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (role && decoded.role !== role) return res.status(403).send("Forbidden");
    req.user = decoded;
    next();
};

// Create Task (ADMIN ONLY)
app.post('/tasks', authorize('ADMIN'), async (req, res) => {
    const { title, projectId, deadline, assignedTo } = req.body;
    const task = await prisma.task.create({
        data: { title, projectId, deadline: new Date(deadline), assignedTo }
    });
    res.json(task);
});

// Update Task Status (MEMBER & ADMIN)
app.patch('/tasks/:id', authorize(), async (req, res) => {
    const { status } = req.body;
    const task = await prisma.task.update({
        where: { id: req.params.id },
        data: { status }
    });
    res.json(task);
});

app.listen(process.env.PORT || 5000, () => console.log("Server running"));