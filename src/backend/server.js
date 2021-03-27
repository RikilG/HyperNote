const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get("/test", (req, res) => {
    res.send("TEST RESPONSE");
});

app.get("/auth/dropbox", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    console.log(req.originalUrl);
    console.log(req.params);
    console.log(req.statusCode);
    console.log(req.statusMessage);
    res.redirect("http://localhost:3000/");
});
