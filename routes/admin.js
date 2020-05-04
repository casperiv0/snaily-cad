const router = require("express").Router();
const usernameNotFound = "There was an error getting your username.";

// Main Admin Page
router.get("/", (req, res) => {
    const query = "SELECT * FROM `users` WHERE username = ?";
    const query2 = "SELECT * FROM `users`";
    const getAllCitizens = "SELECT * FROM `citizens`";
    const getAllWeapons = "SELECT * FROM `registered_weapons`";
    const getAllVehicles = "SELECT * FROM `registered_cars`";
    const getAllCharges = "SELECT * FROM `posted_charges`";
    const getAllCompanies = "SELECT * FROM `businesses` ";
    const getAllCompaniesPosts = "SELECT * FROM `posts` ";
    const getAllBolos = "SELECT * FROM `bolos` ";
    const cad_info = "SELECT * FROM `cad_info`"
    connection.query(`${query}; ${cad_info}; ${query2};`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            connection.query(`${getAllCitizens}; ${getAllWeapons}; ${getAllVehicles}; ${getAllCharges}; ${getAllCompanies}; ${getAllCompaniesPosts}; ${getAllBolos}`, (err, result3) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    if (result[0][0]) {
                        if (result[0][0].rank == 'moderator' || result[0][0].rank == 'admin' || result[0][0].rank == 'owner') {
                            res.render("admin.ejs", { desc: "", title: 'Admin Panel | SnailyCAD', isAdmin: result[0][0].rank, users: result[1].length, cads: result[2], citizens: result3[0].length, weapons: result3[1].length, vehicles: result3[2].length, charges: result3[3].length, companies: result3[4].length, posts: result3[5].length, bolos: result3[6].length });
                        } else {
                            res.sendStatus(403);
                        };
                    } else {
                        res.send(usernameNotFound)
                    }
                };
            });
        };
    });
});

// Action Logs Page
router.get("/action-log", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?"
    connection.query(`${query}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'owner' || result[0].rank == 'admin' || result[0].rank == 'moderator') {
                    let query = "SELECT * FROM `action_logs` ORDER BY `date` DESC"
                    connection.query(`${query}`, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.render("admin-pages/action-logs.ejs", { desc: "", messageG: '', message: '', title: "Action Logs | Equinox CAD", isAdmin: result[0].rank, actions: result2 });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.status(500).send("something went wrong! Please report this bug at Discord DM's CasperTheGhost#4546 ");
            };
        };
    });
});

// Delete All Citizens
router.get("/delete-all-citizens", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?"

    const date = new Date()
    const currentD = date.toLocaleString();
    const action_title = `All Citizens were deleted by ${req.session.username2}.`

    const actionLog = "INSERT INTO `action_logs` (`action_title`, `date`) VALUES (?, ?)"

    connection.query(`${query}; ${actionLog}`, [req.session.username2, action_title, currentD], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0][0]) {
                if (result[0][0].rank == 'owner') {
                    connection.query("DELETE FROM `citizens`", (err) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500)
                        } else {
                            res.render("admin-pages/cad-settings.ejs", { desc: "", messageG: 'All Citizens Were Successfully Deleted.', current: "", title: "CAD Settings | Equinox CAD", isAdmin: result[0][0].rank })
                        };
                    })
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.send(usernameNotFound)
            }
        };
    });
});


// Company Management
router.get("/manage-companies", (req, res) => {
    const query = "SELECT * FROM `users` WHERE `username` = ?"
    connection.query(`${query}`, [req.session.username2], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        } else {
            if (result[0]) {
                if (result[0].rank == 'owner' || result[0].rank == 'admin' || result[0].rank == 'moderator') {
                    let query = "SELECT * FROM `businesses`"
                    connection.query(`${query}`, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            res.render("admin-pages/company/manage-companies.ejs", { desc: "", messageG: '', message: '', title: "Manage Companies", isAdmin: result[0].rank, companies: result2 });
                        };
                    });
                } else {
                    res.sendStatus(403);
                };
            } else {
                res.status(500).send("something went wrong! Please report this bug at Discord DM's CasperTheGhost#4546 ");
            };
        };
    });
});

// Delete Company
router.get("/manage-companies/delete/:companyId", (req,res) => {
    const companyId = req.params.companyId;

    const query = "DELETE FROM `businesses` WHERE `id` = ?";
    connection.query(query, [companyId], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500)
        } else {
            res.redirect("/admin/manage-companies")
        }
    })
});

module.exports = router