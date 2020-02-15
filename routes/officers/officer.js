module.exports = {
    officersPage: (req, res) => {
        // if (req.session.loggedin) {
        // } else {
        //     res.redirect("/login")
        // }
        res.render("officers-pages/officers.ejs", { title: "My Officers", users: "qsd" })

    }
}