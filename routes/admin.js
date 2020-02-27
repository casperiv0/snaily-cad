module.exports = {
    adminPanel: (req, res) => {
        if (req.session.loggedinAdmin) {
            res.render("admin.ejs", { title: 'Admin Panel', isAdmin: req.session.admin })
        } else {
            res.redirect("/admin/login")

        }

    },
    adminLoginPage: (req, res) => {
        res.render("citizens/login.ejs", {
            title: "Admin Login | Equinox CAD",
            message: "Session expired, Please log back in.",
            isAdmin: req.session.admin,
            loggedIn: req.session.loggedin
        })
    }, 
    adminLogin: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedinAdmin = true;
                    req.session.username = username;
                    req.session.admin = true;
                    console.log("Successfully logged in at: " + req.connection.remoteAddress)
                    res.redirect('/admin');
                } else {
                    res.render("citizens/login.ejs", {
                        title: 'Admin Panel',
                        isAdmin: req.session.admin,
                        message: "Wrong Username or Password"
                    });
                    console.log("log in failed at: ", req.connection.remoteAddress)
                }
                res.end();
            });
        } else {
            res.render("citizens/login.ejs", {
                title: 'Admin Panel',
                isAdmin: req.session.admin,
                message: "Something went wrong! Please try again"
            })
            res.end();
        }
    },
    citizensPage: (req, res) => {
        if (req.session.loggedinAdmin) {
            let query = "SELECT * FROM `users` ORDER BY id ASC"
            connection1.query(query, (err, result) => {
                if (err) {
                    res.sendStatus(400)
                }
                res.render("admin-pages/citizens.ejs", { title: 'Admin Panel | Citizens', users: result, isAdmin: req.session.admin })
            })

        } else {
            res.redirect("/admin/login")
        }


    },
    deleteCitizen: (req, res) => {
        if (req.session.loggedinAdmin) {
            let playerId = req.params.id;
            // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
            let deleteUserQuery = 'DELETE FROM users WHERE id = "' + playerId + '"';

            connection.query(deleteUserQuery, (err, result) => {

                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/admin/citizens');
            });
        } else {
            res.redirect("/admin/login")

        }


    }

}
