module.exports = {
    create911Call: (req, res) => {
        let name = req.body.name;
        let location = req.body.location;
        let desc = req.body.description;
        let query = "INSERT INTO `911calls` (`description`, `name`, `location`, `status`, `cadID`) VALUES (?,?,?,?,?)"

        connection.query(query, [desc, name, location, 'not assigned', req.params.cadID], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query2 = "SELECT cadID FROM `cads` WHERE cadID = '" + req.params.cadID + "'"

                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            res.redirect(`/cad/${result2[0].cadID}/citizen`);
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            };
        });
    }
};