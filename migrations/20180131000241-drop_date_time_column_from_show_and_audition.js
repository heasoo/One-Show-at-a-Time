exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Show', 'date_time'),
    queryInterface.removeColumn('Audition', 'date_time')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Audition', 'date_time', Sequelize.DATE),
    queryInterface.addColumn('Show', 'date_time', Sequelize.DATE)
    ]);
};