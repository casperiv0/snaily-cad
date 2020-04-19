module.exports = {
    weaponsPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                        let query = "SELECT * FROM `weapons` ORDER BY id ASC"
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.sendStatus(400)
                            }
                            res.render("admin-pages/weapons.ejs", { desc: "", title: 'Admin Panel | Weapons', weapons: result, isAdmin: result1[0].rank, })
                        })
                    } else {
                        res.sendStatus(403)
                    };
                };
            });
        } else {
            res.redirect("/login")
        }
    },
    deleteWeapon: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let weaponId = req.params.id;
                        let deleteUserQuery = 'DELETE FROM weapons WHERE id = ?';

                        connection.query(deleteUserQuery, [weaponId], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);;
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `A weapon was deleted by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/weapons`);
                                    };
                                });
                            };
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect("/login");
        };
    },
    addWeaponPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                        res.render("weapons/add-weapons.ejs", { desc: "", title: "Add Weapon", isAdmin: result1[0].rank, });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect("/login");
        }
    },
    addWeapon: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let name = req.body.name;

                        let query = "INSERT INTO `weapons` (`name`) VALUES (?)";
                        connection.query(query, [name], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);;
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `Weapon "${name}" was added by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/weapons`);
                                    };
                                });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`);
        };
    },
    editWeaponPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    let genderId = req.params.id;
                    let query = "SELECT * FROM `weapons` WHERE id = '" + genderId + "' ";
                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);;
                        }
                        res.render("weapons/edit-weapon.ejs", { desc: "", title: "Edit Gender", weapon: result[0], isAdmin: result1[0].rank, });
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    editWeapon: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let weaponId = req.params.id;
                        let name = req.body.name;
                        let query = 'UPDATE `weapons` SET `name` = ? WHERE `weapons`.`id` = ?';

                        connection.query(query, [name, weaponId], (err) => {
                            if (err) {
                                console.log(err)
                                console.log(err);
                                return res.sendStatus(500);;
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `Weapon "${name}" was edited by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`,`date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/weapons`);
                                    };
                                });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    regWeaponPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let weapons = "SELECT * FROM `weapons` ORDER BY id ASC"
                    let citizens = "SELECT * FROM `citizens` ORDER BY `full_name` ASC"
                    let wStatusess = "SELECT * FROM `in_statuses`  ORDER BY id ASC"
                    let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = ?"

                    connection.query(`${weapons}; ${citizens}; ${wStatusess}; ${ownerQ}`, [req.session.username2], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            res.render("weapons/reg-weapons.ejs", { title: "Weapon Registration", weapons: result[0], status: result[2], owners: result[1], isAdmin: result1[0].rank, name: req.session.username2, owner: result[3], desc: "" })
                        }
                    });
                };
            });
        };
    },
    regWeapon: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            function makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            // let owner = req.body.owner;
            let owner = req.body.owner;
            let weapon = req.body.weapon;
            let status = req.body.status;
            let serial_number = makeid(10)

            let query = "INSERT INTO `registered_weapons` (`owner`, `weapon`, `serial_number`, `status`, `linked_to`) VALUES (?, ?, ?, ?, ?)";

            connection.query(query, [owner, weapon, serial_number, status, req.session.username2], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);;
                } else {
                    let query = "SELECT * FROM `users` WHERE username = ?";
                    connection.query(query, [req.session.username2], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            let query = "SELECT * FROM `citizens` WHERE linked_to = ?";
                            let query3 = "SELECT * FROM `users`";
                            let query4 = "SELECT * FROM `cad_info`"
                            connection.query(`${query3}; ${query4}`, (err, result4) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    connection.query(`${query}`,[req.session.username2 ], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].rank, message: "", messageG: 'Successfully Registered Weapon', username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP, desc: "See All your citizens, register vehicles or weapons here too." });
                                        }
                                    });
                                };
                            });
                        }
                    });
                }

            });
        };
    },
    citizenDeleteWeapon: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`);
        } else {
            let weaponId = req.params.weapon;
            let query = "DELETE FROM `registered_weapons` WHERE id = ?";

            connection.query(query, [weaponId], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500)
                } else {
                    let query = "SELECT * FROM `users` WHERE username = ?";
                    connection.query(query, [req.session.username2], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            let query = "SELECT * FROM `users` WHERE username = ?";
                            connection.query(query, [req.session.username2], (err, result1) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    let query = "SELECT * FROM `citizens` WHERE linked_to = ?";
                                    let query3 = "SELECT * FROM `users`";
                                    let query4 = "SELECT * FROM `cad_info`"
                                    connection.query(`${query3}; ${query4}`,  (err, result4) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            connection.query(`${query}`,[req.session.username2], (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    res.render("citizens/citizen.ejs", { desc: "See All your citizens, register vehicles or weapons here too.", title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].rank, message: "", messageG: 'Successfully Removed Weapon', username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP, });
                                                }
                                            });
                                        };
                                    });
                                }
                            });
                        };
                    });
                };
            });
        };
    }
};