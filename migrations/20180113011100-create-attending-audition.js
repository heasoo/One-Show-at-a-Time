exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.createTable('AttendingAudition', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      audition_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Audition',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'User',
          key: 'id'
        }
      }
    })
    ]);
}; 

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.dropTable('AttendingAudition', {
      cascade: true
    })
    ]);
};