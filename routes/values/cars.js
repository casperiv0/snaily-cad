module.exports = {
    addCarPage: (req, res) => {
        if (req.session.loggedinAdmin) {
            res.render("vehicles/add-vehicle.ejs", { title: "Add Vehicle", isAdmin: req.session.admin })

        } else {
            res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.admin })
        }
        res.end();
    },
    addCar: (req, res) => {
        if (req.session.loggedinAdmin) {
            let name = req.body.cname;

            let query = "INSERT INTO `vehicles` (`cname`) VALUES ('" + name + "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/admin/values/cars/');
            });
        } else {
            res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.admin })
        }

    },
    carValuePage: (req, res) => {
        if (req.session.loggedinAdmin) {
            let query = "SELECT * FROM `vehicles` ORDER BY id ASC"
            db.query(query, (err, result) => {
                if (err) {
                    res.sendStatus(400)
                }
                res.render("admin-pages/vehicles.ejs", { title: 'Admin Panel | Values', vehicles: result, isAdmin: req.session.admin })
            })
        } else {
            res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.admin })
        }

    },
    editVehiclePage: (req, res) => {
        if (req.session.loggedinAdmin) {
            let carId = req.params.id;
            let query = "SELECT * FROM `vehicles` WHERE id = '" + carId + "' ";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render("vehicles/edit-vehicle.ejs", { title: "Edit Vehicle", vehicle: result[0], isAdmin: req.session.admin })
            });
        } else {
            res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.admin })
        }

    },
    editVehicle: (req, res) => {
        if (req.session.loggedinAdmin) {
            let carId = req.params.id;
            let car_name = req.body.cname;
            let myear = req.body.myear;
            let query = 'UPDATE `vehicles` SET `cname` = "' + car_name + '", `myear` = "' + myear + '" WHERE `vehicles`.`id` = "' + carId + '"';

            db.query(query, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err);
                }
                res.redirect('/admin/values/cars');
            });
        } else {
            res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.admin })
        }

    },
    deleteVehiclePage: (req, res) => {
        if (req.session.loggedinAdmin) {
            let playerId = req.params.id;
            // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
            let deleteUserQuery = 'DELETE FROM vehicles WHERE id = "' + playerId + '"';

            db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/admin/values/cars');
            });
        } else {
            res.render("errors/logged.ejs", { title: "Error", isAdmin: req.session.admin })
        }

    },
    regVehiclePage: (req, res) => {

        let query = "SELECT * FROM `citizens` ORDER BY id ASC"
        let carQ = "SELECT * FROM `vehicles` ORDER BY id ASC"
        let in_s = "SELECT * FROM `in_statuses` ORDER BY id ASC"
        let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '"+ req.session.username2+"'"

        db.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}`, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render("vehicles/reg-vehicle.ejs", { title: "Vehicle Registration", owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: req.session.admin, name: req.session.username2, owners: result[3] })
        });
    },
    regVehicle: (req, res) => {
        let plate = req.body.plate;
        let owner = req.body.owner;
        let vehicle = req.body.vehicle;
        let in_status = req.body.in_status;
        let color = req.body.color;
        let q1 = "SELECT plate FROM `registered_cars` WHERE plate = '"+ plate+ "'"

        db.query(q1, (err, result1) => {
            console.log(result1.forEach(plate => {
                plate.plate;
            }))
            if (plate === result1.plate) {
                res.send('Plate does exist')
            } else {
                res.send('plate does not exist')
            }
        })


        // let query = "INSERT INTO `registered_cars` (`owner`, `vehicle`, `in_status`, `plate`, `color`) VALUES ('" + owner + "', '" + vehicle + "', '" + in_status + "', '" + plate + "', '" + color + "')";


        // db.query(query, (err, result) => {
        //     if (err) {
        //         return res.status(500).send(err);
        //     }
        //     res.redirect("/citizen")
        // });
    }

}
