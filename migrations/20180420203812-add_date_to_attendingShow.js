exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('AttendingShow', 'date', Sequelize.ARRAY(Sequelize.DATE))
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('AttendingShow', 'date')
    ]);
};