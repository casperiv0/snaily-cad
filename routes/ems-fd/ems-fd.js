module.exports = {
    emsPage: (req, res, next) => {

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
                                let qeury = "SELECT * FROM `ems-fd` ORDER by id ASC"
                                connection.query(qeury, (err, result) => {
                                    if (err) {
                                        res.send("Oops something went wrong!")
                                        console.log("Error" + err)
                                    }
                                    res.render("ems-fd/ems-fd.ejs", {
                                        title: "EMS/FD | SnailyCAD",
                                        users: "qsd",
                                        isAdmin: result1[0].admin,
                                        ems: result,
                                        cadId: result2[0].cadID
                                    });
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



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
    }
}