function loginAuth(req, res, next) {
    if (!req.session.loggedin) {
        return res.redirect("/auth/login");
    } else {
        next()
    }
}

module.exports = {
    loginAuth
}