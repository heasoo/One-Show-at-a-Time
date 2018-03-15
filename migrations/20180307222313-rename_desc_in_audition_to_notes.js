exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('Audition', 'desc', 'notes')
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.renameColumn('Audition', 'notes', 'desc')
    ]);
};