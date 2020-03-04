module.exports = {
    homePage: (req, res) => {
        res.render("index.ejs", { title: "Home | Equinox CAD", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2 })
    },
    cadHomePage: (req, res) => {
        res.render("main/home-page.ejs", { title: "Home | Equinox CAD", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2 })
    },
    manageAccountPage: (req, res) => {
        if (req.session.mainLoggedin) {
            connection2.query("SELECT * FROM `users` ")
            res.render("main/manage-account.ejs", { title: "Home | Equinox CAD", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2 })
        } else {
            res.redirect("/login")

        }
    },
    manageAccount: (req, res) => {
        if (req.session.mainLoggedin) {

            // Login Stuff


        } else {
            res.redirect("/login")
        }
    },
    loginPageMain: (req, res) => {
        res.render("main/login.ejs", { title: "Login In | SnailyCAD", message: "" })
    },
    loginMain: (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            connection2.query('SELECT * FROM `users` WHERE username = "' + username + '" AND password = "' + password + '"', (error, results, fields) => {
                if (error) {
                    return console.log(error);
                } else if (results.length > 0) {
                    req.session.mainLoggedin = true;
                    req.session.user = username;
                    res.redirect("/account")
                } else {
                    res.render("main/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Wrong Username or Password" })
                }
                // res.end();
            });
        } else {
            res.render("main/login.ejs", { title: 'Login | Equinox CAD', isAdmin: req.session.admin, message: "Something went wrong! Please try again later." })
            res.end();
        }
    },
    registerPageMain: (req, res) => {
        res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "" })
    },
    registerMain: (req, res) => {
        let username = req.body.username;
        let email = req.body.email
        let password = req.body.password;
        let password2 = req.body.password2;

        console.log(email);


        if (password !== password2) {
            res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "Passwords Are not the same!" })
        } else {
            connection2.query("SELECT email FROM `users` WHERE email = '" + email + "'", (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else if (result1.length > 0) {
                    res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "Email is already registered!" })
                } else {
                    connection2.query("SELECT username FROM `users` WHERE username = '" + username + "'", (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else if (result1.length > 0) {
                            res.render("main/register.ejs", { title: "Register | SnailyCAD", message: "Username is already in use! Please change to another username" });
                        } else {
                            connection2.query("INSERT INTO `users` (`username`, `email`, `password`) VALUES ('" + username + "', '" + email + "', '" + password + "')", (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    req.session.mainLoggedin = true;
                                    req.session.user = username;
                                    res.redirect("/");
                                };
                            });
                        };
                    });
                };
            });
        };
    },
    accountMainPage: (req, res) => {
        if (req.session.mainLoggedin) {
            connection2.query("SELECT * FROM `users` ")
            res.render("main/settings/account.ejs", { title: "Home | Equinox CAD", isAdmin: req.session.isAdmin, loggedin: req.session.loggedin, username: req.session.username2 })
        } else {
            res.redirect("/login")

        }
    }

}