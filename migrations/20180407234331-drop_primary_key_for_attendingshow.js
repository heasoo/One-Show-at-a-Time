exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('AttendingShow', 'AttendingShow_pkey')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addConstraint('AttendingShow', ['id'], {
      type: 'primary key',
      name: 'AttendingShow_pkey'
    })
    ]);
};