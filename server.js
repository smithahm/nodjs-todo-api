var express = require('express');
var bodyParser = require('body-parser');
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
	var body = req.body;
    var id =  todonextId++;

    body.id = id;
    todos.push(body);
    res.json(body);

})

app.get('/todos/:id', function(req,res){
	//params.id will be string so convert to Integer. Second argument is base10
	var todoid = parseInt(req.params.id, 10);
	var matchFound;
	todos.forEach(function(todoArray){
               if(todoArray.id === todoid){
               	 matchFound = todoArray;
               }
	});

  if(!matchFound){
   res.status(400).send();
  }else{
  	res.json(matchFound);
  }
 
});

app.listen(PORT, function(){
	console.log('express lisitening on ' + PORT + '!');
});