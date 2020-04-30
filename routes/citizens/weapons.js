const router = require("express").Router();


// Register Weapon Page
router.get("/register", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            const weapons = "SELECT * FROM `weapons` ORDER BY id ASC"
            const citizens = "SELECT * FROM `citizens` ORDER BY `full_name` ASC"
            const insuranceStatuses = "SELECT * FROM `in_statuses`  ORDER BY id ASC"
            const ownerQ = "SELECT * FROM `citizens` WHERE linked_to = ?"

            connection.query(`${weapons}; ${citizens}; ${insuranceStatuses}; ${ownerQ}`, [req.session.username2], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);;
                } else {
                    res.render("weapons/reg-weapons.ejs", { title: "Weapon Registration", weapons: result[0], status: result[2], owners: result[1], isAdmin: result1[0].rank, name: req.session.username2, owner: result[3], desc: "" })
                }
            });
        };
    });
});

// Register Weapon
router.post("/register", (req, res) => {
    function createSerialNumber(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    let owner = req.body.owner;
    let weapon = req.body.weapon;
    let status = req.body.status;
    let serial_number = createSerialNumber(10)

    let query = "INSERT INTO `registered_weapons` (`owner`, `weapon`, `serial_number`, `status`, `linked_to`) VALUES (?, ?, ?, ?, ?)";

    connection.query(query, [owner, weapon, serial_number, status, req.session.username2], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);;
        } else {
            let query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err, result1) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query = "SELECT * FROM `citizens` WHERE linked_to = ?";
                    let query3 = "SELECT * FROM `users`";
                    let query4 = "SELECT * FROM `cad_info`"
                    connection.query(`${query3}; ${query4}`, (err, result4) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            connection.query(`${query}`, [req.session.username2], (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.render("citizens/citizen.ejs", { title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].rank, message: "", messageG: 'Successfully Registered Weapon', username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP, desc: "See All your citizens, register vehicles or weapons here too." });
                                }
                            });
                        };
                    });
                };
            });
        };
    });
});

// Delete Registered Weapon
router.get("/delete/:citizenId/:weaponId", (req, res) => {
    const weaponId = req.params.weaponId;
    const query = "DELETE FROM `registered_weapons` WHERE id = ?";

    connection.query(query, [weaponId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500)
        } else {
            const query = "SELECT * FROM `users` WHERE username = ?";
            connection.query(query, [req.session.username2], (err) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    let query = "SELECT * FROM `users` WHERE username = ?";
                    connection.query(query, [req.session.username2], (err, result1) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            const query = "SELECT * FROM `citizens` WHERE linked_to = ?";
                            const query3 = "SELECT * FROM `users`";
                            const query4 = "SELECT * FROM `cad_info`"
                            connection.query(`${query3}; ${query4}`, (err, result4) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    connection.query(`${query}`, [req.session.username2], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            res.render("citizens/citizen.ejs", { desc: "See All your citizens, register vehicles or weapons here too.", title: "Citizens | SnailyCAD", citizen: result, isAdmin: result1[0].rank, message: "", messageG: 'Successfully Removed Weapon', username: req.session.username2, cadName: result4[1][0].cad_name, aop: result4[1][0].AOP, });
                                        };
                                    });
                                };
                            });
                        };
                    });
                };
            });
        };
    });
})

module.exports = router;