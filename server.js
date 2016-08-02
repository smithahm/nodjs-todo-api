var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var db = require('./db.js');

var todos = [];
var todonextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('ToDo API root');
});

//GEt request /todos
//GET /todos/id
//GET /todos/?completed=true
app.get('/todos', function(req, res){
  var query = req.query;
  var where = {};

  // var filteredTodos = todos;

  if(query.hasOwnProperty('completed') && query.completed === 'true'){
  //	filteredTodos = _.where(filteredTodos, {completed: true});
     where.completed = true;
  }else if(query.hasOwnProperty('completed') && query.completed === 'false'){
    //  filteredTodos = _.where(filteredTodos, {completed: false});
     where.completed = false;
  } 
 
  if(query.hasOwnProperty('q') && query.q.length > 0){
 /* 	filteredTodos  = _.filter(filteredTodos, function(todo){
       return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;     
  	});*/
     where.description = {
      $like : '%' + query.q.toLowerCase() + '%'
  };
}
  db.todo.findAll({where: where}).then(function (todos){
     res.json(todos);
  }, function(e){
    res.status(500).send();
  })
});

app.post('/todos', function(req,res){

// this removes unwanted fields and keeps only description and completed tags
	var body = _.pick(req.body, 'description', 'completed');

   db.todo.create(body).then(function(todo){
         return res.status(200).json(todo.toJSON());
  }, function(e){
        return res.status(400).json(e);
  });



/*	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	body.description = body.description.trim();
    var id =  todonextId++;
    body.id = id;
    todos.push(body);
    res.json(body); */

})

app.get('/todos/:id', function(req,res){
	//params.id will be string so convert to Integer. Second argument is base10
	var todoid = parseInt(req.params.id, 10);
   db.todo.findById(todoid).then(function (todo){
  if(!!todo){
    res.json(todo.toJSON());
  }else{
    res.status(404).send();
  }
 }, function(e){
     res.status(500).send();
 });
/*	var matchFound = _.findWhere(todos, {id: todoid});
  if(!matchFound){
   res.status(404).send();
  }else{
  	res.json(matchFound);
  }
 */ 
});

//DELETE
app.delete('/todos/:id', function(req,res){
    var todoid = parseInt(req.params.id, 10);
  //  var matched = _.findWhere(todos, {id: todoid});

    db.todo.destroy({
      where: {
         id: todoid
      }
    }).then(function(rowsdeleted){
        if(rowsdeleted === 0){
          res.status(400).json({
            error: 'no todo with id'
          })
        }else{
          res.status(204).send();
        }
    }, function(){
      res.status(500).send();
    })

 /*  if(!matched){
   res.status(404).json({"error": "no todo found with that id " + todoid});
  }else{
  	todos = _.without(todos, matched);
  	res.json(todos);
  }*/


});

//PUT to update todo item
app.put('/todos/:id', function(req, res){
   var todoid = parseInt(req.params.id, 10);
   var body = _.pick(req.body, 'description', 'completed');
   //this stores the value that needs to be updated.
   var attrs = {};

   if(body.hasOwnProperty('completed')){
     attrs.completed = body.completed;
   }

   if(body.hasOwnProperty('description')){
     attrs.description = body.description;
   }

 /*var matchFound = _.findWhere(todos, {id: todoid});

  if(!matchFound){
   return res.status(404).send();
  }else{
     _.extend(matchFound, validAttrs);
  } */    
  // res.json(todos);

  db.todo.findById(todoid).then(function(todo){
       if(todo){
           todo.update(attrs).then(function(todo){
             res.json(todo.toJSON());
        }, function(e){
             res.status(400).json(e);
       });
       }else{
        res.status(404).send();
       }
  }, function(){
    res.status(500).send();
  })
});


app.post('/users', function(req,res){

// this removes unwanted fields and keeps only description and completed tags
  var body = _.pick(req.body, 'email', 'password');

   db.user.create(body).then(function(todo){
         return res.status(200).json(todo.toJSON());
  }, function(e){
        return res.status(400).json(e);
  });
});

db.sequelize.sync({force: true}).then(function(){
	 app.listen(PORT, function(){
	console.log('express lisitening on ' + PORT + '!');
});
});