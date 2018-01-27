'use strict';

module.exports = (sequelize, DataTypes) => {
  var Show = sequelize.define('Show', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: '0000-00-00T00:00:00.000Z',
      allowNull: false
    },
 },
{
  freezeTableName: true,
});

  Show.associate = (models) => {
    Show.belongsTo(models.Company, {
      foreignKey: 'company_id',
      targetKey: 'id'
    });
    Show.belongsToMany(models.User, {
      as: 'Attendants',
      foreignKey: 'user_id',
      through: 'AttendingShow'
    });
  };

  return Show;
};