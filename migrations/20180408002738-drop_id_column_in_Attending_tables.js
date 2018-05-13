exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('AttendingShow', 'id'),
    queryInterface.removeColumn('AttendingAudition', 'id')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('AttendingAudition', 'id', Sequelize.UUID),
    queryInterface.addColumn('AttendingShow', 'id', Sequelize.UUID)
    ]);
};