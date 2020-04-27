const bcrypt = require('bcrypt');
const saltRounds = 15;

module.exports = {
    loginPage: (req, res) => {
        if (req.session.loggedin) {
            res.redirect(`/citizen`)
        } else {
            res.render("login-res/login.ejs", { title: "Login | SnailyCAD", isAdmin: req.session.isAdmin, message: "", desc: "Login into your community CAD" })
        };
    },
    login: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;

        if (username && password) {
            connection.query('SELECT * FROM `users` WHERE username = ?', [username], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else if (results.length > 0) {
                    if (results[0].banned === 'true') {
                        res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: '', message: `You're banned for this server on this CAD. Reason: ${results[0].ban_reason}` })
                    } else {
                        let whitelisted = "SELECT * FROM `cad_info`"
                        connection.query(whitelisted, [req.params.cadID], (err, result5) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result5[0].whitelisted === "true") {
                                    let whitelist = "SELECT * FROM `users` WHERE `username` = ? "
                                    connection.query(whitelist, [username], (err, result4) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            if (result4[0].whitelist_status === "awaiting") {
                                                res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: '', message: `This account has not been accepted yet to this CAD. Please contact your community staff.` })
                                            } else if (result4[0].whitelist_status === "declined") {
                                                res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: '', message: `This account was declined. Please contact your community staff if you think this was a mistake.` })
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
                                                                } else {
                                                                    if (!result[0]) {
                                                                        res.redirect(`/citizen/add`);
                                                                    } else {
                                                                        res.redirect(`/citizen`);
                                                                    };
                                                                };
                                                            });
                                                        } else {
                                                            res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: '', message: "Wrong Username or Password!" })
                                                        };
                                                    };
                                                });
                                            };
                                        };
                                    });
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
                                                        res.redirect(`/citizen/add`)
                                                    }
                                                    else {
                                                        res.redirect(`/citizen`)
                                                    }
                                                })
                                            } else {
                                                res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: '', message: "Wrong Username or Password!" })
                                            };
                                        };
                                    });
                                };
                            };
                        });
                    };
                } else {
                    res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: '', message: "Wrong Username or Password!" })
                }
                // res.end();
            });
        } else {
            res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: "", message: "Something went wrong! Please try again" })
            res.end();
        }
    },
    registerPage: (req, res) => {
        if (req.session.loggedin) {
            res.redirect("/citizen")
        } else {
            res.render("login-res/reg.ejs", { desc: "", title: "Register | SnailyCAD", isAdmin: req.session.isAdmin, message: "" });
        };
    },
    register: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;


        if (password.length < 6) {
            return res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Passwords must be at least 6 characters long!" });
        } else if (password2 !== password) {
            return res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Passwords are not the same!" });
        } else {
            connection.query("SELECT * FROM `users`", (err, cad) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {

                    if (cad.length > 0) {
                        bcrypt.hash(password, saltRounds, function (err, hash) {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                let q1 = "SELECT username FROM `users` WHERE username = '" + username + "'";

                                connection.query(q1, (err, result) => {
                                    if (result.length > 0) {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            if (result2[0]) {
                                                res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Username is already in use, Please change username." });
                                            } else {
                                                res.sendStatus(404);
                                            };
                                        };
                                    } else {
                                        if (username && password) {
                                            let whitelist = "SELECT * FROM `cad_info`"

                                            connection.query(whitelist, (err, result3) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    if (result3[0].whitelisted === "true") {
                                                        if (result3[0].tow_whitelisted === "yes") {
                                                            let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                            connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "awaiting"], function (error, results, fields) {
                                                                if (error) {
                                                                    console.log(error);
                                                                    return res.sendStatus(500)
                                                                } else {
                                                                    if (results.length > 0) {
                                                                        res.render("login-res/reg.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: "", message: "Wrong Username or Password" });
                                                                    } else {
                                                                        req.session.loggedin = false;
                                                                        res.redirect(`/login`);
                                                                    };
                                                                };
                                                            });
                                                        } else {
                                                            let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                            connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "awaiting"], function (error, results, fields) {
                                                                if (error) {
                                                                    console.log(error);
                                                                } else {
                                                                    if (results.length > 0) {
                                                                        res.render("login-res/reg.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: "", message: "Wrong Username or Password" });
                                                                    } else {
                                                                        req.session.loggedin = false;
                                                                        res.redirect(`/login`);
                                                                    };
                                                                };
                                                            });
                                                        };
                                                    } else {
                                                        if (result3[0].tow_whitelisted === "yes") {
                                                            let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                            connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "accepted"], function (error, results, fields) {
                                                                if (error) {
                                                                    console.log(error);
                                                                } else {
                                                                    if (results.length > 0) {
                                                                        res.render("login-res/reg.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: "", message: "Wrong Username or Password", cadId: result2[0].cadID });
                                                                    } else {
                                                                        req.session.loggedin = true;
                                                                        req.session.username2 = username;
                                                                        res.redirect(`/citizen/add`);
                                                                    };
                                                                };
                                                            });
                                                        } else {
                                                            let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                            connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "accepted"], function (error, results, fields) {
                                                                if (error) {
                                                                    console.log(error);
                                                                } else {
                                                                    if (results.length > 0) {
                                                                        res.render("login-res/reg.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: "", message: "Wrong Username or Password", cadId: result2[0].cadID });
                                                                    } else {
                                                                        req.session.loggedin = true;
                                                                        req.session.username2 = username;
                                                                        res.redirect(`/citizen/add`);
                                                                    };
                                                                };
                                                            });
                                                        }
                                                    }
                                                };
                                            });
                                        } else {
                                            res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Something went wrong! Please try again", cadId: result2[0].cadID });
                                        };
                                    };
                                });
                            };
                        });
                    } else {

                        // SETUP FOR NEW CAD
                        if (password.length < 6) {
                            return res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Passwords must be at least 6 characters long!" });
                        } else if (password2 !== password) {
                            return res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Passwords are not the same!" });
                        } else {
                            bcrypt.hash(password, saltRounds, (err, hash) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                    let makeCad = "INSERT INTO `cad_info` (`owner`, `cad_name`, `AOP`, `whitelisted`) VALUES (?, ?, ?, ?)"
                                    connection.query(`${query}; ${makeCad}`, [username, hash, "owner", "yes", "yes", "yes", "", "", "accepted", username, "Change Me", "Change Me", "false"], function (error, results) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            req.session.loggedin = true;
                                            req.session.username2 = username;
                                            res.redirect(`/admin/edit-cad`);
                                        };
                                    });
                                };
                            });
                        };
                    };
                };
            })
        };
    },
    editAccountPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Currently you are only able to edit your password, Username will follow up soon!', messageG: '' })
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    editAccountPassword: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`);
        } else {

            let old_password = req.body.oldPassword;
            let password = req.body.password;
            let password2 = req.body.password2;

            if (password !== password2) {
                let query = "SELECT * FROM `users` WHERE username = ?";
                connection.query(query, [req.session.username2], (err, result1) => {

                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", messageG: '', message2: "Passwords Are Not The Same" })
                    };
                });
            } else {
                let query = "SELECT * FROM `users` WHERE username = ?"

                connection.query(query, [req.session.username2], (err, result) => {
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
                                            let query2 = 'UPDATE `users` SET `password` = ? WHERE `users`.`username` = ?';
                                            connection.query(`${query2};`, [hash, old_name], async (err, result1) => {
                                                if (err) {
                                                    console.log(err);
                                                } else if (err) {
                                                    console.log(err1);
                                                } else {
                                                    let query = "SELECT * FROM `users` WHERE username = ?";
                                                    connection.query(query, [req.session.username2], (err, result1) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.sendStatus(500)
                                                        } else {
                                                            res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, messageG: 'Successfully Changed Password', message: "", message2: "", messageG: '' })
                                                        }
                                                    });
                                                };
                                            });
                                        }
                                    })
                                } else {
                                    let query = "SELECT * FROM `users` WHERE username = ?";
                                    connection.query(query, [req.session.username2], (err, result1) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Invalid Password', messageG: '' })
                                        }
                                    });
                                };
                            };
                        });
                    };
                });
            };
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
                connection.query(query, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        let query = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

                        connection.query(query, async (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                if (result2[0]) {
                                    await req.session.destroy();
                                    await res.redirect(`/cad/${result2[0].cadID}/`);
                                } else {
                                    res.sendStatus(404);
                                };
                            };
                        });
                    };
                });
            };
        });
    }
};