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

function createProfile(age, city, url, user_id) {
    return db
        .query(
            `INSERT INTO profile ( age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [age, city, url, user_id]
        )
        .then((result) => result.rows[0]);
}

function getSignatures({ signature, userid }) {
    console.log("howa dah", userid);
    return db
        .query(
            `INSERT INTO signatures (
                signature, user_id)
    VALUES ($1, $2)
    RETURNING *`,
            [signature, userid]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function getSigner() {
    return db
        .query(
            `SELECT users.first_name, users.last_name, profile.city, profile.url, profile.age
        FROM users
        JOIN profile
        ON users.id = profile.user_id`
        )
        .then((result) => console.log("here we got the signers", result.rows));
}

function getCity(city) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, profile.city, profile.url, profile.age
        FROM users
        JOIN rofile
        ON users.id = profile.user_id
        WHERE profile.city = $1`,
            [city]
        )
        .then((result) => console.log(result.rows));
}

function getAllInfo(user_Id) {
    return db
        .query(
            `SELECT users.id, first_name, last_name, email, password, age, city, homepage FROM users LEFT JOIN profiles ON users.id = profiles.user_id WHERE users.id = $1;`,
            [user_Id]
        )
        .then((result) => {
            return result.rows;
        });
}

module.exports = {
    getSignatures,
    createSigns,
    registerUser,
    auth,
    hash,
    loginEmail,
    createProfile,
    getSigner,
    getCity,
    getAllInfo,
};
