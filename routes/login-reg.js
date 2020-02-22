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
            db2.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username2 = username;

                    try {
                        db.query("SELECT * FROM `citizens` WHERE full_name = '" + req.session.username2 + "'", (err, result) => {
                            if (err) {
                                res.redirect("/citizen/add")
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
            res.render("login-res/change.ejs", {title: "Change name | Equinox CAD",isAdmin: req.session.isAdmin, message: "", req: req  })
        }
    },
    changeUsername: (req, res) => {
        let old_name = req.body.old_name;
        let new_name = req.body.new_name;
        let query = "SELECT * FROM `users` WHERE username = '" + old_name + "' ";
        let query2 = 'UPDATE `users` SET `username` = "' + new_name + '" WHERE `users`.`username` = "' + old_name + '"';
        let query3 = 'UPDATE `citizens` SET `first_name` = "' + new_name + '", `full_name` = "' + new_name + '"  WHERE `citizens`.`first_name` = "' + new_name + '"';

        db2.query(query, (err, result1) => {
            db2.query(query2, (err, result2) => {
                db.query(query3, (err,result3) => {
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
        if (username && password) {
            // req.session.loggedin = true;

            db2.query("INSERT INTO users (`username`, `password` ) VALUES ('" + username + "', '" + password + "')", function (error, results, fields) {
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
}