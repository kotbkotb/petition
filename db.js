const spicedPg = require("spiced-pg");
require("dotenv").config();
const { DATABASE_URL } = process.env;

const db = spicedPg(`${DATABASE_URL}`);
const bcrypt = require("bcryptjs");

// Hashing the password
function hash(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

// login function
function loginEmail(email) {
    return db.query(`SELECT id, email, password FROM users WHERE email= $1;`, [
        email,
    ]);
}

//authorizing the password
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

// registtration function
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

// Inserting signature
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

// creating a profile with exta info
function createProfile(age, city, url, user_id) {
    console.log("hello from db", age, city, url, user_id);
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

// joining profile and users table
function getSigner() {
    return db
        .query(
            `SELECT users.first_name, users.last_name, profile.city, profile.url, profile.age
        FROM users
        JOIN profile
        ON users.id = profile.user_id`
        )
        .then((result) => {
            return result.rows;
        });
}

// get user by a city
function getCity(city) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, profile.city, profile.url, profile.age
        FROM users
        JOIN profile
        ON users.id = profile.user_id
        WHERE profile.city = $1`,
            [city]
        )
        .then((result) => {
            return result.rows;
        });
}

// getting all user input
function getAllInfo(user_Id) {
    return db
        .query(
            `SELECT users.id, first_name, last_name, email, password, age, city, url FROM users LEFT JOIN profile ON users.id = profile.user_id WHERE users.id = $1;`,
            [user_Id]
        )
        .then((result) => {
            return result.rows;
        });
}
function updateUserinfoWithPW(first_name, last_name, email, password, id) {
    return hash(password).then((hashedpassword) => {
        return db
            .query(
                `UPDATE users
                            SET first_name=$1, last_name=$2, email=$3, password=$4
                            WHERE id=$5`,
                [first_name, last_name, email, hashedpassword, id]
            )
            .then((result) => {
                console.log("updateUserinfoWithPW", result);
                return result.rows;
            });
    });
}

function updateUserinfoWithoutPW(first_name, last_name, email, id) {
    return db
        .query(
            `UPDATE users
                    SET first_name=$1, last_name=$2, email=$3
                    WHERE id=$4`,
            [first_name, last_name, email, id]
        )
        .then((result) => {
            console.log("updateUserWithoutPW", result);
            return result.rows;
        });
}

function updateUserProfileInfo(age, city, url, user_id) {
    console.log("hello from db", age, city, url, user_id);
    return db
        .query(
            `INSERT INTO profile ( age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3, user_id = $4;
    RETURNING *`,
            [age, city, url, user_id]
        )
        .then((result) => {
            console.log("updateProfile", result);

            return result.rows;
        });
}

function deleteSignature(user_Id) {
    return db.query(
        `DELETE FROM signatures WHERE user_id = $1;
        RETURNING *`[user_Id]
    );
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
    updateUserinfoWithPW,
    updateUserinfoWithoutPW,
    updateUserProfileInfo,
    deleteSignature,
};
