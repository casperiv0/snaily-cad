module.exports = {
    homePage: (req, res, next) => {
        connection.query("SELECT * FROM `cad_info`", (err, result) => {
            res.render("index.ejs", { title: "Home | SnailyCAD", isAdmin: '', loggedin: req.session.loggedin, username: req.session.username2, req: req, desc: "", cad_name: result[0].cad_name });
        })
    },
    logout: (req, res) => {
        req.session.destroy();

        res.redirect("/")
    }
};