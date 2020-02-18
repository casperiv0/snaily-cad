module.exports = {
    loginPage: (req, res) => {
        res.render("login-res/login.ejs", { title: "Login | Equinox CAD", isAdmin: req.session.isAdmin, message: "" })
    },
    login: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            db2.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username2 = username;
                    console.log("Successfully logged in at: " + req.connection.remoteAddress)

                    try {
                        db.query("SELECT * FROM `citizens` WHERE full_name = '" + req.session.username2 + "'", (err, result) => {
                            if (err) {
                                res.redirect("/citizen/add")
                            }
                            console.log(result)
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
                    console.log("log in failed at: ", req.connection.remoteAddress)
                }
                // res.end();
            });
        } else {
            res.render("login-res/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again" })

            res.end();
        }
    },
    registerPage: (req, res) => {
        res.render("login-res/reg.ejs", { title: "Register | Equuinox CAD", isAdmin: req.session.isAdmin, message: "" })
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
            db2.query("INSERT INTO users (`username`, `password` ) VALUES ('" + username + "', '" + password + "')", function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                console.log(results)
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