module.exports = {
    loginPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/citizen`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {

            res.render("login-res/login.ejs", { title: "Login | Equinox CAD", isAdmin: req.session.isAdmin, message: "", cadId: "" })
        }
    },
    login: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        let cadID = req.params.cadID
        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
        connection1.query(query2, (err, result2) => {
            if (!result2) {
                res.sendStatus(404)
            } else {
                if (username && password) {
                    connection1.query('SELECT * FROM users WHERE username = ? AND password = ? AND cadID = ?', [username, password, cadID], function (error, results, fields) {
                        if (results.length > 0) {
                            req.session.loggedin = true;
                            req.session.username2 = username;
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                connection.query("SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'", (err, result) => {
                                    if (err) {
                                        res.sendStatus(500);
                                        console.log(err);
                                    }
                                    if (!result[0]) {
                                        res.redirect(`/cad/${result2[0].cadID}/citizen/add`)
                                    }
                                    else {
                                        res.redirect(`/cad/${result2[0].cadID}/citizen`)
                                    }
                                })

                            }
                        } else {
                            res.render("login-res/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Wrong Username or Password", cadId: result2[0].cadID })
                        }
                        // res.end();
                    });
                } else {
                    res.render("login-res/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again", cadId: result2[0].cadID })
                    res.end();
                }
            }
        })
    },
    registerPage: (req, res) => {
        if (req.session.loggedin) {
            res.redirect("/citizen")
        } else {
            let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query, (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result1[0]) {
                        res.render("login-res/reg.ejs", { title: "Register | Equinox CAD", isAdmin: req.session.isAdmin, message: "", cadId: result1[0].cadID })
                    } else {
                        res.sendStatus(404)
                    }
                }
            })

        }
    },
    register: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;
        let cadID = req.params.cadID;
        let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
        connection1.query(query, (err, result2) => {
            if (password.length > 6) {
                return res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Passwords must be at least 6 characters long!", cadId: result2[0].cadID });
            } else if (password2 !== password) {
                return res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Passwords are not the same!", cadId: result2[0].cadID });
            } else {
                let q1 = "SELECT username FROM `users` WHERE username = '" + username + "'"

                connection1.query(q1, (err, result) => {
                    if (result.length > 0) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Username is already in use, Please change username.", cadId: result2[0].cadID });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    } else {
                        if (username && password) {
                            connection1.query("INSERT INTO users (`username`, `password`, `cadID` ) VALUES ('" + username + "', '" + password + "', '" + cadID + "')", function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                if (results.length > 0) {
                                    res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Wrong Username or Password", cadId: result2[0].cadID });
                                } else {
                                    let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                                    connection1.query(query, (err, result2) => {
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
                                    })
                                }
                            });
                        } else {
                            res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again", cadId: result2[0].cadID });
                        }
                    }
                });
            }


        })

    },
    editAccountPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection1.query(query, (err, result1) => {
                let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                connection1.query(query, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.render("edit-account.ejs", { title: 'Edit Account | Equinox CAD', isAdmin: result1[0].admin, req: req, message: "", cadId: result2[0].cadID })
                        } else {
                            res.sendStatus(404)
                        }
                    }
                })
            });
        } else {
            let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query, (err, result2) => {
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
    editAccount: (req, res) => {

        if (!req.session.loggedin) {
            let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query, (err, result2) => {
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
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {

                        let newUsername = req.body.username;
                        let password = req.body.password;
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"

                        connection1.query(query, (err, result) => {

                            if (password !== result[0].password) {
                                let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                connection1.query(query, (err, result1) => {
                                    res.render("edit-account.ejs", { title: 'Edit Account | Equinox CAD', isAdmin: result1[0].admin, req: req, message: "Invalid Password", cadId: result2[0].cadID })
                                });
                            } else {
                                let old_name = req.session.username2;
                                let query3 = 'UPDATE `citizens` SET `linked_to` = "' + newUsername + '"  WHERE `citizens`.`linked_to` = "' + old_name + '"';
                                let query2 = 'UPDATE `users` SET `username` = "' + newUsername + '" WHERE `users`.`username` = "' + old_name + '"';
                                let query4 = 'UPDATE `officers` SET `linked_to` = "' + newUsername + '" WHERE `officers`.`linked_to` = "' + old_name + '"';

                                connection.query(`${query3}; ${query4}`, async (err1, result) => {
                                    connection1.query(`${query2};`, async (err, result1) => {

                                        if (err) {
                                            console.log(err);
                                        } else if (err) {
                                            console.log(err1);
                                        } else {
                                            req.session.destroy();
                                            await res.redirect(`/cad/${result2[0].cadID}/`)
                                        }
                                    })

                                })
                            }
                        })
                    } else {
                        res.sendStatus(404)
                    }
                }
            })

        }




    }
}