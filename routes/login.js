module.exports = {
    loggedinHomePage: (req, res, next) => {
        if (req.session.loggedin) {
            res.render("home.ejs", { title: "home" })
        } else {
            res.send("You're not logged in!");
        }
        res.end();
    }
}