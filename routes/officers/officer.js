const fetch = require("node-fetch")
module.exports = {
    officersPage: (req, res, next) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
                                                connection.query(qeury, (err, result) => {
                                                    if (err) {
                                                        console.log("Error" + err)
                                                    }
                                                    res.render("officers-pages/officers.ejs", {
                                                        title: "Police Department | SnailyCAD",
                                                        users: "qsd",
                                                        isAdmin: result1[0].admin,
                                                        officers: result,
                                                        cadId: result2[0].cadID,
                                                        cad: result43[0]
                                                    });
                
                                                });
                                            } else {
                                                res.render("officers-pages/403.ejs", { title: "unauthorized", isAdmin: "", cadId: result2[0].cadID })
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.render("login-res/login.ejs", { title: "Login | SnailyCAD", isAdmin: "", message: "Session Expired. Please log back in.", cadId: result2[0].cadID })
                        // res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        };
    },
    addOfficerPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].leo == 'yes') {
                                res.render("officers-pages/add-officers.ejs", { title: "Add Officer | SnailyCAD", isAdmin: result1[0].admin, req: req, cadId: result2[0].cadID })
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
    addOfficer: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].leo == 'yes') {
                                res.render("officers-pages/officers-dash.ejs", {
                                    title: "Police Department",
                                    isAdmin: result[0].admin
                                    , cadId: result2[0].cadID
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
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
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].leo == 'yes') {
                                let id = req.params.id;
                                let first_name = req.params.first_name;
                                let last_name = req.params.last_name;
                                let owner = req.params.first_name;
                                let owner2 = req.params.first_name + " " + req.params.last_name;
                                let chargeQ = "SELECT * FROM `posted_charges` WHERE `name` = '" + owner + "' AND `cadID` = '" + req.params.cadID + "'";
                                let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "'AND `cadID` = '" + req.params.cadID + "'";
                                let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + owner + "'AND `cadID` = '" + req.params.cadID + "'";
                                let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
                                let warrantsQ = "SELECT * FROM `warrants` WHERE name = '" + owner2 + "' AND `cadID` = '" + req.params.cadID + "'";


                                connection.query(`${query}; ${vehiclesQ}; ${weaponsQ}; ${chargeQ}; ${warrantsQ}`, (err, result) => {
                                    if (err) {
                                        return res.status(500).send(err);
                                    }
                                    res.render("officers-pages/name-results.ejs", {
                                        title: "Name Results | Police Department",
                                        isAdmin: result1[0].admin,
                                        cadId: result2[0].cadID,
                                        result: result[0][0],
                                        vehicles: result[1],
                                        weapons: result[2],
                                        charges: result[3],
                                        warrants: result[4]
                                    })
                                });
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
    officerApplyPage: (req, res) => {
        res.render("officers-pages/apply.ejs", {
            title: "Apply | SnailyCAD",
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
    addOffence: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].leo == 'yes') {

                                let name = req.body.name;
                                let offence = req.body.offence;
                                let date = req.body.date;
                                let officer_name = req.body.officer_name;
                                let postal = req.body.postal;
                                let notes = req.body.notes;
                                if (notes == "") {
                                    notes = "None";
                                };

                                let query = "INSERT INTO `posted_charges` ( `name`, `charge`, `notes`, `officer_name`, `date`, `postal`, `cadID`) VALUES ('" + name + "','" + offence + "','" + notes + "','" + officer_name + "','" + date + "', '" + postal + "', '" + req.params.cadID + "')";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        return res.status(500).send(err);
                                    }
                                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                                    connection1.query(query, (err, result1) => {
                                        if (result1[0].leo == 'yes') {
                                            let query2 = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"
                                            connection.query(query2, async (err, result5) => {
                                                res.render("officers-pages/name.ejs", {
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
                                });
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
    addWarrantPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].leo == 'yes') {
                                res.render("officers-pages/warrant.ejs", { title: "Add Warrant | SnailyCAD", isAdmin: result[0].admin, req: req, cadId: result2[0].cadID })
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
    addWarrant: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
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

                    })
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
    suspendLicensePlate: (req, res) => {
        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
                        connection.query(query2, (err, result) => {
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            } else {
                                let query = "SELECT * FROM `registered_cars` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"
                                connection.query(query, (err, result) => {
                                    res.render("officers-pages/plate.ejs", {
                                        title: "Plate Search | Police Department",
                                        isAdmin: result1[0].admin,
                                        plates: result
                                        , cadId: result2[0].cadID,
                                        messageG: "License was successfully suspended",
                                    })
                                })
                            }
                        })
                    })
                } else {
                    res.sendStatus(404)
                }
            }
        })


    },
    suspendLicenseName: (req, res) => {
        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
                        connection.query(query2, (err, result) => {
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            } else {
                                let query = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER by id ASC"

                                connection.query(query, (err, result) => {
                                    res.render("officers-pages/name.ejs", {
                                        title: "Name Search | Police Department",
                                        isAdmin: result1[0].admin,
                                        information: result,
                                        cadId: result2[0].cadID,
                                        messageG: "License was successfully suspended",
                                    });
                                });
                            };
                        });
                    });
                } else {
                    res.sendStatus(404);
                };
            };
        });
    },
    statusChange: (req, res) => {
        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].leo == 'yes') {
                                res.render("officers-pages/codes.ejs", { title: "10 Codes | SnailyCAD", isAdmin: result[0].admin, cadId: result2[0].cadID })
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

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