const router = require("express").Router();
const bcrypt = require('bcrypt');
const saltRounds = 15;


// Login Page
router.get("/login", (req, res) => {
    res.render("login-res/login.ejs", { title: "Login | SnailyCAD", isAdmin: req.session.isAdmin, message: "", desc: "Login into your community CAD" })
});

// Login Use
router.post("/login", (req, res) => {
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
                                            res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: result4[0].rank, message: `This account has not been accepted yet to this CAD. Please contact your community staff.` })
                                        } else if (result4[0].whitelist_status === "declined") {
                                            res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: result4[0].rank, message: `This account was declined. Please contact your community staff if you think this was a mistake.` })
                                        } else {
                                            bcrypt.compare(password, results[0].password, (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    if (result == true) {
                                                        req.session.loggedin = true;
                                                        req.session.username2 = username;
                                                        connection.query("SELECT * FROM `citizens` WHERE linked_to = ?", [req.session.username2], (err, result) => {
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
                                                        res.render("login-res/login.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: result4[0].rank, message: "Wrong Username or Password!" })
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
});

// Register Page
router.get("/register", (req, res) => {
    res.render("login-res/reg.ejs", { desc: "", title: "Register | SnailyCAD", isAdmin: "", message: "" });
});

// Register User
router.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;


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
                            let q1 = "SELECT username FROM `users` WHERE username = ?";

                            connection.query(q1, [username], (err, result) => {
                                if (result.length > 0) {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Username is already in use, Please change username." });
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
                                                        // CAD whitelisted & Tow Whitelisted
                                                        let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                        connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "awaiting"], function (error, results) {
                                                            if (error) {
                                                                console.log(error);
                                                                return res.sendStatus(500)
                                                            } else {
                                                                if (results.length > 0) {
                                                                    res.render("login-res/reg.ejs", { desc: "", title: 'Login | SnailyCAD', isAdmin: "", message: "Wrong Username or Password" });
                                                                } else {
                                                                    req.session.loggedin = false;
                                                                    res.redirect(`/auth/login`);
                                                                };
                                                            };
                                                        });
                                                    } else {
                                                        // Only CAD Whitelisted
                                                        let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                        connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "awaiting"], function (error) {
                                                            if (error) {
                                                                console.log(error);
                                                            } else {
                                                                req.session.loggedin = false;
                                                                res.redirect(`/auth/login`);
                                                            };
                                                        });
                                                    };
                                                } else {
                                                    if (result3[0].tow_whitelisted === "yes") {
                                                        // CAD not whitelisted, Tow whitelisted
                                                        let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                        connection.query(query, [username, hash, "No Rank", "no", "no", "no", "no", "", "", "accepted"], function (error) {
                                                            if (error) {
                                                                console.log(error);
                                                            } else {
                                                                req.session.loggedin = true;
                                                                req.session.username2 = username;
                                                                res.redirect(`/citizen/add`);

                                                            };
                                                        });
                                                    } else {
                                                        // CAD & Tow Not whitelisted
                                                        let query = "INSERT INTO users (`username`, `password`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                                        connection.query(query, [username, hash, "No Rank", "no", "no", "no", "yes", "", "", "accepted"], function (error) {
                                                            if (error) {
                                                                console.log(error);
                                                            } else {
                                                                req.session.loggedin = true;
                                                                req.session.username2 = username;
                                                                res.redirect(`/citizen/add`);
                                                            };
                                                        });
                                                    }
                                                }
                                            };
                                        });
                                    } else {
                                        res.render("login-res/reg.ejs", { desc: "", title: 'Register | SnailyCAD', isAdmin: "", message: "Something went wrong! Please try again" });
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
});


module.exports = router;