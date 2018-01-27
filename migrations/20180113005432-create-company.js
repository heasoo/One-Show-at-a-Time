exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.createTable('Company', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
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
    queryInterface.dropTable('Company', {
      cascade: true
    })
    ]);
};