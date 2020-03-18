const slugify = require('slugify')
const d = new Date()

module.exports = {
    supportPage: (req, res) => {
        if (!req.session.mainLoggedin) {
            res.redirect("/login")
        } else {
            let query = "SELECT * FROM `tickets` WHERE `creator` = '" + req.session.user + "'"
            connection1.query(`${query}; `, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("support/support.ejs", { title: "Support | SnailyCAD", desc: "", tickets: result})
                }
            })
        }
    },
    createTicketPage: (req, res) => {
        if (!req.session.mainLoggedin) {
            res.redirect("/login")
        } else {
            res.render("support/tickets.ejs", { title: "Create Ticket | SnailyCAD", desc: "", message: "" })
        }
    },
    createTicket: (req, res) => {
        if (!req.session.mainLoggedin) {
            res.redirect("/login")
        } else {
            function makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            let subject = slugify(req.body.subject);
            let desc = req.body.desc;
            let date = d.toLocaleDateString();
            let ticket_id = makeid(4)
            let query = "INSERT INTO `tickets` (`title`, `ticket_id`, `description`, `status`, `creator`, `date`) VALUES (?,?,?,?,?,?)"

            connection1.query(query, [subject, ticket_id, desc, 'open', req.session.user, date], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.render("support/tickets.ejs", { title: "Create Ticket | SnailyCAD", desc: "", message: "Something went wrong while making the ticket! Please try again later." })
                } else {
                    res.redirect("/support");
                };
            });
        };
    },
    ticketPage: (req, res) => {
        if (!req.session.mainLoggedin) {
            res.redirect("/login")
        } else {
            let query = "SELECT * FROM `tickets` WHERE `creator` = '" + req.session.user + "' AND `ticket_id` = '" + req.params.ticket_id + "' ";
            let query2 = "SELECT * FROM `ticket_message` WHERE `ticket_id` = '" + req.params.ticket_id + "' ORDER BY `ticket_message`.`time` DESC";
            let admin = "SELECT * FROM `users` WHERE `username` = '" + req.session.user + "'"
            connection1.query(`${query}; ${query2}; ${admin}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    res.render("support/ticket.ejs", { title: "Tickets | SnailyCAD", desc: "", message: "", ticket: result[0], messages: result[1], isAdmin: result[2][0].main_administrator_sM7a6mFOHI  });
                };
            });
        };
    },
    replyToPost: (req, res) => {
        let ticket_title = req.params.title
        let message = req.body.message;
        let time = d.toLocaleTimeString()
        let name = req.session.user;
        let ticket_id = req.params.ticket_id;
        let query = "INSERT INTO `ticket_message` (`name`, `message`, `time`, `ticket_id`) VALUES (?,?,?,?)"
        connection1.query(query, [name, message, time, ticket_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                res.redirect(`/support/ticket/${ticket_id}-${ticket_title}`)
            }
        })
    },
    cadPage: (req, res) => {
        if (!req.session.mainLoggedin) {
            res.redirect("/login")
        } else {
            let cadID = req.params.cadID;

            connection1.query("SELECT * FROM `cads` WHERE `id` = ?", [cadID], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.render("support/cad.ejs", { title: "CAD info", desc: "", cad: result[0] })
                }
            })
        };
    },
    closeTicket: (req, res) => {
        if (!req.session.mainLoggedin) {
            res.redirect("/login")
        } else {
            let ticketID = req.params.id;
            connection1.query("UPDATE `tickets` SET `status` = 'closed' WHERE `tickets`.`id` = '" + ticketID + "' ", (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500)
                } else {
                    res.redirect("/admin/dashboard")
                }
            })
        };
    }
}
