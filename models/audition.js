'use strict';

module.exports = (sequelize, DataTypes) => {
  var Audition = sequelize.define('Audition', {
  	id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      defaultValue: [],
      allowNull: true
    },
  	venue: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
  	notes: {
  		type: DataTypes.STRING,
  		allowNull: true
  	},
    contact: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/images/default-audition-picture.jpg'
    },
    show_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
 },
{
  freezeTableName: true,
});

  Audition.associate = (models) => {
  	Audition.belongsTo(models.Show, {
  		foreignKey: 'show_id',
  		targetKey: 'id',
      onDelete: 'CASCADE'
  	});
  	
  	Audition.belongsToMany(models.User, {
  		as: 'Auditionees',
      through: 'AttendingAudition',
  		foreignKey: 'audition_id',
      otherKey: 'user_id'
  	});
  }

  return Audition;
};