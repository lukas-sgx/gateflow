const express = require('express');
const app = express();
const port = 58925;

app.use(express.json());

app.post('/', (req, res) => {
    console.log(req.body)
    res.send("Receive request");
});

app.listen(port, async () => {
    console.log(`Dispatch app listening on port ${port}`);
});