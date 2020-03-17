const d = new Date()

module.exports = {
    citizenPage: (req, res, next) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.render("login-res/login.ejs", { title: "Login | SnailyCAD", isAdmin: '', message: "Session Expired. Please log back in.", cadId: result2[0].cadID })
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
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
                                        res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].admin, message: "", messageG: '', username: req.session.username2, cadId: result2[0].cadID, cadName: result4[1][0].cad_name, aop: result4[2][0].AOP });
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

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
                                        if (result[0][0].linked_to === req.session.username2) {
                                            // console.log(first_name + "first_nae")
                                            // console.log(result[3][0].business_owner)
                                            // if (result[3][0].business_owner == first_name) {
                                            //     isCeo = true
                                            // } else {
                                            //     isCeo = false
                                            // }
                                            // console.log(isCeo);

                                            res.render("citizens/detail-citizens.ejs", { title: "Citizen Detail | SnailyCAD", citizen: result[0], vehicles: result[1], weapons: result[2], ceo: isCeo, isAdmin: result1[0].admin, cadId: result2[0].cadID });
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
                                    res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", message: "", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2, cadId: result2[0].cadID })
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
                let ethnicity = req.body.ethnicity;
                let hair_color = req.body.hair;
                let eyes_color = req.body.eyes;
                let address = req.body.address;
                let ccw = req.body.ccw;

                let weight = req.body.weight;
                if (weight == "") {
                    weight = "Unknown"
                }
                let dmv = req.body.dmv;
                let fireArms = req.body.fire;
                let pilot = req.body.pilot;
                let height = req.body.height;
                if (height == "") {
                    height = "Unknown"

                }
                if (height.includes("'") || height.includes('"')) {
                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result2[0]) {
                                connection1.query(query, (err, result1) => {
                                    let genderQ = "SELECT * FROM `genders`"
                                    let ethnicityQ = "SELECT * FROM `ethnicities`"
                                    let dmvQ = "SELECT * FROM `in_statuses`"
                                    connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                                        if (err) {
                                            return res.status(500).send(err);
                                        } else {
                                            res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", message: "Please Remove any ' or \" from the height, try using inch or feet", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2, cadId: result2[0].cadID });
                                        }

                                    });
                                });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                } else {
                    query = "INSERT INTO `citizens` ( `first_name`, `last_name`, `full_name`, `linked_to`, `birth`, `gender`, `ethnicity`, `hair`, `eyes`, `address`, `height`, `weight`, `dmv`, `fire_licence`, `pilot_licence`,`ccw`,`ocw`,`business`,`cadID`) VALUES ('" + first_name + "','" + last_name + "','" + full_name + "','" + linked_to + "','" + birth + "','" + gender + "','" + ethnicity + "','" + hair_color + "','" + eyes_color + "','" + address + "','" + height + "','" + weight + "', '" + dmv + "', '" + fireArms + "' ,'" + pilot + "', '" + ccw + "', 'none', 'Currently is not working', '" + cadID + "')";
                    let query222 = "SELECT `full_name` FROM `citizens` WHERE `full_name` ='" + full_name + "' AND cadID = '" + cadID + "'";

                    connection.query(query222, (err, result3) => {
                        // if (result3[])
                        if (result3.length > 0) {

                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                            connection1.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    if (result2[0]) {
                                        connection1.query(query, (err, result1) => {
                                            let genderQ = "SELECT * FROM `genders`"
                                            let ethnicityQ = "SELECT * FROM `ethnicities`"
                                            let dmvQ = "SELECT * FROM `in_statuses`"
                                            connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                                                if (err) {
                                                    return res.status(500).send(err);
                                                } else {
                                                    res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", message: "Citizen Name is already in use please choose a new name!", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2, cadId: result2[0].cadID })
                                                }
                                            });
                                        });
                                    } else {
                                        res.sendStatus(404)
                                    };
                                };
                            });
                        } else {
                            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                            connection1.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        connection.query(query, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).send("Something went wrong")
                                            } else {
                                                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
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
                                                                            res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].admin, message: "", messageG: `Successfully Added ${full_name}`, username: req.session.username2, cadId: result2[0].cadID, cadName: result4[1][0].cad_name, aop: result4[2][0].AOP });
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
                    });
                };
            });
        };
    },
    editCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
                let genderQ = "SELECT * FROM `genders`"
                let ethnicityQ = "SELECT * FROM `ethnicities`"
                let dmvQ = "SELECT * FROM `in_statuses`"
                let id = req.params.id;
                let current = "SELECT * FROM `citizens` WHERE `id` = '" + id + "'"

                connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}; ${current}`, (err, result) => {

                    if (result[3][0].linked_to == req.session.username2) {
                        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                        connection1.query(query2, (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result2[0]) {
                                    res.render("citizens/edit-citizen.ejs", { title: "Edit Citizen | SnailyCAD", message: '', genders: result[0], ethnicities: result[1], dmvs: result[2], current: result[3], isAdmin: result1[0].admin, username: result[3], cadId: result2[0].cadID })
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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

                    let query = 'UPDATE `citizens` SET `first_name` = "' + first_name + '", `last_name` = "' + last_name + '", `full_name` = "' + full_name + '", `birth` = "' + birth + '", `gender` = "' + gender + '", `ethnicity` = "' + ethnicity + '", `hair` = "' + hair_color + '", `eyes` = "' + eyes_color + '", `address` = "' + address + '", `height` = "' + height + '", `weight` = "' + weight + '", `dmv` = "' + dmv + '", `fire_licence` = "' + fireArms + '", `pilot_licence` = "' + pilot + '", `ccw` = "' + ccw + '" WHERE `citizens`.`id` = "' + id + '"';
                    let query2 = 'UPDATE `registered_cars` SET `owner` = "' + full_name + '" WHERE `registered_cars`.`owner` = "' + citiZn[0].full_name + '"';
                    let weapons = 'UPDATE `registered_weapons` SET `owner` = "' + full_name + '" WHERE `registered_weapons`.`owner` = "' + citiZn[0].full_name + '"';

                    connection.query(`${query}; ${query2}; ${weapons}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        };
                        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
                                }
                                res.redirect(`/cad/${result2[0].cadID}/citizen`)
                            });

                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })

        }
    },
    companyPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
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
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"


            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "' ";
                        connection1.query(query, (err, result1) => {
                            let query2 = "SELECT * FROM businesses WHERE cadID = '" + req.params.cadID + "'";
                            let citizen = "SELECT * FROM citizens WHERE linked_to = '" + req.session.username2 + "' AND cadID = '" + req.params.cadID + "'"
                            connection.query(`${query2}; ${citizen}`, (err, result) => {

                                res.render("citizens/company.ejs", { title: "Edit Citizen | SnailyCAD", isAdmin: result1[0].admin, businesses: result[0], current: result[1], cadId: result2[0].cadID, })
                            })
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    company: (req, res) => {
        let joined_business = req.body.join_business;
        let citizen_name = req.body.citizen_name;
        let query = 'UPDATE `citizens` SET `business` = "' + joined_business + '" WHERE `citizens`.`full_name` = "' + citizen_name + '"';
        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

        connection1.query(query2, (err, result2) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {

                connection.query(query, (err, result1) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/cad/${result2[0].cadID}/citizen/company/${joined_business}`)

                    }
                })
            }
        })

    },
    createCompany: (req, res) => {

        let companyName = req.body.companyName;
        let owner = req.body.owner;
        let query = 'INSERT INTO `businesses` (`business_name`, `business_owner`, `linked_to`, `cadID`) VALUES  ("' + companyName + '", "' + owner + '", "' + req.session.username2 + '", "' + req.params.cadID + '")';
        let query2 = 'UPDATE `citizens` SET `business` = "' + companyName + '" WHERE `citizens`.`full_name` = "' + owner + '"';
        let query3 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

        connection1.query(query3, (err, result2) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {

                connection.query(`${query}; ${query2}`, (err, result1) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/cad/${result2[0].cadID}/citizen/company/${companyName}`)

                    }
                })
            }
        })


    },
    companyDetailPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`)
                }
            })
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        let postss = "SELECT * FROM `posts` WHERE cadID = '" + req.params.cadID + "' AND `linked_to_bus` = '" + req.params.company + "'";
                        let totalEmployees = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' AND `business` = '" + req.params.company + "'"
                        connection.query(`${postss}; ${totalEmployees}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("company/main.ejs", { messageG: '', message: '', title: req.params.company + " | SnailyCAD", isAdmin: "", cadId: result2[0].cadID, req: req, posts: result[0], employees: result[1] });
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    createCompanyPostPage: (req, res) => {
        if (!req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`)
                }
            })
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.render("company/add.ejs", { messageG: '', message: '', title: "Create Post | SnailyCAD", isAdmin: "", cadId: result2[0].cadID, req: req });
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

            if (title.includes("'")) {
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (result2[0]) {
                            res.render("company/add.ejs", { messageG: '', message: "Error: Please Remove any ' from the title", title: "Create Post | SnailyCAD", isAdmin: "", cadId: result2[0].cadID, req: req });
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            } else if (desc.includes("'")) {
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (result2[0]) {
                            res.render("company/add.ejs", { messageG: '', message: "Error: Please Remove any ' from the discription", title: "Create Post | SnailyCAD", isAdmin: "", cadId: result2[0].cadID, req: req });
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            } else {
                let query = "INSERT INTO `posts` (`linked_to_bus`,`title`,`description`,`cadID`,`uploadedBy`,`uploadedAt`) VALUES ('" + req.params.company + "', '" + title + "', '" + desc + "', '" + cadID + "', '" + uploadedBy + "', '" + uploadedAt + "')"
                connection.query(query, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus((500))
                    } else {
                        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                        connection1.query(query2, (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result2[0]) {
                                    let postss = "SELECT * FROM `posts` WHERE cadID = '" + req.params.cadID + "' AND `linked_to_bus` = '" + req.params.company + "'";

                                    connection.query(postss, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            res.render("company/main.ejs", { messageG: "Post successfully created", message: '', title: req.params.company + " | SnailyCAD", isAdmin: "", cadId: result2[0].cadID, req: req, posts: result });
                                            res.end();
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
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/cad/${result2[0].cadID}/login`);
                };
            });
        };
    }
};