module.exports = {
    adminPanel: (req, res) => {
        if (req.session.loggedinAdmin) {
            res.render("admin.ejs", { title: 'Admin Panel', isAdmin: req.session.admin })
        } else {
            res.redirect("/admin/login")

        }

    },
    citizensPage: (req, res) => {
        if (req.session.loggedinAdmin) {
            let query = "SELECT * FROM `users` ORDER BY id ASC"
            db.query(query, (err, result) => {
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

            db.query(deleteUserQuery, (err, result) => {
                console.log(`${playerId} was a success! DELETE`)
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
