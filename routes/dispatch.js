module.exports = {
    dispatchPage: (req, res) => {
        let weapons = "SELECT * FROM weapons"
        let addressess = "SELECT address FROM citizens"
        connection.query(`${weapons}; ${addressess}`, (err, result) => {
            if (err) {
                return console.log(err)
            } else {
                res.render("dispatch/main.ejs", { title: "Dispatch | Equinox CAD", isAdmin: "", weapons: result[0], address: result[1] })
            }
        })
    },
    disptachNameSearch: (req, res) => {
        let searchQ = req.body.name_search;
        let query = "SELECT * FROM citizens WHERE full_name = '" + searchQ + "'"
        let vehicles = "SELECT * FROM registered_cars WHERE owner = '" + searchQ + "'";
        let weapon = "SELECT * FROM registered_weapons WHERE owner = '" + searchQ + "'";
        let charge = "SELECT * FROM posted_charges WHERE name = '" + searchQ + "'";

        connection.query(`${query}; ${vehicles}; ${weapon}; ${charge}`, (err, result) => {
            if (err) {
                return console.log(err);
            } else {
                res.render("dispatch/name-search.ejs", { title: "Dispatch | Equinox CAD", isAdmin: "", result: result[0][0], vehicles: result[1], weapons: result[2], charges: result[3] });
            }
        })


    },
    disptachPlateSearch: (req, res) => {
        let searchQ = req.body.plate_search;
        let vehicle = "SELECT * FROM registered_cars WHERE plate = '" + searchQ + "'";

        connection.query(`${vehicle}`, (err1, result1) => {
            if (!result1[0]) {
                console.log(err1);
                res.redirect('/dispatch');
            } else {
                let citizen = "SELECT * FROM citizens WHERE full_name = '" + result1[0].owner + "'";
                connection.query(citizen, (err, result) => {
                    res.render("dispatch/plate-search.ejs", { title: "Dispatch | Equinox CAD", isAdmin: "", plates: result1[0], name: result[0] });
                });
            };
        });
    },
    disptachWeaponSearch: (req, res) => {
        let searchQ = req.body.weapon_search;
        let weaponQ = "SELECT * FROM `registered_weapons` WHERE weapon = '" + searchQ + "'";

        connection.query(`${weaponQ}`, (err, result) => {
            res.render("dispatch/weapons-search.ejs", { title: 'Dispatch | Equinox CAD', isAdmin: "", weapons: result });
        })
    },
    disptachAddressSearch: (req, res) => {
        let searchQ = req.body.address_search;
        let query = "SELECT * FROM citizens WHERE address = '" + searchQ + "'";

        connection.query(query, (err, result) => {
            if (err) {
                return console.log(err);
            } else {
                res.render("dispatch/address-search.ejs", { title: "Dispatch | Equinox CAD", isAdmin: "", users: result });
            };
        });
    }
};