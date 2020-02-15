module.exports = {
    addethnicityPage: (req, res) => {
        res.render("ethnicities/add-ethnicities.ejs", { title: "Add Ethnicities" })
    },
    addethnicity: (req, res) => {
        let ethnicity = req.body.ethnicity;

        let query = "INSERT INTO `ethnicities` (`ethnicity`) VALUES ('" + ethnicity + "')";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/ethnicities/');
        });
    },
    ethnicitiesPage: (req, res) => {
        let query = "SELECT * FROM `ethnicities` ORDER BY id ASC"
        db.query(query, (err, result) => {
            if (err) {
                res.sendStatus(400)
            }
            res.render("admin-pages/ethnicities.ejs", { title: 'Admin Panel | Values', ethnicities: result })
        })
    },
    editEthnicityPage: (req, res) => {
        let ethnicitiesId = req.params.id;
        let query = "SELECT * FROM `ethnicities` WHERE id = '" + ethnicitiesId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render("ethnicities/edit-ethnicities.ejs", { title: "Edit ethnicity", ethnicity: result[0] })
        });
    },
    editethnicity: (req, res) => {
        let carId = req.params.id;
        let ethnicity = req.body.ethnicity;
        let query = 'UPDATE `ethnicities` SET `ethnicity` = "' + ethnicity + '" WHERE `ethnicities`.`id` = "' + carId + '"';

        db.query(query, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/ethnicities');
        });
    },
    deleteEthnicity: (req, res) => {
        let playerId = req.params.id;
        // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM ethnicities WHERE id = "' + playerId + '"';

        db.query(deleteUserQuery, (err, result) => {
            console.log(`${playerId} was a success! DELETE`)
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/ethnicities');
        });
    }

}
