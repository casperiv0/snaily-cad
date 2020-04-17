module.exports = {
    towPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT * FROM `users` WHERE username = ?"
            let query = "SELECT * FROM `cad_info`"

            connection.query(`${query2}; ${query}`, [req.session.username2], (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let calls = "SELECT * FROM `tow_calls`"
                        connection.query(`${calls};`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result2[1][0].tow_whitelisted === "yes") {
                                    if (result2[0][0].tow !== "yes") {
                                        res.render("tow/403.ejs", { desc: "", title: "unauthorized", isAdmin: result2[0][0].rank })
                                    } else {
                                        res.render("tow/tow.ejs", { desc: "", title: "Tow | SnailyCAD", isAdmin: result2[0][0].rank, calls: result, aop: result2[1][0] });
                                    }
                                } else {
                                    res.render("tow/tow.ejs", { desc: "", title: "Tow | SnailyCAD", isAdmin: result2[0][0].rank, calls: result, aop: result2[1][0] });
                                }
                            }
                        })
                    } else {
                        res.send("There was an error in the request");
                    };
                };
            });
        } else {
            res.redirect(`/login`);
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
        let query = "INSERT INTO `tow_calls` (`description`, `name`, `location`) VALUES (?, ?, ?)"

        connection.query(query, [desc, name, location, req.params.cadID], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/citizen`);
            };
        });
    },
    cancelCallTow: (req, res) => {
        if (req.session.loggedin) {
            let callID = req.params.callID;
            let query = "DELETE FROM `tow_calls` WHERE `id` = ?"

            connection.query(query, [callID, req.params.cadID], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect(`/tow`);
                }
            })
        } else {
            res.redirect(`/login`);
        }
    }
};
