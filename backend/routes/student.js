const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');

let lastId=0;


router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        if (students.length > 0) {
            lastId = Math.max(...students.map(student => student.id)) 
        }
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});


router.post('/', async (req, res) => {
    lastId++; 
    const newStudent = new Student({
        id: lastId, // Set ID to lastId
        ...req.body 
    });

    try {
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(400).json({ message: 'Error adding student' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedStudent = await Student.findOneAndUpdate({ id: parseInt(id) }, req.body, { new: true });
    if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ id: parseInt(id) });
    if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }
    res.status(204).send();
});

module.exports = router;