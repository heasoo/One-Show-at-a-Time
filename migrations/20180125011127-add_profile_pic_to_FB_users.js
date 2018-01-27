exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('FacebookUser', 'profile_picture', Sequelize.STRING)
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('FacebookUser', 'profile_picture')
    ]);
};