'use strict';

module.exports = (sequelize, DataTypes) => {
  var AttendingAudition = sequelize.define('AttendingAudition', {
  	    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
	},
{
  freezeTableName: true,
});

  AttendingAudition.associate = (models) => {
  	AttendingAudition.belongsTo(models.Audition, {
  		foreignKey: 'audition_id',
  		targetKey: 'id'
  	});
  	AttendingAudition.belongsTo(models.User, {
  		foreignKey: 'user_id',
  		targetKey: 'id'
  	});
  }

  return AttendingAudition;
};