
const express = require("express");
const winston = require("winston");
const fs = require("fs");

const app = express();
app.use(express.json());

// Create logs folder automatically
if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

// Winston logger configuration
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: "logs/app.log"
        })
    ]
});

// Log every API request
app.use((req, res, next) => {
    res.on("finish", () => {
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
});

let students = [
    { id: 1, name: "Roji" },
    { id: 2, name: "Raj" }
];

// GET - Get all students
app.get("/students", (req, res) => {
    res.json(students);
});

// GET - Get student by ID
app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    res.json(student || { message: "Student not found" });
});

// POST - Add a student
app.post("/students", (req, res) => {
    const student = {
        id: req.body.id,
        name: req.body.name
    };

    students.push(student);
    res.json(student);
});

// PUT - Replace student details
app.put("/students/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) return res.status(404).json({ message: "Not found" });

    student.name = req.body.name;
    res.json(student);
});

// PATCH - Update student name
app.patch("/students/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) return res.status(404).json({ message: "Not found" });

    if (req.body.name !== undefined) {
        student.name = req.body.name;
    }

    res.json(student);
});

// DELETE - Delete a student
app.delete("/students/:id", (req, res) => {
    students = students.filter(s => s.id != req.params.id);
    res.json({ message: "Student deleted" });
});

app.listen(3000, () => {
    logger.info("Server is running at http://localhost:3000 for roll number 23071A05B7");
    console.log("Server running on port 3000");
});
