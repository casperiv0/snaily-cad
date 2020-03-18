const bcrypt = require('bcrypt');
const saltRounds = 15;
const d = new Date()
module.exports = {
    homePage: (req, res, next) => {
        let query2 = "SELECT `cadID` FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'"
        connection1.query(query2, (err, result2) => {
            if (err) {
                connection1.query("INSERT INTO `errors` (`name`, `description`) VALUES ('" + err.name + "', '" + err.message + "')", (err2, resultError) => {
                    if (err2) {
                        console.log("error2" + err2);
                        // return res.sendStatus(500);
                    }
                    return res.sendStatus(500);
                });
            } else {
                if (!result2[0]) {
                    res.sendStatus(404)
                } else {
                    let query = "SELECT * FROM `cads` WHERE `cadID` = '" + result2[0].cadID + "'"
                    connection1.query(query, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            let expire_date = d.toLocaleDateString()
                            if (result[0].expire_date === expire_date) {
                                res.render("expired.ejs", { title: "Expired | SnailyCAD", isAdmin: '', cadId: result2[0].cadID })
                            } else {
                                res.render("index.ejs", { title: "Home | SnailyCAD", isAdmin: '', loggedin: req.session.loggedin, username: req.session.username2, cadId: result2[0].cadID, req: req, desc: "" });
                            }
                        }
                    })
                }
            }
        })
        req
    },
    cadHomePage: (req, res) => {
        res.render("main/home-page.ejs", { title: "Home | SnailyCAD", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2, req: req, desc: "" })
    },
    manageAccountPage: (req, res) => {
        if (req.session.mainLoggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.user + "'";
            let que3 = "SELECT * FROM `cads` WHERE owner = '" + req.session.user + "'";
            connection1.query(`${query}; ${que3}`, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("main/manage-account.ejs", { title: "Account | SnailyCAD", message: "", messageG: "", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2, current: result2[0][0], subs: result2[1], req: req, desc: "see all your subscriptions or change your username or password."  })
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    manageAccount: (req, res) => {
        if (req.session.mainLoggedin) {
            let username = req.body.manage_username
            let password = req.body.password;


            let query = "SELECT * FROM `users` WHERE username = '" + req.session.user + "'"
            let query2 = 'UPDATE `users` SET `username` = "' + username + '" WHERE `users`.`username` = "' + req.session.user + '"';

            connection1.query(query, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let hash = result2[0].password
                    bcrypt.compare(password, hash, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result == true) {
                                connection1.query(`${query2};`, async (err, result3) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("main/manage-account.ejs", { title: "Account | SnailyCAD", message: '', messageG: 'Username Successfully changed.', loggedin: req.session.loggedin, username: req.session.username2, current: result2[0], subs: result2, req: req, desc: "" })
                                    }
                                })
                            } else {
                                connection1.query("SELECT * FROM `users` WHERE username = '" + req.session.user + "'", (err, result4) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("main/manage-account.ejs", { title: "Account | SnailyCAD", messageG: "", message: 'Passwords is incorrect!', loggedin: req.session.loggedin, username: req.session.username2, current: result4[0], subs: result4, req: req, desc: "" })
                                    }
                                })
                            };
                        };
                    });
                }
            })

        } else {
            res.redirect("/login")
        }
    },
    loginPageMain: (req, res) => {
        if (req.session.mainLoggedin) {
            res.redirect("/account")
        } else {
            res.render("main/login.ejs", { title: "Login In | SnailyCAD", message: "", req: req, desc: "Login to manage your account, see all your subscriptions and more." })
        }
    },
    loginMain: (req, res) => {
        let username = req.body.username;
        let password = req.body.password;


        if (username && password) {
            connection1.query('SELECT * FROM `users` WHERE username = "' + username + '"', (error, results, fields) => {
                if (error) {
                    return console.log(error);
                } else if (results.length > 0) {
                    bcrypt.compare(password, results[0].password, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result == true) {
                                req.session.mainLoggedin = true;
                                req.session.user = username;
                                res.redirect("/account");
                            } else {
                                res.render("main/login.ejs", { title: 'Login | SnailyCAD', isAdmin: req.session.admin, message: "Wrong Username or Password", req: req, desc: "" });
                            };
                        };
                    });
                } else {
                    res.render("main/login.ejs", { title: 'Login | SnailyCAD', isAdmin: req.session.admin, message: "Wrong Username or Password", req: req, desc: "" })
                }
                // res.end();
            });
        } else {
            res.render("main/login.ejs", { title: 'Login | SnailyCAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again later.", req: req, desc: "" })
            res.end();
        }
    },
    registerPageMain: (req, res) => {
        res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "", desc: "" })
    },
    registerMain: (req, res) => {
        let username = req.body.username;
        let email = req.body.email;
        let passwordInput = req.body.password;
        let password2Input = req.body.password2;



        if (passwordInput !== password2Input) {
            res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "Passwords Are not the same!", req: req, desc: "" })
        } else {
            bcrypt.hash(passwordInput, saltRounds, function (err, hash) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection1.query("SELECT email FROM `users` WHERE email = '" + email + "'", (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else if (result1.length > 0) {
                            res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "Email is already registered!", req: req, desc: "" })
                        } else {
                            connection1.query("SELECT username FROM `users` WHERE username = '" + username + "'", (err, result1) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else if (result1.length > 0) {
                                    res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "Username is already in use! Please change to another username", req: req, desc: "" });
                                } else {
                                    connection1.query("INSERT INTO `users` (`username`, `email`, `password`, `admin`, `leo`, `ems_fd`, `dispatch`, `cadID`, `main_administrator_sM7a6mFOHI`, `orderID`, `expired`, `banned`) VALUES ('" + username + "', '" + email + "', '" + hash + "', 'no', 'no', 'no', 'no', '', 'pi75PugYho', '', 'no', 'false')", (err, result2) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            req.session.mainLoggedin = true;
                                            req.session.user = username;
                                            res.redirect("/order");
                                        };
                                    });
                                };
                            });
                        };
                    });
                };
            });

        };
    },
    changeUsernameMain: (req, res) => {
        if (req.session.mainLoggedin) {
            let old_username = req.session.user;
            let new_username = req.body.username;
            let query = "SELECT * FROM users WHERE username = '" + old_username + "'";
            let query2 = "UPDATE `users` SET `username` = '" + new_username + "' WHERE `users`.`username` = '" + old_username + "'";

            connection1.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    connection1.query(query2, (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.redirect("/account");
                        };
                    });
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    orderPage: (req, res) => {
        if (req.session.mainLoggedin) {
            res.render("main/order.ejs", { title: "Order | SnailyCAD", message: "", messageG: "", req: req, desc: ""});
        } else {
            res.redirect("/login");
        };
    },
    editPasswordPage: (req, res) => {
        if (req.session.mainLoggedin) {
            res.render("main/settings/password.ejs", { title: "Edit Password | SnailyCAD", message: '', isAdmin: '', req: req, desc: "" });
        } else {
            res.redirect("/login");
        };
    },
    editPassword: (req, res) => {
        if (req.session.mainLoggedin) {
            let username = req.params.username
            let oldPassword = req.body.old_password;
            let newPassword = req.body.password;
            let newPassword2 = req.body.password2;

            if (newPassword !== newPassword2) {
                res.render("main/settings/password.ejs", { title: "Edit Password | SnailyCAD", message: "Passwords Are not the same!", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2, req: req, desc: "" })
            } else {
                if (oldPassword && newPassword) {
                    connection1.query('SELECT * FROM `users` WHERE username = "' + username + '"', (error, results, fields) => {
                        if (error) {
                            return console.log(error);
                        } else if (results.length > 0) {
                            // console.log(results[0].password);
                            bcrypt.compare(oldPassword, results[0].password, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result == true) {
                                        bcrypt.hash(newPassword, saltRounds, function (err, hash) {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                let query = "UPDATE `users` SET `password`= '" + hash + "' WHERE username = '" + username + "'";
                                                connection1.query(query, async (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.sendStatus(500)
                                                    } else {
                                                        connection1.query("SELECT * FROM `users` WHERE username = '" + req.session.user + "'", async (err, result2) => {
                                                            if (err) {
                                                                console.log(err);
                                                                return res.sendStatus(500)
                                                            } else {
                                                                req.session.destroy()
                                                                await res.render("main/manage-account.ejs", { title: 'Manage Account | SnailyCAD', isAdmin: "", message: '', messageG: "Password Updated Successfully", current: result2[0], subs: result2, req: req, desc: "" })                                                            }
                                                        })

                                                    }
                                                })
                                            }
                                        });
                                    } else {
                                        res.render("main/settings/password.ejs", { title: 'Edit Password | SnailyCAD', isAdmin: req.session.admin, message: "Password doesn't match account", req: req, desc: "" });
                                    };
                                };
                            });
                        } else {
                            res.render("main/settings/password.ejs", { title: 'Edit Password | SnailyCAD', isAdmin: req.session.admin, message: "Password doesn't match account", req: req, desc: "" });
                        };
                    });
                } else {
                    res.render("main/settings/password.ejs", { title: 'Edit Password | SnailyCAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again later.", req: req, desc: "" })
                    res.end();
                };
            };
        } else {
            res.redirect("/login");
        };
    },
    allScreensPage: (req, res) => {
        res.render("main/all-screens.ejs", { title: "Screenshots | SnailyCAD", req: req, desc: "" })
    }
};