const passport = require('koa-passport');

module.exports = function () {
    return async (ctx, next) => {
        if (!ctx.req.session) {
            ctx.req.session = {};
        }

        ctx.req.session = {
            save: (done) => {
                done();
            }, // Пустышка для метода save
            regenerate: (done) => {
                console.log("regenerated");
                ctx.session = {}; // Очищаем сессию
                done();
            }
        };

        await passport.initialize()(ctx, () => Promise.resolve());
        await passport.session()(ctx, () => Promise.resolve());

        return next();
    };
};