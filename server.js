const express = require("express")
const app = express()
const { homePage } = require("./routes/index")
const { adminPanel, citizensPage, } = require("./routes/admin")
const { addCarPage, carValuePage, editVehiclePage, editVehicle, deleteVehiclePage, addCar } = require("./routes/values/cars")
const { genderPage, deleteGender, addGenderPage, addGender } = require("./routes/values/genders")
const { weaponsPage, deleteWeapon, addWeaponPage, addWeapon } = require("./routes/values/weapons")
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
app.get("/admin/citizens", citizensPage)

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

// Weapons
app.get("/admin/values/weapons", weaponsPage)
app.get("/admin/values/weapons/add", addWeaponPage)
app.get("/admin/values/weapons/delete/:id", deleteWeapon)
app.post("/admin/values/weapons/add", addWeapon)



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