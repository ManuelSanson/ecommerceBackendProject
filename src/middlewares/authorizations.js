export const loginAuth = (req, res, next) => {
    if (req.session?.user) return next()

    return res.status(401).send(`Auth error. Debes <a href="/session/logins">iniciar sesión</a>`)
}

export const adminAuth = (req, res, next) => {
    if (req.session.role == 'admin') return next()

    return res.status(401).send(`Auth error. Solo los admin pueden ver esta seccion`)
}

export const userAuth = (req, res, next) => {
    if (req.session.role == 'user') return next()

    return res.status(401).send(`Auth error. Solo los user pueden ver esta seccion`)
}