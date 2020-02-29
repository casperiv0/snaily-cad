module.exports = {
    emsPage: (req, res, next) => {

        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            connection1.query(query, (err, result1) => {
                if (result1[0].ems_fd == 'yes') {
                    let qeury = "SELECT * FROM `ems-fd` ORDER by id ASC"
                    connection.query(qeury, (err, result) => {
                        if (err) {
                            res.send("Oops something went wrong!")
                            console.log("Error" + err)
                        }
                        res.render("ems-fd/ems-fd.ejs", {
                            title: "EMS/FD | Equinox CAD",
                            users: "qsd",
                            isAdmin: result1[0].admin,
                            ems: result
                        });
                    });
                } else {
                    res.sendStatus(403);
                };
            });
        } else {
            res.redirect("/login")
        }
    }
}