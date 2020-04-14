const express = require("express");
const app = express();
let eSession = require('easy-session');
let cookieParser = require('cookie-parser');
let creds = require("./creds.json");
const favicon = require('express-favicon');
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require('path');
const paypal = require("paypal-rest-sdk");
// Variables
let port = creds.ENV === "dev" ? 3001 : 80;
const mysql = require('mysql');
let connection;

let db = {
    host: "localhost",
    user: "root",
    password: creds.DBP,
    database: "snaily-cad",
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
    officerWeaponSearch,
    officerAddWarrant,
    officerAPI,
    quickWarrant,
    officerAPIPlate,
    officerAPIWeapon,
    cancelCall911,
    update911call
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
    editAccountPage,
    editAccountUsername,
    editAccountPassword,
    deleteAccount
} = require("./routes/login-reg");

const { addDept, addDeptPage, editDept, deleteDept, editDeptPage, deptPage } = require("./routes/values/depts")

const {
    dispatchPage,
    disptachWeaponSearch,
    disptachAddressSearch,
    statusChangeDispatch,
    statusChangeDispatchEMS,
    editAOP,
    createBolo,
    removeBolo,
    updateDispatchCall,
    cancelCall911Dis
} = require("./routes/dispatch")

const {
    homePage,
    logout
} = require("./routes/index");

const { legalPage, addLegalPage, deleteLegal, addLegal, editLegalPage, editLegal } = require("./routes/values/legal")


const { towPage, createTowCall, cancelCallTow } = require("./routes/tow/tow")

const { create911Call } = require("./routes/911/911")

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


// Main Pages
app.get("/", homePage);
app.get(`/logout`, logout);

//  Login : Registration
app.get(`/login`, loginPage);
app.post(`/login`, login);
app.get(`/register`, registerPage);
app.post(`/register`, register);


app.get("/cad/:cadID/account/edit", editAccountPage);
app.post("/cad/:cadID/account/edit/username", editAccountUsername);
app.post("/cad/:cadID/account/edit/password", editAccountPassword);
app.post("/cad/:cadID/delete-account", deleteAccount)

// Admin
app.get("/admin", adminPanel);
app.get("/admin/users", usersPage);
app.get("/admin/users/edit/:id", adminEditCitizenPage);
app.post("/admin/users/edit/:id", adminEditCitizen);
app.get("/admin/edit-cad", editCADPage)
app.post("/admin/edit-cad", editCAD)
app.post("/admin/delete-citizens", deleteAllCitizens)
app.post("/admin/ban-:id", banUser)
app.post("/admin/unban-:id", unBanUser)
app.get("/admin/action-log", actionLogPage)

// Citizens
app.get("/citizen", citizenPage);
app.get("/citizens/:id-:full_name", citizenDetailPage);
app.get("/citizen/add", addCitizenPage);
app.post("/citizen/add", addCitizen);
app.get("/citizen/edit/:id-:full_name", editCitizenPage);
app.post("/citizen/edit/:id-:full_name", editCitizen);
app.get("/citizen/delete/:id-:full_name", deleteCitizens);
app.get("/citizen/company", companyPage);
app.post("/citizen/company/join", company);
app.post("/citizen/company/create", createCompany);
app.get("/citizen/company/:id-:company", companyDetailPage);
app.get("/citizen/company/:id-:company/create-post", createCompanyPostPage)
app.post("/citizen/company/:id-:company", createCompanyPost)
app.get("/citizen/company/:id-:company/edit-company", editCompanyPage)
app.get("/citizen/company/:id-:company/edit/:citizen", editCitizenCompanyPage)
app.post("/citizen/company/:id-:company/edit/:citizen", editCitizenCompany)
// Tow
app.get("/cad/:cadID/tow", towPage)
app.post("/cad/:cadID/create-tow-call", createTowCall)
app.post("/cad/:cadID/create-911-call", create911Call)
app.get("/cad/:cadID/tow/cancel-call-:callID", cancelCallTow)



app.get("/cad/:cadID/dispatch", dispatchPage);
app.post("/cad/:cadID/dispatch/search/weapon", disptachWeaponSearch);
app.post("/cad/:cadID/dispatch/search/address", disptachAddressSearch);
app.post("/cad/:cadID/dispatch/status", statusChangeDispatch);
app.post("/cad/:cadID/dispatch/status-ems", statusChangeDispatchEMS);
app.post("/cad/:cadID/dispatch/aop", editAOP);
app.post("/cad/:cadID/dispatch/bolo", createBolo);
app.post("/cad/:cadID/dispatch/remove-bolo", removeBolo);
app.post("/cad/:cadID/dispatch/update-call-:id", updateDispatchCall)
app.get("/cad/:cadID/dispatch/cancel-call-:id", cancelCall911Dis)




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
app.post("/cad/:cadID/officers/warrant", officerAddWarrant)
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
app.get("/cad/:cadID/officers/api/:name", officerAPI)
app.get("/cad/:cadID/officers/api/plate/:plate", officerAPIPlate)
app.get("/cad/:cadID/officers/api/weapon/:serial", officerAPIWeapon)
app.post("/cad/:cadID/officers/quickwarrant", quickWarrant)
app.get("/cad/:cadID/officers/cancel-call-:id", cancelCall911)
app.post("/cad/:cadID/officers/dash/update-call-:id", update911call)

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
// Weapon registration
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
    connection.query(query2, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (result[0]) {
                if (req.path.includes("/cad/")) {
                    res.status(404).render("errors/404.ejs", {
                        title: "404 | Equinox CAD",
                        isAdmin: req.session.admin,
                        cadId: result[0].cadID,
                        desc: "",
                    });
                };
            } else {
                res.sendStatus(404)
            }

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
        // the old one cannot be reused.
        global.connection = connection

        connection.connect(function (err) { // The server is either down
            connection.timeout = 0;
            if (err) { // or restarting (takes a while sometimes).
                console.log('error when connecting to db2:', err);
                setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
            } // to avoid a hot loop, and to allow our node script to
        }); // process asynchronous requests in the meantime.
        connection.on('error - 2', function (err) {
            console.log('db error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                handleDisconnect(); // lost due to either server restart, or a
            } else { // connnection idle timeout (the wait_timeout
                throw err; // server variable configures this)
            }
        });
        connection.on('error', function (err) {
            console.log('db error - 2', err);
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
    });
}

main();