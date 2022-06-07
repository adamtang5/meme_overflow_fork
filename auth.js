const db = require('./db/models');

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    };
    req.session.save(() => {
        res.redirect('/');
    });
};

const logoutUser = (req, res) => {
    delete req.session.auth;
    req.session.save(() => {
        res.redirect('/');
    });
};

const requireAuth = (req, res, next) => {
    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }
    return next();
};

const restoreUser = async (req, res, next) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await db.User.findByPk(userId);

            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                next();
            }
        } catch (err) {
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        res.locals.authenticated = false;
        next();
    }
};

const checkSessionUser = (req, res, next) => {
    if (req.session.auth) {
        req.renderOptions = {
            isLoggedIn: true,
            sessionUser: res.locals.user,
        };
    } else {
        req.renderOptions = {
            isLoggedIn: false,
            sessionUser: undefined,
        };
    }
    next();
};

module.exports = {
    loginUser,
    restoreUser,
    logoutUser,
    requireAuth,
    checkSessionUser,
};
