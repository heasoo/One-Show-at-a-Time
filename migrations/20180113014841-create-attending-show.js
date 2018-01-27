exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.createTable('AttendingShow', {
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
      role_desc: {
        type: Sequelize.STRING,
        allowNull: false
      },
      show_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Show',
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
    queryInterface.dropTable('AttendingShow', {
      cascade: true
    })
  ]);
};