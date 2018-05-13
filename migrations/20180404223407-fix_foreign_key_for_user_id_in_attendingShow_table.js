exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('AttendingShow', 'AttendingShow_user_id_fkey'),
    queryInterface.addConstraint('AttendingShow',['UserId'], {
      type: 'foreign key',
      name: 'AttendingShow_user_id_fkey',
      references: {
        table: 'User',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('AttendingShow', 'AttendingShow_user_id_fkey'),
    queryInterface.addConstraint('AttendingShow',['UserId'], {
      type: 'foreign key',
      name: 'AttendingShow_user_id_fkey',
      references: {
        table: 'Show',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    ]);
};