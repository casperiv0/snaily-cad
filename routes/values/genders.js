module.exports = {
    genderPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let query = "SELECT * FROM `genders` ORDER BY id ASC"
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400)
                        }
                        res.render("admin-pages/gender.ejs", { title: 'Admin Panel | Genders', genders: result, isAdmin: req.session.isAdmin })
                    })
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login")
        }
    },
    deleteGender: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let playerId = req.params.id;
                    // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                    let deleteUserQuery = 'DELETE FROM genders WHERE id = "' + playerId + '"';

                    connection.query(deleteUserQuery, (err, result) => {

                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/genders');
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login")
        }
    },
    addGenderPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    res.render("genders/add-gender.ejs", { title: "Add Gender", isAdmin: req.session.isAdmin })
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login")
        }
    },
    addGender: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let gender = req.body.gender;

                    let query = "INSERT INTO `genders` (`gender`) VALUES ('" + gender + "')";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/genders/');
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login")
        }
    },
    editGenderPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let genderId = req.params.id;
                    let query = "SELECT * FROM `genders` WHERE id = '" + genderId + "' ";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        };
                        res.render("genders/edit-gender.ejs", { title: "Edit Gender", gender: result[0], isAdmin: req.session.isAdmin });
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    editGender: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let genderId = req.params.id;
                    let gender = req.body.gender;
                    let query = 'UPDATE `genders` SET `gender` = "' + gender + '" WHERE `genders`.`id` = "' + genderId + '"';

                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/genders');
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login")
        }
    }

}