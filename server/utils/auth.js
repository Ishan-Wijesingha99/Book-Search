const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: object => {
    // this allows tokens to be sent through the request body, the request query or the request headers
    let token = object.req.body.token || object.req.query.token || object.req.headers.authorization;

    // if authorization exists, reassign token value, get the token out of ["Bearer", token]
    if (object.req.headers.authorization) token = token.split(' ').pop().trim()

    // if token doesn't exist at all, return the request object and authentication will fail (not take place)
    if (token == null) return object.req

    try {
      // verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // add user property to request object
      object.req.user = data;
    } catch {
      // if error in the asynchronous task, log this to the console
      console.log('Invalid token');
    }

    // after authentication takes place, return request object
    return object.req
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
