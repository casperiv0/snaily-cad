const express = require("express")
const app = express()

let eSession = require('easy-session');
let cookieParser = require('cookie-parser');
const Discord = require("discord.js")
const bot = new Discord.Client()
require('dotenv').config()
const favicon = require('express-favicon');
const fetch = require("node-fetch")
const session = require("express-session");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// Variables
let connection;
let connection1;
let connection2;
let db;
let db2;
let db3;
let port = process.env.ENV === "dev" ? 3001 : 80;

// Admin
const {
    adminPanel,
    usersPage,
    adminEditCitizen,
    adminEditCitizenPage
} = require("./routes/admin")

// Vehicles
const {
    addCarPage,
    carValuePage,
    editVehiclePage,
    editVehicle,
    deleteVehiclePage,
    addCar,
    regVehicle,
    regVehiclePage
} = require("./routes/values/cars")

// Genders
const {
    genderPage,
    deleteGender,
    addGenderPage,
    addGender,
    editGender,
    editGenderPage
} = require("./routes/values/genders")

// Weapons
const {
    weaponsPage,
    deleteWeapon,
    addWeaponPage,
    addWeapon,
    editWeapon,
    editWeaponPage,
    regWeapon,
    regWeaponPage
} = require("./routes/values/weapons")

// Ethnicities
const {
    ethnicitiesPage,
    addethnicityPage,
    addethnicity,
    editEthnicityPage,
    editethnicity,
    deleteEthnicity
} = require("./routes/values/ethnicities")

// Officers
const {
    officersPage,
    tabletPage,
    penalCodesPage,
    officersDash,
    searchNamePage,
    searchPlatePage,
    plateResultsPage,
    nameResultsPage,
    officerApplyPage,
    addOffencePage,
    addOffence,
    officerApply,
    addWarrant,
    addWarrantPage,
    addOfficer,
    addOfficerPage,
    suspendLicensePlate,
    suspendLicenseName,
    statusChange,
    codesPage
} = require("./routes/officers/officer");

const {
    emsPage,
} = require('./routes/ems-fd/ems-fd')

// Citizens
const {
    citizenPage,
    citizenDetailPage,
    addCitizen,
    addCitizenPage,
    editCitizenPage,
    editCitizen,
    deleteCitizens,
    companyPage,
    company,
    createCompany,
    companyDetailPage
} = require("./routes/citizens/citizen");

// Registration - Login
const {
    loginPage,
    registerPage,
    login,
    register,
    changeUsername,
    changeUsernamePage,
    editAccountPage,
    editAccount
} = require("./routes/login-reg");

const {
    dispatchPage,
    disptachNameSearch,
    disptachPlateSearch,
    disptachWeaponSearch,
    disptachAddressSearch,
    statusChangeDispatch
} = require("./routes/dispatch")

const {
    homePage,
    cadHomePage,
    manageAccountPage,
    loginPageMain,
    loginMain,
    registerMain,
    registerPageMain,
    accountMainPage,
    changeUsernameMain,
    manageAccount
} = require("./routes/index")
// Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('views', __dirname + '/views');
app.set("view engine", "ejs")
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(favicon(__dirname + '/public/icon.png'));
app.use(eSession.main(session));


app.get("/", cadHomePage);
app.get("/account", manageAccountPage);
app.get("/login", loginPageMain);
app.post("/login", loginMain);
app.get("/register", registerPageMain);
app.post("/register", registerMain);
app.post("/account/edit-account", manageAccount)
app.get(`/logout`, (req, res) => {
    req.session.destroy();

    res.redirect("/")
})

// Settings
app.get("/account/settings/account", accountMainPage);
app.post("/account/change-username", changeUsernameMain);
// Home/defualt pages
app.get(`/cad/:cadID/`, homePage);
app.get("/cad/:cadID/account/edit", editAccountPage);
app.post("/cad/:cadID/account/edit", editAccount);

// Admin
app.get("/cad/:cadID/admin", adminPanel);
app.get("/cad/:cadID/admin/users", usersPage);
app.get("/cad/:cadID/admin/users/edit/:id", adminEditCitizenPage);
app.post("/cad/:cadID/admin/users/edit/:id", adminEditCitizen);

// Citizens
app.get("/cad/:cadID/citizen", citizenPage);
app.get("/cad/:cadID/citizens/:id-:first_name-:last_name", citizenDetailPage);
app.get("/cad/:cadID/citizen/add", addCitizenPage);
app.post("/cad/:cadID/citizen/add", addCitizen);
app.get("/cad/:cadID/citizen/edit/:id-:first_name-:last_name", editCitizenPage);
app.post("/cad/:cadID/citizen/edit/:id-:first_name-:last_name", editCitizen);
app.get("/cad/:cadID/citizen/delete/:id-:first_name-:last_name", deleteCitizens);
app.get("/cad/:cadID/citizen/company", companyPage);
app.post("/cad/:cadID/citizen/company/join", company);
app.post("/cad/:cadID/citizen/company/create", createCompany);
app.get("/cad/:cadID/citizen/company/:company", companyDetailPage);

//  Login : Registration : Logout
app.get(`/cad/:cadID/login`, loginPage);
app.post(`/cad/:cadID/login`, login);
app.get(`/cad/:cadID/register`, registerPage);
app.post(`/cad/:cadID/register`, register);
app.get(`/cad/:cadID/logout`, (req, res) => {
    req.session.destroy();
    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

    connection2.query(query2, (err, result2) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.redirect(`/cad/${result2[0].cadID}/`)
        };
    });
})

app.get("/cad/:cadID/dispatch", dispatchPage)
app.post("/cad/:cadID/dispatch/search/name", disptachNameSearch)
app.post("/cad/:cadID/dispatch/search/plate", disptachPlateSearch)
app.post("/cad/:cadID/dispatch/search/weapon", disptachWeaponSearch)
app.post("/cad/:cadID/dispatch/search/address", disptachAddressSearch)
app.post("/cad/:cadID/dispatch/status", statusChangeDispatch)


// Officers
app.get("/cad/:cadID/myofficers", officersPage)
app.get("/cad/:cadID/officers/dash", officersDash)
app.get("/cad/:cadID/officers/penal-codes", penalCodesPage)
app.get("/cad/:cadID/officers/dash/search/plate", searchPlatePage)
app.get("/cad/:cadID/officers/dash/search/plate/:id-:owner", plateResultsPage)
app.get("/cad/:cadID/officers/dash/offence/add/:id-:first_name-:last_name", addOffencePage)
app.post("/cad/:cadID/officers/dash/offence/add/:id-:first_name-:last_name", addOffence)
app.get("/cad/:cadID/officers/dash/search/person-name", searchNamePage)
app.get("/cad/:cadID/officers/dash/search/name/:id-:first_name-:last_name", nameResultsPage)
app.get("/cad/:cadID/officers/apply", officerApplyPage);
app.post("/cad/:cadID/officers/apply", officerApply);
app.get("/cad/:cadID/officers/dash/warrants/add/:id-:first_name-:last_name", addWarrantPage)
app.post("/cad/:cadID/officers/dash/warrants/add/:id-:first_name-:last_name", addWarrant)
app.get('/cad/:cadID/officers/add', addOfficerPage)
app.post('/cad/:cadID/officers/add', addOfficer)
app.post("/cad/:cadID/officers/dash/search/plate/:id-:first_name-:last_name/suspend", suspendLicensePlate)
app.post("/cad/:cadID/officers/dash/search/name/:id-:first_name-:last_name/suspend", suspendLicenseName)
app.post("/cad/:cadID/myofficers/status", statusChange)
app.get("/cad/:cadID/officers/dash/codes", codesPage)

// EMS/FD
app.get('/cad/:cadID/ems-fd', emsPage);

// Cars
app.get("/cad/:cadID/admin/values/cars", carValuePage)
app.get("/cad/:cadID/admin/values/cars/add", addCarPage)
app.get("/cad/:cadID/admin/values/cars/edit/:id", editVehiclePage)
app.get("/cad/:cadID/admin/values/cars/delete/:id", deleteVehiclePage)
app.post("/cad/:cadID/admin/values/cars/edit/:id", editVehicle)
app.post("/cad/:cadID/admin/values/cars/add", addCar)

// Car Regestration
app.get("/cad/:cadID/cars/register", regVehiclePage)
app.post("/cad/:cadID/cars/register", regVehicle)

// Genders 
app.get("/cad/:cadID/admin/values/genders", genderPage)
app.get("/cad/:cadID/admin/values/genders/add", addGenderPage)
app.get("/cad/:cadID/admin/values/genders/delete/:id", deleteGender)
app.post("/cad/:cadID/admin/values/genders/add", addGender)
app.get("/cad/:cadID/admin/values/genders/edit/:id", editGenderPage)
app.post("/cad/:cadID/admin/values/genders/edit/:id", editGender)

// ethnicities 
app.get("/cad/:cadID/admin/values/ethnicities", ethnicitiesPage)
app.get("/cad/:cadID/admin/values/ethnicities/add", addethnicityPage)
app.get("/cad/:cadID/admin/values/ethnicities/edit/:id", editEthnicityPage)
app.get("/cad/:cadID/admin/values/ethnicities/delete/:id", deleteEthnicity)
app.post("/cad/:cadID/admin/values/ethnicities/edit/:id", editethnicity)
app.post("/cad/:cadID/admin/values/ethnicities/add", addethnicity)

// Weapons
app.get("/cad/:cadID/admin/values/weapons", weaponsPage)
app.get("/cad/:cadID/admin/values/weapons/add", addWeaponPage)
app.get("/cad/:cadID/admin/values/weapons/delete/:id", deleteWeapon)
app.post("/cad/:cadID/admin/values/weapons/add", addWeapon)
app.get("/cad/:cadID/admin/values/weapons/edit/:id", editWeaponPage)
app.post("/cad/:cadID/admin/values/weapons/edit/:id", editWeapon)

// Weapon regestration
app.get("/cad/:cadID/weapons/register", regWeaponPage)
app.post("/cad/:cadID/weapons/register", regWeapon)

// 404 page 
app.get('*', (req, res) => {

    if (req.path.includes("/cad/")) {

        res.status(404).render("errors/404.ejs", {
            title: "404 | Equinox CAD",
            isAdmin: req.session.admin,
            cadId: ""
        })
    } else {
        res.status(404).render("errors/404-main.ejs", {
            title: "404 | Equinox CAD",
            isAdmin: req.session.admin,
            cadId: ""
        })
    }

})


async function main() {
    db = {
        host: "localhost",
        user: "root",
        password: process.env.DBP,
        database: process.env.DB,
        multipleStatements: true,
        timeout: 0
    };

    db2 = {
        host: "localhost",
        user: "root",
        password: process.env.DBP,
        database: process.env.DB2,
        multipleStatements: true,
        timeout: 0
    }

    db3 = {
        host: "localhost",
        user: "root",
        password: process.env.DBP,
        database: process.env.DB3,
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

        connection1.connect(function (err) { // The server is either down
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

    handleDisconnect();
    app.listen(port, () => {

        console.log(`Running on ${port}`)
    });
    bot.commands = new Discord.Collection();
    bot.login(process.env.BOT_TOKEN);

    bot.on("ready", () => {
        console.log(`bot up and running ${bot.user.username}`)
    })
}

main();