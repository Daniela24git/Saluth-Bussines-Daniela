const redirect = {};

redirect.redirect = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/api/auth/");
    } else {
        next();
    }
};





module.exports = redirect;
