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
      allowNull: false
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/images/shows/default-show-picture.jpg'
    },
    company_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    range: {
      type: DataTypes.RANGE(DataTypes.DATE),
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
      through: 'AttendingShow',
      foreignKey: 'show_id',
      otherKey: 'user_id'
    });
  };

  return Show;
};