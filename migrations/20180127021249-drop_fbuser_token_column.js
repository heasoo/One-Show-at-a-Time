exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('FacebookUser', 'token')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('FacebookUser', 'token', Sequelize.STRING)
    ]);
};