var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes){
       var user =  sequelize.define('user', {
       	email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, //no other record is present with this same email id  
            validate: {
            	isEmail: true
            }
       	 },
       	salt: {
           type: DataTypes.STRING,
       	},
       	password_hash: {
           type: DataTypes.STRING,
       	},
       	password: {
       		type: DataTypes.STRING,
       		allowNull: false,
       		validate: {
       			len: [7, 100]
       		},
       		set: function(value){
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
       	}
     }, {
     	hooks: {
     		beforeValidate: function(user, options){
     			if(typeof user.email === 'string'){
     				user.email = user.email.toLowerCase();
     			}

     		}
     	},

      classMethods:{
       authenticate: function(body){
         return new Promise(function (resolve, reject){
              if(typeof body.password !== 'string' || typeof body.email !== 'string'){
                return reject();
              }
             user.findOne({
                    where: {
                       email: body.email
                         }
             }).then(function(user){
              if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
                   return reject();
               }
               resolve(user);
              }, function(){
                reject();
            })
         });
       }
      },
     	instanceMethods: {
     		toPublicJSON: function() {
     			var json = this.toJSON();
     			return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
     		}
     	}
    });
       return user;
};