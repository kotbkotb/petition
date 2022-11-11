const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;
const handlebars = require("express-handlebars");
const cookieSession = require("cookie-session");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.use(
    cookieSession({
        secret: "Shh, its a secret!",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

const { createSigns, registerUser, loginEmail, auth } = require("./db");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded());

app.get("/", (req, res) => {
    if (req.session.userid) {
        res.redirect("/petition");
    } else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    if (req.session.userid) {
        res.redirect("/petition");
    } else {
        res.render("login");
    }
});

app.post("/login", (req, res) => {
    const body = req.body;
    console.log("here is the body", body);
    const { email, password } = body;

    loginEmail(email).then((result) => {
        console.log("result in login post", result);
        auth(email, password).then((succes) => {
            if (succes === true) {
                req.session.userid = result.rows[0].id;
                res.redirect("petition");
            } else {
                res.redirect("login");
            }
        });
    });
});

app.get("/register", (req, res) => {
    if (req.session.userid) {
        res.redirect("/petition");
    } else {
        res.render("register");
    }
});
app.post("/register", (req, res) => {
    const body = req.body;
    console.log(body);
    const { first, last, email, password } = body;

    registerUser(first, last, email, password).then((result) => {
        console.log("userid", result[0].id);
        req.session.userid = result[0].id;
        res.redirect("/petition");
    });
});

app.get("/petition", (req, res) => {
    res.render("petition");
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
