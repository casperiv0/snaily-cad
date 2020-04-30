const router = require("express").Router();

/*
* Create Tow Call is in "global/global.js"
*/

// Tow Truckers page
router.get("/", (req, res) => {
    const query2 = "SELECT * FROM `users` WHERE username = ?"
    const query = "SELECT * FROM `cad_info`"

    connection.query(`${query2}; ${query}`, [req.session.username2], (err, result2) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (result2[0]) {
                const calls = "SELECT * FROM `tow_calls`"
                connection.query(`${calls};`, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else {
                        if (result2[1][0].tow_whitelisted === "yes") {
                            if (result2[0][0].tow !== "yes") {
                                res.render("tow/403.ejs", { desc: "", title: "unauthorized", isAdmin: result2[0][0].rank });
                                res.end()
                            } else {
                                res.render("tow/tow.ejs", { desc: "", title: "Tow | SnailyCAD", isAdmin: result2[0][0].rank, calls: result, aop: result2[1][0] });
                                res.end()
                            }
                        } else {
                            res.render("tow/tow.ejs", { desc: "", title: "Tow | SnailyCAD", isAdmin: result2[0][0].rank, calls: result, aop: result2[1][0] });
                            res.end()
                        }
                    }
                })
            } else {
                res.send("There was an error in the request");
            };
        };
    });
});

// Cancel Tow Call
router.get("/cancel-call-:callId", (req, res) => {
    const callId = req.params.callId;
    const query = "DELETE FROM `tow_calls` WHERE `id` = ?"

    connection.query(query, [callId], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/tow`);
        };
    });
});


module.exports = router;