const fetch = require("node-fetch")

let roles = {
    founders: {
        can: ['publish'],
        inherits: ['admin']
    },
    admin: {
        can: ['write'],
        inherits: ['police']
    },
    police: {
        can: ['read', 'write'],
        inherits: ['guest']
    },
    guest: {
        can: ['read']
    }
}

module.exports = {
    officersPage: (req, res, next) => {
        // if (!req.session.hasRole('police')) {
        //     res.sendStatus(403);
        //     return;
        // }
        if (req.session.PDloggedin) {
            let qeury = "SELECT * FROM `officers` ORDER by id ASC"
            db.query(qeury, (err, result) => {
                if (err) {
                    console.log("Error" + err)
                }
                res.render("officers-pages/officers.ejs", { title: "Equinox Officers", users: "qsd", isAdmin: req.session.admin, officers: result })

            })

        } else {
            res.redirect("/officers/login")
        }

    },
    tabletPage: (req, res) => {
        if (req.session.PDloggedin) {
            res.render("officers-pages/tablet.ejs", {
                title: "Officers Tablet", fetch: fetch("http://95.179.141.103:8000/businesses").then(url => {
                    url.json("http://95.179.141.103:8000/businesses").then(result => {
                        console.log(result)
                    })
                })
            })
        } else {
            res.redirect("/officers/login")
        }

    },
    penalCodesPage: (req, res) => {
        if (req.session.PDloggedin) {
            const url = "http://95.179.141.103:3000";
            fetch(url)
                .then(res => res.json())
                .then(json => res.render("officers-pages/penal-codes.ejs", { title: "Penal Codes | Equinox CAD", penals: json, isAdmin: req.session.admin }))
            // .catch(res.send("Penal Code API probably is down! Please come back later."));
        } else {
            res.redirect("/officers/login")

        }


    },
    officersDash: (req, res) => {
        if (req.session.PDloggedin) {

            res.render("officers-pages/officers-dash.ejs", { title: "Police Department", isAdmin: req.session.admin })

        } else {
            res.redirect("/officers/login")

        }
    },
    searchPlatePage: (req, res) => {
        if (req.session.PDloggedin) {
            let query = "SELECT * FROM `registered_cars` ORDER by id ASC"
            db.query(query, (err, result) => {
                res.render("officers-pages/plate.ejs", { title: "Plate Search | Police Department", isAdmin: req.session.admin, plates: result })
            })

        } else {
            res.redirect("/officers/login")

        }
    },
    searchNamePage: (req, res) => {
        if (req.session.PDloggedin) {
            let query = "SELECT * FROM `citizens` ORDER by id ASC"

            db.query(query, (err, result) => {
                res.render("officers-pages/name.ejs", { title: "Name Search | Police Department", isAdmin: req.session.admin, information: result })

            })


        } else {
            res.redirect("/officers/login")

        }
    },
    plateResultsPage: (req, res) => {
        if (req.session.PDloggedin) {
            let id = req.params.id;
            let query = "SELECT * FROM `registered_cars` WHERE id = '" + id + "' ";
            let getOwner = req.params.owner;
            // let owner = getOwner.split(" ");
            // let first_name = owner[0];
            // let last_name = owner[1];

            let query2 = "SELECT * FROM `citizens` WHERE full_name = '" + getOwner + "'"

            db.query(`${query}; ${query2};`, (err, result) => {
                if (err) {
                    return res.status(404).send(err);
                }
                // console.log(result[1][0])
                res.render("officers-pages/plate-results.ejs", { title: "Plate Results | Police Department", isAdmin: req.session.admin, plates: result[0][0], name: result[1][0] })
            });
        } else {
            res.redirect("/officers/login")

        }
    },
    nameResultsPage: (req, res) => {
        if (req.session.PDloggedin) {
            let id = req.params.id;
            let first_name = req.params.first_name;
            let last_name = req.params.last_name;
            let owner = first_name + " " + last_name;
            let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "'"
            let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + owner + "'"
            let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
            db.query(`${query}; ${vehiclesQ}; ${weaponsQ}`, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render("officers-pages/name-results.ejs", { title: "Name Results | Police Department", isAdmin: req.session.admin, result: result[0][0], vehicles: result[1], weapons: result[2] })
            });

        } else {
            res.redirect("/officers/login")

        }
    },
    officerApplyPage: (req, res) => {
        res.send("sd")
    }
}

