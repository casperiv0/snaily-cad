const router = require("express").Router();

// My EMS/FD Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0].ems_fd === 'yes') {
                let query = "SELECT * FROM `ems-fd` WHERE `linked_to` = ? ORDER by id ASC"
                connection.query(query, [req.session.username2], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        res.render("ems-fd/ems-fd.ejs", {
                            title: "EMS/FD",
                            isAdmin: result1[0].rank,
                            ems: result,
                            desc: ""
                        });
                    }
                });
            } else {
                res.render("ems-fd/403.ejs", { desc: "", title: "unauthorized | SnailyCAD", isAdmin: result1[0].rank })
            };
        }
    });
});

// EMS-fd Dash
router.get("/dash", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (result1[0].ems_fd == 'yes') {
                const query = "SELECT * FROM `cad_info`";
                const callsQ = "SELECT * FROM `911calls`";
                connection.query(`${query}; ${callsQ}`, [req.session.username2], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.render("ems-fd/ems-dash.ejs", { title: "EMS/FD", isAdmin: result1[0].rank, desc: "", cad: result[0][0], calls: result[1] });
                    }
                });
            } else {
                res.render("ems-fd/403.ejs", { desc: "", title: "unauthorized | SnailyCAD", isAdmin: result1[0].rank });
            };
        };
    });
});

// Add EMS-fd deputy Page
router.get("/add-deputy", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(`${query}`, [req.session.username2], (err, result2) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (result2[0].ems_fd === "yes") {
                res.render("ems-fd/add-ems.ejs", { desc: "", title: "Add EMS/FD Deputy | SnailyCAD", isAdmin: result2[0].rank })
            } else {
                res.render("ems-fd/403.ejs", { desc: "", title: "unauthorized | SnailyCAD", isAdmin: result2[0].rank })
            }
        };
    });
});

// Add EMS-fd Deputy
router.post("/add-deputy", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0].ems_fd == 'yes') {
                const deputy_name = req.body.name;
                const query = "INSERT INTO `ems-fd` (`name`, `linked_to`, `status`, `status2`) VALUES (?, ?, ?, ?)";

                connection.query(query, [deputy_name, req.session.username2, '10-42 | 10-7', '----------'], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        res.redirect(`/ems-fd`);
                    };
                });
            } else {
                res.sendStatus(403);
            };
        };
    });
});

// Medical Search
router.get("/api/:citizenName", (req, res) => {
    const citizenName = req.params.citizenName;

    const query = "SELECT * FROM `medical_records` WHERE `name` = ?"
    connection.query(query, [citizenName], (err, result) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            res.json(result);
        };
    });
});

// Update Status
router.post("/update-status", (req, res) => {
    let id = req.body.id
    let status = req.body.status;
    let status2 = req.body.status2;
    if (status === "10-42 | 10-7") {
        status2 = "----------"
    }
    if (status2 === undefined) {
        status2 = "----------"
    }
    let query1 = "UPDATE `ems-fd` SET `status` = ?, `status2` = ? WHERE `ems-fd`.`id` = ?"
    connection.query(`${query1};`, [status, status2, id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/ems-fd`);
        };
    });
})

module.exports = router;