module.exports = {
    loggedinHomePage: (req, res, next) => {
        if (req.session.loggedin) {
            res.redirect("/admin")
        } else {
            res.send("You're not logged in!");
        }
        res.end();
    }
}