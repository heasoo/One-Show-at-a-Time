'use strict';
module.exports = (sequelize, DataTypes) => {
  var LocalUser = sequelize.define('LocalUser', {
  	id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
  	email: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
  	password: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
  	name: {
  		type: DataTypes.STRING,
  		allowNull: false
  	},
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/images/users/default-profile-picture.jpg'
    }
},
{
  freezeTableName: true,
});

  LocalUser.associate = (models) => {
  	LocalUser.belongsTo(models.User, {
  		foreignKey: 'id',
  		targetKey: 'id'
  	});
  }
  
  return LocalUser;
};