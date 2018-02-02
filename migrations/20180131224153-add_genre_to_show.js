exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Show', 'genre', Sequelize.ARRAY(Sequelize.STRING))
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Show', 'genre')
    ]);
};