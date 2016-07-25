var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

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
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
  	filteredTodos = _.where(filteredTodos, {completed: true});
  }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
  	filteredTodos = _.where(filteredTodos, {completed: false});
  }
 
  if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
  	filteredTodos  = _.filter(filteredTodos, function(todo){
       return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;     
  	});
  }

  res.json(filteredTodos);
});

app.post('/todos', function(req,res){

// this removes unwanted fields and keeps only description and completed tags
	var body = _.pick(req.body, 'description', 'completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	body.description = body.description.trim();
    var id =  todonextId++;
    body.id = id;
    todos.push(body);
    res.json(body);

})

app.get('/todos/:id', function(req,res){
	//params.id will be string so convert to Integer. Second argument is base10
	var todoid = parseInt(req.params.id, 10);
	var matchFound = _.findWhere(todos, {id: todoid});

  if(!matchFound){
   res.status(404).send();
  }else{
  	res.json(matchFound);
  }
 
});

//DELETE
app.delete('/todos/:id', function(req,res){
    var todoid = parseInt(req.params.id, 10);
    var matched = _.findWhere(todos, {id: todoid});

   if(!matched){
   res.status(404).json({"error": "no todo found with that id " + todoid});
  }else{
  	todos = _.without(todos, matched);
  	res.json(todos);
  }


});

//PUT to update todo item
app.put('/todos/:id', function(req, res){
   var todoid = parseInt(req.params.id, 10);
   var body = _.pick(req.body, 'description', 'completed');
   //this stores the value that needs to be updated.
   var validAttrs = {};

   if(body.hasOwnProperty('completed') && _.isBoolean('completed')){
     validAttrs.completed = body.completed;
   }else if(body.hasOwnProperty('completed')){
       return res.status(400).send();
   }

   if(body.hasOwnProperty('description') && _.isString('description') && body.description.trim().length !== 0){
     validAttrs.description = body.description;
   }else if(body.hasOwnProperty('description')){
      return res.status(400).send();
   }

 var matchFound = _.findWhere(todos, {id: todoid});

  if(!matchFound){
   return res.status(404).send();
  }else{
     _.extend(matchFound, validAttrs);
  }    

   res.json(todos);
});

app.listen(PORT, function(){
	console.log('express lisitening on ' + PORT + '!');
});