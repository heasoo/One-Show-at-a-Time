exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('AttendingAudition', 'AttendingAudition_pkey'),
    queryInterface.addConstraint('AttendingAudition', ['user_id', 'audition_id'], {
      type: 'unique',
      name: 'AttendingAudition_unique_constraint'
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addConstraint('AttendingAudition', ['id'], {
      type: 'primary key',
      name: 'AttendingAudition_pkey'
    }),
    queryInterface.removeConstraint('AttendingAudition', 'AttendingAudition_unique_constraint')
    ]);
};