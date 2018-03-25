exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('Show', 'photo', 'picture')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('Audition', 'picture', 'photo'),
    queryInterface.renameColumn('Show', 'picture', 'photo')
    ]);
};