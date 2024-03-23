const fs = require("fs");
const koa = require("koa");
const koaRouter = require("koa-router");
const { koaBody } = require('koa-body');
const { graphqlHTTP } = require('koa-graphql');
const {
    graphql,
    buildSchema
} = require('graphql');
const resolver = require('./resolver');
const cors = require('@koa/cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('koa-session');

const dotenv = require('dotenv');
//dotenv.config();

const app = new koa();
const router = new koaRouter();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

/*app.keys = ['nohornyplease'];
const sessionConfig = {
  key: 'koa:sess', // the cookie key name (default is koa:sess)
  maxAge: 86400000, // 1 day in milliseconds
  overwrite: true, // overwrite session if exists, default is true
  httpOnly: true, // cookie is not accessible via JavaScript, default is true
  signed: true, // signed cookie
  rolling: false, // forces a session identifier cookie to be set on every response. 
                 // The expiration is reset to the original maxAge, resetting the expiration countdown. 
                 // Default is false.
  renew: false, // renew session when session is nearly expired, so we can always keep user logged in. Default is false.
};
app.use(session(sessionConfig, app));*/
app.use(koaBody());

router.get("/test", (ctx) => {
    ctx.body = "<h3>Server online!</h3>";
});

//app.use(passport.initialize());
//app.use(passport.session());

/*passport.serializeUser(function(user, done) {
    console.log('Serializing user' + user.profile.displayName);
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    console.log('Deserializing user' + user.profile.displayName);
    done(null, user);
});*/

/*passport.use(
    new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        (token, refreshToken, profile, done) => { done(null, {profile: profile, token: token}); }
    )
);*/

router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    })
);
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/resource',
    })
);
router.get('/login', (ctx, next) => {
    ctx.body = `<h2><a href="/auth/google">Login via Google</a></h2>`;
});
router.get('/resource', (ctx, next) => {
    if (ctx.isAuthenticated())
        return ctx.body = `<h2>Welcome to the resource, ${req.user.username}!</h2>`;
    ctx.status = 401;
    return ctx.body = '[ERROR] 401: Unauthorized.';
});
router.get('/logout', (ctx, next) => {
    ctx.logout();
    ctx.redirect('/login');
});

const schema = buildSchema(fs.readFileSync('./schema.graphql').toString());
router.post('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
  })
);
router.get('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
router.post('/getbook', (ctx, next) => {
    let path = ctx.request.body.document;
    if (fs.existsSync(path)) {
        ctx.response.type = 'application/pdf';
        let pdf = fs.createReadStream(path);
        console.log(pdf);
        ctx.body = pdf;
    } else {
        ctx.status = 404;
        ctx.body = { error: "Error: file not found: " + path };
    }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[OK] Running on port ${PORT}`));
