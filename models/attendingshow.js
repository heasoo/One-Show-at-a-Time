'use strict';
module.exports = (sequelize, DataTypes) => {
  var AttendingShow = sequelize.define('AttendingShow', {
  	role_desc: {
  		type: DataTypes.STRING,
  		allowNull: false,
      defaultValue: 'guest'
  	},
    date: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull: false,
      defaultValue: []
    }
  },
  {
    freezeTableName: true
  });

  AttendingShow.associate = (models) => {

  }
  return AttendingShow;
};