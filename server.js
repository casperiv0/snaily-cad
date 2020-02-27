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
let port = 80;
const prefix = "?"

// Admin
const {
    adminPanel,
    adminLoginPage,
    adminLogin,
    citizensPage,
    deleteCitizen
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
    officerLogin,
    officerLoginPage
} = require("./routes/officers/officer");

const {
    emsPage,
    emsLogin,
    emsLoginPage
} = require('./routes/ems-fd/ems-fd')

// Citizens
const {
    citizenPage,
    citizenDetailPage,
    addCitizen,
    addCitizenPage,
    editCitizenPage,
    editCitizen,
    deleteCitizens
} = require("./routes/citizens/citizen");

// Registration - Login
const {
    loginPage,
    registerPage,
    login,
    register,
    changeUsername,
    changeUsernamePage
} = require("./routes/login-reg")

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

// Admin
app.get("/admin", adminPanel);
app.get('/admin/login', adminLoginPage);
app.post('/admin/auth', adminLogin);

// Citizens
app.get("/admin/citizens", citizensPage)
app.get("/admin/citizens/delete/:id", deleteCitizen)
app.get("/citizen", citizenPage)
app.get("/citizens/:id-:first_name-:last_name", citizenDetailPage)
app.get("/citizen/add", addCitizenPage)
app.post("/citizen/add", addCitizen)
app.get("/citizen/edit/:id-:first_name-:last_name", editCitizenPage)
app.post("/citizen/edit/:id-:first_name-:last_name", editCitizen)
app.get("/citizen/delete/:id-:first_name-:last_name", deleteCitizens)
app.get("/edit-name", changeUsernamePage)
app.post("/edit-name", changeUsername)

//  Login : Registration : Logout
app.get("/login", loginPage);
app.post("/login", login);
app.get("/register", registerPage);
app.post("/register", register);
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

// Officers
app.get('/officer/login', officerLoginPage)
app.post('/officers/auth', officerLogin);
app.get("/myofficers", officersPage)
app.get("/officers/dash", officersDash)
app.get("/officers/tablet", tabletPage)
app.get("/officers/penal-codes", penalCodesPage)
app.get("/officers/dash/search/plate", searchPlatePage)
app.get("/officers/dash/search/plate/:id-:owner", plateResultsPage)
app.get("/officers/dash/offence/add/:id-:first_name-:last_name", addOffencePage)
app.post("/officers/dash/offence/add/:id-:first_name-:last_name", addOffence)
app.get("/officers/dash/search/person-name", searchNamePage)
app.get("/officers/dash/search/name/:id-:first_name-:last_name", nameResultsPage)
app.get('/officers/login', officerLoginPage);


// EMS/FD
app.get('/ems-fd', emsPage);
app.get('/ems-fd/login', emsLoginPage)
app.post('/ems-fd/login', emsLogin)

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

app.get("/officers/apply", (req, res) => {
    res.render("officers-pages/apply.ejs", {
        title: "Apply | Equinox CAD",
        isAdmin: req.session.isAdmin
    })
})

app.post("/officers/apply", async (req, res) => {
    res.redirect("/")
    let dUsername = req.body.dUsername;
    let q1 = req.body.q1;
    let q2 = req.body.q2;
    let q3 = req.body.q3;
    let q4 = req.body.q4;
    let q5 = req.body.q5;
    // 643417616337207296 << Testing channel
    // 679698348730482689 << app channel - Equinox Roleplay
    let embed = new Discord.RichEmbed()
        .setTitle(`New Police Application From ${dUsername}`)
        .setColor("0000FF")
        .addField("**What inspired you to apply?**", q1)
        .addField("**Do you have previous experience as an officer?**", q2)
        .addField("**Which department you looking to apply to?**", q3)
        .addField("**Are you over 16?**", q4)
        .addField("**Do you agree that you will be on duty once a week as a minimal requirement?**", q5)
    bot.channels.get("679712964374167560").send(embed)
    // .then(async (embedMsg, message) => {
    //     embedMsg.react("✅").then(r => {
    //         embedMsg.react("❌")
    //         let approved = embedMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '✅' && user.id !== bot.user.id);
    //         let declined = embedMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '❌' && user.id !== bot.user.id);

    //         approved.on('collect', r => {
    //             bot.channels.get("643417616337207296").send(`${dUsername} Was Declined`)
    //         });

    //         declined.on("collect", r => {
    //             bot.channels.get("643417616337207296").send(`${dUsername} Was Declined`)

    //         });
    //     })
    // })
    // await message.react("😄")
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
    // 7{aH$mkLP@vfpW-!
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