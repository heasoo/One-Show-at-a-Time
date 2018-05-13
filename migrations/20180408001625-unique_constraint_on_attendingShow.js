exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addConstraint('AttendingShow', ['user_id', 'show_id'], {
      type: 'unique',
      name: 'AttendingShow_unique_constraint'
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('AttendingShow', 'AttendingShow_unique_constraint')
    ]);
};