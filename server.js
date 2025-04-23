
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('members.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    upline TEXT
)`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', (req, res) => {
    const { name, upline } = req.body;
    db.run('INSERT INTO members (name, upline) VALUES (?, ?)', [name, upline], () => {
        res.send('<p>Registration successful! <a href="/">Go back</a></p>');
    });
});

app.get('/check', (req, res) => {
    const upline = req.query.upline;
    db.all('SELECT * FROM members WHERE upline = ?', [upline], (err, rows) => {
        if (err) {
            return res.send('Error checking downlines.');
        }
        let names = rows.map(row => `<li>${row.name}</li>`).join('');
        res.send(`<h2>${upline}'s Downlines (${rows.length})</h2><ul>${names}</ul><a href="/">Go back</a>`);
    });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
