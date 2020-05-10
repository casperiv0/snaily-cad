const router = require("express").Router();
const marked = require("marked");
const usernameNotFound = "There was an error getting your username.";


// All bleets
router.get("/", async (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const bleets = "SELECT * FROM `bleets` ORDER BY `id` DESC"

    connection.query(`${query}; ${bleets}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0][0]) {
                res.render("bleeter/bleeter.ejs", { title: "Bleeter", bleets: result[1], isAdmin: result[0][0].rank, desc: "Bleeter, send an awesome bleet!", message: "" })
            } else {
                res.send(usernameNotFound)
            }
        };
    });
});

// Add bleet page
router.get("/new-bleet", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(`${query};`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                res.render("bleeter/new-bleet.ejs", { title: "New Bleet", isAdmin: result[0].rank, desc: "Bleeter, send an awesome bleet!", message: "" })
            } else {
                res.send(usernameNotFound)
            }
        };
    });
});

// Add bleet 
router.post("/new-bleet", (req, res) => {
    const title = req.body.title;
    const bleetDescription = marked(req.body.description);
    if (bleetDescription.includes("<script>")) {
        const query = "SELECT * FROM `users` WHERE `username` = ?";
        connection.query(`${query};`, [req.session.username2], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                if (result[0]) {
                    res.render("bleeter/new-bleet.ejs", { title: "New Bleet", isAdmin: result[0].rank, desc: "Bleeter, send an awesome bleet!", message: "script tags are not allowed!" });
                    return res.end();
                } else {
                    res.send(usernameNotFound);
                };

            };
        });
    } else {
        const posted_at = new Date().toDateString();
        const posted_by = req.session.username2;
        const query = "INSERT INTO `bleets` (`title`, `description`, `uploaded_by`, `uploaded_at`, `file_dir`) VALUES (?, ?, ?, ?, ?)";
        let file;
        let fileName;

        if (req.files) {
            file = req.files.bleeter_img
            fileName = file.name;
        } else {
            fileName = "no files uploaded"
        }

        connection.query(query, [title, bleetDescription, posted_by, posted_at, fileName], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                if (req.files) {
                    file.mv("./public/bleeter-pictures/" + fileName, err => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.redirect(`/bleeter/${result.insertId}`);
                        }
                    })
                } else {
                    res.redirect(`/bleeter/${result.insertId}`);
                };
            };
        });
    };
});

// Bleet page
router.get("/:bleetId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const query2 = "SELECT * FROM `bleets` WHERE `id` = ?";

    connection.query(`${query}; ${query2}`, [req.session.username2, req.params.bleetId], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0][0]) {
                res.render("bleeter/bleet.ejs", { title: "Bleet", desc: "Bleet", isAdmin: result[0][0].rank, bleet: result[1][0], req: req })
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});

// Edit Bleet page
router.get("/edit/:bleetId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const query2 = "SELECT * FROM `bleets` WHERE `id` = ?"
    connection.query(`${query}; ${query2}`, [req.session.username2, req.params.bleetId], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.render("bleeter/edit-bleet.ejs", { title: "Edit Bleet", isAdmin: result[0][0].rank, desc: "Bleeter, send an awesome bleet!", message: "", current: result[1][0] })
        };
    });
});

// Edit bleet
router.post("/edit/:bleetId", (req, res) => {
    const title = req.body.title;
    const bleetDescription = marked(req.body.description);
    let file;
    let query = "";
    let fileName;

    if (req.files) {
        file = req.files.bleeter_img
        fileName = file.name;
        query = "UPDATE `bleets` SET `title` = ?, `description` = ?, `file_dir` = ?";
    } else {
        query = "UPDATE `bleets` SET `title` = ?, `description` = ?";
    }



    if (bleetDescription.includes("<script>")) {
        const query = "SELECT * FROM `users` WHERE `username` = ?";
        const query2 = "SELECT * FROM `bleets` WHERE `id` = ?"

        connection.query(`${query}; ${query2}`, [req.session.username2, req.params.bleetId], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.render("bleeter/edit-bleet.ejs", { title: "Edit Bleet", isAdmin: result[0][0].rank, desc: "Bleeter, send an awesome bleet!", message: "script tags are not allowed!", current: result[1][0] });
                return res.end()
            };
        });
    } else {

        connection.query(query, [title, bleetDescription, fileName], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                if (req.files) {
                    file.mv("./public/bleeter-pictures/" + fileName, err => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.redirect(`/bleeter/${req.params.bleetId}`);
                        };
                    });
                } else {
                    res.redirect(`/bleeter/${req.params.bleetId}`);
                };
            };
        });
    };
});


// Delete bleet
router.get("/delete/:bleetId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const bleetId = req.params.bleetId;
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank === "admin" || result[0].rank === "moderator" || result[0].rank === "owner") {
                    connection.query("DELETE FROM `bleets` WHERE `id` = ?", [bleetId], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            const query = "SELECT * FROM `users` WHERE `username` = ?";
                            const bleets = "SELECT * FROM `bleets`"
                            connection.query(`${query}; ${bleets}`, [req.session.username2], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.render("bleeter/bleeter.ejs", { title: "Bleeter", bleets: result[1], isAdmin: result[0][0].rank, desc: "Bleeter, send an awesome bleet!", message: "Bleet was successfully deleted!" })
                                };
                            });
                        }
                    })
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("Error getting your username!");
            };
        };
    });
});

module.exports = router;