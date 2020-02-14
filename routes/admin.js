module.exports = {
    adminPanel: (req, res) => {
        res.render("admin.ejs", { title: 'Admin Panel' })

    },
    citizensPage: (req, res) => {
        let query = "SELECT * FROM `users` ORDER BY id ASC"
        db.query(query, (err, result) => {
            if (err) {
                res.sendStatus(400)
            }
            res.render("admin-pages/citizens.ejs", { title: 'Admin Panel | Citizens', users: result })
        })

    },

}
