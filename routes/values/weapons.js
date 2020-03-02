module.exports = {
    weaponsPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let query = "SELECT * FROM `weapons` ORDER BY id ASC"
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400)
                        }
                        res.render("admin-pages/weapons.ejs", { title: 'Admin Panel | Weapons', weapons: result, isAdmin: req.session.isAdmin })
                    })
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    deleteWeapon: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let playerId = req.params.id;
                    // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                    let deleteUserQuery = 'DELETE FROM weapons WHERE id = "' + playerId + '"';

                    connection.query(deleteUserQuery, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/weapons');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    addWeaponPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    res.render("weapons/add-weapons.ejs", { title: "Add Weapon", isAdmin: req.session.isAdmin })
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    addWeapon: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let name = req.body.name;

                    let query = "INSERT INTO `weapons` (`name`) VALUES ('" + name + "')";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/weapons/');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        };
    },
    editWeaponPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let genderId = req.params.id;
                    let query = "SELECT * FROM `weapons` WHERE id = '" + genderId + "' ";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.render("weapons/edit-weapon.ejs", { title: "Edit Gender", weapon: result[0], isAdmin: req.session.isAdmin })
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        };
    },
    editWeapon: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let genderId = req.params.id;
                    let name = req.body.name;
                    let query = 'UPDATE `weapons` SET `name` = "' + name + '" WHERE `weapons`.`id` = "' + genderId + '"';

                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/weapons');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    regWeaponPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {

            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection1.query(query, (err, result1) => {
                let weapons = "SELECT * FROM `weapons` ORDER BY id ASC"
                let citizens = "SELECT * FROM `citizens`"
                let wStatusess = "SELECT * FROM `weaponstatus` ORDER BY id ASC"
                let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"

                connection.query(`${weapons}; ${citizens}; ${wStatusess}; ${ownerQ}`, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.render("weapons/reg-weapons.ejs", { title: "Weapon Registration", weapons: result[0], status: result[2], owners: result[1], isAdmin: result1[0].admin, name: req.session.username2, owner: result[3] })
                });
            });
        }
    },
    regWeapon: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            // let owner = req.body.owner;
            let owner = req.body.owner;
            let weapon = req.body.weapon;
            let status = req.body.status;
            let query = "INSERT INTO `registered_weapons` (`owner`, `weapon`, `status`) VALUES ('" + owner + "', '" + weapon + "', '" + status + "')";


            connection.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect("/citizen")
            });
        };
    }

}