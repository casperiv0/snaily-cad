const router = require("express").Router();

// Main Departments Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const query = "SELECT * FROM `departments`";
                    connection.query(query, (err, result1) => {
                        if (err) {
                            res.sendStatus(500);
                        };
                        res.render("admin-pages/departments/departments.ejs", { desc: "", title: 'Departments | SnailyCAD', departments: result1, isAdmin: result[0].rank });
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username");
            };
        };
    });
});

// add Department Page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    res.render("admin-pages/departments/add-dept.ejs", { desc: "", title: "Add Department | SnailyCAD", isAdmin: result[0].rank, });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username");
            }
        }
    });
});

// Add Department
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const dept = req.body.dept;
                const query = "INSERT INTO `departments` (`name`) VALUES (?)";
                connection.query(query, [dept], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        const date = new Date()
                        const currentD = date.toLocaleString();
                        const action_title = `New Department Added by ${req.session.username2}.`

                        const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                        connection.query(actionLog, [action_title, currentD], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.redirect(`/admin/departments/`);
                            };
                        });
                    };
                });
            } else {
                res.sendStatus(403);
            };
        }
    });
});

// Edit Department Page
router.get("/edit/:deptId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let query = "SELECT * FROM `departments` WHERE id = ? ";
                    connection.query(query, [req.params.deptId], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.render("admin-pages/departments/edit-dept.ejs", { desc: "", title: "Edit Department", department: result1[0], isAdmin: result[0].rank });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username");
            };
        };
    });
});


// Edit Department
router.post("/edit/:deptId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const deptId = req.params.deptId;
                    const dept = req.body.dept;
                    const query = 'UPDATE `departments` SET `name` = ? WHERE `departments`.`id` = ?';

                    connection.query(query, [dept, deptId], (err) => {
                        if (err) {
                            console.log(err)
                            return res.sendStatus(500);
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `Department "${dept}" was edited by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/departments/`);
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username");
            };
        };
    });
});

// Delete Department
router.get("/delete/:deptId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const query = 'DELETE FROM `departments` WHERE id = ?';
                    connection.query(query, [req.params.deptId], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `A department was deleted by ${req.session.username2}.`
    
                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/departments/`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username");
            };
        };
    });
});

module.exports = router;