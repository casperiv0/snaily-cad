const d = new Date()

module.exports = {
    citizenPage: (req, res, next) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.render("login-res/login.ejs", { title: "Login | SnailyCAD", isAdmin: '', message: "Session Expired. Please log back in.", cadId: result2[0].cadID, desc: "" })
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
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result1) => {
                            let query = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "' AND cadID = '" + req.params.cadID + "'";
                            let query2 = "SELECT cad_name FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'";
                            let query3 = "SELECT * FROM `users` WHERE `cadID` = '" + req.params.cadID + "'";
                            let query4 = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'"
                            connection1.query(`${query3}; ${query2}; ${query4}`, (err, result4) => {
                                connection.query(`${query}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", desc: "", citizen: result, isAdmin: result1[0].admin, message: "", messageG: '', username: req.session.username2, cadId: result2[0].cadID, cadName: result4[1][0].cad_name, aop: result4[2][0].AOP, desc: "See All your citizens, register vehicles or weapons here too." });
                                    }
                                });
                            });
                        });
                    } else {
                        res.send("CAD not found");
                    };
                };
            });
        };
    },
    citizenDetailPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)

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
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";

                        connection1.query(query, (err, result1) => {
                            let id = req.params.id;
                            let first_name = req.params.first_name;
                            let last_name = req.params.last_name;
                            let owner2 = first_name + " " + last_name;
                            let owner = req.params.first_name;
                            let isCeo = false;
                            let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
                            let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "' AND `linked_to` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'";
                            let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + first_name + "'  AND `linked_to` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'";
                            let ceo = "SELECT business_owner FROM `businesses` WHERE `business_owner` = '" + first_name + "' AND `linked_to` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'";
                            connection.query(`${query}; ${vehiclesQ}; ${weaponsQ}; ${ceo}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    if (!result[0][0]) {
                                        res.sendStatus(404)
                                    } else {
                                        if (result[0][0].linked_to.toLowerCase() === req.session.username2.toLowerCase()) {
                                            res.render("citizens/detail-citizens.ejs", { title: "Citizen Detail | SnailyCAD", desc: "", citizen: result[0], vehicles: result[1], weapons: result[2], ceo: isCeo, isAdmin: result1[0].admin, cadId: result2[0].cadID, desc: "See All the information about your current citizen." });
                                        } else {
                                            res.sendStatus(401);
                                        };
                                    }
                                }
                            });
                        });
                    } else {
                        res.sendStatus(404)
                    }

                };
            });
        };
    },
    addCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)

                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        } else {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        connection1.query(query, (err, result1) => {
                            let genderQ = "SELECT * FROM `genders` WHERE `cadID` = '" + req.params.cadID + "'"
                            let ethnicityQ = "SELECT * FROM `ethnicities` WHERE `cadID` = '" + req.params.cadID + "'"
                            let dmvQ = "SELECT * FROM `in_statuses` WHERE `cadID` = '" + req.params.cadID + "'"
                            connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                                if (err) {
                                    return res.status(500).send(err);
                                } else {
                                    res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", message: "", desc: "", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2, cadId: result2[0].cadID })
                                };
                            });
                        });
                    } else {
                        res.sendStatus(404)
                    };
                };
            });
        };
    },
    addCitizen: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        } else {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection1.query(query, (err, result1) => {
                let query
                let cadID = req.params.cadID
                // let first_name = req.body.first_name;
                let first_name = req.body.full_name;
                // let last_name = req.body.last_name;
                let last_name = "Unknown";
                // let full_name = first_name + " " + last_name;
                let full_name = first_name;
                let linked_to = req.session.username2;
                let birth = req.body.birth;
                let gender = req.body.gender;
                if (gender === undefined) {
                    gender = "Unknown"
                }
                let ethnicity = req.body.ethnicity;
                if (ethnicity === undefined) {
                    ethnicity = "Unknown"
                }
                let hair_color = req.body.hair;
                let eyes_color = req.body.eyes;
                let address = req.body.address;
                let ccw = req.body.ccw;

                let weight = req.body.weight;
                if (weight == "") {
                    weight = "Unknown"
                }
                let dmv = req.body.dmv;
                if (dmv === undefined) {
                    dmv = "Unknown"
                }
                let fireArms = req.body.fire;
                if (fireArms === undefined) {
                    fireArms = "Unknown"
                }
                let pilot = req.body.pilot;
                if (pilot === undefined) {
                    pilot = "Unknown"
                }
                let height = req.body.height;
                if (height == "") {
                    height = "Unknown"

                }
                query = "INSERT INTO `citizens` ( `first_name`, `last_name`, `full_name`, `linked_to`, `birth`, `gender`, `ethnicity`, `hair`, `eyes`, `address`, `height`, `weight`, `dmv`, `fire_licence`, `pilot_licence`,`ccw`,`ocw`,`business`,`cadID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                let query222 = "SELECT `full_name` FROM `citizens` WHERE `full_name` ='" + full_name + "' AND cadID = '" + cadID + "'";

                connection.query(query222, (err, result3) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        // if (result3[])
                        if (result3.length > 0) {

                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                            connection1.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    if (result2[0]) {
                                        connection1.query(query, (err, result1) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                let genderQ = "SELECT * FROM `genders`"
                                                let ethnicityQ = "SELECT * FROM `ethnicities`"
                                                let dmvQ = "SELECT * FROM `in_statuses`"
                                                connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                                                    if (err) {
                                                        return res.status(500).send(err);
                                                    } else {
                                                        res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", desc: "", message: "Citizen Name is already in use please choose a new name!", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2, cadId: result2[0].cadID })
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.sendStatus(404)
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
                                        connection.query(query, [first_name, last_name, full_name, linked_to, birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, dmv, fireArms, pilot, ccw, 'none', 'Currently not working', cadID], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).send("Something went wrong")
                                            } else {
                                                let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
                                                connection1.query(query2, (err, result2) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.sendStatus(500);
                                                    } else {
                                                        if (result2[0]) {
                                                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                                            connection1.query(query, (err, result1) => {
                                                                let query = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "' AND cadID = '" + req.params.cadID + "'";
                                                                let query2 = "SELECT cad_name FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'";
                                                                let query3 = "SELECT * FROM `users` WHERE `cadID` = '" + req.params.cadID + "'";
                                                                let query4 = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'"
                                                                connection1.query(`${query3}; ${query2}; ${query4}`, (err, result4) => {
                                                                    connection.query(`${query}`, (err, result) => {
                                                                        if (err) {
                                                                            console.log(err);
                                                                        } else {
                                                                            res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", desc: "", citizen: result, isAdmin: result1[0].admin, message: "", messageG: `Successfully Added ${full_name}`, username: req.session.username2, cadId: result2[0].cadID, cadName: result4[1][0].cad_name, aop: result4[2][0].AOP });
                                                                        };
                                                                    });
                                                                });
                                                            });
                                                        } else {
                                                            res.send("CAD not found");
                                                        };
                                                    };
                                                });
                                            }
                                        });
                                    } else {
                                        res.sendStatus(404);
                                    };
                                };
                            });
                        };
                    }
                });
            });
        };
    },
    editCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        } else {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection1.query(query, (err, result1) => {
                let genderQ = "SELECT * FROM `genders` WHERE `cadID` = '" + req.params.cadID + "'"
                let ethnicityQ = "SELECT * FROM `ethnicities` WHERE `cadID` = '" + req.params.cadID + "'"
                let dmvQ = "SELECT * FROM `in_statuses` WHERE `cadID` = '" + req.params.cadID + "'"
                let id = req.params.id;
                let current = "SELECT * FROM `citizens` WHERE `id` = '" + id + "'"

                connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}; ${current}`, (err, result) => {

                    if (result[3][0].linked_to == req.session.username2) {
                        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                        connection1.query(query2, (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result2[0]) {
                                    res.render("citizens/edit-citizen.ejs", { title: "Edit Citizen | SnailyCAD", desc: "", message: '', genders: result[0], ethnicities: result[1], dmvs: result[2], current: result[3], isAdmin: result1[0].admin, username: result[3], cadId: result2[0].cadID })
                                } else {
                                    res.sendStatus(404)
                                }
                            }
                        })
                    } else {
                        res.sendStatus(401)
                    }
                    if (err) {
                        console.log(err)
                    }
                });
            });

        }
    },
    editCitizen: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        } else {
            let id = req.params.id
            connection.query("SELECT * FROM citizens WHERE id = '" + id + "'", (err, citiZn) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                } else {

                    let first_name = req.params.first_name;
                    // let last_name = req.body.last_name;
                    let last_name = "Unknown";
                    // let full_name = first_name + " " + last_name;
                    let full_name = first_name;
                    let birth = req.body.birth;
                    let gender = req.body.gender;
                    let ethnicity = req.body.ethnicity;
                    let hair_color = req.body.hair;
                    let eyes_color = req.body.eyes;
                    let address = req.body.address;
                    let height = req.body.height;
                    if (height == "") {
                        height = "Unknown"
                    }
                    let weight = req.body.weight;
                    if (weight == "") {
                        weight = "Unknown"
                    }
                    let dmv = req.body.dmv;
                    let fireArms = req.body.fire;
                    let pilot = req.body.pilot
                    let ccw = req.body.ccw
                    let cadID = req.params.cadID

                    let query = 'UPDATE `citizens` SET `first_name` = ?, `last_name` = ?, `full_name` = ?, `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair` = ?, `eyes` = ?, `address` = ?, `height` = ?, `weight` = ?, `dmv` = ?, `fire_licence` = ?, `pilot_licence` = ?, `ccw` = ? WHERE `citizens`.`id` = "' + id + '"';
                    let query2 = 'UPDATE `registered_cars` SET `owner` = "' + full_name + '" WHERE `registered_cars`.`owner` = "' + citiZn[0].full_name + '"';
                    let weapons = 'UPDATE `registered_weapons` SET `owner` = "' + full_name + '" WHERE `registered_weapons`.`owner` = "' + citiZn[0].full_name + '"';

                    connection.query(`${query}; ${query2}; ${weapons}`, [first_name, last_name, full_name, birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, dmv, fireArms, pilot, ccw, 'none', 'Currently not working', cadID], (err, result) => {
                        if (err) {
                            console.log(err);
                        };
                        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
                        connection1.query(query2, (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                if (result2[0]) {
                                    res.redirect(`/cad/${result2[0].cadID}/citizens/${id}-${first_name}-${last_name}`);
                                } else {
                                    res.sendStatus(404);
                                };
                            };
                        });
                    });
                };
            });
        };
    },
    deleteCitizens: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
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
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        let id = req.params.id;
                        let query = 'SELECT * FROM citizens WHERE id = "' + id + '"';

                        connection.query(query, (err, result) => {
                            let vehicles = "DELETE FROM registered_cars WHERE owner = '" + result[0].full_name + "'"
                            let weapons = "DELETE FROM registered_weapons WHERE owner = '" + result[0].full_name + "'"
                            let citizens = "DELETE FROM citizens WHERE id = '" + id + "'"
                            connection.query(`${vehicles}; ${weapons}; ${citizens}`, (err1, result1) => {
                                if (err1) {
                                    return res.status(500).send(err);
                                } else {
                                    res.redirect(`/cad/${result2[0].cadID}/citizen`);
                                }
                            });

                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    companyPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
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
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = ?";
                        connection1.query(query, [req.session.username2], (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                let query2 = "SELECT * FROM businesses WHERE cadID = ?";
                                let citizen = "SELECT * FROM citizens WHERE linked_to = ? AND cadID = ?"
                                connection.query(`${query2}; ${citizen}`, [req.params.cadID, req.session.username2, req.params.cadID], (err, result) => {
                                    res.render("citizens/company.ejs", { title: "Edit Citizen | SnailyCAD", desc: "", isAdmin: result1[0].admin, businesses: result[0], current: result[1], cadId: result2[0].cadID, });
                                });
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    company: (req, res) => {
        if (req.session.loggedin) {
            let joined_business = req.body.join_business;
            let citizen_name = req.body.citizen_name;
            let query = 'UPDATE `citizens` SET `business` = ? WHERE `citizens`.`full_name` = ?';
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = ?"

            connection1.query(query2, [req.params.cadID], (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection.query(query, [joined_business, citizen_name], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.redirect(`/cad/${result2[0].cadID}/citizen/company/${joined_business}`)

                        }
                    })
                }
            })
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
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
    createCompany: (req, res) => {
        if (req.session.loggedin) {
            let linked_to = req.session.username2
            let companyName = req.body.companyName;
            let owner = req.body.owner;
            // "' + companyName + '", "' + owner + '", "' + req.session.username2 + '", "' + req.params.cadID + '"
            let query = "INSERT INTO `businesses` (`business_name`, `business_owner`, `linked_to`, `cadID`) VALUES (?, ?, ?, ?)";
            let query2 = "UPDATE `citizens` SET `business` = ? WHERE `citizens`.`full_name` = ? AND `cadID` = ?";
            let query3 = "SELECT cadID FROM `cads` WHERE cadID = ?"

            connection1.query(query3, [req.params.cadID], (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection.query(`${query}; ${query2}`, [companyName, owner, linked_to, req.params.cadID, companyName, owner, req.params.cadID], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.redirect(`/cad/${result2[0].cadID}/citizen/company/${id}-${companyName}`);
                        };
                    });
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
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
    companyDetailPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`)
                }
            })
        } else {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "'"
            connection1.query(query, (err, result5) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result2[0]) {
                                // '" + req.params.cadID + "'
                                // '" + req.params.company + "'
                               
                                let getCitizen = "SELECT * FROM `citizens` WHERE `cadID` = ? AND `id` = ?" 
                                connection.query(getCitizen, [req.params.cadID, req.params.id], (err, result5) => {
                                    if(err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        if (result5[0]) {
                                            let postss = "SELECT * FROM `posts` WHERE cadID = ? AND `linked_to_bus` = ?";
                                            let totalEmployees = "SELECT * FROM `citizens` WHERE `cadID` = ? AND `business` = ?"
                                            let ownerQ = "SELECT * FROM `businesses` WHERE `cadID` = ? AND `business_owner` = ?"
                                            connection.query(`${postss}; ${totalEmployees}; ${ownerQ}`, [req.params.cadID, req.params.company, req.params.cadID, req.params.company, req.params.cadID, result5[0].full_name], (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    console.log(result[2]);
                                                    res.render("company/main.ejs", { messageG: '', message: '', desc: "", title: req.params.company + " | SnailyCAD", isAdmin: result5[0].admin, cadId: result2[0].cadID, req: req, posts: result[0], employees: result[1], owner: result[2], result5: result5 });
                                                };
                                            });
                                        } else {
                                            res.send("There was an error getting your name! Please try again later")
                                        }
                                    };
                                });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                };
            });
        };
    },
    createCompanyPostPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`)
                }
            })
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.render("company/add.ejs", { messageG: '', message: '', desc: "", title: "Create Post | SnailyCAD", isAdmin: "", cadId: result2[0].cadID, req: req });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    createCompanyPost: (req, res) => {
        if (req.session.loggedin) {
            let title = req.body.title;
            let desc = req.body.description;
            let cadID = req.params.cadID;
            let uploadedBy = req.session.username2;
            let uploadedAt = d.toLocaleDateString();

            let query = "INSERT INTO `posts` (`linked_to_bus`,`title`,`description`,`cadID`,`uploadedBy`,`uploadedAt`) VALUES (?, ?, ?, ?, ?, ?)"
            connection.query(query, [req.params.company, title, desc, cadID, uploadedBy, uploadedAt], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus((500))
                } else {
                    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result2[0]) {
                                let postss = "SELECT * FROM `posts` WHERE cadID = ? AND `linked_to_bus` = ?";

                                connection.query(postss, [req.params.cadID, req.params.company], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        // '" + req.params.cadID + "'
                                        // '" + req.params.company + "'
                                        let postss = "SELECT * FROM `posts` WHERE cadID = ? AND `linked_to_bus` = ?";
                                        let totalEmployees = "SELECT * FROM `citizens` WHERE `cadID` = ? AND `business` = ?"
                                        connection.query(`${postss}; ${totalEmployees}`, [req.params.cadID, req.params.company, req.params.cadID, req.params.company], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.render("company/main.ejs", { messageG: 'Post successfully created', message: '', desc: "", title: req.params.company + " | SnailyCAD", isAdmin: result2[0].admin, cadId: result2[0].cadID, req: req, posts: result[0], employees: result[1] });
                                                res.end();
                                            };
                                        });
                                    };
                                });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`);
                };
            });
        };
    },
    editCompanyPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`);
                };
            });
        } else {
            res.send("Coming very soon");
        };
    }
};