module.exports = function(app) {
  var ctrl = require('../controllers/appControllers');

  // Routes
  app.route('/auth/register').post(ctrl.authRegister);
};