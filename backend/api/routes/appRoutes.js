var ctrl = require('../controllers/appControllers');

// Routes
module.exports = function(app) {
  app.route('/auth/register').post(ctrl.authRegister);
  app.route('/auth/login').post(ctrl.authLogin);
  app.route('/get/users').get(ctrl.getUsers);
};