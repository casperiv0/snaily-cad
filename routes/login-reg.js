const bcrypt = require('bcrypt');
const saltRounds = 15;

module.exports = {
    editAccountPage: (req, res) => {
        let query = "SELECT * FROM `users` WHERE username = ?";
        connection.query(query, [req.session.username2], (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Currently you are only able to edit your password, Username will follow up soon!', messageG: '' })
            }
        })
    },
    editAccountPassword: (req, res) => {

        let old_password = req.body.oldPassword;
        let password = req.body.password;
        let password2 = req.body.password2;

        if (password !== password2) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {

                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", messageG: '', message2: "Passwords Are Not The Same" })
                };
            });
        } else {
            let query = "SELECT * FROM `users` WHERE username = ?"

            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    bcrypt.compare(old_password, result[0].password, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result2 === true) {
                                let old_name = req.session.username2;
                                bcrypt.hash(password, saltRounds, (err2, hash) => {
                                    if (err2) {
                                        console.log(err2);
                                        return res.sendStatus(500)
                                    } else {
                                        let query2 = 'UPDATE `users` SET `password` = ? WHERE `users`.`username` = ?';
                                        connection.query(`${query2};`, [hash, old_name], async (err, result1) => {
                                            if (err) {
                                                console.log(err);
                                            } else if (err) {
                                                console.log(err1);
                                            } else {
                                                let query = "SELECT * FROM `users` WHERE username = ?";
                                                connection.query(query, [req.session.username2], (err, result1) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.sendStatus(500)
                                                    } else {
                                                        res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, messageG: 'Successfully Changed Password', message: "", message2: "", messageG: '' })
                                                    }
                                                });
                                            };
                                        });
                                    }
                                })
                            } else {
                                let query = "SELECT * FROM `users` WHERE username = ?";
                                connection.query(query, [req.session.username2], (err, result1) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Invalid Password', messageG: '' })
                                    }
                                });
                            };
                        };
                    });
                };
            });
        };
    },
    deleteAccount: (req, res) => {
        let username = req.body.username;
        let query = "DELETE FROM `users` WHERE username = '" + username + "'";
        let query2 = "DELETE FROM `citizens` WHERE `linked_to` = '" + username + "'";
        let query3 = "DELETE FROM `registered_weapons` WHERE `linked_to` = '" + username + "'";
        let query4 = "DELETE FROM `registered_cars` WHERE `linked_to` = '" + username + "'";
        let query5 = "DELETE FROM `officers` WHERE `linked_to` = '" + username + "'";
        let query6 = "DELETE FROM `posted_charges` WHERE `name` = '" + username + "'";

        connection.query(`${query2}; ${query3}; ${query4}; ${query5}; ${query6}`, (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                connection.query(query, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        let query = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

                        connection.query(query, async (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                if (result2[0]) {
                                    await req.session.destroy();
                                    await res.redirect(`/cad/${result2[0].cadID}/`);
                                } else {
                                    res.sendStatus(404);
                                };
                            };
                        });
                    };
                });
            };
        });
    }
};