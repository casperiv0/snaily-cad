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

// Global Router
const globalRouter = require("./routes/global/global")

// Admin
const { adminPanel, actionLogPage } = require("./routes/admin");
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
const editCadRouter = require("./routes/editCADRouter");

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
const { citizenPage, citizenDetailPage, addCitizen, addCitizenPage, editCitizenPage, editCitizen, deleteCitizens } = require("./routes/citizens/citizen");

// Registration - Login
const { editAccountPage, editAccountPassword, deleteAccount } = require("./routes/login-reg");

// Admin Departments
const departmentsRouter = require("./routes/values/departments");

const {
    dispatchPage,
    disptachWeaponSearch,
    disptachAddressSearch,
    statusChangeDispatch,
    statusChangeDispatchEMS,
    editAOP,
    updateDispatchCall,
    cancelCall911Dis,
    dispatchUpdateOfficerStatus
} = require("./routes/dispatch")

// Index Router
const indexRouter = require("./routes/index")

// Tow Router
const towRouter = require("./routes/tow/tow");

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


// Keep this line here, otherwise the above pages will not work!
app.use(loginAuth);


app.get("/account/edit", editAccountPage);
app.post("/account/edit", editAccountPassword);
app.post("/delete-account", deleteAccount)

// Admin
app.get("/admin", adminPanel);

// Member Management
app.use("/admin/members", memberManagementRouter)

// Edit CAD Router
app.use("/admin/edit-cad", editCadRouter)

// Action log
app.get("/admin/action-log", actionLogPage)


// Citizens vehicle Stuff
app.use("/c/vehicle", citizenVehicleRouter);

// Citizens Weapon Stuff
app.use("/c/weapons", citizenWeaponRouter)

// Citizens Router
app.get("/citizen", citizenPage);
app.get("/citizens/:id-:full_name", citizenDetailPage);
app.get("/citizen/add", addCitizenPage);
app.post("/citizen/add", addCitizen);
app.get("/citizen/edit/:id-:full_name", editCitizenPage);
app.post("/citizen/edit/:id-:full_name", editCitizen);
app.get("/citizen/delete/:id-:full_name", deleteCitizens);

// Company Router
app.use("/company", companyRouter);

// Medical Records Router
app.use("/medical", medicalRecordRouter);

// Licenses Router
app.use("/licenses", licenseRouter);

// Tow Router
app.use("/tow", towRouter)


// Dispatch
app.get("/dispatch", dispatchPage);
app.post("/dispatch/search/weapon", disptachWeaponSearch);
app.post("/dispatch/search/address", disptachAddressSearch);
app.post("/dispatch/status", statusChangeDispatch);
app.post("/dispatch/status-ems", statusChangeDispatchEMS);
app.post("/dispatch/aop", editAOP);
app.post("/dispatch/update-call-:id", updateDispatchCall)
app.get("/dispatch/cancel-call-:id", cancelCall911Dis)
app.post("/dispatch/update-status-:id", dispatchUpdateOfficerStatus)
// app.get("/dispatch/susdmv/:id", suspendDriversLicense)


// Officers
app.use("/officers", officersRouter);

// Use for bolos, 911 calls..
app.use("/global", globalRouter);
// app.get("/myofficers", officersPage)
// app.get("/officers/dash", officersDash)
// app.get("/officers/penal-codes", penalCodesPage)
// app.get('/officers/add', addOfficerPage)
// app.post('/officers/add', addOfficer)
// app.post("/officers/dash/search/plate/:id-:first_name-:last_name/suspend", suspendLicensePlate)
// app.post("/myofficers/status", statusChange)
// app.get("/officers/dash/codes", codesPage)
// app.post("/officers/bolo", officerBolo)
// app.get("/officers/remove-bolo-:boloId", removeOfficerBolo)
// app.post("/officers/dash/search/name/:id-:full_name/suspend/dmv", suspendLicenseName)
// app.post("/officers/dash/search/name/:id-:full_name/suspend/pilot", suspendLicenseName)
// app.post("/officers/dash/search/name/:id-:full_name/suspend/fire", suspendLicenseName)
// app.post("/officers/dash/search/name/:id-:full_name/suspend/ccw", suspendLicenseName)
// app.post("/officers/dash/add-offence", officerOffencer)
// app.get("/officers/susdmv/:id", suspendDriversLicense)


// app.get("/officers/api/:name", officerAPI)
// app.get("/officers/api/plate/:plate", officerAPIPlate)
// app.get("/officers/api/weapon/:serial", officerAPIWeapon)
// app.post("/officers/quickwarrant", quickWarrant)
// app.get("/officers/cancel-call-:id", cancelCall911)
// app.post("/officers/dash/update-call-:id", update911call)

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


    if (`${package.version}` !== `${versionResult.latestVersion}`) {
        console.log(chalk.red("Your Version is out of date! Please Pull the latest version on the GitHub page: https://github.com/Dev-CasperTheGhost/snaily-cad Or Run: git pull origin master"))
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