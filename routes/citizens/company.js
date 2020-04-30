const router = require("express").Router();


// Main Company Page
router.get("/", (req, res) => {
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
                    res.render("citizens/company/company.ejs", { title: "Manage Employment | SnailyCAD", desc: "", message: "", isAdmin: result1[0].rank, businesses: result[0], current: result[1], companies: result[2] });
                }
            });
        };
    });
});


// Join Company
router.post("/join", (req, res) => {
    const joined_business = req.body.join_business;
    const citizen_name = req.body.citizen_name;
    const query = 'UPDATE `citizens` SET `business` = ? WHERE `citizens`.`full_name` = ?';

    connection.query(query, [joined_business, citizen_name], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.redirect(`/citizen`);
        };
    });
});

// Create Company
router.post("/create", (req, res) => {
    const linked_to = req.session.username2
    const companyName = req.body.companyName;
    const owner = req.body.owner;
    const query = "SELECT * FROM `businesses` WHERE `business_name` = ?"

    connection.query(query, [companyName], (err, results) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (results[0]) {
                const query = "SELECT * FROM `users` WHERE username = ?";
                connection.query(query, [req.session.username2], (err, result1) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        const query2 = "SELECT * FROM businesses";
                        const citizen = "SELECT * FROM citizens WHERE linked_to = ?"
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
                const query = "INSERT INTO `businesses` (`business_name`, `business_owner`, `linked_to`) VALUES (?, ?, ?)";
                const query2 = "UPDATE `citizens` SET `business` = ?, `rank` = ? WHERE `citizens`.`full_name` = ?";

                connection.query(`${query}; ${query2}`, [companyName, owner, linked_to, companyName, 'owner', owner], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/company/${companyName}/`);
                    };
                });
            };
        }
    });
});


// Company Page
router.get("/:citizenId-:company", (req, res) => {
    const citizenId = req.params.citizenId;
    const companyName = req.params.company
    const query = "SELECT * FROM `users` WHERE `username` = ?"
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            const getCitizen = "SELECT * FROM `citizens` WHERE `id` = ?"
            connection.query(getCitizen, [citizenId], (err, result5) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result5[0]) {
                        const posts = "SELECT * FROM `posts` WHERE `linked_to_bus` = ?";
                        const totalEmployees = "SELECT * FROM `citizens` WHERE  `business` = ?"
                        const ownerQ = "SELECT * FROM `businesses` WHERE `business_owner` = ?"
                        connection.query(`${posts}; ${totalEmployees}; ${ownerQ}`, [companyName, companyName, result5[0].full_name], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.render("company/main.ejs", { messageG: '', message: '', desc: "", title: companyName, isAdmin: result1[0].rank, req: req, posts: result[0], employees: result[1], owner: result[2], result5: result5 });
                            };
                        });
                    } else {
                        res.send("There was an error getting your name! Please try again later")
                    }
                };
            });
        };
    });
});

// Create Company Post Page
router.get("/:citizenId-:company/create-post", (req, res) => {
    connection.query("SELECT * FROM `users` WHERE `username` = ?", [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.render("company/new-post.ejs", { messageG: '', message: '', desc: "", title: "Create Post | SnailyCAD", isAdmin: result[0].rank, req: req });
        };
    });
});

// Create Company Post
router.post("/:citizenId-:company/create-post", (req, res) => {
    let d = new Date()
    const citizenId = req.params.citizenId
    const companyName = req.params.company
    const title = req.body.title;
    const desc = req.body.description;
    let uploadedBy = "";
    const uploadedAt = d.toLocaleDateString();
    const query3 = "SELECT * FROM `citizens` WHERE `id` = ?";

    connection.query(query3, [citizenId], (err, results) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (results[0]) {
                uploadedBy = results[0].full_name
                if (results[0].posts === 'yes' || results[0].rank === "owner" || results[0].rank === "manager") {
                    let query = "INSERT INTO `posts` (`linked_to_bus`,`title`,`description` ,`uploadedBy`,`uploadedAt`) VALUES (?, ?, ?, ?, ?)"
                    connection.query(query, [companyName, title, desc, uploadedBy, uploadedAt], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus((500))
                        } else {
                            let getCitizen = "SELECT * FROM `citizens` WHERE `id` = ?";
                            connection.query(getCitizen, [citizenId], (err, result5) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result5[0]) {
                                        let postss = "SELECT * FROM `posts` WHERE  `linked_to_bus` = ?";
                                        let totalEmployees = "SELECT * FROM `citizens` WHERE `business` = ?";
                                        let ownerQ = "SELECT * FROM `businesses` WHERE  `business_owner` = ?";
                                        connection.query(`${postss}; ${totalEmployees}; ${ownerQ}`, [companyName, companyName, result5[0].full_name], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500);
                                            } else {
                                                res.render("company/main.ejs", { messageG: 'Post Successfully created', message: '', desc: "", title: companyName, isAdmin: result5[0].rank, req: req, posts: result[0], employees: result[1], owner: result[2], result5: result5 });
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
                    res.render("company/new-post.ejs", { messageG: '', message: 'You are not allowed to create posts to this company! Please message your company owner or manager.', desc: "", title: "Create Post | SnailyCAD", isAdmin: "", req: req });
                };
            } else {
                res.render("company/new-post.ejs", { messageG: '', message: 'You are not allowed to create posts to this company! Please message your company owner or manager.', desc: "", title: "Create Post | SnailyCAD", isAdmin: "", req: req });
            };
        };
    });
});


// Edit Company Page
router.get("/:citizenId-:company/edit", (req, res) => {
    const citizenId = req.params.citizenId;
    const companyName = req.params.company;
    const query = "SELECT * FROM `citizens` WHERE  `id` = ?";
    const query2 = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(`${query}; ${query2}`, [citizenId, req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0][0]) {
                if (result[0][0].rank === 'owner' || result[0][0].rank === "manager") {
                    let query2 = "SELECT * FROM `businesses` WHERE `business_name` = ?"
                    let query3 = "SELECT * FROM `citizens` WHERE `business` = ?"
                    let query4 = "SELECT * FROM `registered_cars` WHERE `company` = ?"
                    connection.query(`${query2}; ${query3}; ${query4}`, [companyName, companyName, companyName], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.render("company/edit.ejs", { title: "Edit Company | SnailyCAD", desc: "", current: result1[0][0], isAdmin: result[1][0].rank, employees: result1[1], req: req, vehicles: result1[2] });
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
});

// Edit Employee Page
router.get("/:citizenId-:company/:employeeId/edit", (req, res) => {
    const citizenId = req.params.citizenId
    const employeeId = req.params.employeeId
    const query = "SELECT * FROM `citizens` WHERE `id` = ?";
    const query2 = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(`${query}; ${query2}`, [citizenId, req.session.username2], (err, result3) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result3[0]) {
                if (result3[0][0].rank === 'owner' || result3[0][0].rank === "manager") {
                    let query = "SELECT * FROM `citizens` WHERE  `id` = ?"

                    connection.query(query, [employeeId], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.render("company/citizen.ejs", { title: "Edit Company | SnailyCAD", desc: "", isAdmin: result3[1][0].rank, current: result[0], req: req, you: result3[0] })
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
});

router.post("/:citizenId-:company/:employeeId/edit", (req, res) => {
    let query;
    const citizenId = req.params.citizenId;
    const employeeId = req.params.employeeId
    const companyName = req.params.company;
    const rank = req.body.company_rank;
    const vehicles = req.body.vehicles;
    const posts = req.body.posts;
    if (rank === undefined) {
        query = "UPDATE `citizens` SET `vehicle_reg` = ?, `posts` = ? WHERE `citizens`.`id` = ?";

        return connection.query(query, [vehicles, posts, employeeId], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                res.redirect(`/company/${citizenId}-${companyName}/edit`);
            };
        });
    } else {
        query = "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ? WHERE `citizens`.`id` = ?";

        return connection.query(query, [rank, vehicles, posts, employeeId], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                res.redirect(`/company/${citizenId}-${companyName}/edit`);
            };
        });
    }
})




module.exports = router