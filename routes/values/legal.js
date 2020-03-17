module.exports = {
    legalPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result1) => {
                            if (result1[0].admin == 'moderator' || result1[0].admin == 'admin' || result1[0].admin == 'owner') {
                                let query = "SELECT * FROM `in_statuses` WHERE `cadID` = '" + req.params.cadID + "'  ORDER BY id ASC";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        res.sendStatus(400)
                                    };
                                    res.render("admin-pages/legal.ejs", { title: 'Legal | SnailyCAD', legals: result, isAdmin: result1[0].admin, cadId: result2[0].cadID });
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
    addLegalPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result1) => {
                            if (result1[0].admin == 'moderator' || result1[0].admin == 'admin' || result1[0].admin == 'owner') {
                                res.render("legal/add-legal.ejs", { title: "Add Legal | SnailyCAD", isAdmin: result1[0].admin, cadId: result2[0].cadID });
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
    addLegal: (req, res) => {
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
                                let legalStatus = req.body.status;
                                let cadId = req.params.cadID

                                let query = "INSERT INTO `in_statuses` (`status`, `cadID`) VALUES ('" + legalStatus + "', '" + cadId + "')";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        return res.console.log(err);
                                        return res.sendStatus(500);;
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Legal Status ${legalStatus} was added by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/legal`);
                                            };
                                        });
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
    deleteLegal: (req, res) => {
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
                                let deleteUserQuery = 'DELETE FROM in_statuses WHERE id = "' + playerId + '"';

                                connection.query(deleteUserQuery, (err, result) => {
                                    if (err) {
                                        return res.console.log(err);
                                        return res.sendStatus(500);;
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `A Legal Status was deleted by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/legal`);
                                            };
                                        });
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
    editLegalPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result1) => {
                            if (result1[0].admin == 'moderator' || result1[0].admin == 'admin' || result1[0].admin == 'owner') {
                                let genderId = req.params.id;
                                let query = "SELECT * FROM `in_statuses` WHERE id = '" + genderId + "' ";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        return res.console.log(err);
                                        return res.sendStatus(500);;
                                    }
                                    res.render("legal/edit-legal.ejs", { title: "Edit Legal | SnailyCAD", legal: result[0], isAdmin: result1[0].admin, cadId: result2[0].cadID });
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
    editLegal: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let genderId = req.params.id;
                                let name = req.body.status;
                                let query = 'UPDATE `in_statuses` SET `status` = "' + name + '" WHERE `in_statuses`.`id` = "' + genderId + '"';

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        res.console.log(err);
                                        return res.sendStatus(500);;
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Legal Status ${name} was edited by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/legal`);
                                            };
                                        });
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