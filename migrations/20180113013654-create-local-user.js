exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.createTable('LocalUser', {
      id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.dropTable('LocalUser', {
      cascade: true
    })
    ]);
};