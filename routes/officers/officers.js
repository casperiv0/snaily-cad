const router = require("express").Router();
const fs = require("fs");

// My Officers Page
router.get("/myofficers", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?"
    let cads = "SELECT * FROM `cad_info`";
    connection.query(cads, (err, result43) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].leo == 'yes') {
                        let query = "SELECT * FROM `officers` WHERE linked_to = ?"
                        let q1 = "SELECT * FROM `officers`"
                        connection.query(`${query}; ${q1}`, [req.session.username2], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("officers-pages/officers.ejs", {
                                    title: "Police Department | SnailyCAD",
                                    users: "qsd",
                                    desc: "",
                                    isAdmin: result1[0].rank,
                                    officers: result[0],
                                    allofficers: result[1],
                                    cad: result43[0]
                                });
                            }
                        });
                    } else {
                        res.render("403.ejs", { desc: "", title: "unauthorized", isAdmin: result1[0].rank, message: "If you'd like to be an officer, Please let a higher up know in your server." })
                    };
                }
            });
        }
    });
});

// Add Officer Page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            let query = "SELECT * FROM `departments`";
            connection.query(query, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result1[0].leo == 'yes') {
                        res.render("officers-pages/add-officers.ejs", { desc: "", title: "Add Officer | SnailyCAD", isAdmin: result1[0].rank, req: req, depts: results });
                    } else {

                    };
                };
            });
        };
    });
})

// Add Officer
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0].leo == 'yes') {
                let officer_name = req.body.officer_name;
                let dept = req.body.dept;
                if (dept === undefined) {
                    dept = "Unknown"
                }
                let query = "INSERT INTO `officers` ( `officer_name`,`officer_dept`,`linked_to`,`status`,`status2`) VALUES (?, ?, ?, ?, ?)";

                connection.query(query, [officer_name, dept, req.session.username2, '10-42 | 10-7', '----------'], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        res.redirect(`/officers/myofficers`)
                    }
                })
            } else {
                res.render("403.ejs", { desc: "", title: "unauthorized", isAdmin: result1[0].rank, message: "If you'd like to be an officer, Please let a higher up know in your server." })
            };
        };
    });
});

// Officers Dashboard
router.get("/dash", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?"
    const bolosQ = "SELECT * FROM `bolos`";
    const calls = "SELECT * FROM `911calls`"
    const citizensQ = "SELECT * FROM `citizens`";
    const activeOfficers = "SELECT * FROM `officers` WHERE `status` = ?"
    const myOfficers = "SELECT * FROM `officers` WHERE `linked_to` = ?"
    connection.query(`${query};`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            connection.query(`${bolosQ}; ${calls}; ${citizensQ}; ${activeOfficers}; ${myOfficers}`, ["10-41 | 10-8", req.session.username2], (err, result5) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].leo == 'yes') {
                        const rawPenalCodes = fs.readFileSync(__dirname + '/penal-codes.json');
                        const penalCodes = JSON.parse(rawPenalCodes)
                        res.render("officers-pages/officers-dash.ejs", {
                            title: "Police Department",
                            isAdmin: result[0].rank,
                            current: result[0],
                            desc: "",
                            officer: "",
                            bolos: result5[0],
                            penals: penalCodes,
                            citizens: result5[2],
                            calls: result5[1],
                            messageG: "",
                            officers: result5[3],
                            myOfficers: result5[4]
                        });
                    } else {
                        res.render("403.ejs", { desc: "", title: "unauthorized", isAdmin: result[0].rank, message: "If you'd like to be an officer, Please let a higher up know in your server." })
                    };
                };
            });
        };
    });
});

// Penal Codes Page
router.get("/penal-codes", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].leo == 'yes') {
                const rawPenalCodes = fs.readFileSync(__dirname + '/penal-codes.json');
                const penalCodes = JSON.parse(rawPenalCodes)
                res.render("officers-pages/penal-codes.ejs", {
                    title: "Penal Codes | SnailyCAD",
                    desc: "",
                    penalCodes: penalCodes,
                    isAdmin: result[0].rank
                })
            } else {
                res.render("403.ejs", { desc: "", title: "unauthorized", isAdmin: result[0].rank, message: "If you'd like to be an officer, Please let a higher up know in your server." })
            };
        };
    });
});

// 10 Codes Page
router.get("/codes", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].leo == 'yes') {
                    res.render("officers-pages/codes.ejs", { desc: "All the 10 codes you should know when going on duty", title: "10 Codes | SnailyCAD", isAdmin: result[0].rank })
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("Something went during the request!");
            };
        };
    });
})

// Add Ticket
router.post("/dash/add-offence", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].leo == 'yes') {
                    const d = new Date();
                    const name = req.body.name;
                    const violations = req.body.violations;
                    const date = d.toLocaleString();
                    const officer_name = req.body.officer_name;
                    const postal = req.body.postal;
                    let notes = req.body.notes;
                    if (notes == "") {
                        notes = "None";
                    };

                    let query = "INSERT INTO `posted_charges` (`name`, `charge`, `ticket_amount`, `notes`, `officer_name`, `date`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    connection.query(query, [name, violations, 0, notes, officer_name, date, postal], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let query = "SELECT * FROM `users` WHERE username = ?"
                            connection.query(query, [req.session.username2], (err, result1) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    if (result1[0].leo == 'yes') {
                                        res.redirect("/officers/dash")
                                    } else {
                                        res.sendStatus(403);
                                    };
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("Something went wrong during the request")
            }
        }
    });
});

// Add Arrest Report
router.post("/dash/create-arrest-report", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].leo === "yes") {
                    const d = new Date();
                    const name = req.body.name;
                    const officer_name = req.body.officer_name;
                    const charges = req.body.charges;
                    const date = d.toLocaleString();
                    const postal = req.body.postal;
                    let notes = req.body.notes;
                    if (notes == "") {
                        notes = "None";
                    };

                    let query = "INSERT INTO `arrest_reports` (`name`, `date`, `charges`, `officer_name`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?)";
                    connection.query(query, [name, date, charges, officer_name, notes, postal], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result[0].leo == 'yes') {
                                res.redirect("/officers/dash")
                            } else {
                                res.sendStatus(403);
                            };
                        };
                    });
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.send("Something went wrong during the request")
            }
        }
    })
})

// Create Written Warning
router.post("/dash/create-written-warning", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].leo === "yes") {
                    const d = new Date();
                    const name = req.body.name;
                    const officer_name = req.body.officer_name;
                    const infractions = req.body.infractions;
                    const date = d.toLocaleString();
                    const postal = req.body.postal;
                    let notes = req.body.notes;
                    if (notes == "") {
                        notes = "None";
                    };

                    let query = "INSERT INTO `written_warnings` (`name`, `date`, `infractions`, `officer_name`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?)";
                    connection.query(query, [name, date, infractions, officer_name, notes, postal], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result[0].leo == 'yes') {
                                res.redirect("/officers/dash")
                            } else {
                                res.sendStatus(403);
                            };
                        };
                    });
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.send("Something went wrong during the request")
            }
        }
    })
})


// SEARCHES
// Name Search
router.get("/api/name/:name", (req, res) => {
    const warrants = "SELECT * FROM `warrants` WHERE `name` = ?";
    const citizen = "SELECT * FROM `citizens` WHERE `full_name` = ?";
    const tickets = "SELECT * FROM `posted_charges` WHERE `name` = ?";
    const arrest_reports = "SELECT * FROM `arrest_reports` WHERE `name` = ?";
    const written_warnings = "SELECT * FROM `written_warnings` WHERE `name` = ?"


    connection.query(`${warrants}; ${citizen}; ${tickets}; ${arrest_reports}; ${written_warnings}`, [req.params.name, req.params.name, req.params.name, req.params.name, req.params.name], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json(result);
        };
    });
});
// Plate Search
router.get("/api/plate/:plate", (req, res) => {
    const query = "SELECT * FROM `registered_cars` WHERE  `plate` = ?"

    connection.query(`${query};`, [req.params.plate], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.json(result);
        };
    });
});
// Weapon Search
router.get("/api/weapon/:serial", (req, res) => {    
    const query = "SELECT * FROM `registered_weapons` WHERE `serial_number` = ?"

    connection.query(`${query};`, [req.params.serial], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.json(result);
        };
    });
});


// Quick Update status
router.get("/dash/status/:status-:officerId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].leo === "yes") {
                const query = "UPDATE"
            } else {
                res.sendStatus(403);
            };
        };
    });
});

// Update status
router.post("/update-status/:officerId", (req, res) => {
    const id = req.params.officerId
    let status = req.body.status;
    let status2 = req.body.status2;

    if (status2 !== undefined) {
        status = "10-41 | 10-8"
    }
    if (status2 === "10-42 | 10-7") {
        status = "10-42 | 10-7"
        status2 = "----------"
    }
    let query1 = "UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `officers`.`id` = ?"
    connection.query(`${query1};`, [status, status2, id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/officers/myofficers`);
        };
    });
});

// Delete Officer
router.get("/delete/:officerId", (req, res) => {
    const id = req.params.officerId

    let query1 = "DELETE FROM `officers` WHERE `officers`.`id` = ?"
    connection.query(`${query1};`, [id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/officers/myofficers`);
        };
    });
});


module.exports = router;