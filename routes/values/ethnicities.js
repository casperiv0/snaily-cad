const router = require("express").Router();
const usernameNotFound = "There was an error getting your username."

// Main ethnicities Page
router.get("/", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let query = "SELECT * FROM `ethnicities`";
                    connection.query(query, (err, result1) => {
                        if (err) {
                            res.sendStatus(400);
                        } else {
                            res.render("admin-pages/ethnicities/ethnicities.ejs", { desc: "", title: 'Admin Panel | Values', ethnicities: result1, isAdmin: result[0].rank });
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

// Add Ethnicity Page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    res.render("admin-pages/ethnicities/add-ethnicities.ejs", { desc: "", title: "Add Ethnicities", isAdmin: result[0].rank });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});

// Add Ethnicity
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let ethnicity = req.body.ethnicity;
                    let query = "INSERT INTO `ethnicities` (`name`) VALUES (?)";
                    connection.query(query, [ethnicity], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            const date = new Date();
                            const currentD = date.toLocaleString();
                            const action_title = `Ethnicity ${ethnicity} was added by ${req.session.username2}.`;

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)";
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/admin/ethnicities`);
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

// Edit Ethnicity Page
router.get("/edit/:ethnicityId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
    connection.query(query, (err, result) => {
        if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
            const ethnicityId = req.params.ethnicityId;
            const query = "SELECT * FROM `ethnicities` WHERE id = ?";
            connection.query(query, [ethnicityId], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("admin-pages/ethnicities/edit-ethnicities.ejs", { desc: "", title: "Edit ethnicity | SnailyCAD", ethnicity: result1[0], isAdmin: result[0].rank });
                }
            });
        } else {
            res.sendStatus(403);
        };
    });
})

// Edit Ethnicity
router.post("/edit/:ethnicityId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let ethnicityId = req.params.ethnicityId;
                    let newEthnicity = req.body.ethnicity;
                    let query = 'UPDATE `ethnicities` SET `name` = ? WHERE `ethnicities`.`id` = ?';

                    connection.query(query, [newEthnicity, ethnicityId], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `Ethnicity ${newEthnicity} was edited by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/ethnicities`);
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

// Delete Ethnicity
router.get("/delete/:ethnicityId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const ethnicityId = req.params.ethnicityId;
                    const query = 'DELETE FROM `ethnicities` WHERE id = ?';

                    connection.query(query, [ethnicityId], (err) => {
                        if (err) {
                            return res.sendStatus(500);
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `An Ethnicity was deleted by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/ethnicities/`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound)
            };
        };
    });
})


module.exports = router;
