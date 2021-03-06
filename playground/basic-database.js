var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
   'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
   description: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      	len: [1, 250]
      }
   },
   completed: {
       type: Sequelize.BOOLEAN,
       allowNull: false,
       defaultValue: false
   }
});
sequelize.sync({force: true}).then(function (){
  console.log('Everything is synced');

 Todo.create({
    description: 'cook food',
   completed: false
  }).then(function(todo){
   return Todo.create({
     description: 'clean house'
   });
  }).then(function(){
     // return Todo.findById(3);
     return Todo.findAll({
        where: {
          description: {
            $like: '%clean%'
          }
        }
     });
  }).then(function(todos){
      if(todos){
        todos.forEach(function (todo){
           console.log(todo.toJSON());
        });
        
      }else{
        console.log('no data found');
      }
  }).catch(function (e){
    console.log(e);
  });

  Todo.findById(1).then(function (todo){
  if(todo){
    console.log(todo.toJSON());
  }else{
    console.log('not found!');
  }
 });
  
});


 /*  */