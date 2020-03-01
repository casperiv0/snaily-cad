module.exports = {
    adminPanel: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    res.render("admin.ejs", { title: 'Admin Panel | Equinox CAD', isAdmin: result[0].admin })
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    usersPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` ORDER BY id ASC"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(`${query1}; ${query}`, (err, result) => {
                if (result[0][0].admin == 'admin') {
                    res.render("admin-pages/citizens.ejs", { title: 'Admin Panel | Citizens', users: result[1], isAdmin: result[0][0].admin })
                } else {
                    res.sendStatus(403)
                };
            });
        } else {
            res.redirect("/login")
        }


    },
    adminEditCitizenPage: (req, res) => {
        if (req.session.loggedin) {
            let id = req.params.id
            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(`${query1}; ${query}`, (err, result) => {
                if (result[0][0].admin == 'admin') {
                    res.render("admin-pages/edit-citizens.ejs", { title: 'Admin Panel | Citizens', user: result[1], isAdmin: result[0][0].admin, })
                } else {
                    res.sendStatus(403)
                };
            });
        } else {
            res.redirect("/login")
        }

    },
    adminEditCitizen: (req, res) => {
        if (req.session.loggedin) {
            let id = req.params.id
            let admin = req.body.admin
            let leo = req.body.leo
            let ems = req.body.ems
            console.log(ems, admin, leo);
            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            let query2 = 'UPDATE `users` SET `admin` = "' + admin + '", `leo` = "' + leo + '", `ems_fd` = "' + ems + '" WHERE `users`.`id` = "' + id + '"';
            connection1.query(`${query1}; ${query}`, (err, result) => {
                if (result[0][0].admin == 'admin') {
                    connection1.query(query2, (err, result1) => {
                        if (err) {
                            res.sendStatus(500).send(err)
                        } else {
                            res.redirect("/admin/users")
                        }
                    })
                } else {
                    res.sendStatus(403)
                };
            });
        } else {
            res.redirect("/login")
        }

    }

}
