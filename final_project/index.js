const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log("🟡 Step 1: Received Request");
    console.log("👉 req.body:", req.body);
    next();
});
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.use("/customer", (req, res, next) => {
    console.log("🟡 Step 2: Session Middleware Triggered");
    console.log("👉 req.session:", req.body);
    next();
});

//req.session.authorization: Stores the JWT token after a user logs in.
//jwt.verify(token, "access", callback): Verifies the token against the secret "access"
//req.user = user: Attaches the decoded payload to the request so that future routes can use it.
//403 responses: Sent when the token is missing or invalid.
app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
console.log("3. req.body(): ", req.body);
if(req.session && req.session.authorization)
{
    const token=req.session.authorization.accessToken;

    jwt.verify(token, "access", (err, user)=>{
        if(!err)
        {
            req.user=user;
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"});
        }
    });
}
else{
    return res.status(403).json({message: "User not logged in"});
}

});
 // Step 4: Mounting Routers
app.use("/customer", (req, res, next) => {
    console.log("🟡 Step 4: Hitting customer routes");
    console.log(req.body);
    next();
});
const PORT =5002;

app.use("/customer", customer_routes);

app.use("/", (req, res, next) => {
    console.log("🟡 Step 5: Hitting general routes");
    next();
});

app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
