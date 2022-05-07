/**
 * @NB
 *
 * In production, make sure to include the api
 * of the client that is making the request.
 *
 */

const whitelistedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:3001",
];

module.exports = whitelistedOrigins;