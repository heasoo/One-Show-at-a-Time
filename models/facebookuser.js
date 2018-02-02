'use strict';
module.exports = (sequelize, DataTypes) => {
	var FacebookUser = sequelize.define('FacebookUser', {
		id: {
	    type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,
	    primaryKey: true
    	},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		fb_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		profile_picture: {
      		type: DataTypes.STRING,
      		allowNull: false
      	}
	},
	{
		freezeTableName: true,
	});

	FacebookUser.associate = (models) => {
		FacebookUser.belongsTo(models.User, {
			foreignKey: 'id',
			as: 'user'
		});
	}

	return FacebookUser;
};