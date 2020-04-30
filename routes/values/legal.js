const router = require("express").Router();
const usernameNotFound = "There was an error getting your username."

// Main Legal Status Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username =?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    let query = "SELECT * FROM `in_statuses`  ORDER BY id ASC";
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400)
                        } else {
                            res.render("admin-pages/legal-statuses/legal.ejs", { desc: "", title: 'Legal Statuses', legals: result, isAdmin: result1[0].rank });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});


// Add Legal Status Page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    res.render("admin-pages/legal-statuses/add-legal.ejs", { desc: "", title: "Add Legal | SnailyCAD", isAdmin: result1[0].rank });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});

// Add Legal Status
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const legalStatus = req.body.status;
                    const query = "INSERT INTO `in_statuses` (`status`) VALUES (?)";
                    connection.query(query, [legalStatus], (err) => {
                        if (err) {
                            res.console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `Legal Status ${legalStatus} was added by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/legal`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        }
    });
})

// Edit Legal Status Page
router.get("/edit/:legalId", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                let legalId = req.params.legalId;
                let query = "SELECT * FROM `in_statuses` WHERE id = ?";
                connection.query(query, [legalId], (err, result) => {
                    if (err) {
                        res.console.log(err);
                        return res.sendStatus(500);;
                    }
                    res.render("admin-pages/legal-statuses/edit-legal.ejs", { desc: "", title: "Edit Legal | SnailyCAD", legal: result[0], isAdmin: result1[0].rank, });
                });
            } else {
                res.sendStatus(403);
            };
        }
    });
})

// Edit Legal Status
router.post("/edit/:legalId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const legalId = req.params.legalId;
                    const name = req.body.status;
                    const query = 'UPDATE `in_statuses` SET `status` = ? WHERE `in_statuses`.`id` = ?';

                    connection.query(query, [name, legalId], (err) => {
                        if (err) {
                            console.log(err)
                            res.console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `Legal Status ${name} was edited by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/legal`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});

// Delete Legal Status
router.get("/delete/:legalId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const legalId = req.params.legalId;
                    const query = 'DELETE FROM `in_statuses` WHERE `id` = ?';

                    connection.query(query, [legalId], (err) => {
                        if (err) {
                            res.console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `A Legal Status was deleted by ${req.session.username2}.`
                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/legal`);
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});


module.exports = router;
