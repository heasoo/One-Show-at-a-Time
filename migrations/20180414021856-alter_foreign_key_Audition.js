exports.up = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('Audition', 'Audition_show_id_fkey'),
    queryInterface.addConstraint('Audition', ['show_id'], {
      type: 'foreign key',
      name: 'Audition_show_id_fkey',
      references: {
        table: 'Show',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    ]);
};

exports.down = function(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeConstraint('Audition', 'Audition_show_id_fkey'),
    queryInterface.addConstraint('Audition',['show_id'], {
      type: 'foreign key',
      name: 'Audition_show_id_fkey',
      references: {
        table: 'Show',
        field: 'id'
      },
      onDelete: 'set null',
      onUpdate: 'cascade'
    })
    ]);
};