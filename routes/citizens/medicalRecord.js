const router = require("express").Router();


// Add Medical Record Page
router.get("/:citizenId-:citizenName/add", (req, res) => {
    res.render("citizens/medical/add-medical-record.ejs", { desc: "", title: "Edit Licenses", isAdmin: "", req: req });
});

// Add medical record
router.post("/:citizenId-:citizenName/add", (req, res) => {
    const citizenId = req.params.citizenId;
    const citizenName = req.params.citizenName;
    const type = req.body.type;
    const shortInfo = req.body.short;

    const query = "INSERT INTO `medical_records` (`type`, `short_info`, `name`) VALUES (?, ?, ?)";

    connection.query(query, [type, shortInfo, citizenName], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.redirect(`/citizens/${citizenId}-${citizenName}`);
        };
    });
});


module.exports = router