const router = require("express").Router();

// Genders Main Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    const query = "SELECT * FROM `genders` ORDER BY id ASC"
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400)
                        }
                        res.render("admin-pages/genders/gender.ejs", { desc: "", title: 'Admin Panel | Genders', genders: result, isAdmin: result1[0].rank, })
                    })
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username.");
            };
        };
    });
});

// Add Gender Page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    res.render("admin-pages/genders/add-gender.ejs", { desc: "", title: "Add Gender", isAdmin: result[0].rank, });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your username")
            }
        };
    });
});

// Add gender
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const gender = req.body.gender;

                    const query = "INSERT INTO `genders` (`name`) VALUES (?)";
                    connection.query(query, [gender], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.redirect(`/admin/genders`)
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your name")
            }
        };
    });
});

// edit gender page
router.get("/edit/:genderId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    const genderId = req.params.genderId;
                    const query = "SELECT * FROM `genders` WHERE id = ? ";
                    connection.query(query, [genderId], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.render("admin-pages/genders/edit-gender.ejs", { desc: "", title: "Edit Gender", gender: result[0], isAdmin: result[0].rank, });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("There was an error getting your name");
            };
        };
    });
});

// update gender
router.post("/edit/:genderId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const genderId = req.params.genderId;
                const newGender = req.body.gender;
                const query = 'UPDATE `genders` SET `name` = ? WHERE `genders`.`id` = ?';

                connection.query(query, [newGender, genderId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/admin/genders`)
                    }
                });
            } else {
                res.sendStatus(403);
            };
        }
    });
})


// Delete Gender
router.get("/delete/:genderId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const genderId = req.params.genderId;
                const query = 'DELETE FROM `genders` WHERE id = ?';

                connection.query(query, [genderId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        res.redirect(`/admin/genders`);
                    };
                });
            } else {
                res.sendStatus(403);
            };
        };
    });
});

module.exports = router;