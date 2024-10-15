const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 1900;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Route untuk view CV page
app.get("/view-cv", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view-cv.html'));
});

// Konfigurasi transporter untuk nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rachrisgamer@gmail.com', // Ganti dengan email Anda
        pass: 'uuih xrkr fifg smeo' // Ganti dengan app password Anda
    }
});

// Endpoint untuk mengirim email
app.post("/send-email", (req, res) => {
    const { name, email, message } = req.body;
    const timestamp = new Date().toISOString();

    const mailOptions = {
        from: email,
        to: 'rachrisgamer@gmail.com', // Ganti dengan email penerima
        subject: `New message from ${name}`,
        text: message,
    };

    // Simpan data pesan ke db.json
    const messageData = { name, email, message, timestamp };
    const dbPath = path.join(__dirname, 'db.json');

    fs.readFile(dbPath, (err, data) => {
        let db = { messages: [] }; // Default jika file kosong

        if (!err) {
            try {
                db = JSON.parse(data); // Parse data jika file ada
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
            }
        }

        db.messages.push(messageData);

        fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving to database' });
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email' });
                }
                res.status(200).json({ message: 'Email sent successfully!' });
            });
        });
    });
});

// Endpoint untuk menghasilkan kunci unik dan menyimpannya ke keys.json
app.get('/generate-key', (req, res) => {
    const newKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    const keysPath = path.join(__dirname, 'keys.json');

    fs.readFile(keysPath, (err, data) => {
        let keys = [];

        if (!err) {
            try {
                keys = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
            }
        }

        keys.push({ key: newKey, used: false });

        fs.writeFile(keysPath, JSON.stringify(keys, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving key to database' });
            }

            res.status(200).json({ key: newKey });
        });
    });
});

// Endpoint untuk memvalidasi kunci sebelum mengunduh CV
app.post('/validate-key', (req, res) => {
    const { key } = req.body;
    const keysPath = path.join(__dirname, 'keys.json');

    fs.readFile(keysPath, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database' });
        }

        let keys;
        try {
            keys = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ message: 'Error parsing database' });
        }

        const keyEntry = keys.find(k => k.key === key && !k.used);

        if (keyEntry) {
            // Tandai kunci sebagai digunakan
            keyEntry.used = true;

            fs.writeFile(keysPath, JSON.stringify(keys, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating database' });
                }
                res.status(200).json({ message: 'Key is valid' });
            });
        } else {
            res.status(400).json({ message: 'Invalid or already used key' });
        }
    });
});

// Endpoint untuk mengunduh CV
app.get('/download-cv', (req, res) => {
    const file = path.join(__dirname, 'public', 'cv.pdf');
    res.download(file, 'My_CV.pdf', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

// Memulai server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
