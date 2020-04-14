module.exports = {
    homePage: (req, res, next) => {
        if (req.session.loggedin) {
            res.render("index.ejs", { title: "Home | SnailyCAD", isAdmin: '', loggedin: req.session.loggedin, username: req.session.username2, req: req, desc: "" });
        } else {
            res.redirect("/login")
        }
    },
    logout: (req, res) => {
        req.session.destroy();

        res.redirect("/")
    }
};