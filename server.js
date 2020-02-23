const express = require("express")
const app = express()
const { homePage } = require("./routes/index")
let eSession = require('easy-session');
let Acl = require("virgen-acl").Acl, acl = new Acl();
let cookieParser = require('cookie-parser');
const Discord = require("discord.js")
const bot = new Discord.Client()
require('dotenv').config()
let Darkmode =  require('darkmode-js');
let darkModeWidget = new Darkmode().showWidget();

const { adminPanel, citizensPage, deleteCitizen } = require("./routes/admin")
const { addCarPage, carValuePage, editVehiclePage, editVehicle, deleteVehiclePage, addCar, regVehicle, regVehiclePage } = require("./routes/values/cars")
const { genderPage, deleteGender, addGenderPage, addGender, editGender, editGenderPage } = require("./routes/values/genders")
const { weaponsPage, deleteWeapon, addWeaponPage, addWeapon, editWeapon, editWeaponPage, regWeapon, regWeaponPage } = require("./routes/values/weapons")
const { ethnicitiesPage, addethnicityPage, addethnicity, editEthnicityPage, editethnicity, deleteEthnicity } = require("./routes/values/ethnicities")
const { officersPage, tabletPage, penalCodesPage, officersDash, searchNamePage, searchPlatePage, plateResultsPage, nameResultsPage, officerApplyPage, addOffencePage, addOffence } = require("./routes/officers/officer")
const { citizenPage, citizenDetailPage, addCitizen, addCitizenPage, editCitizenPage, editCitizen,deleteCitizens } = require("./routes/citizens/citizen")
const { loggedinHomePage } = require("./routes/login")
const { loginPage, registerPage, login, register, changeUsername, changeUsernamePage } = require("./routes/login-reg")
let port = 80;
const prefix = "?"

const fetch = require("node-fetch")
const session = require("express-session");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('views', __dirname + '/views');
app.set("view engine", "ejs")
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(eSession.main(session));


app.get("/", homePage)
app.get("/admin", adminPanel)

app.get('/admin/login', function (req, res) {

    res.render("citizens/login.ejs", { title: "Login", message: "Session expired, Please log back in.", isAdmin: req.session.admin, loggedIn: req.session.loggedin })
});

app.post('/admin/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedinAdmin = true;
                request.session.username = username;
                request.session.admin = true;
                console.log("Successfully logged in at: " + request.connection.remoteAddress)
                response.redirect('/home');
            } else {
                response.render("citizens/login.ejs", { title: 'Admin Panel', isAdmin: request.session.admin, message: "Wrong Username or Password" })
                console.log("log in failed at: ", request.connection.remoteAddress)
            }
            // response.render("citizens/login.ejs", { title: 'Admin Panel', isAdmin: request.session.admin, message: "Something went wrong! Please try again" })
            response.end();
        });
    } else {
        response.render("citizens/login.ejs", { title: 'Admin Panel', isAdmin: request.session.admin, message: "Something went wrong! Please try again" })

        response.end();
    }
});
app.post('/officers/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        db.query('SELECT * FROM `officer-acc` WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.PDloggedin = true;
                request.session.username = username;
                response.redirect('/myofficers');
            } else {
                response.render("officers-pages/login.ejs", { title: 'Police Dept.', isAdmin: request.session.admin, message: "Wrong Username or Password" })
                // response.render("errors/logged.ejs", { title: "Error", isAdmin: request.session.isAdmin })
                console.log("log in failed at: " + request.connection.remoteAddress)

            }
            response.end();
        });
    } else {
        response.render("officers-pages/login.ejs", { title: 'Police Dept.', isAdmin: request.session.admin, message: "Something went wrong! Please try again" })

        response.end();
    }
});

app.get('/home', loggedinHomePage);

app.use(function (req, res, next) {
    if (res.statusCode == 404) {
        res.status(404).render("errors/404.ejs", { title: "404 | Equinox CAD", isAdmin: req.session.admin })
    } else {
        next()
    }
})

// Citizens
app.get("/admin/citizens", citizensPage)
app.get("/admin/citizens/delete/:id", deleteCitizen)
app.get("/citizen", citizenPage)
app.get("/citizens/:id-:first_name-:last_name", citizenDetailPage)
app.get("/citizen/add", addCitizenPage)
app.post("/citizen/add", addCitizen)
app.get("/citizen/edit/:id-:first_name-:last_name", editCitizenPage)
app.post("/citizen/edit/:id-:first_name-:last_name", editCitizen)
app.post("/citizen/delete/:id-:first_name-:last_name", deleteCitizens)
app.get("/edit-name", changeUsernamePage)
app.post("/edit-name", changeUsername)

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
    // res.render("login-res/logout.ejs", { title: "Are you sure you want to logout? | Equinox CAD", isAdmin: req.session.isAdmin })
})

app.post("/logout", (req, res) => {
    req.session
})

//  Login : Registration
app.get("/login", loginPage);
app.post("/login", login);
app.get("/register", registerPage);
app.post("/register", register);

// Officers
app.get("/myofficers", officersPage)
app.get("/officers/dash", officersDash)
app.get("/officers/tablet", tabletPage)
app.get("/officers/penal-codes", penalCodesPage)
app.get("/officers/dash/search/plate", searchPlatePage)
app.get("/officers/dash/search/plate/:id-:owner", plateResultsPage)
app.get("/officers/dash/offence/add/:id-:first_name-:last_name", addOffencePage)
app.post("/officers/dash/offence/add/:id-:first_name-:last_name", addOffence)
// app.get("/officers/")
app.get("/officers/dash/search/person-name", searchNamePage)
app.get("/officers/dash/search/name/:id-:first_name-:last_name", nameResultsPage)
// application

app.get('/officers/login', function (req, res) {
    res.render("officers-pages/login.ejs", { title: "Login", message: "", isAdmin: req.session.admin, loggedIn: req.session.loggedin })
});


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
    res.render("officers-pages/apply.ejs", { title: "Apply | Equinox CAD", isAdmin: req.session.isAdmin })
    // bot.channels.get("643417616337207296").send(``)
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




async function main() {

    db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: process.env.DBP,
        database: process.env.DB,
        multipleStatements: true
    });

    db2 = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: process.env.DBP,
        database: process.env.DB2,
        multipleStatements: true
    })
    // 7{aH$mkLP@vfpW-!
    app.listen(port, () => {

        console.log(`Running on ${port}`)
    });
    bot.commands = new Discord.Collection();
    bot.login(process.env.BOT_TOKEN);

    bot.on("ready", () => {
        console.log(`bot up and running ${bot.user.username}`)
    })

    bot.on('message', (message, bot) => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        let messageArray = message.content.split(/ +/);
        let args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
        let cmd = args.shift().toLowerCase();
        let commandfile;
        if (bot.commands.has(cmd)) {
            commandfile = bot.commands.get(cmd);
        } else if (bot.aliases.has(cmd)) {
            commandfile = bot.commands.get(bot.aliases.get(cmd));
        } else {
            return;
        }
        console.log(
            `${message.author.username} Has used the ${(commandfile, cmd)} command in ${
            message.guild.name
            }`
        );
        try {
            commandfile.run(bot, message, args, cmd, commandfile);
        } catch (err) {
            console.log("There was an error loading the commands");
            console.log(err);
        }
    });


}
// var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
// require('child_process').exec(start + ' ' + "http://localhost:" + port + "/");

main();