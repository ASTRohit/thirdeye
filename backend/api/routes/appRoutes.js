var ctrl = require('../controllers/appControllers');

module.exports = function(app) {
  // Routes
  app.route('/auth/register').post(ctrl.authRegister);
  app.route('/auth/login').post(ctrl.authLogin);
};