module.exports = {
    addethnicityPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    res.render("ethnicities/add-ethnicities.ejs", { title: "Add Ethnicities", isAdmin: req.session.isAdmin });
                } else {
                    res.sendStatus(403)
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    addethnicity: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let ethnicity = req.body.ethnicity;
                    let query = "INSERT INTO `ethnicities` (`ethnicity`) VALUES ('" + ethnicity + "')";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/ethnicities/');
                    });
                } else {
                    res.sendStatus(403);
                }
            });
        } else {
            res.redirect("/login");
        };
    },
    ethnicitiesPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let query = "SELECT * FROM `ethnicities` ORDER BY id ASC";
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400);
                        };
                        res.render("admin-pages/ethnicities.ejs", { title: 'Admin Panel | Values', ethnicities: result, isAdmin: req.session.isAdmin });
                    });
                } else {
                    res.sendStatus(403);
                }
            });
        } else {
            res.redirect("/login");
        };
    },
    editEthnicityPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let ethnicitiesId = req.params.id;
                    let query = "SELECT * FROM `ethnicities` WHERE id = '" + ethnicitiesId + "' ";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.render("ethnicities/edit-ethnicities.ejs", { title: "Edit ethnicity", ethnicity: result[0], isAdmin: req.session.isAdmin })
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    editethnicity: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let carId = req.params.id;
                    let ethnicity = req.body.ethnicity;
                    let query = 'UPDATE `ethnicities` SET `ethnicity` = "' + ethnicity + '" WHERE `ethnicities`.`id` = "' + carId + '"';

                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/ethnicities');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    deleteEthnicity: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let playerId = req.params.id;
                    // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                    let deleteUserQuery = 'DELETE FROM ethnicities WHERE id = "' + playerId + '"';

                    connection.query(deleteUserQuery, (err, result) => {

                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/ethnicities');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }

    }

}
