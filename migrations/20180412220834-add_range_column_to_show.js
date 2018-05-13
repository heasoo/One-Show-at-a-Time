exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Show', 'range', Sequelize.RANGE(Sequelize.DATE))
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Show', 'range')
    ]);
};