const express = require('express');
const router = express.Router();
const db = require('../database/db');   // ✅ Correct path
const multer = require('multer');
const path = require('path');

// File upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CREATE
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const pool = await poolPromise;
        const { name, dob, email, mobile } = req.body;
        const photo = req.file ? req.file.filename : null;

        await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('DOB', sql.Date, dob)
            .input('Email', sql.NVarChar, email)
            .input('Mobile', sql.NVarChar, mobile)
            .input('Photo', sql.NVarChar, photo)
            .query('INSERT INTO Students (Name, DOB, Email, Mobile, Photo) VALUES (@Name, @DOB, @Email, @Mobile, @Photo)');

        res.send({ message: 'Student added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// READ
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Students');
        res.send(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// UPDATE
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id } = req.params;
        const { name, dob, email, mobile } = req.body;
        const photo = req.file ? req.file.filename : null;

        const query = photo
            ? 'UPDATE Students SET Name=@Name, DOB=@DOB, Email=@Email, Mobile=@Mobile, Photo=@Photo WHERE Id=@Id'
            : 'UPDATE Students SET Name=@Name, DOB=@DOB, Email=@Email, Mobile=@Mobile WHERE Id=@Id';

        await pool.request()
            .input('Id', sql.Int, id)
            .input('Name', sql.NVarChar, name)
            .input('DOB', sql.Date, dob)
            .input('Email', sql.NVarChar, email)
            .input('Mobile', sql.NVarChar, mobile)
            .input('Photo', sql.NVarChar, photo)
            .query(query);

        res.send({ message: 'Student updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id } = req.params;
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Students WHERE Id=@Id');

        res.send({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

module.exports = router;
