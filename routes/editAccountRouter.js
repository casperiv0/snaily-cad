const router = require("express").Router();
const usernameNotFound = "There was an error getting your username.";

router.get("/edit", (req, res) => {
    let query = "SELECT * FROM `users` WHERE username = ?";
    connection.query(query, [req.session.username2], (err, result1) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result1[0]) {
                res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Currently you are only able to edit your password, Username will follow up soon!', messageG: '' })
            } else {
                res.send(usernameNotFound)
            }
        }
    })
});

router.post("/edit", (req, res) => {
    const old_password = req.body.oldPassword;
    const password = req.body.password;
    const password2 = req.body.password2;

    if (password !== password2) {
        let query = "SELECT * FROM `users` WHERE username = ?";
        connection.query(query, [req.session.username2], (err, result1) => {

            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", messageG: '', message2: "Passwords Are Not The Same" })
            };
        });
    } else {
        let query = "SELECT * FROM `users` WHERE username = ?"

        connection.query(query, [req.session.username2], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                bcrypt.compare(old_password, result[0].password, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (result2 === true) {
                            let old_name = req.session.username2;
                            bcrypt.hash(password, saltRounds, (err2, hash) => {
                                if (err2) {
                                    console.log(err2);
                                    return res.sendStatus(500)
                                } else {
                                    let query2 = 'UPDATE `users` SET `password` = ? WHERE `users`.`username` = ?';
                                    connection.query(`${query2};`, [hash, old_name], async (err, result1) => {
                                        if (err) {
                                            console.log(err);
                                        } else if (err) {
                                            console.log(err1);
                                        } else {
                                            let query = "SELECT * FROM `users` WHERE username = ?";
                                            connection.query(query, [req.session.username2], (err, result1) => {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500)
                                                } else {
                                                    res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, messageG: 'Successfully Changed Password', message: "", message2: "", messageG: '' })
                                                }
                                            });
                                        };
                                    });
                                }
                            })
                        } else {
                            let query = "SELECT * FROM `users` WHERE username = ?";
                            connection.query(query, [req.session.username2], (err, result1) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500)
                                } else {
                                    res.render("edit-account.ejs", { desc: "", title: 'Edit Account | SnailyCAD', isAdmin: result1[0].admin, req: req, message: "", message2: 'Invalid Password', messageG: '' })
                                }
                            });
                        };
                    };
                });
            };
        });
    };
});

module.exports = router;