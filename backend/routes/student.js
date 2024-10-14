const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');

let lastId = 0; // Initialize lastId to 0

// Fetch all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        if (students.length > 0) {
            lastId = Math.max(...students.map(student => student.id)); // Update lastId to the highest existing ID
        }
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Add a new student
router.post('/', async (req, res) => {
    lastId++; // Increment the lastId
    const newStudent = new Student({
        id: lastId, // Set the ID to lastId
        ...req.body // Spread the rest of the request body
    });

    try {
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(400).json({ message: 'Error adding student' });
    }
});

// Update a student by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedStudent = await Student.findOneAndUpdate({ id: parseInt(id) }, req.body, { new: true });
    if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
});

// Delete a student by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ id: parseInt(id) });
    if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }
    res.status(204).send();
});

module.exports = router;
