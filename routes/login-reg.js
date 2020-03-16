const bcrypt = require('bcrypt');
const saltRounds = 15;

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
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.render("login-res/login.ejs", { title: "Login | SnailyCAD", isAdmin: req.session.isAdmin, message: "", cadId: result2[0].cadID })

                    } else {
                        res.sendStatus(404)
                    }
                }
            });
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
                    connection1.query('SELECT * FROM `users` WHERE username = "' + username + '" AND cadID = "' + cadID + '"', (error, results, fields) => {
                        if (error) {
                            return console.log(error);
                        } else if (results.length > 0) {
                            if (results[0].banned === 'true') {
                                res.render("login-res/login.ejs", { title: 'Login | SnailyCAD', isAdmin: '', message: `You're banned for this server on this CAD. Reason: ${results[0].ban_reason}`, cadId: result2[0].cadID })
                            } else {
                                bcrypt.compare(password, results[0].password, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        if (result == true) {
                                            req.session.loggedin = true;
                                            req.session.username2 = username;
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
                                        } else {
                                            res.render("login-res/login.ejs", { title: 'Login | SnailyCAD', isAdmin: '', message: "Wrong Username or Password!", cadId: result2[0].cadID })
                                        };
                                    };
                                });
                            }
                        } else {
                            res.render("login-res/login.ejs", { title: 'Login | SnailyCAD', isAdmin: '', message: "Wrong Username or Password!", cadId: result2[0].cadID })
                        }
                        // res.end();
                    });
                } else {
                    res.render("login-res/login.ejs", { title: 'Login | SnailyCAD', isAdmin: "", message: "Something went wrong! Please try again", cadId: result2[0].cadID })
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
                        res.render("login-res/reg.ejs", { title: "Register | SnailyCAD", isAdmin: req.session.isAdmin, message: "", cadId: result1[0].cadID })
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
            if (password.length < 6) {
                return res.render("login-res/reg.ejs", { title: 'Login | SnailyCAD', isAdmin: "", message: "Passwords must be at least 6 characters long!", cadId: result2[0].cadID });
            } else if (password2 !== password) {
                return res.render("login-res/reg.ejs", { title: 'Login | SnailyCAD', isAdmin: "", message: "Passwords are not the same!", cadId: result2[0].cadID });
            } else {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    let q1 = "SELECT username FROM `users` WHERE username = '" + username + "'";
                    let cadID = req.params.cadID

                    connection1.query(q1, (err, result) => {
                        if (result.length > 0) {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                if (result2[0]) {
                                    res.render("login-res/reg.ejs", { title: 'Login | SnailyCAD', isAdmin: "", message: "Username is already in use, Please change username.", cadId: result2[0].cadID });
                                } else {
                                    res.sendStatus(404);
                                };
                            };
                        } else {
                            if (username && password) {
                                connection1.query("INSERT INTO users (`username`, `email`, `password`, `admin`, `leo`, `ems_fd`, `dispatch`, `cadID`,  `main_administrator_sM7a6mFOHI`, `orderID`, `expired`, `banned`, `ban_reason`) VALUES ('" + username + "', '" + username + "@" + cadID + "', '" + hash + "', 'no', 'no', 'no', 'no', '" + cadID + "', 'pi75PugYho', '', 'no', 'false', '')", function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        if (results.length > 0) {
                                            res.render("login-res/reg.ejs", { title: 'Login | SnailyCAD', isAdmin: "", message: "Wrong Username or Password", cadId: result2[0].cadID });
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
                                    }

                                });
                            } else {
                                res.render("login-res/reg.ejs", { title: 'Login | SnailyCAD', isAdmin: "", message: "Something went wrong! Please try again", cadId: result2[0].cadID });
                            };
                        };
                    });
                });
            };
        });
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
                            res.render("edit-account.ejs", { title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: '',messageG: '', cadId: result2[0].cadID })
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
    editAccountUsername: (req, res) => {
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
            connection1.query(query2, (err, result3) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result3[0]) {
                        let newUsername = req.body.username;
                        let password = req.body.password;
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"

                        connection1.query(query, (err, result) => {
                            bcrypt.compare(password, result[0].password, function (err, result2) {
                                if (result2 === true) {
                                    let old_name = req.session.username2;
                                    let query3 = 'UPDATE `citizens` SET `linked_to` = "' + newUsername + '"  WHERE `citizens`.`linked_to` = "' + old_name + '"';
                                    let query5 = 'UPDATE `cads` SET `owner` = "' + newUsername + '" WHERE `cads`.`owner` = "' + old_name + '"';
                                    let query2 = 'UPDATE `users` SET `username` = "' + newUsername + '" WHERE `users`.`username` = "' + old_name + '"';
                                    let query4 = 'UPDATE `officers` SET `linked_to` = "' + newUsername + '" WHERE `officers`.`linked_to` = "' + old_name + '"';
                                    connection.query(`${query3}; ${query4}`, async (err1, result) => {
                                        connection1.query(`${query2}; ${query5};`, async (err, result1) => {

                                            if (err) {
                                                console.log(err);
                                            } else if (err) {
                                                console.log(err1);
                                            } else {
                                                req.session.destroy();
                                                await res.redirect(`/cad/${result3[0].cadID}/`)
                                            };
                                        });
                                    });
                                } else {
                                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                    connection1.query(query, (err, result1) => {
                                        res.render("edit-account.ejs", { title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "Invalid Password",  messageG: '', message2: '', cadId: result3[0].cadID })
                                    });

                                };
                            });
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    editAccountPassword: (req, res) => {
        if (!req.session.loggedin) {
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
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result3) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result3[0]) {
                        let old_password = req.body.old_password;
                        let password = req.body.password;
                        let password2 = req.body.password2;

                        if (password !== password2) {
                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                            connection1.query(query, (err, result1) => {
                                let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                                connection1.query(query, (err, result2) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        if (result2[0]) {
                                            res.render("edit-account.ejs", { title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", messageG: '', message2: "Passwords Are Not The Same", cadId: result2[0].cadID })
                                        } else {
                                            res.sendStatus(404)
                                        };
                                    };
                                });
                            });
                        } else {
                            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"

                            connection1.query(query, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    bcrypt.compare(old_password, result[0].password, (err, result2) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            if (result2 === true) {
                                                let old_name = req.session.username2;
                                                bcrypt.hash(password, saltRounds, (err2, hash) => {
                                                    if (err2) {
                                                        console.log(err2);
                                                        return res.sendStatus(500)
                                                    } else {
                                                        let query2 = 'UPDATE `users` SET `password` = "' + hash + '" WHERE `users`.`username` = "' + old_name + '"';
                                                        connection1.query(`${query2};`, async (err, result1) => {
                                                            if (err) {
                                                                console.log(err);
                                                            } else if (err) {
                                                                console.log(err1);
                                                            } else {
                                                                let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                                                connection1.query(query, (err, result1) => {
                                                                    let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                                                                    connection1.query(query, (err, result2) => {
                                                                        if (err) {
                                                                            console.log(err);
                                                                            return res.sendStatus(500);
                                                                        } else {
                                                                            if (result2[0]) {
                                                                                res.render("edit-account.ejs", { title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, messageG: 'Successfully Changed Password', message: "", message2: "", cadId: result2[0].cadID, messageG: '', })
                                                                            } else {
                                                                                res.sendStatus(404)
                                                                            };
                                                                        };
                                                                    });
                                                                });
                                                            };
                                                        });
                                                    }
                                                })
                                            } else {
                                                let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                                connection1.query(query, (err, result1) => {
                                                    res.render("edit-account.ejs", { title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Invalid Password', messageG: '', cadId: result3[0].cadID })
                                                });
                                            };
                                        };
                                    });
                                };
                            });
                        };
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    deleteAccount: (req, res) => {
        let username = req.body.username;
        let query = "DELETE FROM `users` WHERE username = '" + username + "'";
        let query2 = "DELETE FROM `citizens` WHERE `linked_to` = '" + username + "'";
        let query3 = "DELETE FROM `registered_weapons` WHERE `linked_to` = '" + username + "'";
        let query4 = "DELETE FROM `registered_cars` WHERE `linked_to` = '" + username + "'";
        let query5 = "DELETE FROM `officers` WHERE `linked_to` = '" + username + "'";
        let query6 = "DELETE FROM `posted_charges` WHERE `name` = '" + username + "'";

        connection.query(`${query2}; ${query3}; ${query4}; ${query5}; ${query6}`, (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                connection1.query(query, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

                        connection1.query(query, async (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                if (result2[0]) {
                                    await req.session.destroy()
                                    await res.redirect(`/cad/${result2[0].cadID}/`)
                                } else {
                                    res.sendStatus(404)
                                }
                            }
                        })

                    }
                })
            }
        })
    }
};