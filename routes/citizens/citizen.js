const d = new Date();

module.exports = {
    citizenPage: (req, res, next) => {
        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
        connection.query(query, (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "'";
                let query3 = "SELECT * FROM `users`";
                let query4 = "SELECT * FROM `cad_info`"
                connection.query(`${query3}; ${query4}`, (err, result4) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        connection.query(`${query}`, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].rank, message: "", messageG: '', username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP, desc: "See All your citizens, register vehicles or weapons here too." });
                            }
                        });
                    };
                });
            }
        });
    },
    citizenDetailPage: (req, res) => {
        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
        connection.query(query, (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let id = req.params.id;
                let full_name = req.params.full_name;
                let owner = full_name;
                let isCeo = false;
                let username = req.session.username2;
                let query = "SELECT * FROM `citizens` WHERE id = ?";
                let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = ? AND `linked_to` = ?";
                let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = ?  AND `linked_to` = ?";
                let ceo = "SELECT business_owner FROM `businesses` WHERE `business_owner` = ?  AND `linked_to` = ?";
                let medicalRecords = "SELECT * FROM `medical_records` WHERE `name` = ?"
                connection.query(`${query}; ${vehiclesQ}; ${weaponsQ}; ${ceo}; ${medicalRecords}`, [id, owner, username, owner, username, owner, username, full_name], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (!result[0][0]) {
                            res.sendStatus(404)
                        } else {
                            if (result[0][0].linked_to.toLowerCase() === req.session.username2.toLowerCase()) {
                                res.render("citizens/detail-citizens.ejs", { title: "Citizen Detail | SnailyCAD", desc: "", citizen: result[0], vehicles: result[1], weapons: result[2], ceo: isCeo, isAdmin: result1[0].rank, desc: "See All the information about your current citizen.", req: req, medicalRecords: result[4] });
                            } else {
                                res.sendStatus(401);
                            };
                        }
                    }
                });
            };
        });
    },
    addCitizenPage: (req, res) => {
        let query = "SELECT * FROM `users` WHERE username = ?";
        connection.query(query, [req.session.username2], (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let genderQ = "SELECT * FROM `genders`"
                let ethnicityQ = "SELECT * FROM `ethnicities`"
                let dmvQ = "SELECT * FROM `in_statuses`"
                connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                    if (err) {
                        return res.sendStatus(500)
                    } else {
                        res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", message: "", desc: "", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].rank, username: req.session.username2 })
                    };
                });
            };
        });
    },
    addCitizen: (req, res) => {
        let query = "SELECT * FROM `users` WHERE username = ?";
        connection.query(query, [req.session.username2], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                if (req.files) {
                    const file = req.files ? req.files.citizen_pictures : null;
                    const fileName = req.files ? file.name : "no file uploaded";
                    let full_name = req.body.full_name;
                    let linked_to = req.session.username2;
                    let birth = req.body.birth;
                    let gender = req.body.gender;
                    if (gender === undefined) {
                        gender = "Unknown"
                    }
                    let ethnicity = req.body.ethnicity;
                    if (ethnicity === undefined) {
                        ethnicity = "Unknown"
                    }
                    let hair_color = req.body.hair_color;
                    let eyes_color = req.body.eye_color;
                    let address = req.body.address;
                    let ccw = req.body.ccw;

                    let weight = req.body.weight;
                    if (weight == "") {
                        weight = "Unknown"
                    }
                    let dmv = req.body.dmv;
                    if (dmv === undefined) {
                        dmv = "Unknown"
                    }
                    let fireArms = req.body.fire;
                    if (fireArms === undefined) {
                        fireArms = "Unknown"
                    }
                    let pilot = req.body.pilot;
                    if (pilot === undefined) {
                        pilot = "Unknown";
                    };
                    let height = req.body.height;
                    if (height == "") {
                        height = "Unknown";
                    };

                    let query = "INSERT INTO `citizens` ( `full_name`, `linked_to`, `birth`, `gender`, `ethnicity`, `hair_color`, `eye_color`, `address`, `height`, `weight`, `dmv`, `fire_license`, `pilot_license`,`ccw`,`business`, `rank`, `vehicle_reg`, `posts`, `citizen_picture`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let query222 = "SELECT `full_name` FROM `citizens` WHERE `full_name` = ?";

                    connection.query(query222, [full_name], (err, result3) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result3.length > 0) {
                                let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";

                                connection.query(query, (err, result1) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        let genderQ = "SELECT * FROM `genders`";
                                        let ethnicityQ = "SELECT * FROM `ethnicities`";
                                        let dmvQ = "SELECT * FROM `in_statuses`";
                                        connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                                            if (err) {
                                                return res.sendStatus(500)
                                            } else {
                                                res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", desc: "", message: "Citizen Name is already in use please choose a new name!", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].rank, username: req.session.username2 });
                                            };
                                        });
                                    };

                                });
                            } else {
                                connection.query(query, [full_name, linked_to, birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, dmv, fireArms, pilot, ccw, 'Currently not working', 'employee', 'yes', 'yes', fileName], (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).send("Something went wrong")
                                    } else {
                                        let query = "SELECT * FROM `users` WHERE username = ?";
                                        connection.query(query, [req.session.username2], (err, result1) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                let query3 = "SELECT * FROM `users`";
                                                let query4 = "SELECT * FROM `cad_info`"
                                                connection.query(`${query3}; ${query4}`, (err, result4) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.sendStatus(500)
                                                    } else {
                                                        let query = "SELECT * FROM `citizens` WHERE linked_to = ?";
                                                        connection.query(`${query}`, [req.session.username2], (err, result) => {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                req.files ? file.mv("./public/citizen-pictures/" + fileName, err => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        return res.sendStatus(500)
                                                                    } else {
                                                                        res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", desc: "", citizen: result, isAdmin: result1[0].rank, message: "", messageG: `Successfully Added ${full_name}`, username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP });
                                                                    }
                                                                })
                                                                    : null
                                                            };
                                                        });
                                                    };
                                                });
                                            };
                                        });
                                    };
                                });
                            };
                        }
                    });
                } else {
                    return res.send("Please upload a file!")
                }
            }
        });
    },
    editCitizenPage: (req, res) => {
        let query = "SELECT * FROM `users` WHERE username = ?";
        connection.query(query, [req.session.username2], (err, result1) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let genderQ = "SELECT * FROM `genders`"
                let ethnicityQ = "SELECT * FROM `ethnicities`"
                let current = "SELECT * FROM `citizens` WHERE `id` = ?"

                connection.query(`${genderQ}; ${ethnicityQ}; ${current}`, [req.params.id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (result[2][0].linked_to == req.session.username2) {
                            res.render("citizens/edit-citizen.ejs", { title: "Edit Citizen | SnailyCAD", desc: "", message: '', genders: result[0], ethnicities: result[1], current: result[2], isAdmin: result1[0].rank, username: result[2] })
                        } else {
                            res.sendStatus(401);
                        };
                    };
                });
            };
        });
    },
    editCitizen: (req, res) => {
        let query;
        let full_name = req.body.full_name
        let birth = req.body.birth;
        let gender = req.body.gender;
        let ethnicity = req.body.ethnicity;
        let hair_color = req.body.hair;
        let eyes_color = req.body.eyes;
        let address = req.body.address;
        let height = req.body.height;
        if (height == "") { height = "Unknown" }
        let weight = req.body.weight;
        if (weight == "") { weight = "Unknown" }
        let dmv = req.body.dmv;
        let fireArms = req.body.fire;
        let pilot = req.body.pilot
        let ccw = req.body.ccw
        let file, fileName
        if (req.files) {
            file = req.files.citizen_pictures;
            fileName = file.name;
            query = 'UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ?, `citizen_picture` = ? WHERE `citizens`.`id` = "' + req.params.id + '"';
        } else {
            query = 'UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ? WHERE `citizens`.`id` = "' + req.params.id + '"';
        }


        connection.query(`${query};`, [birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, dmv, fireArms, pilot, ccw, fileName], (err) => {
            if (err) {
                console.log(err);
            } else {
                if (req.files) {
                    file.mv("./public/citizen-pictures/" + fileName, err => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.redirect(`/citizens/${req.params.id}-${full_name}`);
                        };
                    });
                } else {
                    res.redirect(`/citizens/${req.params.id}-${full_name}`);
                }
            };
        });
    },
    deleteCitizens: (req, res) => {

        let id = req.params.id;
        let query = 'SELECT * FROM citizens WHERE id = "' + id + '"';

        connection.query(query, (err, result) => {
            let vehicles = "DELETE FROM registered_cars WHERE owner = '" + result[0].full_name + "'"
            let weapons = "DELETE FROM registered_weapons WHERE owner = '" + result[0].full_name + "'"
            let citizens = "DELETE FROM citizens WHERE id = '" + id + "'"
            connection.query(`${vehicles}; ${weapons}; ${citizens}`, (err1, result1) => {
                if (err1) {
                    console.log(err1);
                    return res.sendStatus(500);
                } else {
                    res.redirect(`/citizen`);
                }
            });

        });
    },
};