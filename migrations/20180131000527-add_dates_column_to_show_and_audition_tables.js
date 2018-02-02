exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Show', 'dates', Sequelize.ARRAY(Sequelize.DATE)),
    queryInterface.addColumn('Audition', 'dates', Sequelize.ARRAY(Sequelize.DATE))

    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Audition', 'dates'),
    queryInterface.removeColumn('Show', 'dates')
    ]);
};