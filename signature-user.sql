DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    signature text NOT NULL,
    user_id INT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    age VARCHAR(255) NOT NULL, 
    city VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL UNIQUE
);
