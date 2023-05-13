export const loginAuth = (req, res, next) => {
    if (req.session?.user) return next()

    return res.status(401).send(`Auth error. Debes <a href="/session/logins">iniciar sesión</a>`)
}

export const adminAuth = (req, res, next) => {
    if (req.session.user.role == 'admin') return next()

    return res.status(401).send(`Auth error. Solo los admin pueden ver esta seccion`)
}

export const usersAuth = (req, res, next) => {
    if (req.session.user.role == 'premium' || req.session.user.role == 'user') return next()

    return res.status(401).send(`Auth error. Solo los users pueden ver esta seccion`)
}

export const premiumUserAdminAuth = (req, res, next) => {
    if (req.session.user.role == 'premium' || req.session.user.role == 'admin') return next()

    return res.status(401).send(`Auth error. Solo los user premium y el admin pueden ver esta seccion`)
}