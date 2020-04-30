const router = require("express").Router();

// Add a bolo from /officers & /dispatch
router.post("/:dir/add-bolo", (req, res) => {
    const boloDesc = req.body.bolo_desc;
    const query = "INSERT INTO `bolos` (`description`) VALUES (?)";
    connection.query(query, [boloDesc], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (req.path.includes("officers")) {
                res.redirect("/officers/dash");
            } else {
                res.redirect("/dispatch");
            };
        };
    });
});

// Delete Bolo from /officers & /dispatch
router.get("/:dir/delete-bolo-:boloId", (req, res) => {
    const boloId = req.params.boloId;
    const query = "DELETE FROM `bolos` WHERE `id` = ?";
    connection.query(query, [boloId], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (req.path.includes("officers")) {
                res.redirect("/officers/dash");
            } else {
                res.redirect("/dispatch");
            };
        };
    });
});

// Suspend DMV from /officers & /dispatch
router.get("/:dir/susdmv/:citizenId", (req, res) => {
    const citizenId = req.params.citizenId;
    const query = "UPDATE `citizens` SET `dmv` = ? WHERE `citizens`.`id` = ?";

    connection.query(query, ["Suspended", citizenId], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (req.path.includes("officers")) {
                res.redirect("/officers/dash")
            } else {
                res.redirect("/dispatch")
            }
        }

    })
});

// Warrant from /officers & /dispatch
router.post("/:dir/add-warrant", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                let name = req.body.name;
                let d_from = req.body.d_from;
                let d_to = req.body.d_to;
                let reason = req.body.reason
                let query = "INSERT INTO `warrants` ( `name`, `reason`, `d_from`, `d_to`) VALUES (?, ?, ?, ?)";

                connection.query(query, [name, reason, d_from, d_to], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (req.path.includes("officers")) {
                            res.redirect("/officers/dash");
                        } else {
                            res.redirect("/dispatch");
                        };
                    };
                });
            } else {
                res.send("Something went wrong during the request");
            };
        };
    });
});


// 911 CALLS

// Cancel 911 call
router.get("/:dir/cancel-911-call-:callId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                const query = "DELETE FROM `911calls` WHERE `id` = ?"
                connection.query(query, [req.params.callId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (req.path.includes("officers")) {
                            res.redirect(`/officers/dash`);
                        } else if (req.path.includes("ems-fd")) {
                            res.redirect(`/ems-fd/dash`);
                        } else {
                            res.redirect(`/dispatch`);
                        }
                    };
                });
            } else {
                res.send("Something went wrong during the request");
            };
        };
    });
});

// Update 911 Call
router.post("/:dir/update-911-call-:callId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                let query = "UPDATE `911calls` SET `location` = ?, `status` = ? WHERE `911calls`.`id` = ?"
                connection.query(query, [req.body.location, req.body.status, req.params.callId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (req.path.includes("officers")) {
                            res.redirect(`/officers/dash`);
                        } else if (req.path.includes("ems-fd")) {
                            res.redirect(`/ems-fd/dash`);
                        } else {
                            res.redirect(`/dispatch`);
                        }
                    };
                });
            } else {
                res.send("Something went wrong during the request");
            };
        };
    });
});


// Create 911 Call
router.post("/:dir/create-911-call", (req, res) => {
    let name = req.body.name
    if (name === "") {
        name = "Not Specified"
    }
    let desc = req.body.description;
    if (desc === undefined) {
        desc = "Not Specified"
    }
    let location = req.body.location;
    const query = "INSERT INTO `911calls` (`description`, `name`, `location`, `status`) VALUES (?, ?, ?, ?)";

    connection.query(query, [desc, name, location, 'not assigned'], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (req.path.includes("citizen")) {
                res.redirect("/citizen")
            } else {
                res.redirect("/dispatch")
            }
        };
    });
});


// Create Tow Call
router.post("/create-tow-call", (req, res) => {
    let name = req.body.name
    if (name === "") {
        name = "Not Specified"
    }
    let desc = req.body.description;
    if (desc === undefined) {
        desc = "Not Specified"
    }
    let location = req.body.location;
    const query = "INSERT INTO `tow_calls` (`description`, `name`, `location`) VALUES (?, ?, ?)"

    connection.query(query, [desc, name, location, req.params.cadID], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/citizen`);
        };
    });
});

module.exports = router;