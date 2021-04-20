const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/campgrounds');
    }
    res.render("users/register")
}

module.exports.register = async (req,res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", `Welcome to Yelp Camp, ${req.user.username}!`);
            res.redirect("/campgrounds");
        })
    } catch(e) {
        req.flash("error", `${e.message}.`, "Please try again!");
        res.redirect("/register")
    }
}

module.exports.renderLoginForm = (req,res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/campgrounds');
    }
    res.render("users/login")
}

module.exports.login = (req,res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`)
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
}