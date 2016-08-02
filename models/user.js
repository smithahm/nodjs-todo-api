module.exports = function(sequelize, DataTypes){
       return sequelize.define('user', {
       	email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, //no other record is present with this same email id  
            validate: {
            	isEmail: true
            }
       	 },
       	password: {
       		type: DataTypes.STRING,
       		allowNull: false,
       		validate: {
       			len: [7, 100]
       		}
       	}
       })
}