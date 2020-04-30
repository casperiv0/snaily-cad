const router = require("express").Router();


// Car registration
router.get("/register", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?";

    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            let query = "SELECT * FROM `citizens`  ORDER BY id ASC"
            let carQ = "SELECT * FROM `vehicles`   ORDER BY id ASC"
            let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
            let in_s = "SELECT * FROM `in_statuses`   ORDER BY id ASC"
            let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = ?"
            let companies = "SELECT * FROM `businesses` WHERE  `linked_to` = ?"

            connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}; ${companies}`, [req.session.username2, req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("vehicles/reg-vehicle.ejs", { desc: "", title: "Vehicle Registration | SnailyCAD", message: '', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].rank, name: req.session.username2, owners: result[3], defaults: result[4], companies: result[5] });
                };
            });
        }
    });
});


// Car registration
router.post("/register", (req, res) => {
    // Make a random vin number
    function makeVinNumber() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 17; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const plate = req.body.plate;
    const owner = req.body.owner;
    const vehicle = req.body.vehicle;
    const vin_number = makeVinNumber(17)
    const insuranceStatus = req.body.in_status;
    const color = req.body.color;
    const linked_to = req.session.username2;
    const companies = req.body.companies;

    if (insuranceStatus === "Company" && companies == "") {
        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
        connection.query(query, (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query = "SELECT * FROM `citizens` ORDER BY id ASC"
                let carQ = "SELECT * FROM `vehicles` ORDER BY id ASC"
                let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
                let in_s = "SELECT * FROM `in_statuses` ORDER BY id ASC"
                let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"
                let companiess = "SELECT * FROM `businesses`"

                connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}; ${companiess}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        res.render("vehicles/reg-vehicle.ejs", { desc: "", title: "Vehicle Registration | SnailyCAD", message: 'This vehicle Insurance status is selected as "Company", Please select which company.', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].rank, name: req.session.username2, owners: result[3], defaults: result[4], companies: result[5] });
                    };
                });
            }
        });
    } else {
        if (insuranceStatus === "Company" && companies !== "") {
            let query = "SELECT * FROM `citizens` WHERE `full_name` = ?"

            connection.query(query, [owner], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].vehicle_reg === "no") {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                let query = "SELECT * FROM `citizens` ORDER BY id ASC"
                                let carQ = "SELECT * FROM `vehicles` ORDER BY id ASC"
                                let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
                                let in_s = "SELECT * FROM `in_statuses` ORDER BY id ASC"
                                let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"
                                let companiess = "SELECT * FROM `businesses`"

                                connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}; ${companiess}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("vehicles/reg-vehicle.ejs", { desc: "", title: "Vehicle Registration | SnailyCAD", message: 'You are not allowed to register vehicles to this company. Please contact your company manager or owner', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].rank, name: req.session.username2, owners: result[3], defaults: result[4], companies: result[5] });
                                    };
                                });
                            }
                        });
                    } else {
                        let q1 = "SELECT plate FROM `registered_cars` WHERE plate = '" + plate + "'"
                        connection.query(q1, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                if (result.length > 0) {
                                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                                    connection.query(query, (err, result1) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            let query = "SELECT * FROM `citizens` ORDER BY id ASC"
                                            let carQ = "SELECT * FROM `vehicles` ORDER BY id ASC"
                                            let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
                                            let in_s = "SELECT * FROM `in_statuses` ORDER BY id ASC"
                                            let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = ?"
                                            let companiess = "SELECT * FROM `businesses`"

                                            connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}; ${companiess}`, [req.session.username2], (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    res.render("vehicles/reg-vehicle.ejs", { desc: "", title: "Vehicle Registration | SnailyCAD", message: 'Sorry! This plate already exists, please change the plate.', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].rank, name: req.session.username2, owners: result[3], defaults: result[4], companies: result[5] });
                                                    res.end()
                                                };
                                            });
                                        };
                                    });
                                } else {
                                    let query = "INSERT INTO `registered_cars` (`owner`, `vehicle`, `vin_number`, `in_status`, `plate`, `color`, `linked_to`, `company`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                                    connection.query(query, [owner, vehicle, vin_number, insuranceStatus, plate, color, linked_to, companies], (err) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            res.redirect(`/citizen`);
                                        };
                                    });
                                };
                            };
                        });
                    };
                };
            });
        } else {
            let q1 = "SELECT plate FROM `registered_cars` WHERE plate = '" + plate + "'"

            connection.query(q1, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result.length > 0) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";

                        connection.query(query, (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                let query = "SELECT * FROM `citizens` ORDER BY id ASC"
                                let carQ = "SELECT * FROM `vehicles` ORDER BY id ASC"
                                let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
                                let in_s = "SELECT * FROM `in_statuses` ORDER BY id ASC"
                                let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"
                                let companiess = "SELECT * FROM `businesses`"

                                connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}; ${companiess}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("vehicles/reg-vehicle.ejs", { desc: "", title: "Vehicle Registration", message: 'Sorry! This plate already exists, please change the plate.', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].rank, name: req.session.username2, owners: result[3], defaults: result[4], companies: result[5] });
                                        res.end()
                                    };
                                });
                            };
                        });
                    } else {
                        let query = "INSERT INTO `registered_cars` (`owner`, `vehicle`, `vin_number`, `in_status`, `plate`, `color`,  `linked_to`, `company`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                        connection.query(query, [owner, vehicle, vin_number, insuranceStatus, plate, color, linked_to, companies], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                res.redirect(`/citizen`);
                            };
                        });
                    };
                };
            });
        };
    };

});



// Update Registered Vehicle Page
router.get("/:id/:car-:plate/edit", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            let query = "SELECT * FROM `registered_cars` WHERE `plate` = ?"
            let legalQ = "SELECT * FROM `in_statuses` "
            let companiess = "SELECT * FROM `businesses`"

            connection.query(`${query}; ${legalQ}; ${companiess}`, [req.params.plate], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500)
                } else {
                    res.render("vehicles/citizen/edit-vehicle.ejs", { desc: "", title: "Edit Vehicle | SnailyCAD", message: '', current: result[0][0], legal: result[1], isAdmin: result1[0].rank, companies: result[2] })
                };
            });
        };
    });
});

// Update Registered Vehicle
router.post('/:id/:car-:plate/edit', (req, res) => {
    const id = req.params.car;
    const color = req.body.color;
    const status = req.body.status
    const company = req.body.companies

    let query4 = "UPDATE `registered_cars` SET `color` = ?, `in_status` = ?, company = ? WHERE `registered_cars`.`id` = ?";

    connection.query(`${query4};`, [color, status, company, id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/citizen`)
        };
    });
});

// Delete Registered vehicle
router.get("/:id/:car/delete", (req, res) => {
    const carId = req.params.car;
    const citizenId = req.params.id;
    const query = "DELETE FROM `registered_cars` WHERE `id` = ?";

    connection.query(query, [carId], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            let query = "SELECT * FROM `citizens` WHERE `id` = ?"
            connection.query(query, [citizenId], (err, result3) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    res.redirect(`/citizens/${result3[0].id}-${result3[0].full_name}`);
                }
            });
        };
    });
});


module.exports = router