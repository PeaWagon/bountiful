const express = require("express");
const hostname = "127.0.0.1";
const port = 3000;
const app = express()

app.get("/", (req, res) => {
    res.send("hello world!")
})

app.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`);
});
