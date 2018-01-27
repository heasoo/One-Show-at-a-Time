'use strict';
module.exports = (sequelize, DataTypes) => {
  var AttendingShow = sequelize.define('AttendingShow', {
  	    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
  	role_desc: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
 },
{
  freezeTableName: true,
});

  AttendingShow.associate = (models) => {
  	AttendingShow.belongsTo(models.Show, {
  		foreignKey: 'show_id',
  		targetKey: 'id'
  	});

  	AttendingShow.belongsTo(models.User, {
  		foreignKey: 'user_id',
  		targetKey: 'id'
  	});

  }
  return AttendingShow;
};