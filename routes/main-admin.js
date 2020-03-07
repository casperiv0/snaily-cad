module.exports = {
    adminDashboard: (req, res) => {
        if (req.session.mainLoggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.user + "'";
            connection1.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT * FROM `users` ORDER BY id ASC";
                    let cads = "SELECT `cadID` FROM `users` ORDER BY id ASC";
                    connection1.query(`${query2}; ${cads}`, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result[0].main_administrator_sM7a6mFOHI == '4d9OOeGOCV6eGOCV4d96') {
                                res.render("main-admin/dashboard.ejs", { title: "Admin | SnailyCAD", cadId: '', isAdmin: "", users: result2[0], cads: result2[1].length });
                            } else {
                                res.sendStatus(403);
                            };
                        };
                    });
                };
            });
        } else {
            res.redirect("/login");
        }
    },
    usernameAdminPage: (req, res) => {
        if (req.session.mainLoggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.user + "'";
            connection1.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    let query2 = "SELECT * FROM `users` WHERE username = '" + req.params.username + "'";
                    connection1.query(`${query2}`, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result[0].main_administrator_sM7a6mFOHI == '4d9OOeGOCV6eGOCV4d96') {
                                function makeid(length) {
                                    var result = '';
                                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                    var charactersLength = characters.length;
                                    for (var i = 0; i < length; i++) {
                                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                                    }
                                    return result;
                                }
                                res.render("main-admin/username.ejs", { title: "Admin | SnailyCAD", cadId: '', isAdmin: "", users: result2[0], IDs: makeid(10) });
                            } else {
                                res.sendStatus(403);
                            };
                        };
                    });
                };
            });
        } else {
            res.redirect("/login");
        };
    },
    usernameAdmin: (req, res) => {
        let CADID = req.body.cadID;
        let username = req.params.username
        let query = "UPDATE `users` SET `cadID` = '" + CADID + "' WHERE `users`.`username`= '" + username + "'";

        connection1.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                console.log(result);
                res.redirect("/admin/dashboard")
            }
        })
    }
}