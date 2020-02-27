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
        if (req.session.PDloggedin) {
            let qeury = "SELECT * FROM `officers` ORDER by id ASC"
            connection.query(qeury, (err, result) => {
                if (err) {
                    console.log("Error" + err)
                }
                res.render("officers-pages/officers.ejs", {
                    title: "Equinox Officers",
                    users: "qsd",
                    isAdmin: req.session.admin,
                    officers: result
                })

            })

        } else {
            res.redirect("/officers/login")
        }

    },
    tabletPage: (req, res) => {
        if (req.session.PDloggedin) {
            res.render("officers-pages/tablet.ejs", {
                title: "Officers Tablet",
                fetch: fetch("http://95.179.141.103:8000/businesses").then(url => {
                    url.json("http://95.179.141.103:8000/businesses").then(result => {})
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
                .then(json => res.render("officers-pages/penal-codes.ejs", {
                    title: "Penal Codes | Equinox CAD",
                    penals: json,
                    isAdmin: req.session.admin
                }))
        } else {
            res.redirect("/officers/login")

        }


    },
    officersDash: (req, res) => {
        if (req.session.PDloggedin) {

            res.render("officers-pages/officers-dash.ejs", {
                title: "Police Department",
                isAdmin: req.session.admin
            })

        } else {
            res.redirect("/officers/login")

        }
    },
    searchPlatePage: (req, res) => {
        if (req.session.PDloggedin) {
            let query = "SELECT * FROM `registered_cars` ORDER by id ASC"
            connection.query(query, (err, result) => {
                res.render("officers-pages/plate.ejs", {
                    title: "Plate Search | Police Department",
                    isAdmin: req.session.admin,
                    plates: result
                })
            })

        } else {
            res.redirect("/officers/login")

        }
    },
    searchNamePage: (req, res) => {
        if (req.session.PDloggedin) {
            let query = "SELECT * FROM `citizens` ORDER by id ASC"

            connection.query(query, (err, result) => {
                res.render("officers-pages/name.ejs", {
                    title: "Name Search | Police Department",
                    isAdmin: req.session.admin,
                    information: result
                })

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

            connection.query(`${query}; ${query2};`, (err, result) => {
                if (err) {
                    return res.status(404).send(err);
                }

                res.render("officers-pages/plate-results.ejs", {
                    title: "Plate Results | Police Department",
                    isAdmin: req.session.admin,
                    plates: result[0][0],
                    name: result[1][0]
                })
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
            let owner = req.params.first_name;
            let chargeQ = "SELECT * FROM `posted_charges` WHERE `name` = '" + owner + "'"
            let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "'"
            let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + owner + "'"
            let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";


            connection.query(`${query}; ${vehiclesQ}; ${weaponsQ}; ${chargeQ}`, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.render("officers-pages/name-results.ejs", {
                    title: "Name Results | Police Department",
                    isAdmin: req.session.admin,
                    result: result[0][0],
                    vehicles: result[1],
                    weapons: result[2],
                    charges: result[3]
                })
            });

        } else {
            res.redirect("/officers/login")

        }
    },
    officerApplyPage: (req, res) => {
        res.send("sd")
    },
    addOffencePage: (req, res) => {
        if (req.session.PDloggedin) {
            const url = "http://95.179.141.103:3000";
            fetch(url)
                .then(res => res.json())
                .then(json => res.render("officers-pages/add-offence.ejs", {
                    title: "Add Offence | Equinox CAD",
                    penals: json,
                    isAdmin: req.session.admin,
                    req: req
                }))
        } else {
            res.redirect('/officers/login')
        }

    },
    addOffence: (req, res) => {
        let name = req.body.name;
        let offence = req.body.offence;
        let date = req.body.date;
        let officer_name = req.body.officer_name;
        let notes = req.body.notes;
        if (notes == "") {
            notes = "None"
        }

        let query = "INSERT INTO `posted_charges` ( `name`, `charge`, `notes`, `officer_name`, `date`) VALUES ('" + name + "','" + offence + "','" + notes + "','" + officer_name + "','" + date + "')";
        connection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect(`/officers/dash/search/person-name`);
        });
    },
    officerLoginPage: (req, res) => {
        res.render("officers-pages/login.ejs", {
            title: "Police Login | Equinox CAD",
            message: "",
            isAdmin: req.session.admin,
            loggedIn: req.session.loggedin
        })
    },
    officerLogin: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            connection.query('SELECT * FROM `officer-acc` WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    req.session.PDloggedin = true;
                    req.session.username = username;
                    res.redirect('/myofficers');
                } else {
                    res.render("officers-pages/login.ejs", {
                        title: 'Police Dept.',
                        isAdmin: req.session.admin,
                        message: "Wrong Username or Password"
                    })
                    // res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.isAdmin })
    
                }
                res.end();
            });
        } else {
            res.render("officers-pages/login.ejs", {
                title: 'Police Dept.',
                isAdmin: req.session.admin,
                message: "Something went wrong! Please try again"
            })
    
            res.end();
        }
    }
}