module.exports = {
    adminPanel: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    res.render("admin.ejs", { title: 'Admin Panel', isAdmin: result[0].admin })
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
