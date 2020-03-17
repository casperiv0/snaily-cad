module.exports = {
    addDeptPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                    res.render("depts/add-dept.ejs", { title: "Add Department | SnailyCAD", isAdmin: result[0].admin, cadId: result2[0].cadID });
                                } else {
                                    res.sendStatus(403);
                                };
                            }
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    addDept: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {

                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let dept = req.body.dept;
                                let query = "INSERT INTO `deptartments` (`name`, `cadID`) VALUES ('" + dept + "', '" + req.params.cadID + "')";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `New Department Added by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/depts/`);
                                            };
                                        });
                                    };
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    deptPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                    let query = "SELECT * FROM `deptartments` WHERE `cadID` = '" + req.params.cadID + "'";
                                    connection.query(query, (err, result1) => {
                                        if (err) {
                                            res.sendStatus(500);
                                        };
                                        res.render("admin-pages/depts.ejs", { title: 'Departments | SnailyCAD', depts: result1, isAdmin: result[0].admin, cadId: result2[0].cadID });
                                    });
                                } else {
                                    res.sendStatus(403);
                                };
                            }
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    editDeptPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                    let ethnicitiesId = req.params.id;
                                    let query = "SELECT * FROM `deptartments` WHERE id = '" + ethnicitiesId + "' ";
                                    connection.query(query, (err, result1) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            res.render("depts/edit-dept.ejs", { title: "Edit Department | SnailyCAD", depts: result1[0], isAdmin: result[0].admin, cadId: result2[0].cadID });
                                        }
                                    });
                                } else {
                                    res.sendStatus(403);
                                };
                            }
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
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
    editDept: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let carId = req.params.id;
                                let dept = req.body.dept;
                                let query = 'UPDATE `deptartments` SET `name` = "' + dept + '" WHERE `deptartments`.`id` = "' + carId + '"';

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Department "${dept}" was edited by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/depts/`);
                                            };
                                        });
                                    }
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    deleteDept: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let playerId = req.params.id;
                                let deleteUserQuery = 'DELETE FROM deptartments WHERE id = "' + playerId + '"';
                                connection.query(deleteUserQuery, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `A department was deleted by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/depts/`);
                                            };
                                        });
                                    }
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    }
};
