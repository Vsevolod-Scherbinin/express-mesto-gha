const allowedCors = [
  'https://scherbinin.mesto.nomoredomains.club',
  'http://scherbinin.mesto.nomoredomains.club',
  'https://api.scherbinin.mesto.nomoredomains.club',
  'http://api.scherbinin.mesto.nomoredomains.club',
  'localhost:3000',
];

module.exports.cors = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};