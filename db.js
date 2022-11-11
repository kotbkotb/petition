const spicedPg = require("spiced-pg");
const user = "omar";
const database = "petition";
const password = "omaromar";
const db = spicedPg(`postgres:${user}:${password}@localhost:5432/${database}`);
const bcrypt = require("bcryptjs");

function hash(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

function loginEmail(email) {
    return db.query(`SELECT id, email, password FROM users WHERE email= $1;`, [
        email,
    ]);
}

function auth(email, password) {
    return loginEmail(email).then((result) => {
        console.log("here is the auth-password", result.rows[0].password);
        return bcrypt
            .compare(password, result.rows[0].password)

            .then((success) => {
                return success;
            });
    });
}

function registerUser(first, last, email, password) {
    console.log(first);
    return hash(password).then((hashedpassword) => {
        return db
            .query(
                `INSERT INTO users (
                 first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
                [first, last, email, hashedpassword]
            )

            .then((result) => result.rows);
    });
}

function createSigns({ signature, user_id }) {
    return db
        .query(
            `INSERT INTO signatures ( signature, user_id)
    VALUES ($1, $2,)
    RETURNING *`,
            [signature, user_id]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    createSigns,
    registerUser,
    auth,
    hash,
    loginEmail,
};
