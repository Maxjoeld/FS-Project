const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');
// const middleWare = require('./middlewares');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const server = express();
server.use(cors(corsOptions));
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: true,
  }),
);

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};


/* ************ MiddleWare ***************** */

const hashedPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError('Gimme a password', res);
    return;
  }
  bcrypt
  .hash(password, BCRYPT_COST)
  .then((pw) => {
    req.password = pw;
    next();
  })
  .catch((err) => {
    throw new Error(err);
  });
};

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  console.log(req.session);
  if (!username) {
    sendUserError('User is not logged in', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('User does exist', res);
    } else {
      req.user = user;
      next();
    }
  });
};
// server.use(loggedIn);

const restrictedPermissions = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {

    if (!req.session.username) {
      sendUserError('user not authorized', res);
      return;
    }
  }
  next();
};
server.use(restrictedPermissions);
/* ************ Routes ***************** */

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('username undefined', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      sendUserError('No user found at that id', res);
      return;
    }
    const hashedPw = user.passwordHash;
    bcrypt
      .compare(password, hashedPw)
      .then((response) => {
        if (!response) throw new Error();
        req.session.username = username;
        req.user = user;
      })
      .then(() => {
        res.json({ success: true });
      })
      .catch((error) => {
        return sendUserError('some message here', res);
      });
  });
});

// server.get('/sesh', (req, res) => {
//   res.json({ session: req.session });
// });

server.post('/users', hashedPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  console.log(newUser);
  newUser.save((err, savedUser) => {
    if (err) {
      console.log(err);
      res.status(422);
      res.json({ 'Need both username/PW fields': err.message });
      return;
    }

    res.json(savedUser);
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    sendUserError('User is not logged in', res);
    return;
  }
  req.session.username = null;
  res.json({ success: true });
});

server.get('/restricted/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      sendUserError('500', res);
      return;
    }
    res.json(users);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way
  res.send({ user: req.user, session: req.session });
});

module.exports = { server };
