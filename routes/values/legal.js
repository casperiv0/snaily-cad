module.exports = {
    legalPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username =?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                        let query = "SELECT * FROM `in_statuses`  ORDER BY id ASC";
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.sendStatus(400)
                            } else {
                                res.render("admin-pages/legal.ejs", { desc: "", title: 'Legal | SnailyCAD', legals: result, isAdmin: result1[0].rank });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect("/login")
        }
    },
    addLegalPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                        res.render("legal/add-legal.ejs", { desc: "", title: "Add Legal | SnailyCAD", isAdmin: result1[0].rank });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });

        } else {
            res.redirect(`/login`);
        };
    },
    addLegal: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let legalStatus = req.body.status;

                    let query = "INSERT INTO `in_statuses` (`status`) VALUES (?)";
                    connection.query(query, [legalStatus], (err) => {
                        if (err) {
                            res.console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `Legal Status ${legalStatus} was added by ${req.session.username2}.`

                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/values/legal`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    deleteLegal: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let legalId = req.params.id;
                        let query = 'DELETE FROM `in_statuses` WHERE `id` = ?';

                        connection.query(query, [legalId], (err) => {
                            if (err) {
                                res.console.log(err);
                                return res.sendStatus(500);;
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `A Legal Status was deleted by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/legal`);
                                    };
                                });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`);
        };
    },
    editLegalPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                        let legalId = req.params.id;
                        let query = "SELECT * FROM `in_statuses` WHERE id = '" + legalId + "' ";
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.console.log(err);
                                return res.sendStatus(500);;
                            }
                            res.render("legal/edit-legal.ejs", { desc: "", title: "Edit Legal | SnailyCAD", legal: result[0], isAdmin: result1[0].rank, });
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`);
        };
    },
    editLegal: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let legalId = req.params.id;
                        let name = req.body.status;
                        let query = 'UPDATE `in_statuses` SET `status` = ? WHERE `in_statuses`.`id` = ?';

                        connection.query(query, [name, legalId], (err) => {
                            if (err) {
                                console.log(err)
                                res.console.log(err);
                                return res.sendStatus(500);;
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `Legal Status ${name} was edited by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/legal`);
                                    };
                                });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`);
        };
    }
};