exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('Audition', 'contact', Sequelize.ARRAY(Sequelize.STRING))
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('Audition', 'contact')
    ]);
};