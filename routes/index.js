module.exports = {
    homePage: (req, res, next) => {
        if (req.session.loggedin) {
            res.render("index.ejs", { title: "Home | SnailyCAD", isAdmin: '', loggedin: req.session.loggedin, username: req.session.username2, cadId: result2[0][0].cadID, req: req, desc: `CAD app for cadID: ${result[0].cadID}.` });
        } else {
            res.redirect("/login")
        }
    },
    logout: (req, res) => {
        req.session.destroy();

        res.redirect("/")
    }
};