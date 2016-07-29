var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined,undefined,{
   'dialect': 'sqlite',
   'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};
//import is a function lets you load sequlize modules from separate files.
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;