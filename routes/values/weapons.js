module.exports = {
    weaponsPage: (req, res) => {
        let query = "SELECT * FROM `weapons` ORDER BY id ASC"
        db.query(query, (err, result) => {
            if (err) {
                res.sendStatus(400)
            }
            res.render("admin-pages/weapons.ejs", { title: 'Admin Panel | Weapons', weapons: result })
        })
    },
    deleteWeapon: (req, res) => {
        let playerId = req.params.id;
        // let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM weapons WHERE id = "' + playerId + '"';

        db.query(deleteUserQuery, (err, result) => {
            console.log(`${playerId} was a success! DELETE`)
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/weapons');
        });
    },
    addWeaponPage: (req, res) => {
        res.render("genders/add-gender.ejs", { title: "Add Gender" })
    },
    addWeapon: (req, res) => {
        let gender = req.body.gender;

        let query = "INSERT INTO `genders` (`gender`) VALUES ('" + gender + "')";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/values/weapons/');
        });
    }

}