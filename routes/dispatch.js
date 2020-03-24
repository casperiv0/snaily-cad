module.exports = {
    dispatchPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result22) => {
                            if (result22[0].dispatch == 'yes') {

                                let cads = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'";
                                connection1.query(cads, (err, result43) => {
                                    if (err) {
                                        return console.log(err);
                                    } else {
                                        let weapons = "SELECT * FROM `weapons` WHERE `cadID` = '" + req.params.cadID + "'"
                                        let addressess = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "'"
                                        let officersQ = "SELECT * FROM `officers` WHERE `cadID` = '" + req.params.cadID + "' AND `status` = '10-41 | 10-8'"
                                        let EMSS = "SELECT * FROM `ems-fd` WHERE `cadID` = '" + req.params.cadID + "' AND `status` = '10-41 | 10-8'";
                                        let bolosQ = "SELECT * FROM `bolos` WHERE `cadID` = '" + req.params.cadID + "'";
                                        connection.query(`${weapons}; ${addressess}; ${officersQ}; ${EMSS}; ${bolosQ}`, (err, result) => {
                                            if (err) {
                                                console.log(err)
                                                return res.sendStatus(500);
                                            } else {
                                                res.render("dispatch/main.ejs", { desc: "", title: "Dispatch | SnailyCAD", isAdmin: result22[0].admin, weapons: result[0], address: result[1], officers: result[2], cadId: result2[0].cadID, ems: result[3], cad: result43[0], bolos: result[4] });
                                            };
                                        });
                                    };
                                });
                            } else {
                                res.render("dispatch/403.ejs", { desc: "", title: "Unauthorized | SnailyCAD", isAdmin: result22[0].admin, cadId: result2[0].cadID });
                            };
                        });
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
                            res.render("dispatch/weapons-search.ejs", {  desc: "",title: 'Dispatch | SnailyCAD', isAdmin: "", weapons: result, cadId: result2[0].cadID });
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
                        let query = "SELECT * FROM citizens WHERE address = '" + searchQ + "' AND `cadID` = '" + req.params.cadID + "'";

                        connection.query(query, (err, result) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                res.render("dispatch/address-search.ejs", {  desc: "",title: "Dispatch | SnailyCAD", isAdmin: "", users: result, cadId: result2[0].cadID });
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

            if (newAOP === '') {
                newAOP = "N/A"
            }

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