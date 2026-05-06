const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// CREATE TASK (Admin Only)
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
    const { title, projectId, assignedTo, deadline } = req.body;
    const task = await prisma.task.create({
        data: { title, projectId, assignedTo, deadline: new Date(deadline) }
    });
    res.status(201).json(task);
});

// UPDATE STATUS (Members & Admin)
router.patch('/:id', authenticate, async (req, res) => {
    const { status } = req.body;
    const task = await prisma.task.update({
        where: { id: req.params.id },
        data: { status }
    });
    res.json(task);
});