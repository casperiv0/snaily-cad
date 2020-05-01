const router = require("express").Router();

// The Reason these 2 are moved here is because of the in game plugin

// Create Tow Call
router.post("/create-tow-call", (req, res) => {
    let name = req.body.name
    if (name === "") {
        name = "Not Specified"
    }
    let desc = req.body.description;
    if (desc === undefined) {
        desc = "Not Specified"
    }
    let location = req.body.location;
    const query = "INSERT INTO `tow_calls` (`description`, `name`, `location`) VALUES (?, ?, ?)"

    connection.query(query, [desc, name, location, req.params.cadID], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            res.redirect(`/citizen`);
        };
    });
});

// Create 911 Call
router.post("/:dir/create-911-call", (req, res) => {
    let name = req.body.name
    if (name === "") {
        name = "Not Specified"
    }
    let desc = req.body.description;
    if (desc === undefined) {
        desc = "Not Specified"
    }
    let location = req.body.location;
    const query = "INSERT INTO `911calls` (`description`, `name`, `location`, `status`) VALUES (?, ?, ?, ?)";



    connection.query(query, [desc, name, location, 'not assigned'], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if (req.path.includes("citizen")) {
                res.redirect("/citizen")
            } else {
                res.redirect("/dispatch")
            }
        };
    });
});



module.exports = router;