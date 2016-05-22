var pg = require('pg');

// define database URI
var connectionString = 'postgres://postgres:rad3eDru9a@localhost:5432/postgres';

// define client
var client = new pg.Client(connectionString);
client.connect();

// queries
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');

// close connection
query.on('end', function () {
    client.end();
});