const express = require("express")
const app = express()
const { homePage } = require("./routes/index")
const { adminPanel, citizensPage, deleteCitizen } = require("./routes/admin")
const { addCarPage, carValuePage, editVehiclePage, editVehicle, deleteVehiclePage, addCar } = require("./routes/values/cars")
const { genderPage, deleteGender, addGenderPage, addGender, editGender, editGenderPage } = require("./routes/values/genders")
const { weaponsPage, deleteWeapon, addWeaponPage, addWeapon, editWeapon, editWeaponPage } = require("./routes/values/weapons")
const { officersPage } = require("./routes/officers/officer")
const { citizenPage, citizenDetailPage, addCitizen, addCitizenPage } = require("./routes/citizens/citizen")
const { loggedinHomePage } = require("./routes/login")
let port = 3001;
const session = require("express-session");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set("view engine", "ejs")
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.get("/", homePage)
app.get("/admin", adminPanel)

app.get('/login', function (req, res) {
    res.render("citizens/login.ejs", { title: "Login", message: "" })
});
app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Please enter Username and Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', loggedinHomePage);

// Citizens
app.get("/admin/citizens", citizensPage)
app.get("/admin/citizens/delete/:id", deleteCitizen)
app.get("/citizen", citizenPage)
app.get("/citizens/:id", citizenDetailPage)
app.get("/citizen/add", addCitizenPage)
app.post("/citizen/add", addCitizen)

// Officers
app.get("/officers", officersPage)

// Cars
app.get("/admin/values/cars", carValuePage)
app.get("/admin/values/cars/add", addCarPage)
app.get("/admin/values/cars/edit/:id", editVehiclePage)
app.get("/admin/values/cars/delete/:id", deleteVehiclePage)
app.post("/admin/values/cars/edit/:id", editVehicle)
app.post("/admin/values/cars/add", addCar)

// Genders 
app.get("/admin/values/genders", genderPage)
app.get("/admin/values/genders/add", addGenderPage)
app.get("/admin/values/genders/delete/:id", deleteGender)
app.post("/admin/values/genders/add", addGender)
app.get("/admin/values/genders/edit/:id", editGenderPage)
app.post("/admin/values/genders/edit/:id", editGender)

// Weapons
app.get("/admin/values/weapons", weaponsPage)
app.get("/admin/values/weapons/add", addWeaponPage)
app.get("/admin/values/weapons/delete/:id", deleteWeapon)
app.post("/admin/values/weapons/add", addWeapon)
app.get("/admin/values/weapons/edit/:id", editWeaponPage)
app.post("/admin/values/weapons/edit/:id", editWeapon)



async function main() {

    db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "7{aH$mkLP@vfpW-!",
        database: "equinox_cad",
    });
    // 7{aH$mkLP@vfpW-!
    app.listen(3001, () => {
        console.log("Running on 3001")
    });

}

main();