module.exports = {
    addDeptPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        res.render("depts/add-dept.ejs", { desc: "", title: "Add Department | SnailyCAD", isAdmin: result[0].rank, });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/cad/${result2[0].cadID}/login`);

        };
    },
    addDept: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let dept = req.body.dept;
                        let query = "INSERT INTO `departments` (`name`) VALUES (?)";
                        connection.query(query, [dept], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `New Department Added by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/depts/`);
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
    deptPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let query = "SELECT * FROM `departments`";
                        connection.query(query, (err, result1) => {
                            if (err) {
                                res.sendStatus(500);
                            };
                            res.render("admin-pages/depts.ejs", { desc: "", title: 'Departments | SnailyCAD', depts: result1, isAdmin: result[0].rank });
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`)
        };
    },
    editDeptPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let query = "SELECT * FROM `departments` WHERE id = ? ";
                        connection.query(query, [req.params.id], (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                res.render("depts/edit-dept.ejs", { desc: "", title: "Edit Department | SnailyCAD", depts: result1[0], isAdmin: result[0].rank });
                            }
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }
            });
        } else {
            res.redirect(`/login`)
        }
    },
    editDept: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let deptId = req.params.id;
                        let dept = req.body.dept;
                        let query = 'UPDATE `departments` SET `name` = ? WHERE `departments`.`id` = ?';

                        connection.query(query, [dept, deptId], (err) => {
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `Department "${dept}" was edited by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/depts/`);
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
            res.redirect(`/login`);
        };
    },
    deleteDept: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let query = 'DELETE FROM `departments` WHERE id = ?';
                        connection.query(query, [req.params.id], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `A department was deleted by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/depts/`);
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
    }
};
