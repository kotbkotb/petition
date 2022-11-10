const spicedPg = require("spiced-pg");
const user = "omar";
const database = "petition";
const password = "omaromar";
const db = spicedPg(`postgres:${user}:${password}@localhost:5432/${database}`);

function getSignatures() {
    return db.query("SELECT * FROM signatures").then((result) => {
        return result.rows;
        //console.log("db result", result));
    });
}

function getSignaturesByName(first) {
    return db
        .query("SELECT * FROM signatures WHERE first = $1", [first])
        .then((result) => result.rows[0]);
}

function createSigns({ first, last, signature }) {
    return db
        .query(
            `INSERT INTO signatures (first, last, signature)
    VALUES ($1, $2, $3)
    RETURNING *`,
            [first, last, signature]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    createSigns,
    getSignatures,
    getSignaturesByName,
};
