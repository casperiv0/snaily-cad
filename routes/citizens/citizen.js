module.exports = {
    citizenPage: (req, res, next) => {

        let query = "SELECT * FROM `citizens`"
        db.query(query, (err, result) => {
            if (err) {
                res.sendStatus(401)
            }
            res.render("citizens/citizen.ejs", { title: "Citizens", citizen: result })
        })
        // if (req.session.loggedin) {
        // } else {
        //     res.send("You're not logged in!");
        // }
        // res.end();

    },
    citizenDetailPage: (req, res) => {
        let id = req.params.id;
        let query = "SELECT * FROM `citizens` WHERE id = '" + id + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render("citizens/detail-citizens.ejs", { title: "Citizen Detail", citizen: result[0] })
        });
    },
    addCitizenPage: (req, res) => {
        let genderQ = "SELECT * FROM `genders`"
        let ethnicityQ = "SELECT * FROM `ethnicities`"
        db.query(`${genderQ}; ${ethnicityQ}`, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render("citizens/add-citizen.ejs", { title: "Add Citizen", genders: result[0], ethnicities: result[1] })

        });
    },
    addCitizen: (req, res) => {
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let birth = req.body.birth;
        let gender = req.body.gender;
        let ethnicity = req.body.ethnicity;
        let hair_color = req.body.hair;
        let eyes_color = req.body.eyes;
        let address = req.body.address;
        let height = req.body.height;
        if (height == "") {
            height = "Unknown"
        }
        let weight = req.body.weight;
        if (weight == "") {
            weight = "Unknown"
        }

        let query = "INSERT INTO `citizens` ( `first_name`, `last_name`, `birth`, `gender`, `ethnicity`, `hair`, `eyes`, `address`, `height`) VALUES ('" + first_name + "','" + last_name + "','" + birth + "','" + gender + "','" + ethnicity + "','" + hair_color + "','" + eyes_color + "','" + address + "','" + height + "' )";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect(`/citizen`);
        });
    },
}