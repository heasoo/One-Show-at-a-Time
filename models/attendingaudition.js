'use strict';

module.exports = (sequelize, DataTypes) => {
  var AttendingAudition = sequelize.define('AttendingAudition', {

	},
{
  freezeTableName: true,
});

  AttendingAudition.associate = (models) => {

  }

  return AttendingAudition;
};