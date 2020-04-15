const d = new Date()
const stringify = require('stringify');

module.exports = {
    citizenPage: (req, res, next) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`);
        } else {
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
        }
    },
    citizenDetailPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
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
                    let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
                    let vehiclesQ = "SELECT * FROM `registered_cars` WHERE `owner` = '" + owner + "' AND `linked_to` = '" + req.session.username2 + "'";
                    let weaponsQ = "SELECT * FROM `registered_weapons` WHERE `owner` = '" + owner + "'  AND `linked_to` = '" + req.session.username2 + "'";
                    let ceo = "SELECT business_owner FROM `businesses` WHERE `business_owner` = '" + owner + "' AND `linked_to` = '" + req.session.username2 + "'";
                    connection.query(`${query}; ${vehiclesQ}; ${weaponsQ}; ${ceo}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (!result[0][0]) {
                                res.sendStatus(404)
                            } else {
                                if (result[0][0].linked_to.toLowerCase() === req.session.username2.toLowerCase()) {
                                    res.render("citizens/detail-citizens.ejs", { title: "Citizen Detail | SnailyCAD", desc: "", citizen: result[0], vehicles: result[1], weapons: result[2], ceo: isCeo, isAdmin: result1[0].admin, desc: "See All the information about your current citizen." });
                                } else {
                                    res.sendStatus(401);
                                };
                            }
                        }
                    });
                };
            });

        }
    },
    addCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let genderQ = "SELECT * FROM `genders`"
                    let ethnicityQ = "SELECT * FROM `ethnicities`"
                    let dmvQ = "SELECT * FROM `in_statuses`"
                    connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}`, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", message: "", desc: "", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2 })
                        };
                    });
                };
            });
        };
    },
    addCitizen: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
            connection.query(query, (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
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
                        pilot = "Unknown"
                    }
                    let height = req.body.height;
                    if (height == "") {
                        height = "Unknown"

                    }
                    let query = "INSERT INTO `citizens` ( `full_name`, `linked_to`, `birth`, `gender`, `ethnicity`, `hair_color`, `eye_color`, `address`, `height`, `weight`, `dmv`, `fire_license`, `pilot_license`,`ccw`,`business`, `rank`, `vehicle_reg`, `posts`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let query222 = "SELECT `full_name` FROM `citizens` WHERE `full_name` = ?";

                    connection.query(query222, [full_name], (err, result3) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            // if (result3[])
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
                                                return res.status(500).send(err);
                                            } else {
                                                res.render("citizens/add-citizen.ejs", { title: "Add Citizen | SnailyCAD", desc: "", message: "Citizen Name is already in use please choose a new name!", genders: result[0], ethnicities: result[1], dmvs: result[2], isAdmin: result1[0].admin, username: req.session.username2 });
                                            };
                                        });
                                    };

                                });
                            } else {
                                connection.query(query, [full_name, linked_to, birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, dmv, fireArms, pilot, ccw, 'Currently not working', 'employee', 'yes', 'yes'], (err, result) => {
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
                                                                res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", desc: "", citizen: result, isAdmin: result1[0].rank, message: "", messageG: `Successfully Added ${full_name}`, username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP });
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
                }
            });
        }
    },
    editCitizenPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let genderQ = "SELECT * FROM `genders`"
                    let ethnicityQ = "SELECT * FROM `ethnicities`"
                    let dmvQ = "SELECT * FROM `in_statuses`"
                    let current = "SELECT * FROM `citizens` WHERE `id` = ?"

                    connection.query(`${genderQ}; ${ethnicityQ}; ${dmvQ}; ${current}`, [req.params.id], (err, result) => {

                        if (result[3][0].linked_to == req.session.username2) {
                            res.render("citizens/edit-citizen.ejs", { title: "Edit Citizen | SnailyCAD", desc: "", message: '', genders: result[0], ethnicities: result[1], dmvs: result[2], current: result[3], isAdmin: result1[0].admin, username: result[3] })
                        } else {
                            res.sendStatus(401)
                        }
                        if (err) {
                            console.log(err)
                        };
                    });
                };
            });

        }
    },
    editCitizen: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {

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
            let cadID = req.params.cadID

            let query = 'UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ? WHERE `citizens`.`id` = "' + req.params.id + '"';

            connection.query(`${query};`, [birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, dmv, fireArms, pilot, ccw, 'none', 'Currently not working', cadID], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect(`/citizens/${req.params.id}-${full_name}`);
                };
            });
        };
    },
    deleteCitizens: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect('/login')
        } else {

            let id = req.params.id;
            let query = 'SELECT * FROM citizens WHERE id = "' + id + '"';

            connection.query(query, (err, result) => {
                let vehicles = "DELETE FROM registered_cars WHERE owner = '" + result[0].full_name + "'"
                let weapons = "DELETE FROM registered_weapons WHERE owner = '" + result[0].full_name + "'"
                let citizens = "DELETE FROM citizens WHERE id = '" + id + "'"
                connection.query(`${vehicles}; ${weapons}; ${citizens}`, (err1, result1) => {
                    if (err1) {
                        return res.status(500).send(err);
                    } else {
                        res.redirect(`/citizen`);
                    }
                });

            });
        };
    },
    companyPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query2 = "SELECT * FROM businesses";
                    let citizen = "SELECT * FROM citizens WHERE linked_to = ? "
                    let companies = "SELECT * FROM `businesses` WHERE `linked_to` = ?"

                    connection.query(`${query2}; ${citizen}; ${companies}`, [req.session.username2, req.session.username2], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.render("citizens/company.ejs", { title: "Manage Employment | SnailyCAD", desc: "", message: "", isAdmin: result1[0].rank, businesses: result[0], current: result[1], companies: result[2] });
                        }
                    });
                };
            });
        };
    },
    company: (req, res) => {
        if (req.session.loggedin) {
            let joined_business = req.body.join_business;
            let citizen_name = req.body.citizen_name;
            let query = 'UPDATE `citizens` SET `business` = ? WHERE `citizens`.`full_name` = ?';
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = ?"

            connection.query(query2, [req.params.cadID], (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    connection.query(query, [joined_business, citizen_name], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.redirect(`/cad/${result2[0].cadID}/citizen`)

                        }
                    })
                }
            })
        } else {
            let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
            connection.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }

    },
    createCompany: (req, res) => {
        if (req.session.loggedin) {
            let linked_to = req.session.username2
            let companyName = req.body.companyName;
            let owner = req.body.owner;
            let query23 = "SELECT * FROM `businesses` WHERE `business_name` = ?"

            connection.query(query23, [companyName], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (results[0]) {
                        let query = "SELECT * FROM `users` WHERE username = ?";
                        connection.query(query, [req.session.username2], (err, result1) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                let query2 = "SELECT * FROM businesses";
                                let citizen = "SELECT * FROM citizens WHERE linked_to = ?"
                                connection.query(`${query2}; ${citizen}`, [req.session.username2], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("citizens/company.ejs", { title: "Manage Employment | SnailyCAD", desc: "", message: "Sorry! This company name already exists, please change the name", isAdmin: result1[0].admin, businesses: result[0], current: result[1], cadId: result2[0].cadID, });
                                    }
                                });
                            };
                        });
                    } else {
                        let query = "INSERT INTO `businesses` (`business_name`, `business_owner`, `linked_to`) VALUES (?, ?, ?)";
                        let query2 = "UPDATE `citizens` SET `business` = ?, `rank` = ? WHERE `citizens`.`full_name` = ?";

                        connection.query(`${query}; ${query2}`, [companyName, owner, linked_to, companyName, 'owner', owner], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } else {
                                res.redirect(`/citizen`);
                            };
                        });
                    };
                }
            });
        } else {
            res.redirect(`/login`)
        }
    },
    companyDetailPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "'"
            connection.query(query, (err, result5) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let getCitizen = "SELECT * FROM `citizens` WHERE `id` = ?"
                    connection.query(getCitizen, [req.params.id], (err, result5) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            if (result5[0]) {
                                let postss = "SELECT * FROM `posts` WHERE `linked_to_bus` = ?";
                                let totalEmployees = "SELECT * FROM `citizens` WHERE  `business` = ?"
                                let ownerQ = "SELECT * FROM `businesses` WHERE `business_owner` = ?"
                                connection.query(`${postss}; ${totalEmployees}; ${ownerQ}`, [req.params.company, req.params.company, result5[0].full_name], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("company/main.ejs", { messageG: '', message: '', desc: "", title: req.params.company + " | SnailyCAD", isAdmin: result5[0].admin, req: req, posts: result[0], employees: result[1], owner: result[2], result5: result5 });
                                    };
                                });
                            } else {
                                res.send("There was an error getting your name! Please try again later")
                            }
                        };
                    });
                };
            });
        };
    },
    createCompanyPostPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`)
        } else {
            res.render("company/add.ejs", { messageG: '', message: '', desc: "", title: "Create Post | SnailyCAD", isAdmin: "", req: req });
        };
    },
    createCompanyPost: (req, res) => {
        if (req.session.loggedin) {
            let title = req.body.title;
            let desc = req.body.description;
            let cadID = req.params.cadID;
            let uploadedBy = "";
            let uploadedAt = d.toLocaleDateString();

            let query3 = "SELECT * FROM `citizens` WHERE `id` = ?";

            connection.query(query3, [req.params.id], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (results[0]) {
                        uploadedBy = results[0].full_name
                        if (results[0].posts === 'yes' || results[0].rank === "owner" || results[0].rank === "manager") {
                            let query = "INSERT INTO `posts` (`linked_to_bus`,`title`,`description` ,`uploadedBy`,`uploadedAt`) VALUES (?, ?, ?, ?, ?)"
                            connection.query(query, [req.params.company, title, desc, uploadedBy, uploadedAt], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus((500))
                                } else {
                                    let getCitizen = "SELECT * FROM `citizens` WHERE `id` = ?";
                                    connection.query(getCitizen, [req.params.id], (err, result5) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500);
                                        } else {
                                            if (result5[0]) {
                                                let postss = "SELECT * FROM `posts` WHERE  `linked_to_bus` = ?";
                                                let totalEmployees = "SELECT * FROM `citizens` WHERE `business` = ?";
                                                let ownerQ = "SELECT * FROM `businesses` WHERE  `business_owner` = ?";
                                                connection.query(`${postss}; ${totalEmployees}; ${ownerQ}`, [req.params.company, req.params.company, result5[0].full_name], (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.sendStatus(500);
                                                    } else {
                                                        res.render("company/main.ejs", { messageG: 'Post Successfully created', message: '', desc: "", title: req.params.company + " | SnailyCAD", isAdmin: result5[0].admin, req: req, posts: result[0], employees: result[1], owner: result[2], result5: result5 });
                                                    };
                                                });
                                            } else {
                                                res.send("There was an error getting your name! Please try again later");
                                            };
                                        };
                                    });
                                };
                            });
                        } else {
                            res.render("company/add.ejs", { messageG: '', message: 'You are not allowed to create posts to this company! Please message your company owner or manager.', desc: "", title: "Create Post | SnailyCAD", isAdmin: "", req: req });
                        };
                    } else {
                        res.render("company/add.ejs", { messageG: '', message: 'You are not allowed to create posts to this company! Please message your company owner or manager.', desc: "", title: "Create Post | SnailyCAD", isAdmin: "", req: req });
                    };
                };
            });
        } else {
            res.redirect(`/login`);
        };
    },
    editCompanyPage: (req, res) => {
        if (!req.session.loggedin) {
            res.redirect(`/login`);
        } else {
            let query = "SELECT * FROM `citizens` WHERE  `id` = ?"
            connection.query(query, [req.params.id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0]) {
                        if (result[0].rank === 'owner' || result[0].rank === "manager") {
                            let query2 = "SELECT * FROM `businesses` WHERE `business_name` = ?"
                            let query3 = "SELECT * FROM `citizens` WHERE `business` = ?"
                            let query4 = "SELECT * FROM `registered_cars` WHERE `company` = ?"
                            connection.query(`${query2}; ${query3}; ${query4}`, [req.params.company, req.params.company, req.params.company], (err, result1) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.render("company/edit.ejs", { title: "Edit Company | SnailyCAD", desc: "", current: result1[0][0], isAdmin: "", employees: result1[1], req: req, vehicles: result1[2] });
                                };
                            });
                        } else {
                            res.send("You're not the company manager or owner!");
                        };
                    } else {
                        res.sendStatus(403);
                    };
                };
            });
        };
    },
    editCitizenCompanyPage: (req, res) => {
        if (!req.session.loggedin) {

            res.redirect(`/login`);

        } else {
            let query = "SELECT * FROM `citizens` WHERE `id` = ?"
            connection.query(query, [req.params.id], (err, result3) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result3[0]) {
                        if (result3[0].rank === 'owner' || result3[0].rank === "manager") {
                            let query = "SELECT * FROM `citizens` WHERE  `id` = ?"

                            connection.query(query, [req.params.citizen], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.render("company/citizen.ejs", { title: "Edit Company | SnailyCAD", desc: "", isAdmin: "", current: result[0], req: req, you: result3[0] })
                                }
                            })
                        } else {
                            res.send("You're not the company manager or owner!");
                        };
                    } else {
                        res.sendStatus(403)
                    };
                };
            });

        };
    },
    editCitizenCompany: (req, res) => {
        if (req.session.loggedin) {
            let query;
            let rank = req.body.company_rank;
            let vehicles = req.body.vehicles;
            let posts = req.body.posts;
            let citizenID = req.params.citizen;
            if (rank === undefined) {
                query = "UPDATE `citizens` SET `vehicle_reg` = ?, `posts` = ? WHERE `citizens`.`id` = ?";

                return connection.query(query, [vehicles, posts, citizenID], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/citizen/company/${req.params.id}-${req.params.company}/edit-company`);
                    };
                });
            } else {
                query = "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ? WHERE `citizens`.`id` = ?";

                return connection.query(query, [rank, vehicles, posts, citizenID], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/citizen/company/${req.params.id}-${req.params.company}/edit-company`);
                    };
                });
            }
        } else {
            res.redirect(`/login`);
        }
    }
};