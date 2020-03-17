module.exports = {
    addCarPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                res.render("vehicles/add-vehicle.ejs", { title: "Add Vehicle", isAdmin: result[0].admin, cadId: result2[0].cadID });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    addCar: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let name = req.body.cname;
                                let cadID = req.params.cadID;

                                let query = "INSERT INTO `vehicles` (`cname`, `cadID`) VALUES ('" + name + "', '" + cadID + "')";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Vehicle ${name} was added by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/cars/`);
                                            };
                                        });
                                    }
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    carValuePage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        connection1.query(query, (err, result1) => {
                            if (result1[0].admin == 'moderator' || result1[0].admin == 'admin' || result1[0].admin == 'owner') {
                                let query2 = "SELECT * FROM `vehicles` WHERE `cadID` = '" + req.params.cadID + "' ORDER BY id ASC";
                                let querys = "SELECT * FROM `vehicles` WHERE `default_car` = 'true' ";
                                connection.query(`${query2}; ${querys}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.sendStatus(500);
                                    } else {
                                        res.render("admin-pages/vehicles.ejs", { title: 'Admin Panel | Values', vehicles: result[0], defaults: result[1], isAdmin: result1[0].admin, cadId: result2[0].cadID });
                                    };
                                });
                            } else {
                                res.sendStatus(403);
                            };
                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
    editVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let carId = req.params.id;
                                let query = "SELECT * FROM `vehicles` WHERE id = '" + carId + "' ";
                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    }
                                    res.render("vehicles/edit-vehicle.ejs", { title: "Edit Vehicle", vehicle: result[0], isAdmin: result[0].admin, cadId: result2[0].cadID })
                                });
                            } else {
                                res.sendStatus(403)
                            }
                        })
                    } else {
                        res.sendStatus(404)
                    }
                }
            })




        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    editVehicle: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let carId = req.params.id;
                                let car_name = req.body.cname;
                                let myear = req.body.myear;
                                let query = 'UPDATE `vehicles` SET `cname` = "' + car_name + '" WHERE `vehicles`.`id` = "' + carId + '"';

                                connection.query(query, (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Vehicle ${car_name} was edited by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/cars`);
                                            };
                                        });
                                    }
                                });
                            } else {
                                res.sendStatus(403)
                            }
                        })
                    } else {
                        res.sendStatus(404)
                    }
                }
            })



        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    deleteVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
                        connection1.query(query, (err, result) => {
                            if (result[0].admin == 'moderator' || result[0].admin == 'admin' || result[0].admin == 'owner') {
                                let playerId = req.params.id;
                                // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
                                let deleteUserQuery = 'DELETE FROM vehicles WHERE id = "' + playerId + '"';

                                connection.query(deleteUserQuery, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `A vehicle was deleted by ${req.session.username2}.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                                        connection1.query(actionLog, (err, result3) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500)
                                            } else {
                                                res.redirect(`/cad/${result2[0].cadID}/admin/values/cars`);
                                            };
                                        });
                                    };
                                });
                            } else {
                                res.sendStatus(403)
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    regVehiclePage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                    connection1.query(query, (err, result1) => {
                        let query = "SELECT * FROM `citizens` WHERE `cadID` = '" + req.params.cadID + "' ORDER BY id ASC"
                        let carQ = "SELECT * FROM `vehicles` WHERE `cadID` = '" + req.params.cadID + "' ORDER BY id ASC"
                        let cas2 = "SELECT * FROM `vehicles` WHERE `default_car` = 'true'"
                        let in_s = "SELECT * FROM `in_statuses` WHERE `cadID` = '" + req.params.cadID + "' ORDER BY id ASC"
                        let ownerQ = "SELECT * FROM `citizens` WHERE linked_to = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"

                        connection.query(`${query}; ${carQ}; ${in_s}; ${ownerQ}; ${cas2}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("vehicles/reg-vehicle.ejs", { title: "Vehicle Registration | SnailyCAD", message: '', owners: result[0], vehicles: result[1], in_status: result[2], isAdmin: result1[0].admin, name: req.session.username2, owners: result[3], cadId: result2[0].cadID, defaults: result[4] });
                            };
                        });
                    });
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    regVehicle: (req, res) => {

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
        let q1 = "SELECT plate FROM `registered_cars` WHERE plate = '" + plate + "'"

        connection.query(q1, (err, result) => {
            if (result.length > 0) {
                res.send("Plate Already Exists Please go back and change the plate.")
            } else {
                let query = "INSERT INTO `registered_cars` (`owner`, `vehicle`, `vin_number`, `in_status`, `plate`, `color`, `cadID`, `linked_to`) VALUES ('" + owner + "', '" + vehicle + "', '" + vin_number + "', '" + in_status + "', '" + plate + "', '" + color + "', '" + req.params.cadID + "', '" + linked_to + "')";


                connection.query(query, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.redirect(`/cad/${result2[0].cadID}/citizen`)
                            } else {
                                res.sendStatus(404)
                            }
                        }
                    })
                });
            };
        });
    },
    editVehiclePageCitizen: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                    connection1.query(query, (err, result1) => {
                        let query = "SELECT * FROM `registered_cars` WHERE `plate` = '" + req.params.plate + "'"
                        let legalQ = "SELECT * FROM `in_statuses`"

                        connection.query(`${query}; ${legalQ}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(500)
                            } else {
                                res.render("vehicles/citizen/edit-vehicle.ejs", { title: "Edit Vehicle | SnailyCAD", message: '', current: result[0][0], legal: result[1], isAdmin: result1[0].admin, cadId: result2[0].cadID })
                            };
                        });
                    });

                }
            })


        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    editVehicleCitizen: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                    connection1.query(query, (err, result1) => {
                        let plate = req.params.plate;
                        let color = req.body.color;
                        let status = req.body.status
                        let query = "UPDATE `registered_cars` SET `color` = '" + color + "', `in_status` ='" + status + "' WHERE `registered_cars`.`plate` = '" + plate + "'";

                        connection.query(`${query};`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(500)
                            } else {
                                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                                connection1.query(query2, (err, result2) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } else {
                                        if (result2[0]) {
                                            res.redirect(`/cad/${result2[0].cadID}/citizen`)
                                        } else {
                                            res.sendStatus(404)
                                        }
                                    }
                                })
                            };
                        });
                    });

                }
            })


        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
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
    deleteVehicleCitizen: (req, res) => {
        let cadID = req.params.cadID;
        let plate = req.params.plate;

        let query = "DELETE FROM `registered_cars` WHERE `plate` = '" + plate + "' AND `cadID` = '" + cadID + "'";

        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                let q1 = "SELECT * FROM `citizens` WHERE `id` = '" + req.params.id + "'"
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        connection.query(q1, (err, result3) => {
                            if (result2[0]) {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.redirect(`/cad/${result2[0].cadID}/citizens/${result3[0].id}-${result3[0].first_name}-${result3[0].last_name}`);
                                }
                            } else {
                                res.sendStatus(404);
                            };
                        })

                    }
                });
            }
        })
    }
};
