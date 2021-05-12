var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var app = express();
app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'baza',
	port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'));

app.get('/', function(req, res){
	res.render('start');
});

app.get('/list', function(req, res){

	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM chess',function(err,rows){
			var chessMan=rows;
			res.render('list',{
				chessMan:chessMan
			});

		});
	});
});

app.get('/add', function(req, res){
	res.render('add');
});

app.post('/add', function(req, res){
	var chessMan={
		CurentRank: req.body.rank,
		Name: req.body.name,
		Surname: req.body.surname,
		Points: req.body.points
	}
	console.log(chessMan);
	req.getConnection(function(error, conn){
		conn.query('INSERT INTO chess SET ?',chessMan,function(err,rows){
			if(err){
				var message='Wystąpił błąd';
			}else{
				var message='Dane zostały dodane';
			}
			res.render('add',{message:message});
		});
	});
});

app.get('/edit/(:id)', function(req, res){
	var idMan=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM chess WHERE id='+idMan,function(err,rows){
			res.render('edit',{
				Id: rows[0].id,
				Rank: rows[0].CurentRank,
				Name: rows[0].Name,
				Surname: rows[0].Surname,
				Points: rows[0].Points
			});
		});
	});
});
app.post('/edit/(:id)', function(req, res){
	var chessMan={
		CurentRank: req.body.Rank,
		Name: req.body.Name,
		Surname: req.body.Surname,
		Points: req.body.Points
	}
	req.getConnection(function(error, conn){
		conn.query('UPDATE chess SET ? WHERE id='+req.body.Id, chessMan, function(err,rows){
			if(err){
				var message='Wystąpił błąd';
				console.log(err);
			}else{
				var message='Dane zostały zmienione';
			}
			res.render('edit',{
				id: req.params.id,
				CurentRank: req.body.rank,
				Name: req.body.name,
				Surname: req.body.surname,
				Points: req.body.points,
				message:message
			});
		});
	});
});

app.get('/delete/(:id)', function(req, res){
	var idMan=req.params.id;
	res.render('delete',{idMan:idMan});
});

app.post('/delete/(:id)', function(req, res){

	var idMan=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('DELETE FROM chess WHERE id='+idMan,function(err,rows){
			if(err){
				var message='Wystąpił błąd';
			}else{
				var message='Dane zostały usunięte';
			}
			res.render('delete',{idMan:idMan,message:message});
		});
	});
});

app.listen(3000);