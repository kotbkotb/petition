const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

const { createSigns, getSignatures, getSignaturesByName } = require("./db");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.render("petition");
});

app.post("/", (req, res) => {
    const body = req.body;
    console.log(body);
    const { first, last } = body;

    createSigns({
        first: first,
        last: last,
        signature: "signature",
    }).then((result) => {
        console.log();
        res.render("thanks");
    });
});

app.get("/signers", (req, res) => {
    getSignatures().then((result) => {
        console.log("we have got it", result);
        // let listOfNames = [];
        res.render("signers", { result });
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
