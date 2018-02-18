exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Show', 'date', Sequelize.ARRAY(Sequelize.DATE)),
    queryInterface.addColumn('Audition', 'date', Sequelize.ARRAY(Sequelize.DATE))

    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Audition', 'date'),
    queryInterface.removeColumn('Show', 'date')
    ]);
};