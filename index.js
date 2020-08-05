const req = require.context('./skjema/', false, /.json$/);
// I have changed
const modules = req.keys().map(req);
module.exports = {
  forms: modules
};
