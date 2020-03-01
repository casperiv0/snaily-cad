module.exports = {
    addCarPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    res.render("vehicles/add-vehicle.ejs", { title: "Add Vehicle", isAdmin: result[0].admin })
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    addCar: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let name = req.body.cname;

                    let query = "INSERT INTO `vehicles` (`cname`) VALUES ('" + name + "')";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/cars/');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }

    },
    carValuePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let query = "SELECT * FROM `vehicles` ORDER BY id ASC"
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400)
                        }
                        res.render("admin-pages/vehicles.ejs", { title: 'Admin Panel | Values', vehicles: result, isAdmin: result[0].admin })
                    })
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    editVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let carId = req.params.id;
                    let query = "SELECT * FROM `vehicles` WHERE id = '" + carId + "' ";
                    connection.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.render("vehicles/edit-vehicle.ejs", { title: "Edit Vehicle", vehicle: result[0], isAdmin: result[0].admin })
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    editVehicle: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let carId = req.params.id;
                    let car_name = req.body.cname;
                    let myear = req.body.myear;
                    let query = 'UPDATE `vehicles` SET `cname` = "' + car_name + '", `myear` = "' + myear + '" WHERE `vehicles`.`id` = "' + carId + '"';

                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/cars');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }

    },
    deleteVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result) => {
                if (result[0].admin == 'moderator' || result[0].admin == 'admin') {
                    let playerId = req.params.id;
                    // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                    let deleteUserQuery = 'DELETE FROM vehicles WHERE id = "' + playerId + '"';

                    connection.query(deleteUserQuery, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/admin/values/cars');
                    });
                } else {
                    res.sendStatus(403)
                }
            })
        } else {
            res.redirect("/login")
        }
    },
    regVehiclePage: (req, res) => {
        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
        connection1.query(query, (err, result1) => {
            let query = "SELECT * FROM `citizens` ORDER BY id ASC"
            let carQ = "SELECT * FROM `vehicles` ORDER BY id ASC"
            let in_s = "SELECT * FROM `in_statuses` ORDER BY id ASC"
            let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"

            connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}`, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render("vehicles/reg-vehicle.ejs", { title: "Vehicle Registration", message: '', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].admin, name: req.session.username2, owners: result[3] })
            });
        });



    },
    regVehicle: (req, res) => {
        let plate = req.body.plate;
        let owner = req.body.owner;
        let vehicle = req.body.vehicle;
        let in_status = req.body.in_status;
        let color = req.body.color;
        let q1 = "SELECT plate FROM `registered_cars` WHERE plate = '" + plate + "'"

        connection.query(q1, (err, result) => {
            if (result.length > 0) {
                res.send("Plate Already Exists Please go back and change the plate.")
            } else {
                let query = "INSERT INTO `registered_cars` (`owner`, `vehicle`, `in_status`, `plate`, `color`) VALUES ('" + owner + "', '" + vehicle + "', '" + in_status + "', '" + plate + "', '" + color + "')";


                connection.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect("/citizen")
                });
            }
        })



    }

}
