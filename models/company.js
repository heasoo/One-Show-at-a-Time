'use strict';

module.exports = (sequelize, DataTypes) => {
  var Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
 },
{
  freezeTableName: true,
});

  Company.associate = (models) => {
    Company.hasMany(models.Show, {
      foreignKey: 'company_id',
      sourceKey: 'id'
    });
  };

  return Company;
};