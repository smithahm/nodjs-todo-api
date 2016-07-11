var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
 id: 1,
 description: 'cook lunch',
 status: false
},{
 id: 2,
 description: 'go to gym',
 status: false
},{
 id: 3, 
 description: 'sleep well',
 status: true
}];

app.get('/', function(req, res){
  res.send('ToDo API root');
});

//GEt request /todos
//GET /todos/id
app.get('/todos', function(req, res){
  res.json(todos);
});

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