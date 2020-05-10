const express = require("express");
const app = express();
const package = require('./package.json');
const chalk = require("chalk")
const fetch = require("node-fetch")
let eSession = require('easy-session');
let cookieParser = require('cookie-parser');
const expressUpload = require("express-fileupload")
let creds = require("./creds.json");
const cors = require("cors")
const favicon = require('express-favicon');
const session = require("express-session");
const mysql = require('mysql');
require("dotenv").config()



// Variables
let port = creds.ENV === "dev" ? 3001 : creds.ProductionPort;
let connection;
let db = {
    host: "localhost",
    user: creds.user,
    database: creds.database,
    password: creds.databasePassword,
    multipleStatements: true,
    timeout: 0
};

// Auth
const { loginAuth } = require("./auth/loginAuth");
const authRouter = require("./routes/authentication/auth");

// 911 & Tow Route 
const callRouter = require("./routes/global/911-tow")

// In game
const getCitizenRouter = require("./routes/global/get-citizen-ingame");

// Global Router
const globalRouter = require("./routes/global/global")

// Admin
const adminRouter = require("./routes/admin")

// Member Management
const memberManagementRouter = require("./routes/admin/memberManagement")

// Vehicles Router
const adminVehicleRouter = require("./routes/values/vehicles")

// Genders Router
const adminGendersRouter = require("./routes/values/genders")

// Weapons Router
const adminWeaponsRouter = require("./routes/values/weapons")

// Ethnicities Router
const ethnicityRouter = require("./routes/values/ethnicities");

// Legal Status Router
const adminLegalStatusesRouter = require("./routes/values/legal");

// Edit CAD Router
const editCadRouter = require("./routes/admin/editCADRouter");

// Officers
const officersRouter = require("./routes/officers/officers");

// EMS/FD
const emsFdRouter = require("./routes/ems-fd/ems-fd")

// Citizens Router

// Licenses 
const licenseRouter = require("./routes/citizens/licenses");

// Vehicle Router
const citizenVehicleRouter = require("./routes/citizens/vehicles");

// Weapon Router
const citizenWeaponRouter = require("./routes/citizens/weapons");

// Medical Record Router
const medicalRecordRouter = require("./routes/citizens/medicalRecord");

// Company Router
const companyRouter = require("./routes/citizens/company");

// Remaining Citizens Routes, will update these asap
const citizenRouter = require("./routes/citizens/citizen")

// Edit Account Router
const editAccountRouter = require("./routes/admin/editAccountRouter");

// Admin Departments
const departmentsRouter = require("./routes/values/departments");

// Dispatch Router
const dispatchRouter = require("./routes/dispatch");

// Index Router
const indexRouter = require("./routes/index");

// Tow Router
const towRouter = require("./routes/tow/tow");

const bleeterRouter = require("./routes/bleeter/bleeter");

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('views', __dirname + '/views');
app.set("view engine", "ejs")
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(cors());
app.use(favicon(__dirname + '/public/icons/icon.png'));
app.use(eSession.main(session));
app.use(expressUpload());


// Main Pages
app.use("/", indexRouter)

// Login & Registration
app.use("/auth", authRouter);

// 911 & Tow call
app.use("/call", callRouter)

app.use("/global", getCitizenRouter)

// Keep this line here, otherwise the above pages will not work!
app.use(loginAuth);


// Edit Account Router
app.use("/account", editAccountRouter);


// Member Management
app.use("/admin/members", memberManagementRouter)

// Edit CAD Router
app.use("/admin/edit-cad", editCadRouter)

// Admin
app.use("/admin", adminRouter);


// Citizens vehicle Stuff
app.use("/c/vehicle", citizenVehicleRouter);

// Citizens Weapon Stuff
app.use("/c/weapons", citizenWeaponRouter)

// Citizens Router
app.use("/citizen", citizenRouter)

// Company Router
app.use("/company", companyRouter);

// Bleeter Router
app.use("/bleeter", bleeterRouter);

// Medical Records Router
app.use("/medical", medicalRecordRouter);

// Licenses Router
app.use("/licenses", licenseRouter);

// Tow Router
app.use("/tow", towRouter)


// Dispatch
app.use("/dispatch", dispatchRouter);

// Officers
app.use("/officers", officersRouter);

// Use for bolos, 911 calls, Tow call, update dispatch&Police stuff..
app.use("/global", globalRouter);

// EMS/FD
app.use("/ems-fd", emsFdRouter)

// Admin Values
// Admin Values Vehicles
app.use("/admin/vehicles", adminVehicleRouter);


// Admin Values Genders 
app.use("/admin/genders", adminGendersRouter)

// Admin Values Ethnicities 
app.use("/admin/ethnicities", ethnicityRouter);


// Admin Values Weapons
app.use("/admin/weapons", adminWeaponsRouter)

// Departments
app.use("/admin/departments", departmentsRouter)

// Legal
app.use("/admin/legal", adminLegalStatusesRouter)


// 404
app.get('/*', (req, res) => {
    res.status(404).render("errors/404.ejs", {
        title: "404 | SnailyCAD",
        isAdmin: "",
        desc: "",
    });
});

app.post("/*", (req, res) => {
    res.status(404).render("errors/404.ejs", {
        title: "404 | SnailyCAD",
        isAdmin: "",
        desc: "",
    });
})

async function main() {
    console.log(chalk.blue("CHECKING CAD VERSION."));

    function handleDisconnect() {
        connection = mysql.createConnection(db); // Recreate the connection, since
        // the old one cannot be reused.
        global.connection = connection

        connection.connect(function (err) { // The server is either down
            connection.timeout = 0;
            if (err) { // or restarting (takes a while sometimes).
                console.log('error when connecting to db2:', err);
                setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
            } // to avoid a hot loop, and to allow our node script to
        }); // process asynchronous requests in the meantime.
        connection.on('error', function (err) {
            console.log('db error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                handleDisconnect(); // lost due to either server restart, or a
            } else { // connection idle timeout (the wait_timeout
                throw err; // server variable configures this)
            }
        });
        connection.on('error', function (err) {
            console.log('db error', err);
            if (err.code === 'ECONNRESET') { // Connection to the MySQL server is usually
                handleDisconnect(); // lost due to either server restart, or a
            } else { // connection idle timeout (the wait_timeout
                throw err; // server variable configures this)
            }
        });
    };
    handleDisconnect();
    app.listen(port, () => {
        console.log(`Running on ${port}`)
    });
    setInterval(function () {
        connection.query("SELECT 1", (err) => {
            if (err) {
                console.log(err);
            }
        })
    });
    const versionUrl = "https://dev-caspertheghost.github.io/api/version.html";

    const versionResult = await fetch(versionUrl).then(res => res.json());

    // This SQL Is for update 3.4.4, Creates arrest reports table
    connection.query(`ALTER TABLE \`bleets\` ADD \`file_dir\` TEXT NOT NULL AFTER \`uploaded_at\`;`, (err) => {
        if (err) {
            if (err.code === "ER_DUP_FIELDNAME") {
                return console.log("Database is up to date.");
            }
            console.log(err);
        } else {
            console.log("Updated the database successfully");

        }
    })

    if (`${package.version}` !== `${versionResult.latestVersion}`) {
        console.log(chalk.red(`Your Version is out of date!\n
Your Version: ${package.version}\n
Updated Version: ${versionResult.latestVersion}\n
Please Pull the latest version on the GitHub page: https://github.com/Dev-CasperTheGhost/snaily-cad Or Run: git pull origin master`))
    } else {
        console.log(chalk.green("You are all up to date."));
    }



    // Checks every 12 hours while running
    setInterval(() => {
        if (`${package.version}` !== `${versionResult.latestVersion}`) {
            console.log(chalk.red("Your Version is out of date! Please Pull the latest version on the GitHub page: https://github.com/Dev-CasperTheGhost/snaily-cad Or Run: git pull origin master"))
        } else {
            console.log(chalk.green("You are all up to date."));
        }
    }, 43200000)

}


main();