const router = require("express").Router();


// Licenses Page
router.get("/:id-:full_name/edit-licenses", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const query2 = "SELECT * FROM `citizens` WHERE `id` = ?"
    const statuses = "SELECT * FROM `in_statuses`";
    connection.query(`${query}; ${query2}; ${statuses}`, [req.session.username2, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.render("citizens/licenses.ejs", { desc: "", title: "Edit Licenses", isAdmin: result[0][0].rank, req: req, current: result[1][0], statuses: result[2] });
        };
    });
});


// Update licenses
router.post("/:id-:full_name/edit-licenses", (req, res) => {
    const citizenId = req.params.id;
    const citizenName = req.params.full_name
    const dmv = req.body.dmv;
    const pilot_license = req.body.pilot_license;
    const fire_license = req.body.fire_license;
    const ccw = req.body.ccw;

    const query = "UPDATE `citizens` SET `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ? WHERE `id`= ?";
    connection.query(query, [dmv, fire_license, pilot_license, ccw, citizenId], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/citizens/${citizenId}-${citizenName}`)
        }
    })
});


module.exports = router