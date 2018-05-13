exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('AttendingShow', 'UserId', 'user_id')
  ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('AttendingShow', 'user_id', 'UserId')
    ]);
};