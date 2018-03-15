exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Show', 'photo', Sequelize.STRING),
    queryInterface.addColumn('Audition', 'photo', Sequelize.STRING)
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Audition', 'photo'),
    queryInterface.removeColumn('Show', 'photo')
    ]);
};