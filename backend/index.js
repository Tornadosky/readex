//------------------------------ HEADER ------------------------------//

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
const serve = require('koa-static');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = new koa();
const router = new koaRouter();

//------------------------------ SETTINGS ------------------------------//

require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(serve(__dirname + '/uploads'));

app.keys = ['nohornyplease'];
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
app.use(session(sessionConfig, app));
//app.use(session(app));

app.use(async (ctx, next) => {
    console.log('Before:', ctx.session);
    await next();
    console.log('After:', ctx.session);
});

app.use(koaBody({
    multipart: true, // to enable multipart/form-data
    formidable: {
      maxFileSize: 200*1024*1024    // set file size limit (this example sets it to 200MB)
    },
    jsonLimit: '50mb', // for JSON payload
    formLimit: '50mb', // for URL-encoded form payload
}));

router.get("/test", (ctx) => {
    ctx.body = "<h3>Server online!</h3>";
});

//------------------------------ AUTH ------------------------------//

app.use(async (ctx, next) => {
    if (ctx.session.isNew) {
        ctx.session = null;
    }
    await next();
});

router.post('/login', async (ctx) => {
    console.log(ctx.session);
    const { email, password } = ctx.request.body;
    let user = users.find(u => u.email === email);

    if (!user) {
        user = await resolver.Users({password: password, email: email}, {});

        if (user.length != 1) {
            ctx.status = 400;
            ctx.body = { message: 'User not found.' };
            return;
        }
    } else if (!user.verified) {
        ctx.status = 400;
        ctx.body = { message: 'Email not verified.' };
        return;
    }

    if (password !== user.password) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid password.' };
        return;
    }

    ctx.session.user = user;
    ctx.status = 200;
    ctx.body = { message: 'Logged in successfully.' };
});

router.post('/logout', async (ctx) => {
    ctx.session = null;
    ctx.status = 200;
    ctx.body = { message: 'Logged out successfully.' };
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

// router.get(
//     '/auth/google',
//     passport.authenticate('google', {
//         scope: ['profile']
//     })
// );
// router.get(
//     '/auth/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/login',
//         successRedirect: '/resource',
//     })
// );
// router.get('/login', (ctx, next) => {
//     ctx.body = `<h2><a href="/auth/google">Login via Google</a></h2>`;
// });

// router.get('/logout', (ctx, next) => {
//     //ctx.logout();
//     ctx.redirect('/login');
// });

router.get('/resource', (ctx, next) => {
    if (ctx.session)
        return ctx.body = `<h2>Welcome to the resource, ${req.user.username}!</h2>`;
    ctx.status = 401;
    return ctx.body = '[ERROR] 401: Unauthorized.';
});

//------------------------------ REGISTRATION ------------------------------//

const users = []; // temporary storage for users
const jwtSecret = process.env.JWT_SECRET;
const transporterEmail = process.env.TRANSPORTER_EMAIL;
const transporterPassword = process.env.TRANSPORTER_PASS;

router.post('/register', async (ctx) => {
    const { email, login, password } = ctx.request.body;
    
    if (!email || !login || !password) {
        ctx.status = 400;
        ctx.body = { message: 'All fields are required.' };
        return;
    }

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });


    // Create a temporary user object and add to the temporary storage
    const newUser = { email, login, password, verified: false, token };
    users.push(newUser);

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: transporterEmail,
            pass: transporterPassword
        }
    });

    const mailOptions = {
        from: transporterEmail,
        to: email,
        subject: 'Email Verification',
        text: `Click the link to verify your email: http://localhost:3000/verify/${token}`
    };

    await transporter.sendMail(mailOptions);

    ctx.status = 201;
    ctx.body = { message: 'Registration successful. Check your email to verify your account.' };
});

router.get('/verify/:token', async (ctx) => {
    const { token } = ctx.params;
    console.log(ctx.session);

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = users.find(u => u.email === decoded.email);

        if (!user) {
            ctx.status = 400;
            ctx.body = { message: 'Invalid token.' };
            return;
        }

        if (user.verified) {
            ctx.status = 400;
            ctx.body = { message: 'Email already verified.' };
            return;
        }

        user.verified = true;
        ctx.status = 200;
        ctx.body = { message: 'Email verified successfully.' };
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid or expired token.' };
    }
});


//------------------------------ DATA MANIPULATION ------------------------------//

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
router.post('/getbook', async (ctx, next) => {
    let pdf = {};
    if (ctx.request.body.id){
        let book = await resolver.Books({id: ctx.request.body.id},{});
        let path = book[0].document;
        if (fs.existsSync(path)) {
            console.log(path);
            ctx.response.type = 'application/pdf';
            pdf = fs.createReadStream(path);
            console.log(pdf);
            ctx.body = pdf;
        } else {
            ctx.status = 404;
            ctx.body = { error: "Error: file not found: " + path };
        }
    } else {
        let path = ctx.request.body.document;
        if (fs.existsSync(path)) {
            console.log(path);
            ctx.response.type = 'application/pdf';
            pdf = fs.createReadStream(path);
            console.log(pdf);
            ctx.body = pdf;
        } else {
            ctx.status = 404;
            ctx.body = { error: "Error: file not found: " + path };
    }}
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[OK] Running on port ${PORT}`));
