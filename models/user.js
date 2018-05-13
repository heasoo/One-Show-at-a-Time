'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
  	id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role: {                          // one of: user, admin, or a company uuid
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    }
 },
{
  freezeTableName: true,
});

  User.associate = (models) => {
  	User.belongsToMany(models.Audition, {
  		as: 'AuditionAttendees',
      through: 'AttendingAudition',
  		foreignKey: 'user_id',
      otherKey: 'audition_id'
  	});

  	User.belongsToMany(models.Show, {
  		as: 'ShowAttendees',
  		through: 'AttendingShow',
      foreignKey: 'user_id',
      otherKey: 'show_id'
  	});  	
  };

  return User;
};