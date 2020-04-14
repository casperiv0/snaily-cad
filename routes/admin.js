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

            connection.query(`${query1}; ${query}; ${pendingUsers}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {

                        res.render("admin-pages/citizens.ejs", { desc: "", title: 'Admin Panel | Citizens', users: result[1], isAdmin: result[0][0].rank, pending: result[2], whitelist: result[0] })
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
            let id = req.params.id
            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(`${query1}; ${query}`, (err, result) => {
                if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {

                    res.render("admin-pages/edit-citizens.ejs", { desc: "", messageG: '', message: '', title: 'Admin Panel | Citizens', user: result[1], isAdmin: result[0][0].rank, req: req })
                } else {
                    res.sendStatus(403)
                };
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
            if (admin == undefined) {
                query2 = 'UPDATE `users` SET `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '" WHERE `users`.`id` = "' + id + '"';
            } else {
                query2 = 'UPDATE `users` SET `admin` = "' + admin + '", `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '" WHERE `users`.`id` = "' + id + '"';
            }
            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(`${query1}; ${query}`, (err, result5) => {
                if (result5[0][0].rank == 'admin' || result5[0][0].rank == 'owner') {
                    connection.query(query2, (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let id = req.params.id
                            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
                            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `Updated Permissions for ${result5[1][0].username} by ${req.session.username2}.`

                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

                            connection.query(`${actionLog}`, [action_title, currentD], (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    connection.query(`${query1}; ${query}`, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                                                res.render("admin-pages/edit-citizens.ejs", { desc: "", messageG: 'Successfully saved changes', message: '', title: 'Edit User | SnailyCAD', user: result[1], isAdmin: result5[0][0].admin, req: req })
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
            });
        } else {
            res.redirect(`/login`)
        }

    },
    editCADPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"
            let cads = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'"

            connection.query(`${query}; ${cads}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0][0]) {
                        if (result[0][0].admin == 'owner') {
                            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                            connection.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: '', message: '', title: "CAD Settings | Equinox CAD", isAdmin: result[0][0].admin, cadId: result2[0].cadID, current: result[1][0] });
                                    } else {
                                        res.sendStatus(404);
                                    };
                                };
                            });
                        } else {
                            res.sendStatus(403)
                        };
                    } else {
                        res.send("Oops something went wrong during the request! Make sure you are logged in and on the correct CAD Id")
                    }
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }
    },
    editCAD: (req, res) => {
        if (req.session.loggedin) {
            let cad_name = req.body.cad_name
            let whitelisted = req.body.whitelist

            if (whitelisted === undefined) {
                whitelisted = "false"
            } else {
                whitelisted = "true"
            }

            let query4 = "UPDATE `cads` SET `cad_name` = '" + cad_name + "', `whitelisted` = '" + whitelisted + "' WHERE `cadID` = '" + req.params.cadID + "'";

            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'";
            connection.query(`${query}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].admin == 'owner') {
                        let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                        let cads = "SELECT * FROM `cads` WHERE `cadID` = '" + req.params.cadID + "'"
                        connection.query(`${query2}; ${cads};`, (err, result2) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                if (result2[0]) {
                                    let date = new Date()
                                    let currentD = date.toLocaleString();
                                    let action_title = `CAD name was edited to "${cad_name}".`

                                    let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                    connection.query(`${query4}; ${actionLog}`, (err, result5) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'Changes Successfully Saved', title: "CAD Settings | Equinox CAD", isAdmin: result[0].admin, cadId: result2[0][0].cadID, current: result2[1][0] });
                                        };
                                    });
                                } else {
                                    res.sendStatus(404);
                                };
                            };
                        });
                    } else {
                        res.sendStatus(403)
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }

    },
    deleteAllCitizens: (req, res) => {
        let cadID = req.params.cadID;
        let query = "DELETE FROM `citizens` WHERE `cadID` = '" + cadID + "'";

        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"

                let date = new Date()
                let currentD = date.toLocaleString();
                let action_title = `All Citizens were deleted by ${req.session.username2}.`

                let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + cadID + "', '" + currentD + "')"

                connection.query(`${query}; ${actionLog}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (result[0][0].admin == 'owner') {
                            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                            connection.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'All Citizens Were Successfully Deleted.', current: "", title: "CAD Settings | Equinox CAD", isAdmin: result[0][0].admin, cadId: result2[0].cadID })
                                    } else {
                                        res.sendStatus(404);
                                    };
                                };
                            });
                        } else {
                            res.sendStatus(403);
                        };
                    };
                });
            };
        });
    },
    banUser: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)

        } else {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "'"

            connection.query(`${query};`, (err, result55) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let cadID = req.params.cadID;
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
                                let query = "SELECT * FROM `users` WHERE id = '" + id + "'";
                                let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";

                                connection.query(query2, (err, result2) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        if (result2[0]) {
                                            connection.query(`${query1}; ${query};`, (err, result) => {
                                                res.render("admin-pages/edit-citizens.ejs", { desc: "", message: 'You are not able to ban yourself.', messageG: '', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].admin, req: req });
                                            });
                                        } else {
                                            res.sendStatus(404);
                                        };
                                    };
                                });
                            } else {
                                let query = "UPDATE `users` SET `banned` = 'true', `ban_reason` = '" + banReason + "' WHERE `users`.`id` = '" + userID + "'";

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let id = req.params.id;
                                        let query = "SELECT * FROM `users` WHERE id = '" + id + "'";
                                        let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let name = result4[0].username
                                        let action_title = `User ${name} was banned by ${req.session.username2}. Reason: ${banReason}`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                        connection.query(`${query1}; ${query};`, (err, result) => {
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
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        } else {
            let query3 = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"
            connection.query(`${query3};`, (err, result55) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let cadID = req.params.cadID;
                    let userID = req.params.id;
                    let query = "UPDATE `users` SET `banned` = 'false', `ban_reason` = '' WHERE `users`.`id` = '" + userID + "' AND `users`.`cadID` = '" + cadID + "'";

                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let id = req.params.id;
                            let query = "SELECT * FROM `users` WHERE id = '" + id + "'";
                            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'";

                            connection.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        connection.query(`${query1}; ${query};`, (err, result) => {
                                            let date = new Date()
                                            let currentD = date.toLocaleString();
                                            let name = result[1][0].username
                                            let action_title = `User ${name} was unbanned by ${req.session.username2}.`

                                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + cadID + "', '" + currentD + "')"
                                            connection.query(actionLog, (err, result22) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    res.render("admin-pages/edit-citizens.ejs", { desc: "", message: '', messageG: 'User was successfully unbanned.', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].admin, cadId: result2[0].cadID, req: req });
                                                };
                                            });
                                        });
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
    },
    actionLogPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "'"
            connection.query(`${query}`, (err, result) => {
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
                                    if (result2[0]) {
                                        res.render("admin-pages/action-logs.ejs", { desc: "", messageG: '', message: '', title: "Action Logs | Equinox CAD", isAdmin: result[0].rank, actions: result2 });
                                    } else {
                                        res.sendStatus(404);
                                    };
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
}
