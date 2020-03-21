const express = require("express");
const app = express();
let eSession = require('easy-session');
let cookieParser = require('cookie-parser');
let creds = require("./creds.json");
const favicon = require('express-favicon');
const fetch = require("node-fetch")
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require('path');
// Variables
let port = creds.ENV === "dev" ? 3001 : 80;
const mysql = require('mysql');
let connection;
let connection1;
let connection2;

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
};

let db3 = {
    host: "localhost",
    user: "root",
    password: creds.DBP,
    database: creds.DB3,
    multipleStatements: true,
    timeout: 0
};


// Admin
const {
    adminPanel,
    usersPage,
    adminEditCitizen,
    adminEditCitizenPage,
    editCADPage,
    deleteAllCitizens,
    banUser,
    unBanUser,
    editCAD,
    actionLogPage
} = require("./routes/admin");

// Vehicles
const {
    addCarPage,
    carValuePage,
    editVehiclePage,
    editVehicle,
    deleteVehiclePage,
    addCar,
    regVehicle,
    regVehiclePage,
    editVehiclePageCitizen,
    editVehicleCitizen,
    deleteVehicleCitizen
} = require("./routes/values/cars");

// Genders
const {
    genderPage,
    deleteGender,
    addGenderPage,
    addGender,
    editGender,
    editGenderPage
} = require("./routes/values/genders");
// Weapons
const {
    weaponsPage,
    deleteWeapon,
    addWeaponPage,
    addWeapon,
    editWeapon,
    editWeaponPage,
    regWeapon,
    regWeaponPage,
    citizenDeleteWeapon
} = require("./routes/values/weapons");

// Ethnicities
const {
    ethnicitiesPage,
    addethnicityPage,
    addethnicity,
    editEthnicityPage,
    editethnicity,
    deleteEthnicity
} = require("./routes/values/ethnicities");

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
    codesPage,
    officerBolo,
    removeOfficerBolo,
    officerOffencer,
    versionChange,
    officerNameSearch,
    officerPlateSearch,
    officerWeaponSearch
} = require("./routes/officers/officer");

const {
    emsPage,
    statusChangeEMS, addEMSPage,
    addEMS
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
    companyDetailPage,
    createCompanyPostPage,
    createCompanyPost,
    editCompanyPage,
    editCitizenCompanyPage,
    editCitizenCompany
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
    editAccountUsername,
    editAccountPassword,
    deleteAccount
} = require("./routes/login-reg");

const { addDept, addDeptPage, editDept, deleteDept, editDeptPage, deptPage } = require("./routes/values/depts")

const {
    dispatchPage,
    disptachNameSearch,
    disptachPlateSearch,
    disptachWeaponSearch,
    disptachAddressSearch,
    statusChangeDispatch,
    statusChangeDispatchEMS,
    editAOP,
    createBolo,
    removeBolo
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
    manageAccount,
    orderPage,
    editPassword,
    editPasswordPage,
    allScreensPage
} = require("./routes/index");

const {
    legalPage, addLegalPage, deleteLegal, addLegal, editLegalPage, editLegal } = require("./routes/values/legal")

const { adminDashboard,
    usernameAdminPage,
    usernameAdmin,
    expireCAD,
    reactivateCAD,
    addCad
} = require("./routes/main-admin")

const { supportPage, createTicketPage, createTicket, ticketPage, replyToPost, cadPage, closeTicket } = require('./routes/support')
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
    saveUninitialized: true,
}));
app.use(favicon(__dirname + '/public/icon2.png'));

app.use(eSession.main(session));


app.get("/", cadHomePage);
app.get("/screenshots", allScreensPage);
app.get("/account", manageAccountPage);
app.get("/login", loginPageMain);
app.post("/login", loginMain);
app.get("/register", registerPageMain);
app.post("/register", registerMain);
app.post("/account/edit-account", manageAccount)
app.get("/cad/", (req, res) => {
    res.redirect("/account")
})

app.get(`/logout`, (req, res) => {
    req.session.destroy();

    res.redirect("/")
});
app.get("/order", orderPage)

// Support 
app.get("/support", supportPage)
app.get("/support/create-ticket", createTicketPage)
app.post("/support", createTicket)
app.get("/support/ticket/:ticket_id-:title", ticketPage)
app.post("/support/ticket/:ticket_id-:title", replyToPost)

// SnailyCAD Admin Dashboard
app.get("/admin/dashboard/", adminDashboard)
app.get("/admin/dashboard/:username", usernameAdminPage)
app.post("/admin/dashboard/:username", usernameAdmin)
app.post("/admin/dashboard/:username/add-cad", addCad)
app.get("/admin/expire-cad/:cadID", expireCAD)
app.post("/admin/reactivate", reactivateCAD)
app.get("/admin/cad/:cadID", cadPage)
app.get("/admin/ticket/close/:id", closeTicket)
// Settings
app.post("/account/change-username", changeUsernameMain);
app.get("/account/edit-password-:username", editPasswordPage)
app.post("/account/edit-password-:username", editPassword)
// Home/defualt pages
app.get(`/cad/:cadID/`, homePage);
app.get("/cad/:cadID/account/edit", editAccountPage);
app.post("/cad/:cadID/account/edit/username", editAccountUsername);
app.post("/cad/:cadID/account/edit/password", editAccountPassword);
app.post("/cad/:cadID/delete-account", deleteAccount)

// Admin
app.get("/cad/:cadID/admin", adminPanel);
app.get("/cad/:cadID/admin/users", usersPage);
app.get("/cad/:cadID/admin/users/edit/:id", adminEditCitizenPage);
app.post("/cad/:cadID/admin/users/edit/:id", adminEditCitizen);
app.get("/cad/:cadID/admin/edit-cad", editCADPage)
app.post("/cad/:cadID/admin/edit-cad", editCAD)
app.post("/cad/:cadID/admin/delete-citizens", deleteAllCitizens)
app.post("/cad/:cadID/admin/ban-:id", banUser)
app.post("/cad/:cadID/admin/unban-:id", unBanUser)
app.get("/cad/:cadID/admin/action-log", actionLogPage)

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
app.get("/cad/:cadID/citizen/company/:id-:company", companyDetailPage);
app.get("/cad/:cadID/citizen/company/:id-:company/create-post", createCompanyPostPage)
app.post("/cad/:cadID/citizen/company/:id-:company", createCompanyPost)
app.get("/cad/:cadID/citizen/company/:id-:company/edit-company", editCompanyPage)
app.get("/cad/:cadID/citizen/company/:id-:company/edit/:citizen", editCitizenCompanyPage)
app.post("/cad/:cadID/citizen/company/:id-:company/edit/:citizen", editCitizenCompany)

//  Login : Registration : Logout
app.get(`/cad/:cadID/login`, loginPage);
app.post(`/cad/:cadID/login`, login);
app.get(`/cad/:cadID/register`, registerPage);
app.post(`/cad/:cadID/register`, register);
app.get(`/cad/:cadID/logout`, async (req, res) => {

    req.session.destroy();
    let query2 = "SELECT `cadID` FROM `users` WHERE `cadID` = '" + req.params.cadID + "'";
    await connection1.query(query2, (err, result2) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.redirect(`/cad/${result2[0].cadID}/`)
        };
    });
});

app.get("/cad/:cadID/dispatch", dispatchPage);
app.post("/cad/:cadID/dispatch/search/name", disptachNameSearch);
app.post("/cad/:cadID/dispatch/search/plate", disptachPlateSearch);
app.post("/cad/:cadID/dispatch/search/weapon", disptachWeaponSearch);
app.post("/cad/:cadID/dispatch/search/address", disptachAddressSearch);
app.post("/cad/:cadID/dispatch/status", statusChangeDispatch);
app.post("/cad/:cadID/dispatch/status-ems", statusChangeDispatchEMS);
app.post("/cad/:cadID/dispatch/aop", editAOP);
app.post("/cad/:cadID/dispatch/bolo", createBolo);
app.post("/cad/:cadID/dispatch/remove-bolo", removeBolo);


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
app.post("/cad/:cadID/myofficers/status", statusChange)
app.get("/cad/:cadID/officers/dash/codes", codesPage)
app.post("/cad/:cadID/officers/bolo", officerBolo)
app.post("/cad/:cadID/officers/remove-bolo", removeOfficerBolo)
app.post("/cad/:cadID/officers/dash/search/name/:id-:first_name-:last_name/suspend/dmv", suspendLicenseName)
app.post("/cad/:cadID/officers/dash/search/name/:id-:first_name-:last_name/suspend/pilot", suspendLicenseName)
app.post("/cad/:cadID/officers/dash/search/name/:id-:first_name-:last_name/suspend/fire", suspendLicenseName)
app.post("/cad/:cadID/officers/dash/search/name/:id-:first_name-:last_name/suspend/ccw", suspendLicenseName)
app.post("/cad/:cadID/officers/dash/offence", officerOffencer)
app.post("/cad/:cadID/officers/version/compact", versionChange)
app.post("/cad/:cadID/officers/version/real", versionChange)

app.post("/cad/:cadID/officers/search/name", officerNameSearch);
app.post("/cad/:cadID/officers/search/plate", officerPlateSearch);
app.post("/cad/:cadID/officers/search/weapon", officerWeaponSearch);

// EMS/FD
app.get('/cad/:cadID/ems-fd', emsPage);
app.post("/cad/:cadID/ems-fd/status", statusChangeEMS)
app.get("/cad/:cadID/ems-fd/add", addEMSPage)
app.post("/cad/:cadID/ems-fd/add", addEMS)

// Cars
app.get("/cad/:cadID/admin/values/cars", carValuePage)
app.get("/cad/:cadID/admin/values/cars/add", addCarPage)
app.get("/cad/:cadID/admin/values/cars/edit/:id", editVehiclePage)
app.get("/cad/:cadID/admin/values/cars/delete/:id", deleteVehiclePage)
app.post("/cad/:cadID/admin/values/cars/edit/:id", editVehicle)
app.post("/cad/:cadID/admin/values/cars/add", addCar)

// Citizen cars
app.get("/cad/:cadID/citizen/:id/:car-:plate/edit", editVehiclePageCitizen)
app.post("/cad/:cadID/citizen/:id/:car-:plate/edit", editVehicleCitizen)
app.get("/cad/:cadID/citizen/:id/:car/delete", deleteVehicleCitizen)
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

// Departments
app.get("/cad/:cadID/admin/values/depts", deptPage)
app.get("/cad/:cadID/admin/values/depts/add", addDeptPage)
app.get("/cad/:cadID/admin/values/depts/edit/:id", editDeptPage)
app.get("/cad/:cadID/admin/values/depts/delete/:id", deleteDept)
app.post("/cad/:cadID/admin/values/depts/edit/:id", editDept)
app.post("/cad/:cadID/admin/values/depts/add", addDept)
// citizen weapons

app.get("/cad/:cadID/weapon/:id/:weapon/delete", citizenDeleteWeapon)
// Weapon regestration
app.get("/cad/:cadID/weapons/register", regWeaponPage)
app.post("/cad/:cadID/weapons/register", regWeapon)

// Legal 
app.get("/cad/:cadID/admin/values/legal", legalPage)
app.get("/cad/:cadID/admin/values/legal/add", addLegalPage)
app.get("/cad/:cadID/admin/values/legal/delete/:id", deleteLegal)
app.post("/cad/:cadID/admin/values/legal/add", addLegal)
app.get("/cad/:cadID/admin/values/legal/edit/:id", editLegalPage)
app.post("/cad/:cadID/admin/values/legal/edit/:id", editLegal)




// 404 page 
app.get('/cad/:cadID/*', (req, res) => {
    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
    connection1.query(query2, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (req.path.includes("/cad/")) {
                res.status(404).render("errors/404.ejs", {
                    title: "404 | Equinox CAD",
                    isAdmin: req.session.admin,
                    cadId: result[0].cadID,
                    desc: "",
                });
            };
        };
    });
});
app.get('/*', (req, res) => {
    res.status(404).render("errors/404-main.ejs", {
        title: "404 | Equinox CAD",
        desc: ""
    });
});

async function main() {
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
        connection1.on('error', function (err) {
            console.log('db error - 2', err);
            if (err.code === 'ECONNRESET') { // Connection to the MySQL server is usually
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
        connection2.on('error', function (err) {
            console.log('db error - 3', err);
            if (err.code === 'ECONNRESET') { // Connection to the MySQL server is usually
                handleDisconnect(); // lost due to either server restart, or a
            } else { // connnection idle timeout (the wait_timeout
                throw err; // server variable configures this)
            }
        });
    };
    handleDisconnect();
    app.listen(port, () => {
        console.log(`Running on ${port}`)
    });
    setInterval(function () {
        connection.query("SELECT 1", (err, result) => {
            if (err) {
                console.log(err);
            }
        })
        connection1.query("SELECT 1", (err, result) => {
            if (err) {
                console.log(err);
            }
        })
        connection2.query("SELECT 1", (err, result) => {
            if (err) {
                console.log(err);
            }
        }, 10000)
    });
}

main();