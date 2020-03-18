module.exports = {
    addethnicityPage: (req, res) => {
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
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                res.render("ethnicities/add-ethnicities.ejs", {  desc: "",title: "Add Ethnicities", isAdmin: result[0].admin, cadId: result2[0].cadID });
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
    addethnicity: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let ethnicity = req.body.ethnicity;
                                let query = "INSERT INTO `ethnicities` (`ethnicity`, `cadID`) VALUES ('" + ethnicity + "', '" + req.params.cadID + "')";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date();
                                        let currentD = date.toLocaleString();
                                        let action_title = `Ethnicity ${ethnicity} was added by ${req.session.username2}.`;

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')";
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500);
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/ethnicities/`);
                                            };
                                        });
                                    };
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
            res.redirect("/login");
        };
    },
    ethnicitiesPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let query = "SELECT * FROM `ethnicities` WHERE `cadID` = '" + req.params.cadID + "'";
                                connection.query(query, (err, result1) => {
                                    if (err) {
                                        res.sendStatus(400);
                                    } else {
                                        res.render("admin-pages/ethnicities.ejs", { desc: "", title: 'Admin Panel | Values', ethnicities: result1, isAdmin: result[0].admin, cadId: result2[0].cadID });
                                    }
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
            })

        };
    },
    editEthnicityPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let ethnicitiesId = req.params.id;
                                let query = "SELECT * FROM `ethnicities` WHERE id = '" + ethnicitiesId + "' ";
                                connection.query(query, (err, result1) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("ethnicities/edit-ethnicities.ejs", { desc: "", title: "Edit ethnicity | SnailyCAD", ethnicity: result1[0], isAdmin: result[0].admin, cadId: result2[0].cadID });
                                    }
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
            })

        }
    },
    editethnicity: (req, res) => {
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
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let carId = req.params.id;
                                let ethnicity = req.body.ethnicity;
                                let query = 'UPDATE `ethnicities` SET `ethnicity` = "' + ethnicity + '" WHERE `ethnicities`.`id` = "' + carId + '"';

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.statusStaus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Ethnicity ${ethnicity} was edited by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/ethnicities/`);
                                            };
                                        });
                                    }
                                });
                            } else {
                                res.sendStatus(403)
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
    deleteEthnicity: (req, res) => {
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
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let playerId = req.params.id;
                                // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                                let deleteUserQuery = 'DELETE FROM ethnicities WHERE id = "' + playerId + '"';

                                connection.query(deleteUserQuery, (err, result) => {
                                    if (err) {
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `An Ethnicity was deleted by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/ethnicities/`);
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
    }
};
