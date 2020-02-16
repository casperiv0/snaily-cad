module.exports = {
    addethnicityPage: (req, res) => {
        if (req.session.loggedin) {
            res.render("ethnicities/add-ethnicities.ejs", { title: "Add Ethnicities" })

        } else {
            res.render("errors/logged.ejs", { title: "Error" })
        }
    },
    addethnicity: (req, res) => {
        if (req.session.loggedin) {
            let ethnicity = req.body.ethnicity;

            let query = "INSERT INTO `ethnicities` (`ethnicity`) VALUES ('" + ethnicity + "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/admin/values/ethnicities/');
            });
        } else {
            res.render("errors/logged.ejs", { title: "Error" })
        }

    },
    ethnicitiesPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `ethnicities` ORDER BY id ASC"
            db.query(query, (err, result) => {
                if (err) {
                    res.sendStatus(400)
                }
                res.render("admin-pages/ethnicities.ejs", { title: 'Admin Panel | Values', ethnicities: result })
            })
        } else {
            res.render("errors/logged.ejs", { title: "Error" })
        }

    },
    editEthnicityPage: (req, res) => {
        if (req.session.loggedin) {
            let ethnicitiesId = req.params.id;
            let query = "SELECT * FROM `ethnicities` WHERE id = '" + ethnicitiesId + "' ";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render("ethnicities/edit-ethnicities.ejs", { title: "Edit ethnicity", ethnicity: result[0] })
            });
        } else {
            res.render("errors/logged.ejs", { title: "Error" })
        }

    },
    editethnicity: (req, res) => {
        if (req.session.loggedin) {
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
        } else {
            res.render("errors/logged.ejs", { title: "Error" })
        }

    },
    deleteEthnicity: (req, res) => {
        if (req.session.loggedin) {
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
        } else {
            res.render("errors/logged.ejs", { title: "Error" })
        }

    }

}
