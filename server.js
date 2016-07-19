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
app.get('/todos', function(req, res){
  res.json(todos);
});

app.post('/todos', function(req,res){

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

app.listen(PORT, function(){
	console.log('express lisitening on ' + PORT + '!');
});