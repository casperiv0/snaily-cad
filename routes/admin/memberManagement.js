const router = require("express").Router();
const usernameNotFound = "There was an error getting your username."

// Members Page
router.get("/", (req, res) => {
    const query2 = "SELECT * FROM `cad_info`"
    const query = "SELECT * FROM `users` ORDER BY id ASC"
    const query1 = "SELECT * FROM `users` WHERE username = ?"
    const pendingUsers = "SELECT * FROM `users` WHERE  `whitelist_status` = 'awaiting'"

    connection.query(`${query2}; ${query1}; ${query}; ${pendingUsers}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[1][0]) {
                if (result[1][0].rank == 'admin' || result[1][0].rank == 'owner') {
                    res.render("admin-pages/management/members.ejs", { desc: "", title: 'Admin Panel | Citizens', users: result[2], isAdmin: result[1][0].rank, pending: result[3], whitelist: result[0][0] })
                } else {
                    res.sendStatus(403)
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});


// Edit Members Permissions Page
router.get("/edit/:memberId", (req, res) => {
    const id = req.params.memberId
    const query = "SELECT * FROM `users` WHERE id = ?"
    const query1 = "SELECT * FROM `users` WHERE username = ?"
    const query3 = "SELECT * FROM `cad_info`"

    connection.query(`${query1}; ${query}; ${query3}`, [req.session.username2, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0][0]) {
                if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                    res.render("admin-pages/management/edit-member.ejs", { desc: "", messageG: '', message: '', title: 'Admin Panel | Citizens', user: result[1], isAdmin: result[0][0].rank, req: req, cad_info: result[2][0] })
                } else {
                    res.sendStatus(403)
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});


// Edit members Permissions
router.post("/edit/:memberId", (req, res) => {
    let query2;
    let memberId = req.params.memberId
    let admin = req.body.admin;
    let leo = req.body.leo;
    let ems = req.body.ems;
    let dispatch = req.body.dispatch;
    let tow = req.body.tow;
    if (tow === undefined) {
        tow = "yes"
    }
    if (admin == "") {
        query2 = 'UPDATE `users` SET `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '", `tow` = "' + tow + '" WHERE `users`.`id` = "' + memberId + '"';
    } else if (admin == undefined) {
        query2 = 'UPDATE `users` SET `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '", `tow` = "' + tow + '"  WHERE `users`.`id` = "' + memberId + '"';
    } else {
        query2 = 'UPDATE `users` SET `rank` = "' + admin + '", `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '", `tow` = "' + tow + '"  WHERE `users`.`id` = "' + memberId + '"';
    }
    let query = "SELECT * FROM `users` WHERE id = ?"
    let query1 = "SELECT * FROM `users` WHERE username = ?"
    let query3 = "SELECT * FROM `cad_info`"
    connection.query(`${query1}; ${query}; ${query3}`, [req.session.username2, memberId], (err, result5) => {
        if (err) {
            console.log(er);
            return res.sendStatus(500)
        } else {
            if (result5[0][0].rank == 'admin' || result5[0][0].rank == 'owner') {
                connection.query(query2, (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        let query = "SELECT * FROM `users` WHERE id = ?"
                        let query1 = "SELECT * FROM `users` WHERE username = ?"
                        let date = new Date()
                        let currentD = date.toLocaleString();
                        let action_title = `Updated Permissions for ${result5[1][0].username} by ${req.session.username2}.`

                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

                        connection.query(`${actionLog}`, [action_title, currentD], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                connection.query(`${query1}; ${query}`, [req.session.username2, memberId], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        if (result[0][0]) {
                                            if (result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                                                res.render("admin-pages/management/edit-member.ejs", { desc: "", messageG: 'Successfully saved changes', message: '', title: 'Edit User | SnailyCAD', user: result[1], isAdmin: result5[0][0].rank, req: req, cad_info: result5[2][0] })
                                            } else {
                                                res.sendStatus(403);
                                            };
                                        } else {
                                            res.send(usernameNotFound);
                                        };
                                    };
                                });
                            };
                        });
                    };
                })
            } else {
                res.sendStatus(403)
            };
        };
    });
});


// Ban Member
router.post("/ban/:memberId", (req, res) => {
    let query = "SELECT * FROM `users` WHERE `username` = ?"

    connection.query(`${query};`, [req.session.username2], (err, result55) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            let memberId = req.params.memberId;
            let banReason = req.body.reason;
            if (banReason === '') {
                banReason = "None specified";
            };

            let query4 = "SELECT * FROM `users` WHERE `id` = ?";
            connection.query(query4, [memberId], (err, result4) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    // Check if username are the same (can't ban urself)
                    if (req.session.username2 === result4[0].username) {
                        let query = "SELECT * FROM `users` WHERE id = ?";
                        let query1 = "SELECT * FROM `users` WHERE username = ?";
                        const query3 = "SELECT * FROM `cad_info`"


                        connection.query(`${query1}; ${query}; ${query3}`, [req.session.username2, memberId], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("admin-pages/management/edit-member.ejs", { desc: "", message: 'You are not able to ban yourself.', messageG: '', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].rank, req: req, cad_info: result[2][0] });
                            };
                        });
                    } else {
                        // Ban the user
                        let query = "UPDATE `users` SET `banned` = 'true', `ban_reason` = ? WHERE `users`.`id` = ?";

                        connection.query(query, [banReason, memberId], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                let query = "SELECT * FROM `users` WHERE id = ?";
                                let query1 = "SELECT * FROM `users` WHERE username = ?";
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let name = result4[0].username
                                let action_title = `User ${name} was banned by ${req.session.username2}. Reason: ${banReason}`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                const query3 = "SELECT * FROM `cad_info`"
                                connection.query(`${query1}; ${query}; ${query3};`, [req.session.username2, memberId], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        connection.query(actionLog, [action_title, currentD], (err) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.render("admin-pages/management/edit-member.ejs", { desc: "", message: '', messageG: `User was successfully banned. Reason: ${banReason}`, title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].rank, req: req, cad_info: result[2][0] });
                                            };
                                        });
                                    }
                                });
                            };
                        });
                    };
                };
            });
        };
    });
})

// Unban Member
router.post("/unban/:memberId", (req, res) => {
    const query3 = "SELECT * FROM `users` WHERE `username` = ?"
    connection.query(`${query3};`, [req.session.username2], (err, result55) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            let memberId = req.params.memberId;
            let query = "UPDATE `users` SET `banned` = 'false', `ban_reason` = '' WHERE `users`.`id` = ?";

            connection.query(query, [memberId], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    let query = "SELECT * FROM `users` WHERE id = ?";
                    let query1 = "SELECT * FROM `users` WHERE username = ?";
                    const query3 = "SELECT * FROM `cad_info`"

                    connection.query(`${query1}; ${query}; ${query3}`, [req.session.username2, memberId], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();

                            const name = result[1][0].username
                            const action_title = `User ${name} was unbanned by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.render("admin-pages/management/edit-member.ejs", { desc: "", message: '', messageG: 'User was successfully unbanned.', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result55[0].rank, req: req, cad_info: result[2][0] });
                                };
                            });
                        }
                    });
                };
            });
        };
    });
});

// Accept User
router.get("/accept/:memberId", (req, res) => {
    const query = "UPDATE `users` SET `whitelist_status` = ? WHERE `users`.`id` = ?"
    connection.query(query, ["accepted", req.params.memberId], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.redirect("/admin/members");
        };
    });
});

// Decline User
router.get("/decline/:memberId", (req, res) => {
    const query = "UPDATE `users` SET `whitelist_status` = ? WHERE `users`.`id` = ?"
    connection.query(query, ["declined", req.params.memberId], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.redirect("/admin/members");
        };
    });
});

module.exports = router;