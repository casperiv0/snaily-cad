const mysql = require('mysql');
let connection;
let connection1;
let connection2;
let creds = require("../creds.json")

let db = {
    host: "localhost",
    user: "root",
    password: creds.DBP,
    database: creds.DB,
    multipleStatements: true,
    timeout: 0
};

let db2 = {
    host: "localhost",
    user: "root",
    password: creds.DBP,
    database: creds.DB2,
    multipleStatements: true,
    timeout: 0
}

let db3 = {
    host: "localhost",
    user: "root",
    password: creds.DBP,
    database: creds.DB3,
    multipleStatements: true,
    timeout: 0
}


function handleDisconnect() {
    connection = mysql.createConnection(db); // Recreate the connection, since
    connection1 = mysql.createConnection(db2); // Recreate the connection, since
    connection2 = mysql.createConnection(db3); // Recreate the connection, since
    // the old one cannot be reused.
    global.connection = connection
    global.connection1 = connection1
    global.connection2 = connection2

    connection.connect(function (err) { // The server is either down
        connection.timeout = 0;
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db1:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error - 1', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });

    connection.on('error', function (err) {
        console.log('db error - 1', err);
        if (err.code === 'ECONNRESET') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });

    connection1.connect(function (err) { // The server is either down
        connection1.timeout = 0;
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db2:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    connection1.on('error - 2', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
    connection2.connect(function (err) { // The server is either down
        connection2.timeout = 0;
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db2:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    connection2.on('error - 2', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}



module.exports = handleDisconnect