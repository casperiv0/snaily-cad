module.exports = {
    emsPage: (req, res, next) => {
        if (req.session.loggedin) {
            let query2 = "SELECT `cadID` FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].ems_fd == 'yes') {
                                let qeury = "SELECT * FROM `ems-fd` WHERE `linked_to` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "' ORDER by id ASC"
                                connection.query(qeury, (err, result) => {
                                    if (err) {
                                        res.send("Oops something went wrong!")
                                        console.log("Error" + err)
                                    } else {
                                        res.render("ems-fd/ems-fd.ejs", {
                                            title: "EMS/FD | SnailyCAD",
                                            users: "qsd",
                                            isAdmin: result1[0].admin,
                                            ems: result,
                                            desc: "",
                                            cadId: result2[0].cadID
                                            
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
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }
    },
    statusChangeEMS: (req, res) => {
        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

        connection1.query(query2, (err, result2) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                if (result2[0]) {
                    let id = req.body.id
                    let status = req.body.status;
                    let status2 = req.body.status2;
                    if (status === "10-42 | 10-7") {
                        status2 = "----------"
                    }
                    if (status2 === undefined) {
                        status2 = "----------"
                    }
                    let query1 = "UPDATE `ems-fd` SET `status` = '" + status + "' WHERE `ems-fd`.`id` = '" + id + "'"
                    let query2 = "UPDATE `ems-fd` SET `status2` = '" + status2 + "' WHERE `ems-fd`.`id` = '" + id + "'"
                    connection.query(`${query1}; ${query2};`, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.redirect(`/cad/${result2[0].cadID}/ems-fd`);
                        };
                    });
                } else {
                    res.sendStatus(404);
                };
            };
        });
    },
    addEMSPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.render("ems-fd/add-ems.ejs", {  desc: "",title: "Add EMS/FD Deputy | SnailyCAD", cadId: result2[0].cadID, isAdmin: '' })
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
    addEMS: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result1) => {
                            if (result1[0].ems_fd == 'yes') {
                                let officer_name = req.body.name;
                                let cadID = req.params.cadID
                                let query = "INSERT INTO `ems-fd` ( `name`,`linked_to`,`status`,`status2`,`cadID`) VALUES ('" + officer_name + "','" + req.session.username2 + "','10-42 | 10-7', '----------', '" + cadID + "')";

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/cad/${result2[0].cadID}/ems-fd`)
                                    }
                                })
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