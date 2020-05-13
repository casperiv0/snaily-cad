const router = require("express").Router();

router.get("/", (req, res) => {
    const allCitizens = "SELECT * FROM `citizens` ORDER BY `linked_to` ASC";
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    connection.query(`${query}; ${allCitizens}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0][0]) {
                res.render("admin-pages/management/citizens.ejs", { title: "Manage Citizens", desc: "", citizens: result[1], isAdmin: result[0][0].rank });
            } else {
                res.send("Username not found!")
            }
        };
    });
});


router.get("/:citizenId/edit", (req, res) => {
    const citizenId = req.params.citizenId;
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const query2 = "SELECT * FROM `citizens` WHERE `id` = ?";
    const genderQ = "SELECT * FROM `genders`"
    const ethnicityQ = "SELECT * FROM `ethnicities`"


    connection.query(`${query}; ${query2}; ${ethnicityQ}; ${genderQ}`, [req.session.username2, citizenId], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.render("admin-pages/management/edit-citizen.ejs", { title: "Edit Citizen", desc: "", citizen: result[1][0], isAdmin: result[0][0].rank, message: "", genders: result[3], ethnicities: result[2] });
        };
    });
});

router.post("/:citizenId/edit", (req, res) => {
    let query;
    let birth = req.body.birth;
    let gender = req.body.gender;
    let ethnicity = req.body.ethnicity;
    let hair_color = req.body.hair;
    let eyes_color = req.body.eyes;
    let address = req.body.address;
    let height = req.body.height;
    if (height == "") { height = "Unknown" }
    let weight = req.body.weight;
    if (weight == "") { weight = "Unknown" }
    let file, fileName
    if (req.files) {
        file = req.files.citizen_pictures;
        fileName = file.name;
        query = 'UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `citizen_picture` = ? WHERE `citizens`.`id` = "' + req.params.citizenId + '"';
    } else {
        query = 'UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ? WHERE `citizens`.`id` = "' + req.params.citizenId + '"';
    }


    connection.query(`${query};`, [birth, gender, ethnicity, hair_color, eyes_color, address, height, weight, fileName], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/admin/citizens/`);
        };
    });
})


router.get("/:citizenId/delete", (req, res) => {
    const citizenId = req.params.citizenId;
    const query = "DELETE FROM `citizens` WHERE `id` = ?";

    connection.query(query, [citizenId], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect("/admin/citizens");
        };
    });
});


module.exports = router;