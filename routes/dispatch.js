module.exports = {
    dispatchPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, usernameResult) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (usernameResult[0].dispatch == 'yes') {
                        let addressess = "SELECT * FROM `citizens`"
                        let officersQ = "SELECT * FROM `officers` WHERE `status` = '10-41 | 10-8'"
                        let EMSS = "SELECT * FROM `ems-fd` WHERE `status` = '10-41 | 10-8'";
                        let bolosQ = "SELECT * FROM `bolos`";
                        let callsQ = "SELECT * FROM `911calls`";
                        let cadInfo = "SELECT * FROM `cad_info`"
                        connection.query(`${addressess}; ${officersQ}; ${EMSS}; ${bolosQ}; ${callsQ}; ${cadInfo}`, (err, result) => {
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            } else {
                                res.render("dispatch/main.ejs", { desc: "", title: "Dispatch | SnailyCAD", isAdmin: usernameResult[0].rank, address: result[0], officers: result[1], ems: result[2], cad: result[5][0], bolos: result[3], calls: result[4] });
                            };
                        });
                    } else {
                        res.render("dispatch/403.ejs", { desc: "", title: "Unauthorized | SnailyCAD", isAdmin: usernameResult[0].rank });
                    };
                }
            });
        } else {
            res.redirect(`/login`);

        };
    },
    disptachWeaponSearch: (req, res) => {
        if (req.session.loggedin) {

            let searchQ = req.body.weapon_search;
            let weaponQ = "SELECT * FROM `registered_weapons` WHERE `weapon` = ?";

            connection.query(`${weaponQ}`, [searchQ], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("dispatch/weapons-search.ejs", { desc: "", title: 'Dispatch | SnailyCAD', isAdmin: "", weapons: result });
                }
            });
        } else {
            res.redirect(`/login`);
        }

    },
    disptachAddressSearch: (req, res) => {
        if (req.session.loggedin) {
            let searchQ = req.body.address_search;
            let query = "SELECT * FROM citizens WHERE address = ?";

            connection.query(query, [searchQ], (err, result) => {
                if (err) {
                    return console.log(err);
                } else {
                    res.render("dispatch/address-search.ejs", { desc: "", title: "Dispatch | SnailyCAD", isAdmin: "", users: result });
                };
            });
        } else {
            res.redirect(`/login`)
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
            connection.query(`${query1}; ${query2};`, (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

                    connection.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/${result2[0].cadID}/dispatch`)
                            } else {
                                res.sendStatus(404)
                            }
                        }
                    });

                }
            })
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/${result2[0].cadID}/login`);
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

                    connection.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/${result2[0].cadID}/dispatch`)
                            } else {
                                res.sendStatus(404)
                            }
                        }
                    });

                }
            })
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    editAOP: (req, res) => {
        if (req.session.loggedin) {
            let newAOP = req.body.aop

            if (newAOP === '') {
                newAOP = "N/A"
            }

            let query1 = "UPDATE `cad_info` SET `AOP` = ?"
            connection.query(`${query1};`, [newAOP], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/dispatch`);
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    createBolo: (req, res) => {
        let boloDesc = req.body.bolo_desc;

        let query = "INSERT INTO `bolos` (`description`) VALUES (?)"
        connection.query(query, [boloDesc], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/dispatch`);
            }
        })
    },
    removeBolo: (req, res) => {
        let boloId = req.body.boloID;

        let query = "DELETE FROM `bolos` WHERE `id` = ?"
        connection.query(query, [boloId], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/dispatch`);
            }
        })
    },
    updateDispatchCall: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].dispatch === 'yes') {
                            let query = "UPDATE `911calls` SET `location` = ?, `status` = ? WHERE `911calls`.`id` = ?"
                            connection.query(query, [req.body.location, req.body.status, req.params.id], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/dispatch`);
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
            res.redirect(`/login`);
        }
    },
    cancelCall911Dis: (req, res) => {
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
                            connection.query(query, [req.params.id], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/dispatch`);
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
            res.redirect(`/login`);
        }
    },
    dispatchUpdateOfficerStatus: (req, res) => {
        if (req.session.loggedin) {
            const officerId = req.params.id;
            const status = req.body.status;
            const status2 = req.body.status2;
            const query = "UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?";

            connection.query(query, [status, status2, officerId], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect("/dispatch")
                }
            })
        } else {
            res.redirect("/login")
        }
    }
};