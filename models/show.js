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
    date: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      defaultValue: [],
      allowNull: true
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/images/default-show-picture.jpg'
    },
    company_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
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