const router = require("express").Router();

/*
* Weapon options for citizen is located in "citizen/weapons.js",
* WeaponRegistration, DeleteRegisteredWeapon

*/

// Main Weapons Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    const query = "SELECT * FROM `weapons` ORDER BY id ASC"
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.sendStatus(400)
                        }
                        res.render("admin-pages/weapons/weapons.ejs", { desc: "", title: 'Admin Panel | Weapons', weapons: result, isAdmin: result1[0].rank, })
                    })
                } else {
                    res.sendStatus(403)
                };
            } else {
                res.send("there was an error getting your username")
            };
        };
    });
});

// Add weapon page
router.get("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    res.render("admin-pages/weapons/add-weapons.ejs", { desc: "", title: "Add Weapon", isAdmin: result1[0].rank, });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("there was an error getting your username");
            };
        };
    });
});

// Add weapon
router.post("/add", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                const weaponName = req.body.weapon_name;
                const query = "INSERT INTO `weapons` (`name`) VALUES (?)";
                connection.query(query, [weaponName], (err) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);;
                    } else {
                        const date = new Date()
                        const currentD = date.toLocaleString();
                        const action_title = `Weapon "${weaponName}" was added by ${req.session.username2}.`

                        const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                        connection.query(actionLog, [action_title, currentD], (err) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                res.redirect(`/admin/weapons`);
                            };
                        });
                    }
                });
            } else {
                res.sendStatus(403);
            };
        }
    });
});

// Edit Weapon Page
router.get("/edit/:weaponId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
    connection.query(query, (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                if (result1[0].rank == 'moderator' || result1[0].rank == 'admin' || result1[0].rank == 'owner') {
                    const weaponId = req.params.weaponId;
                    const query = "SELECT * FROM `weapons` WHERE id = ?";
                    connection.query(query, [weaponId], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.render("admin-pages/weapons/edit-weapon.ejs", { desc: "", title: "Edit Gender", weapon: result[0], isAdmin: result1[0].rank, });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("there was an error getting your username");
            }
        };
    });
});

// Edit Weapon
router.post("/edit/:weaponId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let weaponId = req.params.weaponId;
                    let newWeaponName = req.body.weapon_name;
                    let query = 'UPDATE `weapons` SET `name` = ? WHERE `weapons`.`id` = ?';

                    connection.query(query, [newWeaponName, weaponId], (err) => {
                        if (err) {
                            console.log(err)
                            console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            const date = new Date()
                            const currentD = date.toLocaleString();
                            const action_title = `Weapon "${newWeaponName}" was edited by ${req.session.username2}.`

                            const actionLog = "INSERT INTO `action_logs` (`action_title`,`date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/weapons`);
                                };
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("there was an error getting your username");
            };
        };
    });
})

// Delete Weapon
router.get("/delete/:weaponId", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?"
    connection.query(query, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'moderator' || result[0].rank == 'admin' || result[0].rank == 'owner') {
                    let weaponId = req.params.weaponId;
                    let deleteUserQuery = 'DELETE FROM weapons WHERE id = ?';
    
                    connection.query(deleteUserQuery, [weaponId], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);;
                        } else {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `A weapon was deleted by ${req.session.username2}.`
    
                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
                            connection.query(actionLog, [action_title, currentD], (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.redirect(`/admin/weapons`);
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send("there was an error getting your username");
            };
        };
    });
});

module.exports = router;