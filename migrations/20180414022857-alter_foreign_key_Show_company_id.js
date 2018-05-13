exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('Show', 'Show_company_id_fkey'),
    queryInterface.addConstraint('Show', ['company_id'], {
      type: 'foreign key',
      name: 'Show_company_id_fkey',
      references: {
        table: 'Company',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('Show', 'Show_company_id_fkey'),
    queryInterface.addConstraint('Show',['company_id'], {
      type: 'foreign key',
      name: 'Show_company_id_fkey',
      references: {
        table: 'Company',
        field: 'id'
      },
      onDelete: 'set null',
      onUpdate: 'cascade'
    })
    ]);
};