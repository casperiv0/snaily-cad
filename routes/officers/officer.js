const fetch = require("node-fetch")
module.exports = {
    officersPage: (req, res, next) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        let cads = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'";
                        connection1.query(cads, (err, result43) => {
                            if (err) {
                                return console.log(err)
                            } else {
                                connection1.query(query, (err, result1) => {
                                    if (result1[0].leo == 'yes') {
                                        let qeury = "SELECT * FROM `officers` WHERE linked_to = '" + req.session.username2 + "' AND cadID = '" + req.params.cadID + "'"
                                        let q1 = "SELECT * FROM `officers` WHERE `cadID` = '" + req.params.cadID + "'"
                                        connection.query(`${qeury}; ${q1}`, (err, result) => {
                                            if (err) {
                                                console.log("Error" + err)
                                            }
                                            res.render("officers-pages/officers.ejs", {
                                                title: "Police Department | SnailyCAD",
                                                users: "qsd",
                                                desc: "",
                                                isAdmin: result1[0].admin,
                                                officers: result[0],
                                                allofficers: result[1],
                                                cadId: result2[0].cadID,
                                                cad: result43[0]
                                            });

                                        });
                                    } else {
                                        res.render("officers-pages/403.ejs", { desc: "", title: "unauthorized | SnailyCAD", isAdmin: "", cadId: result2[0].cadID })
                                    };
                                });
                            }
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    addOfficerPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                let query = "SELECT * FROM `deptartments` WHERE `cadID` = '" + req.params.cadID + "'";
                                connection.query(query, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        if (result1[0].leo == 'yes') {
                                            res.render("officers-pages/add-officers.ejs", { desc: "", title: "Add Officer | SnailyCAD", isAdmin: result1[0].admin, req: req, cadId: result2[0].cadID, depts: results });
                                        } else {
                                            res.sendStatus(403);
                                        };
                                    };
                                });
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    addOfficer: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].leo == 'yes') {
                                let officer_name = req.body.officer_name;
                                let dept = req.body.dept;
                                if (dept === undefined) {
                                    dept = "Unknown"
                                }
                                let cadID = req.params.cadID
                                let query = "INSERT INTO `officers` ( `officer_name`,`officer_dept`,`linked_to`,`status`,`status2`,`cadID`) VALUES ('" + officer_name + "','" + dept + "','" + req.session.username2 + "','10-42 | 10-7','----------', '" + cadID + "')";

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/cad/${result2[0].cadID}/myofficers`)
                                    }
                                })
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        };
    },
    penalCodesPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].leo == 'yes') {
                                const url = "http://95.179.141.103:3000";
                                fetch(url)
                                    .then(res => res.json())
                                    .then(json => res.render("officers-pages/penal-codes.ejs", {
                                        title: "Penal Codes | SnailyCAD",
                                        desc: "",
                                        penals: json,
                                        isAdmin: result[0].admin
                                        , cadId: result2[0].cadID
                                    }));
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404); // CAD not found
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        }
    },
    officersDash: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        let bolosQ = "SELECT * FROM `bolos` WHERE `cadID` = '" + req.params.cadID + "'"
                        connection1.query(`${query};`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                connection.query(bolosQ, (err, result5) => {
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
                                                    isAdmin: result[0].admin,
                                                    current: result[0],
                                                    desc: "",
                                                    officer: "",
                                                    cadId: result2[0].cadID,
                                                    bolos: result5,
                                                    penals: json,
                                                    messageG: "The Realistic Version is still in development."
                                                }));
                                        } else {
                                            res.sendStatus(403);
                                        };
                                    }
                                })

                            }
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        }
    },
    searchPlatePage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].leo == 'yes') {
                                let query = "SELECT * FROM `registered_cars` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"
                                connection.query(query, (err, result) => {
                                    res.render("officers-pages/plate.ejs", {
                                        desc: "",
                                        title: "Plate Search | Police Department",
                                        isAdmin: result1[0].admin,
                                        plates: result
                                        , cadId: result2[0].cadID,
                                        messageG: "",
                                    })
                                })
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        }
    },
    searchNamePage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].leo == 'yes') {
                                let query2 = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"

                                connection.query(query2, (err, result) => {
                                    res.render("officers-pages/name.ejs", {
                                        desc: "",
                                        title: "Name Search | Police Department",
                                        isAdmin: result1[0].admin,
                                        information: result,
                                        cadId: result2[0].cadID,
                                        messageG: "",
                                    });
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            });
        };
    },
    plateResultsPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    if (result1[0].leo == 'yes') {
                                        let id = req.params.id;
                                        let query = "SELECT * FROM `registered_cars` WHERE id = '" + id + "' ";
                                        let getOwner = req.params.owner;
                                        let warrantsQ = "SELECT * FROM `warrants` WHERE `name` = '" + getOwner + "'"
                                        let query2 = "SELECT * FROM `citizens` WHERE full_name = '" + getOwner + "'"

                                        connection.query(`${query}; ${query2}; ${warrantsQ};`, (err, result) => {
                                            if (err) {
                                                return res.status(404).send(err);
                                            }
                                            res.render("officers-pages/plate-results.ejs", {
                                                desc: "",
                                                title: "Plate Results | Police Department",
                                                isAdmin: result1[0].admin,
                                                plates: result[0][0],
                                                name: result[1][0],
                                                warrants: result[2][0]
                                                , cadId: result2[0].cadID
                                            })
                                        });
                                    } else {
                                        res.sendStatus(403);
                                    };
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        }
    },
    nameResultsPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    if (result1[0].leo == 'yes') {
                                        let id = req.params.id;
                                        let first_name = req.params.first_name;
                                        let last_name = req.params.last_name;
                                        let owner = req.params.first_name;
                                        let chargeQ = "SELECT * FROM `posted_charges` WHERE `name` = '" + owner + "' AND `cadID` = '" + req.params.cadID + "'";
                                        let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "'AND `cadID` = '" + req.params.cadID + "'";
                                        let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + owner + "'AND `cadID` = '" + req.params.cadID + "'";
                                        let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
                                        let warrantsQ = "SELECT * FROM `warrants` WHERE name = '" + owner + "' AND `cadID` = '" + req.params.cadID + "'";


                                        connection.query(`${query}; ${vehiclesQ}; ${weaponsQ}; ${chargeQ}; ${warrantsQ}`, (err, result) => {
                                            if (err) {
                                                return res.status(500).send(err);
                                            } else {
                                                res.render("officers-pages/name-results.ejs", {
                                                    desc: "",
                                                    title: "Name Results | Police Department",
                                                    isAdmin: result1[0].admin,
                                                    cadId: result2[0].cadID,
                                                    result: result[0][0],
                                                    vehicles: result[1],
                                                    weapons: result[2],
                                                    charges: result[3],
                                                    warrants: result[4]
                                                });
                                            };
                                        });
                                    } else {
                                        res.sendStatus(403);
                                    };
                                } else {
                                    res.send("Something went wrong in the request!");
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    officerApplyPage: (req, res) => {
        res.render("officers-pages/apply.ejs", {
            title: "Apply | SnailyCAD",
            desc: "",
            isAdmin: req.session.isAdmin
        })
    },
    officerApply: (req, res) => {
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
    },
    addOffencePage: (req, res) => {

        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].leo == 'yes') {
                                const url = "http://95.179.141.103:3000";
                                fetch(url)
                                    .then(res => res.json())
                                    .then(json => res.render("officers-pages/add-offence.ejs", {
                                        desc: "",
                                        title: "Add Offence | SnailyCAD",
                                        penals: json,
                                        isAdmin: result[0].admin,
                                        req: req
                                        , cadId: result2[0].cadID
                                    }))
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        }
    },
    addOffence: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
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

                                    // '" + name + "','" + offence + "','" + notes + "','" + officer_name + "','" + date + "', '" + postal + "', '" + req.params.cadID + "'
                                    let query = "INSERT INTO `posted_charges` (`name`, `charge`, `notes`, `officer_name`, `date`, `postal`, `cadID`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                                    connection.query(query, [name, offence, notes, officer_name, date, postal, req.params.cadID], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                                            connection1.query(query, (err, result1) => {
                                                if (result1[0].leo == 'yes') {
                                                    let query2 = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"
                                                    connection.query(query2, async (err, result5) => {
                                                        res.render("officers-pages/name.ejs", {
                                                            desc: "",
                                                            title: "Name Search | Police Department",
                                                            isAdmin: result1[0].admin,
                                                            information: result5,
                                                            cadId: result2[0].cadID,
                                                            messageG: `Successfully posted offence to ${name}`,
                                                        });
                                                        res.end();
                                                    });
                                                } else {
                                                    res.sendStatus(403);
                                                };
                                            });
                                        };
                                    });
                                } else {
                                    res.sendStatus(403);
                                };
                            } else {
                                res.send("Something went wrong during the request");
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    officerOffencer: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
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

                                    let query = "INSERT INTO `posted_charges` (`name`, `charge`, `notes`, `officer_name`, `date`, `postal`, `cadID`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                                    connection.query(query, [name, offence, notes, officer_name, date, postal, req.params.cadID], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                                            connection1.query(query, (err, result1) => {
                                                if (result1[0].leo == 'yes') {
                                                    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

                                                    connection1.query(query2, (err, result2) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.sendStatus(500);
                                                        } else {
                                                            if (result2[0]) {
                                                                let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                                                                let bolosQ = "SELECT * FROM `bolos` WHERE `cadID` = '" + req.params.cadID + "'"
                                                                connection1.query(`${query};`, (err, result) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        return res.sendStatus(500)
                                                                    } else {
                                                                        connection.query(bolosQ, (err, result5) => {
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
                                                                                            isAdmin: result[0].admin,
                                                                                            current: result[0],
                                                                                            desc: "",
                                                                                            officer: "",
                                                                                            cadId: result2[0].cadID,
                                                                                            bolos: result5,
                                                                                            penals: json,
                                                                                            messageG: "Successfully Added Offence/Charge"
                                                                                        }));
                                                                                } else {
                                                                                    res.sendStatus(403);
                                                                                };
                                                                            }
                                                                        })

                                                                    }
                                                                });
                                                            } else {
                                                                res.sendStatus(404)
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    res.sendStatus(403);
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
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    addWarrantPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result[0]) {
                                    if (result[0].leo == 'yes') {
                                        res.render("officers-pages/warrant.ejs", { desc: "", title: "Add Warrant | SnailyCAD", isAdmin: result[0].admin, req: req, cadId: result2[0].cadID })
                                    } else {
                                        res.sendStatus(403);
                                    };
                                } else {
                                    res.send("Something went wrong during the request");
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    addWarrant: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
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
                                        let query = "INSERT INTO `warrants` ( `name`, `reason`, `d_from`, `d_to`, `cadID`) VALUES ('" + name + "','" + reason + "','" + d_from + "','" + d_to + "', '" + req.params.cadID + "')";

                                        connection.query(query, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500);
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/officers/dash/search/person-name`);
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
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    suspendLicensePlate: (req, res) => {
        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

        connection1.query(query2, (err, result2) => {
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
                                            isAdmin: result1[0].admin,
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
            connection1.query(query2, (err, result2) => {
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
                                                    isAdmin: result1[0].admin,
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
            connection1.query(query2, (err, result2) => {
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
                                                    isAdmin: result1[0].admin,
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
            connection1.query(query2, (err, result2) => {
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
                                                    isAdmin: result1[0].admin,
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
            connection1.query(query2, (err, result2) => {
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
                                                    isAdmin: result1[0].admin,
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
        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

        connection1.query(query2, (err, result2) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                if (result2[0]) {
                    let id = req.body.id
                    let status = req.body.status;
                    let status2 = req.body.status2;
                    if (status === "10-42 | 10-7") {
                        status2 = "----------"
                    }
                    if (status2 === undefined) {
                        status2 = "----------"
                    }
                    let query1 = "UPDATE `officers` SET `status` = '" + status + "' WHERE `officers`.`id` = '" + id + "'"
                    let query2 = "UPDATE `officers` SET `status2` = '" + status2 + "' WHERE `officers`.`id` = '" + id + "'"
                    connection.query(`${query1}; ${query2};`, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.redirect(`/cad/${result2[0].cadID}/myofficers`);
                        };
                    });
                } else {
                    res.sendStatus(404);
                };
            };
        });
    },
    codesPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result[0]) {
                                    if (result[0].leo == 'yes') {
                                        res.render("officers-pages/codes.ejs", { desc: "All the 10 codes you should know when going on duty", title: "10 Codes | SnailyCAD", isAdmin: result[0].admin, cadId: result2[0].cadID })
                                    } else {
                                        res.sendStatus(403);
                                    };
                                } else {
                                    res.send("Something went during the request!");
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    officerBolo: (req, res) => {
        let boloDesc = req.body.bolo_desc;
        let cadID = req.params.cadID;

        let query = "INSERT INTO `bolos` (`description`, `cadID`) VALUES (?, ?)"
        connection.query(query, [boloDesc, cadID], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.redirect(`/cad/${result2[0].cadID}/officers/dash`);
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            };
        });
    },
    removeOfficerBolo: (req, res) => {
        let boloId = req.body.boloID;
        let cadID = req.params.cadID;

        let query = "DELETE FROM `bolos` WHERE `id` = '" + boloId + "' AND `cadID` = '" + cadID + "' "
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.redirect(`/cad/${result2[0].cadID}/officers/dash`);
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            };
        });
    },
    versionChange: (req, res) => {
        if (req.path.includes("compact")) {
            let query = "UPDATE `users` SET `leo_dash` = ? WHERE `username` = ?"

            connection1.query(query, ['1', req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/officers/dash`);
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                }
            })
        } else {
            let query = "UPDATE `users` SET `leo_dash` = ? WHERE `username` = ?"

            connection1.query(query, ['2', req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/officers/dash`);
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                };
            });
        };
    },
    officerNameSearch: (req, res) => {
        if (req.session.loggedin) {
            let searchQ = req.body.name;
            let query = "SELECT * FROM `citizens` WHERE `full_name` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let vehicles = "SELECT * FROM `registered_cars` WHERE `owner` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let weapon = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let charge = "SELECT * FROM `posted_charges` WHERE `name` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let warrantsQ = "SELECT * FROM `warrants` WHERE `name` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'"

            connection.query(`${query}; ${vehicles}; ${weapon}; ${charge}; ${warrantsQ}`, (err, result) => {
                if (err) {
                    return console.log(err);
                } else {
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.render("officers-pages/name-results.ejs", { desc: "", title: "Dispatch | SnailyCAD", isAdmin: "", result: result[0][0], vehicles: result[1], weapons: result[2], charges: result[3], cadId: result2[0].cadID, warrants: result[4] });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            });
        }
    },
    officerPlateSearch: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result1[0]) {
                                    if (result1[0].leo == 'yes') {
                                        let plate = req.body.plate
                                        let query = "SELECT * FROM `registered_cars` WHERE plate = '" + plate + "' AND `cadID` = '" + req.params.cadID + "'";


                                        connection.query(`${query};`, (err, result) => {
                                            if (err) {
                                                return res.status(404).send(err);
                                            } else {
                                                
                                                if (result[0]) {
                                                    let warrantsQ = "SELECT * FROM `warrants` WHERE `name` = '" + result[0].owner + "'"
                                                    let query2 = "SELECT * FROM `citizens` WHERE full_name = '" + result[0].owner + "'"

                                                    connection.query(`${query2}; ${warrantsQ}`, (err, result23) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.sendStatus(500)
                                                        } else {
                                                            console.log(result[0]);

                                                            res.render("officers-pages/plate-results.ejs", {
                                                                desc: "",
                                                                title: "Plate Results | Police Department",
                                                                isAdmin: result1[0].admin,
                                                                plates: result[0],
                                                                name: result23[0][0],
                                                                warrants: result23[1][0],
                                                                cadId: result2[0].cadID
                                                            });
                                                        }
                                                    })
                                                } else {
                                                    res.send("<h1 class=\"text-center text-light\">Plate not found</h1>")
                                                };
                                            };
                                        });
                                    } else {
                                        res.sendStatus(403);
                                    };
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        }
    },
    officerWeaponSearch: (req, res) => {
            
    },
    officerAddWarrant: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result[0]) {
                                    if (result[0].leo == 'yes') {
                                        let name = req.body.name;
                                        let d_from = req.body.d_from;
                                        let d_to = req.body.d_to;
                                        let reason = req.body.reason;
                                        let query = "INSERT INTO `warrants` (`name`, `reason`, `d_from`, `d_to`, `cadID`) VALUES (?, ?, ?, ?, ?)";
                                        connection.query(query, [name, reason, d_from, d_to, req.params.cadID], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500);
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/officers/dash/search/person-name`);
                                            };
                                        });
                                    } else {
                                        res.sendStatus(403);
                                    };
                                } else {
                                    res.send("Something went during the request!");
                                };
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    }
};