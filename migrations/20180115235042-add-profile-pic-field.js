exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('LocalUser', 'profile_picture', Sequelize.STRING)
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('LocalUser', 'profile_picture')
    ]);
};