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
    deleteAllCitizens: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = ?"

            let date = new Date()
            let currentD = date.toLocaleString();
            let action_title = `All Citizens were deleted by ${req.session.username2}.`

            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

            connection.query(`${query}; ${actionLog}`, [req.session.username2, action_title, currentD], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0][0].rank == 'owner') {
                        connection.query("DELETE FROM `citizens`", (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'All Citizens Were Successfully Deleted.', current: "", title: "CAD Settings | Equinox CAD", isAdmin: result[0][0].rank })
                            };
                        })
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    actionLogPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = ?"
            connection.query(`${query}`, [req.session.username2], (err, result) => {
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
                                    res.render("admin-pages/action-logs.ejs", { desc: "", messageG: '', message: '', title: "Action Logs | Equinox CAD", isAdmin: result[0].rank, actions: result2 });
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
    }
}
