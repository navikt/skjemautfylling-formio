const req = require.context('./skjema/', false, /.json$/);

const modules = req.keys().map(req);
module.exports = {
  forms: modules
};
