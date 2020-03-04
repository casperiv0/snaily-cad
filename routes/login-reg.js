module.exports = {
    loginPage: (req, res) => {
        if (req.session.loggedin) {
            res.redirect("/citizen")
        } else {
            res.render("login-res/login.ejs", { title: "Login | Equinox CAD", isAdmin: req.session.isAdmin, message: "" })
        }
    },
    login: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            connection1.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username2 = username;

                    try {
                        connection.query("SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'", (err, result) => {
                            if (err) {
                                res.sendStatus(500);
                                console.log(err);
                            }
                            if (!result[0]) {
                                res.redirect("/citizen/add")
                            }
                            else {
                                res.redirect("/citizen")
                            }
                        })
                    } catch {
                        res.redirect('/citizen/add');
                    }

                } else {
                    res.render("login-res/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Wrong Username or Password" })
                }
                // res.end();
            });
        } else {
            res.render("login-res/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again" })

            res.end();
        }
    },
    changeUsernamePage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            res.render("login-res/change.ejs", { title: "Change name | Equinox CAD", isAdmin: req.session.isAdmin, message: "", req: req })
        }
    },
    changeUsername: (req, res) => {
        let old_name = req.body.old_name;
        let new_name = req.body.new_name;
        let query = "SELECT * FROM `users` WHERE username = '" + old_name + "' ";
        let query2 = 'UPDATE `users` SET `username` = "' + new_name + '" WHERE `users`.`username` = "' + old_name + '"';
        let query3 = 'UPDATE `citizens` SET `first_name` = "' + new_name + '", `full_name` = "' + new_name + '"  WHERE `citizens`.`first_name` = "' + new_name + '"';

        connection1.query(query, (err, result1) => {
            connection1.query(query2, (err, result2) => {
                connection.query(query3, (err, result3) => {
                    console.log(result3);
                    console.log(result1);
                    console.log(result2);
                });
            });
            res.redirect("/citizen")
        });
    },
    registerPage: (req, res) => {
        if (req.session.loggedin) {
            res.redirect("/citizen")
        } else {
            res.render("login-res/reg.ejs", { title: "Register | Equinox CAD", isAdmin: req.session.isAdmin, message: "" })
        }
    },
    register: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;
        if (password2 !== password) {
            return res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Passwords are not the same!" })
            res.end();
        }
        let q1 = "SELECT username FROM `users` WHERE username = '" + username + "'"

        connection1.query(q1, (err, result) => {
            if (result.length > 0) {
                res.send("Username Already Exists Please go back and change the username.")
            } else {
                if (username && password) {
                    // req.session.loggedin = true;

                    connection1.query("INSERT INTO users (`username`, `password` ) VALUES ('" + username + "', '" + password + "')", function (error, results, fields) {
                        if (error) {
                            console.log(error)
                        }
                        if (results.length > 0) {
                            res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Wrong Username or Password" })
                        } else {

                            res.redirect('/login');
                        }
                        res.end();
                    });
                } else {
                    res.render("login-res/reg.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again" })

                    res.end();
                }
            }
        })

    },
    editAccountPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection1.query(query, (err, result1) => {
                res.render("edit-account.ejs", { title: 'Edit Account | Equinox CAD', isAdmin: result1[0].admin, req: req, message: "" })
            });
        } else {
            res.redirect("/login")
        }

    },
    editAccount: (req, res) => {

        if (!req.session.loggedin) {
            res.redirect("/login")


        } else {
            let newUsername = req.body.username;
            let password = req.body.password;
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"

            connection1.query(query, (err, result) => {

                if (password !== result[0].password) {
                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                    connection1.query(query, (err, result1) => {
                        res.render("edit-account.ejs", { title: 'Edit Account | Equinox CAD', isAdmin: result1[0].admin, req: req, message: "Invalid Password" })
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
                                await res.redirect("/")
                            }
                        })

                    })
                }
            })
        }




    }
}