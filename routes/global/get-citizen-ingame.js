const router = require("express").Router();


// Get citizen data by name
router.get("/:full_name", (req, res) => {
    const full_name = req.params.full_name;

    if (!full_name) {
        return res.send("Please include a name!");
    };

    const query = "SELECT * FROM `citizens` WHERE `full_name` = ?";

    connection.query(query, [full_name], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                res.json(result);
            } else {
                res.send("Citizen Not Found")
            }
        };
    });
});



module.exports = router;