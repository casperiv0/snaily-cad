module.exports = {
    addCarPage: (req, res) => {
        res.render("vehicles/add-vehicle.ejs", { title: "Add Vehicle" })
    },
    addCar: (req, res) => {
        let name = req.body.cname;
        let myear = req.body.myear;
        console.log(`${name} was a success! ADD`)

        let query = "INSERT INTO `vehicles` (`cname`, `myear`) VALUES ('" + name + "', '" + myear + "')";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/cars/');
        });
    },
    carValuePage: (req, res) => {
        let query = "SELECT * FROM `vehicles` ORDER BY id ASC"
        db.query(query, (err, result) => {
            if (err) {
                res.sendStatus(400)
            }
            res.render("admin-pages/vehicles.ejs", { title: 'Admin Panel | Values', vehicles: result })
        })
    },
    editVehiclePage: (req, res) => {
        let carId = req.params.id;
        let query = "SELECT * FROM `vehicles` WHERE id = '" + carId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render("vehicles/edit-vehicle.ejs", { title: "Edit Vehicle", vehicle: result[0] })
        });
    },
    editVehicle: (req, res) => {
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
            console.log(`yes?? ${car_name}`)
        });
    },
    deleteVehiclePage: (req, res) => {
        let playerId = req.params.id;
        // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM vehicles WHERE id = "' + playerId + '"';

        db.query(deleteUserQuery, (err, result) => {
            console.log(`${playerId} was a success! DELETE`)
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/cars');
        });
    }

}
