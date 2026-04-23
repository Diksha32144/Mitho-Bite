import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send("Mitho Bite Backend is working with npm!");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});