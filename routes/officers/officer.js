const fetch = require("node-fetch")
const fs = require("fs")
module.exports = {
    officersPage: (req, res, next) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            let cads = "SELECT * FROM `cad_info`";
            connection.query(cads, (err, result43) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection.query(query, (err, result1) => {
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
                            res.render("officers-pages/403.ejs", { desc: "", title: "unauthorized | SnailyCAD", isAdmin: "" })
                        };
                    });
                }
            });
        } else {
            res.redirect("/login")
        };
    },
    addOfficerPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
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
                                res.sendStatus(403);
                            };
                        };
                    });
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    addOfficer: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result1) => {
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
                                res.redirect(`/myofficers`)
                            }
                        })
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        };
    },
    penalCodesPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
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
                            penals: penalCodes,
                            isAdmin: result[0].rank
                        })
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`);
        }
    },
    officersDash: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = ?"
            let bolosQ = "SELECT * FROM `bolos`";
            let calls = "SELECT * FROM `911calls`"
            let citizensQ = "SELECT * FROM `citizens`"
            connection.query(`${query};`, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection.query(`${bolosQ}; ${calls}; ${citizensQ}`, (err, result5) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result[0].leo == 'yes') {
                                const url = "http://95.179.141.103:3000";
                                fetch(url)
                                    .then(res => res.json())
                                    .then(json => res.render("officers-pages/officers-dash.ejs", {
                                        title: "Police Department",
                                        isAdmin: result[0].rank,
                                        current: result[0],
                                        desc: "",
                                        officer: "",
                                        bolos: result5[0],
                                        penals: json,
                                        citizens: result5[2],
                                        calls: result5[1],
                                        messageG: ""
                                    }));
                            } else {
                                res.sendStatus(403);
                            };
                        };
                    });
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    officerOffencer: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query,[req.session.username2],  (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].leo == 'yes') {
                            let d = new Date()
                            let name = req.body.name;
                            let offence = req.body.offence;
                            let date = d.toLocaleString();
                            let officer_name = req.body.officer_name;
                            let postal = req.body.postal;
                            let notes = req.body.notes;
                            if (notes == "") {
                                notes = "None";
                            };

                            let query = "INSERT INTO `posted_charges` (`name`, `charge`, `notes`, `officer_name`, `date`, `postal`) VALUES (?, ?, ?, ?, ?, ?)";
                            connection.query(query, [name, offence, notes, officer_name, date, postal], (err) => {
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
        } else {
            res.redirect(`/login`)
        };
    },
    suspendLicensePlate: (req, res) => {
        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

        connection.query(query2, (err, result2) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                if (result2[0]) {
                    let id = req.params.id
                    let query = "SELECT * FROM `citizens` WHERE id = '" + id + "'";
                    let query2 = "UPDATE `citizens` SET `dmv` = 'Suspended' WHERE `citizens`.`id` = '" + id + "'"
                    connection.query(query, (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            connection.query(query2, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    return res.sendStatus(500);
                                } else {
                                    let query = "SELECT * FROM `registered_cars` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC";
                                    connection.query(query, (err, result) => {
                                        res.render("officers-pages/plate.ejs", {
                                            title: "Plate Search | Police Department",
                                            desc: "",
                                            isAdmin: result1[0].rank,
                                            plates: result,
                                            cadId: result2[0].cadID,
                                            messageG: "License was successfully suspended"
                                        });
                                    });
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(404);
                };
            };
        });
    },
    suspendLicenseName: (req, res) => {
        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

        if (req.path.includes("dmv")) {
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {

                        let id = req.params.id;
                        let query = "SELECT * FROM `citizens` WHERE id = '" + id + "'";
                        let query2 = "UPDATE `citizens` SET `dmv` = 'Suspended' WHERE `citizens`.`id` = '" + id + "'"
                        connection.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    connection.query(query2, (err, result3) => {
                                        if (err) {
                                            console.log(err)
                                            return res.sendStatus(500);
                                        } else {
                                            let query = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"

                                            connection.query(query, (err, result) => {
                                                res.render("officers-pages/name.ejs", {
                                                    desc: "",
                                                    title: "Name Search | Police Department",
                                                    isAdmin: result1[0].rank,
                                                    information: result,
                                                    cadId: result2[0].cadID,
                                                    messageG: "Drivers License was successfully suspended",
                                                });
                                            });
                                        };
                                    });
                                } else {
                                    res.send("Something went during the request!")
                                }
                            }
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else if (req.path.includes("pilot")) {
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {

                        let id = req.params.id;
                        let query = "SELECT * FROM `citizens` WHERE id = '" + id + "'";
                        let query2 = "UPDATE `citizens` SET `pilot_licence` = 'Suspended' WHERE `citizens`.`id` = '" + id + "'"
                        connection.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    connection.query(query2, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            return res.sendStatus(500);
                                        } else {
                                            let query = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"

                                            connection.query(query, (err, result) => {
                                                res.render("officers-pages/name.ejs", {
                                                    title: "Name Search | Police Department",
                                                    desc: "",
                                                    isAdmin: result1[0].rank,
                                                    information: result,
                                                    cadId: result2[0].cadID,
                                                    messageG: "Pilot License was successfully suspended",
                                                });
                                            });
                                        };
                                    });
                                } else {
                                    res.send("Something went during the request!")
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else if (req.path.includes("fire")) {
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {

                        let id = req.params.id;
                        let query = "SELECT * FROM `citizens` WHERE id = '" + id + "'";
                        let query2 = "UPDATE `citizens` SET `fire_licence` = 'Suspended' WHERE `citizens`.`id` = '" + id + "'"
                        connection.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    connection.query(query2, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            return res.sendStatus(500);
                                        } else {
                                            let query = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"

                                            connection.query(query, (err, result) => {
                                                res.render("officers-pages/name.ejs", {
                                                    desc: "",
                                                    title: "Name Search | Police Department",
                                                    isAdmin: result1[0].rank,
                                                    information: result,
                                                    cadId: result2[0].cadID,
                                                    messageG: "Firearms License was successfully suspended",
                                                });
                                            });
                                        };
                                    });
                                } else {
                                    res.send("Something went during the request!")
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let id = req.params.id;
                        let query = "SELECT * FROM `citizens` WHERE id = '" + id + "'";
                        let query2 = "UPDATE `citizens` SET `ccw` = 'Suspended' WHERE `citizens`.`id` = '" + id + "'"
                        connection.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    connection.query(query2, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            return res.sendStatus(500);
                                        } else {
                                            let query = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"

                                            connection.query(query, (err, result) => {
                                                res.render("officers-pages/name.ejs", {
                                                    desc: "",
                                                    title: "Name Search | Police Department",
                                                    isAdmin: result1[0].rank,
                                                    information: result,
                                                    cadId: result2[0].cadID,
                                                    messageG: "CCW was successfully suspended",
                                                });
                                            });
                                        };
                                    });
                                } else {
                                    res.send("Something went during the request!")
                                }
                            }
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        }
    },
    statusChange: (req, res) => {
        let id = req.body.id
        let status = req.body.status;
        let status2 = req.body.status2;
        if (status === "10-42 | 10-7") {
            status2 = "----------"
        }
        if (status2 === undefined) {
            status2 = "----------"
        }
        let query1 = "UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `officers`.`id` = ?"
        connection.query(`${query1};`, [status, status2, id], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/myofficers`);
            };
        });
    },
    codesPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
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
        } else {
            res.redirect("/login")
        };
    },
    officerBolo: (req, res) => {
        let boloDesc = req.body.bolo_desc;

        let query = "INSERT INTO `bolos` (`description`) VALUES (?)"
        connection.query(query, [boloDesc], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/officers/dash`);
            };
        });
    },
    removeOfficerBolo: (req, res) => {
        let boloId = req.params.boloId;

        let query = "DELETE FROM `bolos` WHERE `id` = ?"
        connection.query(query, [boloId], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/officers/dash`);
            };
        });
    },
    officerAPI: (req, res) => {
        let warrants = "SELECT * FROM `warrants` WHERE `name` = ?"
        let citizen = "SELECT * FROM `citizens` WHERE `full_name` = ?"
        let charges = "SELECT * FROM `posted_charges` WHERE `name` = ?"

        connection.query(`${warrants}; ${citizen}; ${charges}`, [req.params.name, req.params.name, req.params.name], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.json(result)
            }
        })
    },
    quickWarrant: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].leo == 'yes') {
                            let name = req.body.name;
                            let d_from = req.body.d_from;
                            let d_to = req.body.d_to;
                            let reason = req.body.reason
                            let query = "INSERT INTO `warrants` ( `name`, `reason`, `d_from`, `d_to`) VALUES (?, ?, ?, ?)";

                            connection.query(query, [name, reason, d_from, d_to], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/officers/dash`);
                                };
                            });
                        } else {
                            res.sendStatus(403);
                        };
                    } else {
                        res.send("Something went wrong during the request");
                    };
                };
            });
        } else {
            res.redirect("/login")
        };
    },
    officerAPIPlate: (req, res) => {
        let cars = "SELECT * FROM `registered_cars` WHERE  `plate` = ?"

        connection.query(`${cars};`, [req.params.plate], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.json(result)
            }
        })
    },
    officerAPIWeapon: (req, res) => {
        let serials = "SELECT * FROM `registered_weapons` WHERE `serial_number` = ?"

        connection.query(`${serials};`, [req.params.serial], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.json(result)
            }
        })
    },
    cancelCall911: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].leo === 'yes') {
                            let query = "DELETE FROM `911calls` WHERE `id` = ?"
                            connection.query(query, [req.params.id, req.params.cadID], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/officers/dash`);
                                };
                            });
                        } else {
                            res.sendStatus(403);
                        };
                    } else {
                        res.send("Something went wrong during the request");
                    };
                };
            });
        } else {
            res.redirect("/login")
        }
    },
    update911call: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].leo === 'yes') {
                            let query = "UPDATE `911calls` SET `location` = ?, `status` = ? WHERE `911calls`.`id` = ?"
                            connection.query(query, [req.body.location, req.body.status, req.params.id], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/officers/dash`);
                                };
                            });
                        } else {
                            res.sendStatus(403);
                        };
                    } else {
                        res.send("Something went wrong during the request");
                    };
                };
            });
        } else {
            res.redirect("/login")
        }
    }
};