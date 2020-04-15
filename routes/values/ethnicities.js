module.exports = {
    addethnicityPage: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        res.render("ethnicities/add-ethnicities.ejs", { desc: "", title: "Add Ethnicities", isAdmin: result[0].rank });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect("/login")
        };
    },
    addethnicity: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let ethnicity = req.body.ethnicity;
                        let query = "INSERT INTO `ethnicities` (`name`) VALUES (?)";
                        connection.query(query, [ethnicity], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                let date = new Date();
                                let currentD = date.toLocaleString();
                                let action_title = `Ethnicity ${ethnicity} was added by ${req.session.username2}.`;

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)";
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        res.redirect(`/admin/values/ethnicities/`);
                                    };
                                });
                            };
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect("/login");
        };
    },
    ethnicitiesPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let query = "SELECT * FROM `ethnicities`";
                        connection.query(query, (err, result1) => {
                            if (err) {
                                res.sendStatus(400);
                            } else {
                                res.render("admin-pages/ethnicities.ejs", { desc: "", title: 'Admin Panel | Values', ethnicities: result1, isAdmin: result[0].rank });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        };
    },
    editEthnicityPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result) => {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let ethnicitiesId = req.params.id;
                    let query = "SELECT * FROM `ethnicities` WHERE id = ?";
                    connection.query(query, [ethnicitiesId], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.render("ethnicities/edit-ethnicities.ejs", { desc: "", title: "Edit ethnicity | SnailyCAD", ethnicity: result1[0], isAdmin: result[0].rank });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    editethnicity: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let ethnicityId = req.params.id;
                    let ethnicity = req.body.ethnicity;
                    let query = 'UPDATE `ethnicities` SET `name` = ? WHERE `ethnicities`.`id` = ?';

                    connection.query(query, [ethnicity, ethnicityId], (err) => {
                        if (err) {
                            console.log(err);
                            return res.statusStaus(500);
                        } else {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `Ethnicity ${ethnicity} was edited by ${req.session.username2}.`

                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/values/ethnicities/`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403)
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    deleteEthnicity: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let ethnicityId = req.params.id;
                    // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                    let query = 'DELETE FROM `ethnicities` WHERE id = ?';

                    connection.query(query, [ethnicityId], (err) => {
                        if (err) {
                            return res.sendStatus(500);
                        } else {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `An Ethnicity was deleted by ${req.session.username2}.`

                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/values/ethnicities/`);
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
    }
};
