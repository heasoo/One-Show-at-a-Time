exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addConstraint('LocalUser', ['email'], {
      type: 'unique',
      name: 'local_user_email_unique_constraint'
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('LocalUser', 'local_user_email_unique_constraint')
    ]);
};