module.exports = {
    citizenPage: (req, res, next) => {

        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {

            let query = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'"
            db2.query("SELECT * FROM `users`", (err, result1) => {
                db.query(query, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    res.render("citizens/citizen.ejs", { title: "Citizens", citizen: result, isAdmin: req.session.admin, message: "", username: req.session.username2 })
                })
            })
        }


    },
    citizenDetailPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {

            let id = req.params.id;
            let first_name = req.params.first_name;
            let last_name = req.params.last_name;
            // let owner = first_name + " " + last_name;
            let owner = req.params.first_name;
            let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
            let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "'"
            let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + first_name + "'"
            db.query(`${query}; ${vehiclesQ}; ${weaponsQ}`, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                console.log(result[0][0].full_name)
                if (result[0][0].full_name == req.session.username2) {
                    res.send('yours ')
                } else {
                    res.send('not yours ')
                }
                // res.render("citizens/detail-citizens.ejs", { title: "Citizen Detail", citizen: result[0], vehicles: result[1], weapons: result[2], isAdmin: req.session.admin })
            });
        }
    },
    addCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            let genderQ = "SELECT * FROM `genders`"
            let ethnicityQ = "SELECT * FROM `ethnicities`"
            let dmvQ = "SELECT * FROM `in_statuses`"
            db.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render("citizens/add-citizen.ejs", { title: "Add Citizen", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: req.session.admin, username: req.session.username2 })

            });
        }
    },
    addCitizen: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            // let first_name = req.body.first_name;
            let first_name = req.body.full_name;
            // let last_name = req.body.last_name;
            let last_name = "Unknown";
            // let full_name = first_name + " " + last_name;
            let full_name = first_name;
            let linked_to = req.session.username2;
            let birth = req.body.birth;
            let gender = req.body.gender;
            let ethnicity = req.body.ethnicity;
            let hair_color = req.body.hair;
            let eyes_color = req.body.eyes;
            let address = req.body.address;
            let height = req.body.height;
            if (height == "") {
                height = "Unknown"
            }
            let weight = req.body.weight;
            if (weight == "") {
                weight = "Unknown"
            }
            let dmv = req.body.dmv;
            let fireArms = req.body.fire;
            let pilot = req.body.pilot;



            let query = "INSERT INTO `citizens` ( `first_name`, `last_name`, `full_name`, `linked_to`, `birth`, `gender`, `ethnicity`, `hair`, `eyes`, `address`, `height`, `weight`, `dmv`, `fire_licence`, `pilot_licence`) VALUES ('" + first_name + "','" + last_name + "','" + full_name + "','" + linked_to + "','" + birth + "','" + gender + "','" + ethnicity + "','" + hair_color + "','" + eyes_color + "','" + address + "','" + height + "','" + weight + "', '" + dmv + "', '" + fireArms + "' ,'" + pilot + "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect(`/citizen`);
            });
        }
    },
    editCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            let genderQ = "SELECT * FROM `genders`"
            let ethnicityQ = "SELECT * FROM `ethnicities`"
            let dmvQ = "SELECT * FROM `in_statuses`"
            let id = req.params.id;
            let current = "SELECT * FROM `citizens` WHERE `id` = '" + id + "'"
            db.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}; ${current}`, (err, result) => {
                if (err) {
                    console.log(err)
                }
                res.render("citizens/edit-citizen.ejs", { title: "Edit Citizen | Equinox CAD", genders: result[0], ethnicities: result[1], dmvs: result[2], current: result[3], isAdmin: req.session.isAdmin, username: result[3] })
            });
        }
    },
    editCitizen: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            let id = req.params.id
            let first_name = req.body.full_name;
            // let last_name = req.body.last_name;
            let last_name = "Unknown";
            // let full_name = first_name + " " + last_name;
            let full_name = first_name;
            let birth = req.body.birth;
            let gender = req.body.gender;
            let ethnicity = req.body.ethnicity;
            let hair_color = req.body.hair;
            let eyes_color = req.body.eyes;
            let address = req.body.address;
            let height = req.body.height;
            if (height == "") {
                height = "Unknown"
            }
            let weight = req.body.weight;
            if (weight == "") {
                weight = "Unknown"
            }
            let dmv = req.body.dmv;
            let fireArms = req.body.fire;
            let pilot = req.body.pilot
            let query = 'UPDATE `citizens` SET `first_name` = "' + first_name + '", `last_name` = "' + last_name + '", `full_name` = "' + full_name + '", `birth` = "' + birth + '", `gender` = "' + gender + '", `ethnicity` = "' + ethnicity + '", `hair` = "' + hair_color + '", `eyes` = "' + eyes_color + '", `address` = "' + address + '", `height` = "' + height + '", `weight` = "' + weight + '", `dmv` = "' + dmv + '", `fire_licence` = "' + fireArms + '", `pilot_licence` = "' + pilot + '" WHERE `citizens`.`id` = "' + id + '"';
            db.query(query, (err, result) => {
                if (err) {
                    console.log(err)
                }
                res.redirect(`/citizens/${id}-${first_name}-${last_name}`)
            })
        }
    },
    deleteCitizens: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect("/login")
        } else {
            let playerId = req.params.id;
            // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
            let deleteUserQuery = 'DELETE FROM citizens WHERE id = "' + playerId + '"';

            db.query(deleteUserQuery, (err, result) => {

                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/citizen');
            });
        }
    }
}