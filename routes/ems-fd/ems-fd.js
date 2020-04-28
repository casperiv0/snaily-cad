module.exports = {
    emsPage: (req, res, next) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].ems_fd == 'yes') {
                        let query = "SELECT * FROM `ems-fd` WHERE `linked_to` = ? ORDER by id ASC"
                        connection.query(query, [req.session.username2], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("ems-fd/ems-fd.ejs", {
                                    title: "EMS/FD | SnailyCAD",
                                    users: "qsd",
                                    isAdmin: result1[0].rank,
                                    ems: result,
                                    desc: ""
                                });
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
    emsDashPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].ems_fd == 'yes') {
                        let query = "SELECT * FROM `cad_info`"
                        let calssQ = "SELECT * FROM `911calls`"
                        connection.query(`${query}; ${calssQ}`, [req.session.username2], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("ems-fd/ems-dash.ejs", { title: "EMS/FD", isAdmin: result1[0].rank, desc: "", cad: result[0][0], calls: result[1]  });
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
    statusChangeEMS: (req, res) => {

        let id = req.body.id
        let status = req.body.status;
        let status2 = req.body.status2;
        if (status === "10-42 | 10-7") {
            status2 = "----------"
        }
        if (status2 === undefined) {
            status2 = "----------"
        }
        let query1 = "UPDATE `ems-fd` SET `status` = ?, `status2` = ? WHERE `ems-fd`.`id` = ?"
        connection.query(`${query1};`, [status, status2, id], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/ems-fd`);
            };
        });

    },
    addEMSPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(`${query}`, [req.session.username2], (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    res.render("ems-fd/add-ems.ejs", { desc: "", title: "Add EMS/FD Deputy | SnailyCAD", isAdmin: result2[0].rank })
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    addEMS: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = ?"
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result1[0].ems_fd == 'yes') {
                        let deputy_name = req.body.name;
                        let query = "INSERT INTO `ems-fd` (`name`, `linked_to`, `status`, `status2`) VALUES (?, ?, ?, ?)";

                        connection.query(query, [deputy_name, req.session.username2, '10-42 | 10-7', '----------'], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.redirect(`/ems-fd`);
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
    medicalSearch: (req, res) => {
        const name = req.params.name;

        const query = "SELECT * FROM `medical_records` WHERE `name` = ?"
        connection.query(query, [name], (err, result) => {
            if (err) {
                console.log(err);
                return res.send(err);
            } else {
                res.json(result);
            };
        });
    }
};