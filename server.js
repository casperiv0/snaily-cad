const express = require("express")
const app = express()
const {
    homePage
} = require("./routes/index")
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
let db;
let db2;
let port = process.env.ENV === "dev" ? 3001 : 80;
const prefix = "?"

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




// Home/defualt pages
app.get("/", homePage)
app.get("/account/edit", editAccountPage)
app.post("/account/edit", editAccount)

// Admin
app.get("/admin", adminPanel);
app.get("/admin/users", usersPage)
app.get("/admin/users/edit/:id", adminEditCitizenPage)
app.post("/admin/users/edit/:id", adminEditCitizen)

// Citizens
app.get("/citizen", citizenPage)
app.get("/citizens/:id-:first_name-:last_name", citizenDetailPage)
app.get("/citizen/add", addCitizenPage)
app.post("/citizen/add", addCitizen)
app.get("/citizen/edit/:id-:first_name-:last_name", editCitizenPage)
app.post("/citizen/edit/:id-:first_name-:last_name", editCitizen)
app.get("/citizen/delete/:id-:first_name-:last_name", deleteCitizens)
app.get("/citizen/company", companyPage)
app.post("/citizen/company/join", company)
app.post("/citizen/company/create", createCompany)
app.get("/citizen/company/:company", companyDetailPage)

//  Login : Registration : Logout
app.get("/login", loginPage);
app.post("/login", login);
app.get("/register", registerPage);
app.post("/register", register);
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

app.get("/dispatch", dispatchPage)
app.post("/dispatch/search/name", disptachNameSearch)
app.post("/dispatch/search/plate", disptachPlateSearch)
app.post("/dispatch/search/weapon", disptachWeaponSearch)
app.post("/dispatch/search/address", disptachAddressSearch)
app.post("/dispatch/status", statusChangeDispatch)


// Officers
app.get("/myofficers", officersPage)
app.get("/officers/dash", officersDash)
app.get("/officers/penal-codes", penalCodesPage)
app.get("/officers/dash/search/plate", searchPlatePage)
app.get("/officers/dash/search/plate/:id-:owner", plateResultsPage)
app.get("/officers/dash/offence/add/:id-:first_name-:last_name", addOffencePage)
app.post("/officers/dash/offence/add/:id-:first_name-:last_name", addOffence)
app.get("/officers/dash/search/person-name", searchNamePage)
app.get("/officers/dash/search/name/:id-:first_name-:last_name", nameResultsPage)
app.get("/officers/apply", officerApplyPage);
app.post("/officers/apply", officerApply);
app.get("/officers/dash/warrants/add/:id-:first_name-:last_name", addWarrantPage)
app.post("/officers/dash/warrants/add/:id-:first_name-:last_name", addWarrant)
app.get('/officers/add', addOfficerPage)
app.post('/officers/add', addOfficer)
app.post("/officers/dash/search/plate/:id-:first_name-:last_name/suspend", suspendLicensePlate)
app.post("/officers/dash/search/name/:id-:first_name-:last_name/suspend", suspendLicenseName)
app.post("/myofficers/status", statusChange)
app.get("/officers/dash/codes", codesPage)

// EMS/FD
app.get('/ems-fd', emsPage);

// Cars
app.get("/admin/values/cars", carValuePage)
app.get("/admin/values/cars/add", addCarPage)
app.get("/admin/values/cars/edit/:id", editVehiclePage)
app.get("/admin/values/cars/delete/:id", deleteVehiclePage)
app.post("/admin/values/cars/edit/:id", editVehicle)
app.post("/admin/values/cars/add", addCar)

// Car Regestration
app.get("/cars/register", regVehiclePage)
app.post("/cars/register", regVehicle)

// Genders 
app.get("/admin/values/genders", genderPage)
app.get("/admin/values/genders/add", addGenderPage)
app.get("/admin/values/genders/delete/:id", deleteGender)
app.post("/admin/values/genders/add", addGender)
app.get("/admin/values/genders/edit/:id", editGenderPage)
app.post("/admin/values/genders/edit/:id", editGender)

// ethnicities 
app.get("/admin/values/ethnicities", ethnicitiesPage)
app.get("/admin/values/ethnicities/add", addethnicityPage)
app.get("/admin/values/ethnicities/edit/:id", editEthnicityPage)
app.get("/admin/values/ethnicities/delete/:id", deleteEthnicity)
app.post("/admin/values/ethnicities/edit/:id", editethnicity)
app.post("/admin/values/ethnicities/add", addethnicity)

// Weapons
app.get("/admin/values/weapons", weaponsPage)
app.get("/admin/values/weapons/add", addWeaponPage)
app.get("/admin/values/weapons/delete/:id", deleteWeapon)
app.post("/admin/values/weapons/add", addWeapon)
app.get("/admin/values/weapons/edit/:id", editWeaponPage)
app.post("/admin/values/weapons/edit/:id", editWeapon)

// Weapon regestration
app.get("/weapons/register", regWeaponPage)
app.post("/weapons/register", regWeapon)



app.post("/officers/apply", async (req, res) => {

})

// 404 page 
app.get('*', (req, res) => {
    res.status(404).render("errors/404.ejs", {
        title: "404 | Equinox CAD",
        isAdmin: req.session.admin
    })
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



    function handleDisconnect() {
        connection = mysql.createConnection(db); // Recreate the connection, since
        connection1 = mysql.createConnection(db2); // Recreate the connection, since
        // the old one cannot be reused.
        global.connection = connection
        global.connection1 = connection1

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