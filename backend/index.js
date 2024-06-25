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
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('koa-session2');
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
    credentials: "include",
}));

app.use(serve(__dirname + '/uploads'));

app.keys = [process.env.SESSION_KEY];
const sessionConfig = {
  key: process.env.COOKIE_NAME, // the cookie key name (default is koa:sess)
  maxAge: 86400000, // 1 day in milliseconds
  overwrite: true, // overwrite session if exists, default is true
  httpOnly: true, // cookie is not accessible via JavaScript, default is true
  signed: true, // signed cookie
  rolling: false, // forces a session identifier cookie to be set on every response. 
                 // The expiration is reset to the original maxAge, resetting the expiration countdown. 
                 // Default is false.
  renew: true, // renew session when session is nearly expired, so we can always keep user logged in. Default is false.
};
app.use(session(sessionConfig));

// This middleware for debugging sessions only
/*app.use(async (ctx, next) => {
    console.log('Before:', ctx.session);
    await next();
    console.log('After:', ctx.session);
});*/

app.use(koaBody({
    multipart: true, // to enable multipart/form-data
    formidable: {
      maxFileSize: 200*1024*1024    // set file size limit (this example sets it to 200MB)
    },
    jsonLimit: '50mb', // for JSON payload
    formLimit: '50mb', // for URL-encoded form payload
}));

router.get("/test", (ctx) => {
    console.log('\n[GET] => /test');
    ctx.type = 'text/html';
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
    console.log('\n[POST] => /login');
    const { email, password } = ctx.request.body;
    let user = users.find(u => u.email === email);

    if (!user) {
        user = await resolver.Users({password: password, email: email}, {});

        if (user.length != 1) {
            console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] User not found niether in temporary storage nor in database!' );
            ctx.status = 400;
            ctx.body = { message: 'User not found.' };
            return;
        }
        user = user[0];
    } else if (!user.verified) {
        console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Email not verified!' );
        ctx.status = 400;
        ctx.body = { message: 'Email not verified.' };
        return;
    } else if (password !== user.password) {
        console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Invalid password provided!' );
        ctx.status = 400;
        ctx.body = { message: 'Invalid password.' };
        return;
    }

    console.log(`\x1b[32m%s\x1b[0m`, '[OK] Logged in successfully.' );
    console.log(user);
    ctx.session.user = {email: user.email, login: user.login };
    ctx.status = 200;
    ctx.body = { message: 'Logged in successfully.' };
});

router.post('/logout', async (ctx) => {
    console.log('\n[POST] => /logout');
    ctx.session = null;
    ctx.status = 200;
    ctx.body = { message: 'Logged out successfully.' };
});

router.get('/login', (ctx) => {
    console.log('\n[GET] => /login');
    ctx.type = 'text/html';
    ctx.body = fs.createReadStream('./logintest.html');
})

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
    console.log('\n[GET] => /resource');
    if (ctx.session && ctx.session.user){
        console.log(`\x1b[32m%s\x1b[0m`, '[OK] User is logged in and session is active.');
        console.log(ctx.session.user);
        ctx.type = 'text/html';
        return ctx.body = `<h2>Welcome to the resource, ${ctx.session.user.login}!</h2>`;
    }
    console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Unauthorized!' );
    ctx.status = 401;
    ctx.type = 'application/json';
    return ctx.body = {message: 'Unauthorized.'};
});

//------------------------------ REGISTRATION ------------------------------//

const users = []; // temporary storage for users
const jwtSecret = process.env.JWT_SECRET;
const transporterEmail = process.env.TRANSPORTER_EMAIL;
const transporterPassword = process.env.TRANSPORTER_PASS;

router.post('/register', async (ctx) => {
    console.log('\n[POST] => /register');
    const { email, login, password } = ctx.request.body;
    
    if (!email || !login || !password) {
        console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Not all fields are provided!' );
        ctx.status = 400;
        ctx.body = { message: 'All fields are required.' };
        return;
    }

    let checkUser = await resolver.Users({email: email}, {});
    if (checkUser.length != 0) {
        console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] User already exists!' );
        ctx.status = 400;
        ctx.body = { message: 'User already exists.' };
        return;
    }

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

    // Create a temporary user object and add to the temporary storage
    const newUser = { email, login, password, verified: false, token };
    users.push(newUser);
    console.log(`\x1b[32m%s\x1b[0m`, '[OK] Temporary user created.' );

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
        text: `Click the link to verify your email:\n http://localhost:3000/verify/${token} \n\nDon't share this link with anyone else!`
    };

    await transporter.sendMail(mailOptions);
    console.log(`\x1b[32m%s\x1b[0m`, '[OK] Email sent.' );
    ctx.status = 201;
    ctx.body = { message: 'Registration successful. Check your email to verify your account.' };
});

router.get('/verify/:token', async (ctx) => {
    console.log('\n[GET] => /verify');
    const { token } = ctx.params;
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = users.find(u => u.email === decoded.email);

        if (!user) {
            console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Invalid token!');
            ctx.status = 400;
            ctx.body = { message: 'Invalid token.' };
            return;
        }

        if (user.verified) {
            console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Email already verified!');
            ctx.status = 400;
            ctx.body = { message: 'Email already verified.' };
            return;
        }

        let createUser = await resolver.setUser({email: user.email, login: user.login, password: user.password, language: "en", theme: "dark"}, {});
        if (!createUser) {
            console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Failed to add user to database!');
            ctx.status = 400;
            ctx.body = { message: 'Server error: Cannot remember user' };
            return;
        }
        console.log(`\x1b[32m%s\x1b[0m`, '[OK] Verification successful.' );
        user.verified = true;
        ctx.status = 200;
        ctx.body = { message: 'Email verified successfully.' };
    } catch (err) {
        console.error(`\x1b[31m%s\x1b[0m`, '[ERROR] Server error:');
        console.error(err);
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
    console.log('\n[POST] => /getbook');
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
            ctx.body = { message: "Error: file not found: " + path };
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
            ctx.response.type = 'application/json';
            ctx.body = { message: "Error: file not found: " + path };
    }}
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\x1b[32m%s\x1b[0m`, `\n[OK] Running on port ${PORT}`));
