require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const helmet = require("helmet");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "defaultsecret";

// Middleware for security headers
app.use(helmet());

// Body parser for form submissions
app.use(express.urlencoded({ extended: false }));

// Static files
const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // Check every 2 minutes
      dbRecordIdIsSessionId: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
      httpOnly: true, // Prevent client-side access to the cookie
    },
  })
);

// Initialize passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
const userModels = require("./models/userModels");
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await userModels.passportQueryEmail(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModels.passportQueryId(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
const usersRouter = require("./routes/userRoutes");
const homeRouter = require("./routes/homeRoutes");
const fileRouter = require("./routes/fileRoutes");
const folderRouter = require("./routes/folderRoutes");

app.use("/user", usersRouter);
app.use("/", homeRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
