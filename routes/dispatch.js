module.exports = {
    dispatchPage: (req, res) => {

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
                            if (result[0].dispatch == 'yes' || result[0].admin == 'owner' || result[0].admin == 'admin') {

                                let cads = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'";
                                connection1.query(cads, (err, result43) => {
                                    if (err) {
                                        return console.log(err)
                                    } else {
                                        let weapons = "SELECT * FROM `weapons` WHERE `cadID` = '" + req.params.cadID + "'"
                                        let addressess = "SELECT `address` FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "'"
                                        let officersQ = "SELECT * FROM `officers` WHERE `cadID` = '" + req.params.cadID + "'"
                                        let EMSS = "SELECT * FROM `ems-fd` WHERE `cadID` = '" + req.params.cadID + "'";
                                        let bolosQ = "SELECT * FROM `bolos` WHERE `cadID` = '" + req.params.cadID + "'";
                                        connection.query(`${weapons}; ${addressess}; ${officersQ}; ${EMSS}; ${bolosQ}`, (err, result) => {
                                            if (err) {
                                                console.log(err)
                                                return res.sendStatus(500);
                                            } else {
                                                res.render("dispatch/main.ejs", { title: "Dispatch | SnailyCAD", isAdmin: "", weapons: result[0], address: result[0], officers: result[2], cadId: result2[0].cadID, ems: result[3], cad: result43[0], bolos: result[4] });
                                            };
                                        });
                                    }
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
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

        }



    },
    disptachNameSearch: (req, res) => {
        if (req.session.loggedin) {
            let searchQ = req.body.name_search;
            let query = "SELECT * FROM `citizens` WHERE `full_name` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let vehicles = "SELECT * FROM `registered_cars` WHERE `owner` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let weapon = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";
            let charge = "SELECT * FROM `posted_charges` WHERE `name` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";

            connection.query(`${query}; ${vehicles}; ${weapon}; ${charge}`, (err, result) => {
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
                                res.render("dispatch/name-search.ejs", { title: "Dispatch | SnailyCAD", isAdmin: "", result: result[0][0], vehicles: result[1], weapons: result[2], charges: result[3], cadId: result2[0].cadID });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
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
        }


    },
    disptachPlateSearch: (req, res) => {
        if (req.session.loggedin) {
            let searchQ = req.body.plate_search;
            let vehicle = "SELECT * FROM `registered_cars` WHERE `plate` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";

            connection.query(`${vehicle}`, (err1, result1) => {
                if (!result1[0]) {
                    console.log(err1);
                    let query2 = "SELECT cadID FROM `users` WHERE `cadID` = '" + req.params.cadID + "'"

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.render("dispatch/plate-not-found.ejs", { title: "Dispatch | SnailyCAD", isAdmin: "", cadId: result2[0].cadID });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                } else {
                    let query2 = "SELECT cadID FROM `users` WHERE `cadID` = '" + req.params.cadID + "'"

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {

                                let citizen = "SELECT * FROM `citizens` WHERE `full_name` = '" + result1[0].owner + "' AND `cadID` = '" + req.params.cadID + "'";
                                connection.query(citizen, (err, result) => {

                                    res.render("dispatch/plate-search.ejs", { title: "Dispatch | SnailyCAD", isAdmin: "", plates: result1[0], name: result[0], cadId: result2[0].cadID });
                                });
                            } else {
                                res.sendStatus(404)
                            }
                        }
                    });


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
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    disptachWeaponSearch: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let searchQ = req.body.weapon_search;
                        let weaponQ = "SELECT * FROM `registered_weapons` WHERE `weapon` = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";

                        connection.query(`${weaponQ}`, (err, result) => {
                            res.render("dispatch/weapons-search.ejs", { title: 'Dispatch | SnailyCAD', isAdmin: "", weapons: result, cadId: result2[0].cadID });
                        })
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
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    }
                }
            });
        }

    },
    disptachAddressSearch: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let searchQ = req.body.address_search;
                        let query = "SELECT * FROM citizens WHERE address = '" + searchQ + "'";

                        connection.query(query, (err, result) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                res.render("dispatch/address-search.ejs", { title: "Dispatch | SnailyCAD", isAdmin: "", users: result, cadId: result2[0].cadID });
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
        }

    },
    statusChangeDispatch: (req, res) => {
        if (req.session.loggedin) {
            let id = req.body.id
            let status = req.body.status;
            let status2 = req.body.status2;
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
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/dispatch`)
                            } else {
                                res.sendStatus(404)
                            }
                        }
                    });

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
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    statusChangeDispatchEMS: (req, res) => {
        if (req.session.loggedin) {
            let id = req.body.id
            let status = req.body.status;
            let status2 = req.body.status2;
            if (status2 === undefined) {
                status2 = "----------"
            }
            let query1 = "UPDATE `ems-fd` SET `status` = '" + status + "' WHERE `ems-fd`.`id` = '" + id + "'"
            let query2 = "UPDATE `ems-fd` SET `status2` = '" + status2 + "' WHERE `ems-fd`.`id` = '" + id + "'"
            connection.query(`${query1}; ${query2};`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/dispatch`)
                            } else {
                                res.sendStatus(404)
                            }
                        }
                    });

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
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    editAOP: (req, res) => {
        if (req.session.loggedin) {
            let cadID = req.params.cadID;
            let newAOP = req.body.aop

            let query1 = "UPDATE `cads` SET `AOP` = '" + newAOP + "' WHERE `cads`.`cadID` = '" + cadID + "'"
            connection1.query(`${query1};`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/dispatch`);
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
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
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    createBolo: (req, res) => {
        let boloDesc = req.body.bolo_desc;
        let cadID = req.params.cadID;

        let query = "INSERT INTO `bolos` (`description`, `cadID`) VALUES ('" + boloDesc + "', '" + cadID + "')"
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.redirect(`/cad/${result2[0].cadID}/dispatch`);
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            }
        })
    },
    removeBolo: (req, res) => {
        let boloId = req.body.boloID;
        let cadID = req.params.cadID;

        let query = "DELETE FROM `bolos` WHERE `id` = '" + boloId + "' AND `cadID` = '" + cadID + "' "
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.redirect(`/cad/${result2[0].cadID}/dispatch`);
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            }
        })
    }
};