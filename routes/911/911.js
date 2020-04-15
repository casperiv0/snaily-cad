module.exports = {
    create911Call: (req, res) => {
        let name = req.body.name;
        let location = req.body.location;
        let desc = req.body.description;
        let query = "INSERT INTO `911calls` (`description`, `name`, `location`, `status`) VALUES (?, ?, ?, ?)"

        connection.query(query, [desc, name, location, 'not assigned'], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/citizen`);
            }
        })
    }
};