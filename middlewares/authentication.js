module.exports = {
  auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect("/api/auth/signin");
  },
  not_auth(req, res, next) {
    if (!req.isAuthenticated()) return next();
    return res.redirect("/api/dashboard");
  },
};
