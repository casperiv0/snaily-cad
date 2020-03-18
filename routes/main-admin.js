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
                    let cads = "SELECT * FROM `cads` ORDER BY id ASC";
                    connection1.query(`${query2}; ${cads}`, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result[0].main_administrator_sM7a6mFOHI == '4d9OOeGOCV6eGOCV4d96') {
                                res.render("main-admin/dashboard.ejs", { desc: "", title: "Admin | SnailyCAD", cadId: '', isAdmin: "", users: result2[0], cads: result2[1] });
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
                    let cads = "SELECT * FROM `cads` WHERE owner = '" + req.params.username + "'";
                    let findCADID = "SELECT `cadID` FROM `cads` WHERE owner = '" + req.params.username + "'"
                    connection1.query(`${query2}; ${cads}; ${findCADID};`, (err, result2) => {
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
                                res.render("main-admin/username.ejs", {  desc: "",title: "Admin | SnailyCAD", cadId: '', isAdmin: "", users: result2[0][0], cads: result2[1], cad2: result2[2][0], IDs: makeid(10) });
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
        let orderID = req.body.orderID;
        let query = "UPDATE `users` SET `admin` = 'owner', `leo` = 'yes', `ems_fd` = 'yes', `dispatch` = 'yes', `cadID` = '" + CADID + "'  WHERE `users`.`username`= '" + username + "'";

        connection1.query(`${query}; ${cadS}`, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect("/admin/dashboard")
            }
        })
    },
    expireCAD: (req, res) => {
        let CADID = req.params.cadID;
        let d = new Date()
        let query = "UPDATE `cads` SET `expire_date` = '" + d.toLocaleDateString() + "' WHERE `cads`.`cadID` = '"+CADID+"'"

        connection1.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect("/admin/dashboard")
            }
        })
    },
    reactivateCAD: (req, res) => {
        let CADID = req.body.cadID;
        let username = req.body.username
        let query = "UPDATE `users` SET `admin` = 'admin', `leo` = 'yes', `ems_fd` = 'yes', `dispatch` = 'yes', `cadID` = '" + CADID + "', `expired` = 'no' WHERE `users`.`username`= '" + username + "'";

        connection1.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect("/admin/dashboard")
            }
        })
    },
    addCad: (req, res) => {
        let CADID = req.body.cadID;
        let username = req.params.username
        let orderID = req.body.orderID;
        let expire_date = req.body.expire_date;
        let cadS = "INSERT INTO `cads` (`cadID`, `orderID`, `owner`, `cad_name`, `AOP`, `expire_date`) VALUES ('" + CADID + "', '" + orderID + "', '" + username + "', '', 'N/A', '" + expire_date + "')";
        let userQ = "UPDATE `users` SET `admin` = 'owner' WHERE `username` = '" + username + "'"
        connection1.query(`${cadS}; ${userQ}`, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect("/admin/dashboard")
            }
        })
    }

}

