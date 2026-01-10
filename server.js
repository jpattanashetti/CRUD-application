const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./database/db');

const app = express();
//const PORT = 5000;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));

// File upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// CREATE
app.post('/add-user', upload.single('photo'), (req, res) => {
    const { name, dob, email, mobile } = req.body;
    const photo = req.file ? req.file.filename : null;

    if(!name || !dob || !email || !mobile) {
        return res.status(400).send("All fields are required");
    }

    const sql = "INSERT INTO users (name, dob, email, mobile, photo) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [name, dob, email, mobile, photo], function(err) {
        if(err) {
            return res.status(400).send(err.message);
        }
        res.redirect('/');
    });
});

// READ
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.all(sql, [], (err, rows) => {
        if(err) return res.status(400).send(err.message);
        res.json(rows);
    });
});

// UPDATE
app.post('/update-user/:id', upload.single('photo'), (req, res) => {
    const { name, dob, email, mobile } = req.body;
    const photo = req.file ? req.file.filename : null;
    const { id } = req.params;

    let sql = "UPDATE users SET name=?, dob=?, email=?, mobile=?";
    const params = [name, dob, email, mobile];

    if(photo) {
        sql += ", photo=?";
        params.push(photo);
    }
    sql += " WHERE id=?";
    params.push(id);

    db.run(sql, params, function(err) {
        if(err) return res.status(400).send(err.message);
        res.redirect('/');
    });
});

// DELETE
app.get('/delete-user/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id=?";
    db.run(sql, [id], function(err) {
        if(err) return res.status(400).send(err.message);
        res.redirect('/');
    });
});

//app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

