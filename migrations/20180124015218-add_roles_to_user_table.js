exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('User', 'role', Sequelize.STRING)
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('User', 'role')
    ]);
};