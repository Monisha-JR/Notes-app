const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// 🔗 MongoDB Connection
mongoose.connect('mongodb+srv://admin:admin123@cluster0.ijo4c9j.mongodb.net/notesDB?retryWrites=true&w=majority')
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// 📦 Schema & Model
const noteSchema = new mongoose.Schema({
    text: String,
    time: String
});

const Note = mongoose.model('Note', noteSchema);

// ✅ CREATE (Add note)
app.post('/notes', async (req, res) => {
    try {
        const note = new Note({
            text: req.body.text,
            time: new Date().toLocaleString()
        });

        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ✅ READ (Get all notes)
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ✅ UPDATE (Edit note)
app.put('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, {
            text: req.body.text,
            time: new Date().toLocaleString()
        });

        res.send("Updated");
    } catch (err) {
        res.status(500).send(err);
    }
});

// ✅ DELETE (Delete note)
app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.send("Deleted");
    } catch (err) {
        res.status(500).send(err);
    }
});

// 🚀 Server Start
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});