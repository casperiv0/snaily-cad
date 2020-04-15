module.exports = {
    genderPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                        let query = "SELECT * FROM `genders` ORDER BY id ASC"
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.sendStatus(400)
                            }
                            res.render("admin-pages/gender.ejs", { desc: "", title: 'Admin Panel | Genders', genders: result, isAdmin: result1[0].rank, })
                        })
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    deleteGender: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let genderId = req.params.id;
                        let query = 'DELETE FROM `genders` WHERE id = "' + genderId + '"';

                        connection.query(query, (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                res.redirect(`/admin/values/genders`);
                            };
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    addGenderPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        res.render("genders/add-gender.ejs", { desc: "", title: "Add Gender", isAdmin: result[0].rank, });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    addGender: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let gender = req.body.gender;

                        let query = "INSERT INTO `genders` (`name`) VALUES (?)";
                        connection.query(query, [gender], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                res.redirect(`/admin/values/genders`)
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`);
        }
    },
    editGenderPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let genderId = req.params.id;
                        let query = "SELECT * FROM `genders` WHERE id = '" + genderId + "' ";
                        connection.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            };
                            res.render("genders/edit-gender.ejs", { desc: "", title: "Edit Gender", gender: result[0], isAdmin: result[0].rank, });
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        };
    },
    editGender: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let genderId = req.params.id;
                        let gender = req.body.gender;
                        let query = 'UPDATE `genders` SET `name` = ? WHERE `genders`.`id` = ?';

                        connection.query(query, [gender, genderId], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            res.redirect(`/admin/values/genders`)
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`)
        };
    }
};