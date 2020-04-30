const router = require("express").Router();
const usernameNotFound = "There was an error getting your username.";


// Edit CAD Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";

    connection.query(`${query}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'owner') {
                    const query2 = "SELECT * FROM `cad_info`";
                    connection.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: '', message: '', title: "CAD Settings", isAdmin: result[0].rank, current: result2[0] });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});

// Edit CAD
router.post("/", (req, res) => {
    let cad_name = req.body.cad_name
    let whitelisted = req.body.whitelist
    let tow_whitelist = req.body.tow_whitelist
    if (whitelisted === undefined) {
        whitelisted = "false"
    } else {
        whitelisted = "true"
    }
    if (tow_whitelist === undefined) {
        tow_whitelist = "no"
    } else {
        tow_whitelist = "yes"
    }

    let query4 = "UPDATE `cad_info` SET `cad_name` = ?, `tow_whitelisted` = ?, `whitelisted` = ? ";

    let query = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(`${query}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'owner') {
                    connection.query(`${query4};`, [cad_name, tow_whitelist, whitelisted], (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
    
                            let cads = "SELECT * FROM `cad_info`"
    
                            connection.query(`${cads};`, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    let date = new Date()
                                    let currentD = date.toLocaleString();
                                    let action_title = `CAD name was edited to "${cad_name}".`
                                    let actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"
    
                                    connection.query(actionLog, [action_title, currentD], (err) => {
                                        if (err) {
                                            console.log(err);
                                            return res.sendStatus(500)
                                        } else {
                                            res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'Changes Successfully Saved', title: "CAD Settings", isAdmin: result[0].rank, current: result2[0] });
                                        };
                                    });
                                };
                            });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound);
            };
        };
    });
});

module.exports = router;