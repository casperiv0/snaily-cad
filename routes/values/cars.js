module.exports = {
    carValuePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    let query2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'false' ORDER BY id ASC";
                    let querys = "SELECT * FROM `vehicles` WHERE `default_car` = 'true' ";
                    connection.query(`${query2}; ${querys}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.render("admin-pages/vehicles.ejs", { desc: "", title: 'Admin Panel | Values', vehicles: result[0], defaults: result[1], isAdmin: result1[0].rank });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect(`/login`);
        }

    },
    addCarPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    res.render("vehicles/add-vehicle.ejs", { desc: "", title: "Add Vehicle", isAdmin: result[0].rank });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect(`/login`);

        };
    },
    addCar: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let name = req.body.cname;
                    let query = "INSERT INTO `vehicles` (`cname`, `default_car`) VALUES (?, ?)";
                    connection.query(query, [name, "false"], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `Vehicle ${name} was added by ${req.session.username2}.`

                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err, result3) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/values/cars/`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    editVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let carId = req.params.id;
                        let query = "SELECT * FROM `vehicles` WHERE id = '" + carId + "' ";
                        connection.query(query, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            res.render("vehicles/edit-vehicle.ejs", { desc: "", title: "Edit Vehicle", vehicle: result[0], isAdmin: result[0].rank });
                        });
                    } else {
                        res.sendStatus(403);
                    };
                }

            });
        } else {
            res.redirect(`/login`);
        };
    },
    editVehicle: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let carId = req.params.id;
                        let car_name = req.body.cname;
                        let query = 'UPDATE `vehicles` SET `cname` = ? WHERE `vehicles`.`id` = ?';

                        connection.query(query, [car_name, carId], (err, result) => {
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `Vehicle ${car_name} was edited by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err, result3) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/cars`);
                                    };
                                });
                            };
                        });
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        } else {
            res.redirect(`/login`)
        }

    },
    deleteVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                        let carId = req.params.id;
                        let query = 'DELETE FROM `vehicles` WHERE id = ?';

                        connection.query(query, [carId], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let action_title = `A vehicle was deleted by ${req.session.username2}.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                                connection.query(actionLog, [action_title, currentD], (err, result3) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.redirect(`/admin/values/cars`);
                                    };
                                });
                            };
                        });
                    } else {
                        res.sendStatus(403)
                    };
                }
            });
        } else {
            res.redirect(`/login`)
        }
    },
    regVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                let query = "SELECT * FROM `citizens`  ORDER BY id ASC"
                let carQ = "SELECT * FROM `vehicles`   ORDER BY id ASC"
                let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
                let in_s = "SELECT * FROM `in_statuses`   ORDER BY id ASC"
                let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"
                let companiess = "SELECT * FROM `businesses` WHERE  `linked_to` = '" + req.session.username2 + "'"

                connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}; ${companiess}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        res.render("vehicles/reg-vehicle.ejs", { desc: "", title: "Vehicle Registration | SnailyCAD", message: '', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].rank, name: req.session.username2, owners: result[3], defaults: result[4], companies: result[5] });
                    };
                });
            });
        } else {
            res.redirect(`/login`);
        };
    },
    regVehicle: (req, res) => {
        if (req.session.loggedin) {
            function makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            let plate = req.body.plate;
            let owner = req.body.owner;
            let vehicle = req.body.vehicle;
            let vin_number = makeid(17)
            let in_status = req.body.in_status;
            let color = req.body.color;
            let linked_to = req.session.username2
            let companies = req.body.companies;
            if (in_status === "Company" && companies == "") {
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
                if (in_status === "Company" && companies !== "") {
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
                                                        if(err) {
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

                                            connection.query(query, [owner, vehicle, vin_number, in_status, plate, color, linked_to, companies], (err, result) => {
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

                                connection.query(query, [owner, vehicle, vin_number, in_status, plate, color, linked_to, companies], (err, result) => {
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
        } else {
            res.redirect(`/login`);
        }
    },
    editVehiclePageCitizen: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query = "SELECT * FROM `registered_cars` WHERE `plate` = '" + req.params.plate + "' "
                    let legalQ = "SELECT * FROM `in_statuses` "
                    let companiess = "SELECT * FROM `businesses`"

                    connection.query(`${query}; ${legalQ}; ${companiess}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500)
                        } else {
                            res.render("vehicles/citizen/edit-vehicle.ejs", { desc: "", title: "Edit Vehicle | SnailyCAD", message: '', current: result[0][0], legal: result[1], isAdmin: result1[0].rank, companies: result[2] })
                        };
                    });
                };
            });
        } else {
            res.redirect(`/login`)
        }
    },
    editVehicleCitizen: (req, res) => {
        if (req.session.loggedin) {

            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let id = req.params.car
                    let plate = req.params.plate;
                    let color = req.body.color;
                    let status = req.body.status
                    let company = req.body.companies

                    let query4 = "UPDATE `registered_cars` SET `color` = ?, `in_status` = ?, company = ? WHERE `registered_cars`.`id` = ?";

                    connection.query(`${query4};`, [color, status, company, id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.redirect(`/citizen`)
                        };
                    });
                }
            });
        } else {
            res.redirect(`/login`);
        };
    },
    deleteVehicleCitizen: (req, res) => {
        let id = req.params.car;

        let query = "DELETE FROM `registered_cars` WHERE `id` = ?";

        connection.query(query, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let q1 = "SELECT * FROM `citizens` WHERE `id` = '" + req.params.id + "'"
                connection.query(q1, (err, result3) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/citizens/${result3[0].id}-${result3[0].full_name}`);
                    }
                });
            };
        });
    }
};
