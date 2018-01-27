'use strict';
module.exports = (sequelize, DataTypes) => {
  var Audition = sequelize.define('Audition', {
  	id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
  	date_time: {
  		type: DataTypes.DATE,
  		defaultValue: '0000-00-00T00:00:00.000Z',
  		allowNull: false
  		},
  	venue: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
  	desc: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
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