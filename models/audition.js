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
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }    
 },
{
  freezeTableName: true,
});

  Audition.associate = (models) => {
  	Audition.belongsTo(models.Show, {
  		foreignKey: 'show_id',
  		targetKey: 'id'
  	});
  	
  	Audition.belongsToMany(models.User, {
  		as: 'Auditionees',
  		foreignKey: 'user_id',
  		through: 'AttendingAudition'
  	});
  }

  return Audition;
};