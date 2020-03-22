module.exports = {
    towPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT * FROM `users` WHERE username = ?"
            let query = "SELECT * FROM `cads` WHERE `cadID` = ?"

            connection1.query(`${query2}; ${query}`, [req.session.username2, req.params.cadID], (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let calls = "SELECT * FROM `calls` WHERE `cadID` = ?"
                        connection.query(`${calls};`, [req.params.cadID], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("tow/tow.ejs", { desc: "", title: "Tow | SnailyCAD", isAdmin: result2[0][0].admin, cadId: result2[1][0].cadID, calls: result, aop: result2[1][0] });
                            }
                        })
                    } else {
                        res.send("There was an error in the request");
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

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
    createTowCall: (req, res) => {

        let name = req.body.name
        if (name === "") {
            name = "Not Specified"
        }
        let desc = req.body.description;
        if (desc === undefined) {
            desc = "Not Specified"
        }
        let location = req.body.location;
        console.log(`Name: ${name}, Desc: ${desc}, Location: ${location}`);
        let query = "INSERT INTO `calls` (`description`, `name`, `location`, `cadID`) VALUES (?, ?, ?, ?)"

        connection.query(query, [desc, name, location, req.params.cadID], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.redirect(`/cad/${result2[0].cadID}/citizen`);
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            };
        });
    },
    cancelCallTow: (req, res) => {
        if (req.session.loggedin) {
            let callID = req.params.callID;
            let query = "DELETE FROM `calls` WHERE `id` = ? AND `cadID` = ?"

            connection.query(query, [callID, req.params.cadID], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/tow`);
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                }
            })
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
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
        }
    }
};
