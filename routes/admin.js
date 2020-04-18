module.exports = {
    adminPanel: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = ?";
            let query2 = "SELECT * FROM `users`";
            let citizenQ = "SELECT * FROM `citizens`";
            let weaponQ = "SELECT * FROM `registered_weapons`";
            let vehiclesQ = "SELECT * FROM `registered_cars`";
            let chargesQ = "SELECT * FROM `posted_charges`";
            let company = "SELECT * FROM `businesses` ";
            let postQ = "SELECT * FROM `posts` ";
            let bolosQ = "SELECT * FROM `bolos` ";
            let cad_info = "SELECT * FROM `cad_info`"
            connection.query(`${query}; ${cad_info}; ${query2};`, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection.query(`${citizenQ}; ${weaponQ}; ${vehiclesQ}; ${chargesQ}; ${company}; ${postQ}; ${bolosQ}`, (err, result3) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result[0][0].rank == 'moderator' || result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                                res.render("admin.ejs", { desc: "", title: 'Admin Panel | SnailyCAD', isAdmin: result[0][0].rank, users: result[1].length, cads: result[2], citizens: result3[0].length, weapons: result3[1].length, vehicles: result3[2].length, charges: result3[3].length, companies: result3[4].length, posts: result3[5].length, bolos: result3[6].length });
                            } else {
                                res.sendStatus(403);
                            };
                        };
                    });
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    usersPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT * FROM `cad_info`"
            let query = "SELECT * FROM `users` ORDER BY id ASC"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            let pendingUsers = "SELECT * FROM `users` WHERE  `whitelist_status` = 'awaiting'"

            connection.query(`${query2}; ${query1}; ${query}; ${pendingUsers}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[1][0].rank == 'admin' || result[1][0].rank == 'owner') {

                        res.render("admin-pages/citizens.ejs", { desc: "", title: 'Admin Panel | Citizens', users: result[2], isAdmin: result[1][0].rank, pending: result[3], whitelist: result[0][0] })
                    } else {
                        res.sendStatus(403)
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    adminEditCitizenPage: (req, res) => {
        if (req.session.loggedin) {
            const id = req.params.id
            const query = "SELECT * FROM `users` WHERE id = ?"
            const query1 = "SELECT * FROM `users` WHERE username = ?"
            const query3 = "SELECT * FROM `cad_info`"

            connection.query(`${query1}; ${query}; ${query3}`, [req.session.username2, id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                        res.render("admin-pages/edit-citizens.ejs", { desc: "", messageG: '', message: '', title: 'Admin Panel | Citizens', user: result[1], isAdmin: result[0][0].rank, req: req, cad_info: result[2][0] })
                    } else {
                        res.sendStatus(403)
                    };
                }
            });


        } else {
            res.redirect(`/login`)
        }

    },
    adminEditCitizen: (req, res) => {
        if (req.session.loggedin) {
            let query2;
            let id = req.params.id
            let admin = req.body.admin;
            let leo = req.body.leo;
            let ems = req.body.ems;
            let dispatch = req.body.dispatch;
            let tow = req.body.tow;
            if (tow === undefined) {
                tow = "yes"
            }
            if (admin == "") {
                query2 = 'UPDATE `users` SET `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '", `tow` = "' + tow + '" WHERE `users`.`id` = "' + id + '"';
            } else if (admin == undefined) {
                query2 = 'UPDATE `users` SET `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '", `tow` = "' + tow + '"  WHERE `users`.`id` = "' + id + '"';
            } else {
                query2 = 'UPDATE `users` SET `rank` = "' + admin + '", `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '", `tow` = "' + tow + '"  WHERE `users`.`id` = "' + id + '"';
            }
            let query = "SELECT * FROM `users` WHERE id = ?"
            let query1 = "SELECT * FROM `users` WHERE username = ?"
            let query3 = "SELECT * FROM `cad_info`"
            connection.query(`${query1}; ${query}; ${query3}`, [req.session.username2, id], (err, result5) => {
                if (err) {
                    console.log(er);
                    return res.sendStatus(500)
                } else {
                    if (result5[0][0].rank == 'admin' || result5[0][0].rank == 'owner') {
                        connection.query(query2, (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                let id = req.params.id
                                let query = "SELECT * FROM `users` WHERE id = ?"
                                let query1 = "SELECT * FROM `users` WHERE username = ?"
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `Updated Permissions for ${result5[1][0].username} by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

                                connection.query(`${actionLog}`, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        connection.query(`${query1}; ${query}`, [req.session.username2, id], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                                                    res.render("admin-pages/edit-citizens.ejs", { desc: "", messageG: 'Successfully saved changes', message: '', title: 'Edit User | SnailyCAD', user: result[1], isAdmin: result5[0][0].rank, req: req, cad_info: result5[2][0] })
                                                } else {
                                                    res.sendStatus(403);
                                                };
                                            };
                                        });
                                    };
                                });
                            };
                        })
                    } else {
                        res.sendStatus(403)
                    };
                }
            });
        } else {
            res.redirect(`/login`)
        }

    },
    editCADPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "'"

            connection.query(`${query}`, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'owner') {
                        let query2 = "SELECT * FROM `cad_info`";
                        connection.query(query2, (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: '', message: '', title: "CAD Settings | Equinox CAD", isAdmin: result[0].rank, current: result2[0] });
                            };
                        })
                    } else {
                        res.sendStatus(403)
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    editCAD: (req, res) => {
        if (req.session.loggedin) {
            let cad_name = req.body.cad_name
            let whitelisted = req.body.whitelist
            let tow_whitelist = req.body.tow_whitelist
            if (whitelisted === undefined) {
                whitelisted = "false"
            } else {
                whitelisted = "true"
            }            
            if (tow_whitelist === undefined) {
                tow_whitelist = "no"
            } else {
                tow_whitelist = "yes"
            }

            let query4 = "UPDATE `cad_info` SET `cad_name` = ?, `tow_whitelisted` = ?, `whitelisted` = ? ";

            let query = "SELECT * FROM `users` WHERE `username` = ?";
            connection.query(`${query}`, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'owner') {
                        connection.query(`${query4};`, [cad_name, tow_whitelist, whitelisted], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {

                                let cads = "SELECT * FROM `cad_info`"

                                connection.query(`${cads};`, (err, result2) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `CAD name was edited to "${cad_name}".`
                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

                                        connection.query(actionLog, [action_title, currentD], (err) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'Changes Successfully Saved', title: "CAD Settings | Equinox CAD", isAdmin: result[0].rank, current: result2[0] });
                                            };
                                        });
                                    };
                                });
                            };
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    deleteAllCitizens: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = ?"

            let date = new Date()
            let currentD = date.toLocaleString();
            let action_title = `All Citizens were deleted by ${req.session.username2}.`

            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

            connection.query(`${query}; ${actionLog}`, [req.session.username2, action_title, currentD], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0][0].rank == 'owner') {
                        connection.query("DELETE FROM `citizens`", (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'All Citizens Were Successfully Deleted.', current: "", title: "CAD Settings | Equinox CAD", isAdmin: result[0][0].rank })
                            };
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
    banUser: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query = "SELECT * FROM `users` WHERE `username` = ?"

            connection.query(`${query};`, [req.session.username2], (err, result55) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let userID = req.params.id;
                    let banReason = req.body.reason;
                    if (banReason === '') {
                        banReason = "None specified";
                    };

                    let query4 = "SELECT * FROM `users` WHERE `id` = ?";
                    connection.query(query4, [userID], (err, result4) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (req.session.username2 === result4[0].username) {
                                let id = req.params.id;
                                let query = "SELECT * FROM `users` WHERE id = ?";
                                let query1 = "SELECT * FROM `users` WHERE username = ?";

                                connection.query(`${query1}; ${query};`, [req.session.username2, id], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("admin-pages/edit-citizens.ejs", { desc: "", message: 'You are not able to ban yourself.', messageG: '', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].rank, req: req });
                                    };
                                });
                            } else {
                                let query = "UPDATE `users` SET `banned` = 'true', `ban_reason` = ? WHERE `users`.`id` = ?";

                                connection.query(query, [banReason, userID], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let id = req.params.id;
                                        let query = "SELECT * FROM `users` WHERE id = ?";
                                        let query1 = "SELECT * FROM `users` WHERE username = ?";
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let name = result4[0].username
                                        let action_title = `User ${name} was banned by ${req.session.username2}. Reason: ${banReason}`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                        connection.query(`${query1}; ${query};`, [req.session.username2, id], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                connection.query(actionLog, [action_title, currentD], (err, result1) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.sendStatus(500)
                                                    } else {
                                                        res.render("admin-pages/edit-citizens.ejs", { desc: "", message: '', messageG: `User was successfully banned. Reason: ${banReason}`, title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].rank, req: req });
                                                    };
                                                });
                                            }
                                        });
                                    };
                                });
                            };
                        };
                    });
                }
            });
        };
    },
    unBanUser: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query3 = "SELECT * FROM `users` WHERE `username` = ?"
            connection.query(`${query3};`, [req.session.username2], (err, result55) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let userID = req.params.id;
                    let query = "UPDATE `users` SET `banned` = 'false', `ban_reason` = '' WHERE `users`.`id` = ?";

                    connection.query(query, [userID], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let query = "SELECT * FROM `users` WHERE id = ?";
                            let query1 = "SELECT * FROM `users` WHERE username = ?";

                            connection.query(`${query1}; ${query};`, [req.session.username2, req.params.id], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    let date = new Date()
                                    let currentD = date.toLocaleString();

                                    let name = result[1][0].username
                                    let action_title = `User ${name} was unbanned by ${req.session.username2}.`

                                    let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                    connection.query(actionLog, [action_title, currentD], (err) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            res.render("admin-pages/edit-citizens.ejs", { desc: "", message: '', messageG: 'User was successfully unbanned.', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].rank, req: req });
                                        };
                                    });
                                }
                            });
                        };
                    });
                };
            });
        }
    },
    actionLogPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = ?"
            connection.query(`${query}`, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].rank == 'owner' || result[0].rank == 'admin' || result[0].rank == 'moderator') {
                            let query = "SELECT * FROM `action_logs` ORDER BY `date` DESC"
                            connection.query(`${query}`, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.render("admin-pages/action-logs.ejs", { desc: "", messageG: '', message: '', title: "Action Logs | Equinox CAD", isAdmin: result[0].rank, actions: result2 });
                                };
                            });
                        } else {
                            res.sendStatus(403)
                        };
                    } else {
                        res.status(500).send("something went wrong! Please report this bug at Discord DM's CasperTheGhost#4546 ");
                    };
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    acceptUser: (req, res) => {
        if (req.session.loggedin) {
            const query = "UPDATE `users` SET `whitelist_status` = ? WHERE `users`.`id` = ?"
            connection.query(query, ["accepted", req.params.userId], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect("/admin/users")
                }
            })
        } else {
            res.redirect(`/login`);
        }
    },
    declineUser: (req, res) => {
        if (req.session.loggedin) {
            const query = "UPDATE `users` SET `whitelist_status` = ? WHERE `users`.`id` = ?"
            connection.query(query, ["declined", req.params.userId], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect("/admin/users")
                }
            })
        } else {
            res.redirect(`/login`);
        }
    }
}
