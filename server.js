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

const {
    createSigns,
    registerUser,
    loginEmail,
    auth,
    createProfile,
    getSigner,
    getCity,
    getSignatures,
    getAllInfo,
    updateUserinfoWithPW,
    updateUserinfoWithoutPW,
    updateUserProfileInfo,
    deleteSignature,
} = require("./db");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded());

// main route dedicated for cookies
app.get("/", (req, res) => {
    if (req.session.userid) {
        res.redirect("/petition");
    } else {
        res.redirect("/login");
    }
});

// Login page
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
                res.redirect("/petition");
            } else {
                res.redirect("/login");
            }
        });
    });
});

// register page
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
        res.redirect("/profile");
    });
});

// I want ro add a log out function
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("/petition", (req, res) => {
    res.render("petition");
});

app.post("/petition", (req, res) => {
    const body = req.body;
    const { signature } = req.body;
    let user_id = req.session.userid;
    console.log(user_id);
    console.log(signature);
    getSignatures({ signature, userid: user_id }).then((result) => {
        console.log("userid", result.id);

        return res.redirect("/thanks");
    });
});

// profile page
app.get("/profile", (req, res) => {
    res.render("profile");
});

app.post("/profile", (req, res) => {
    const body = req.body;
    let user_id = req.session.userid;
    console.log("what the body contains", req.body, user_id);
    const { age, city, url } = body;
    createProfile(age, city, url, user_id).then((data) => {
        console.log("the city data", data);

        res.redirect("/petition");
    });
});

app.get("/thanks", (req, res) => {
    res.render("thanks");
});

app.get("/signers", (req, res) => {
    getSigner().then((result) => {
        console.log("signer'S result", result);
        res.render("signers", { result });
    });
});

app.get("/signers/:City", (req, res) => {
    let city = req.params.City;
    console.log("deh el params ya prince", req.params);
    if (!req.session.userid) {
        res.redirect("/login");
    } else {
        getCity(city).then((result) => {
            return res.render("City", { result });
        });
    }
});

app.get("/edit", (req, res) => {
    if (!req.session.userid) {
        res.redirect("/login");
    } else {
        let user_id = req.session.userid;
        getAllInfo(user_id).then((result) => {
            console.log("getallinfo", result);
            res.render("edit", {
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                email: result[0].email,
                age: result[0].age,
                city: result[0].city,
                url: result[0].url,
            });
        });
    }
});

app.get("/deleteSignature", (req, res) => {
    let user_id = req.session.userid;
    deleteSignature(user_id).then(() => {
        req.session.signatureId = null;
        res.redirect("/petition");
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
