const router = require("express").Router();


// Main Vehicles Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                let query2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'false' ORDER BY id ASC";
                let query = "SELECT * FROM `vehicles` WHERE `default_car` = 'true' ";
                connection.query(`${query2}; ${query}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.render("admin-pages/vehicles/vehicles.ejs", { desc: "", title: 'Admin Panel | Values', vehicles: result[0], defaults: result[1], isAdmin: result1[0].rank });
                    };
                });
            } else {
                res.sendStatus(403);
            };
        }
    });
});

// Add Vehicle Page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                res.render("admin-pages/vehicles/add-vehicle.ejs", { desc: "", title: "Add Vehicle", isAdmin: result[0].rank });
            } else {
                res.sendStatus(403);
            };
        }
    });
});

// Add Vehicle
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const name = req.body.cname;
                const query = "INSERT INTO `vehicles` (`cname`, `default_car`) VALUES (?, ?)";
                connection.query(query, [name, "false"], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        const date = new Date()
                        const currentD = date.toLocaleString();
                        const action_title = `Vehicle ${name} was added by ${req.session.username2}.`

                        const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                        connection.query(actionLog, [action_title, currentD], (err, result3) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.redirect(`/admin/vehicles`);
                            };
                        });
                    }
                });
            } else {
                res.sendStatus(403);
            };
        };
    });
});

// Edit Vehicle Page
router.get("/edit/:carId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const carId = req.params.carId;
                const query = "SELECT * FROM `vehicles` WHERE id = ?";
                connection.query(query, [carId], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    res.render("admin-pages/vehicles/edit-vehicle.ejs", { desc: "", title: "Edit Vehicle", vehicle: result[0], isAdmin: result[0].rank });
                });
            } else {
                res.sendStatus(403);
            };
        };
    });
});

router.post("/edit/:carId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const carId = req.params.carId;
                const car_name = req.body.cname;
                const query = 'UPDATE `vehicles` SET `cname` = ? WHERE `vehicles`.`id` = ?';

                connection.query(query, [car_name, carId], (err) => {
                    if (err) {
                        console.log(err)
                        return res.sendStatus(500);
                    } else {
                        const date = new Date()
                        const currentD = date.toLocaleString();
                        const action_title = `Vehicle ${car_name} was edited by ${req.session.username2}.`

                        const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                        connection.query(actionLog, [action_title, currentD], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.redirect(`/admin/vehicles`);
                            };
                        });
                    };
                });
            } else {
                res.sendStatus(403);
            };
        };
    });
});

router.get("/delete/:carId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const carId = req.params.carId;
                    const query = 'DELETE FROM `vehicles` WHERE id = ?';

                    connection.query(query, [carId], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `A vehicle was deleted by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/vehicles`);
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(403)
                };
            } else {
                res.send("There was an error getting your username")
            }
        }
    });
})

module.exports = router;