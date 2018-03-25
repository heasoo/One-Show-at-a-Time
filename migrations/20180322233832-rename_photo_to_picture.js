exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('Audition', 'photo', 'picture')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('Audition', 'photo', 'picture')
    ]);
};