module.exports = {
    homePage: (req, res, next) => {
        res.render("index.ejs", { title: "Home | SnailyCAD", isAdmin: '', loggedin: req.session.loggedin, username: req.session.username2, req: req, desc: "" });
    },
    logout: (req, res) => {
        req.session.destroy();

        res.redirect("/")
    }
};