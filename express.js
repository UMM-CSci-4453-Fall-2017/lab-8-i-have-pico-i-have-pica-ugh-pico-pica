async = require("async");

var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT XaiMarsh.till_buttons.*, XaiMarsh.prices.prices FROM XaiMarsh.till_buttons LEFT JOIN (XaiMarsh.prices) on (XaiMarsh.till_buttons.invID = XaiMarsh.prices.id)';
//  var sql = 'SELECT * FROM XaiMarsh.till_buttons';
     connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});
//app.get("/click",function(req,res){
//  	var id = req.param('id');
//  	var sql = 'SELECT prices from prices where id = '+id;
//  	var item_info;

//	console.log("Attempting sql ->"+sql+"<-");

//	async.series([
//		function(callback){
//			connection.query(sql,(function(res){return function(err,rows,fields){
  //  				if(err){console.log("We have an insertion error:");
    //    	     			console.log(err);}
    //	 			res.send(err); // Let the upstream guy know how it went
//				item_info = rows[0][prices];
//
//	  		}})(res));
//			
//			callback();
//		}]);
//});
// Your other API handlers go here!
app.get("/user",function(req,res){
	var userID = req.param('userID');
	var sql = 'SELECT * FROM XaiMarsh.Lab8_User';
	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error:");
			console.log(err);}
		res.send(rows);
	}})(res));

});
app.get("/update",function(req,res){
	var invID = req.param('invID');
	var quantity = req.param('quantity');
	var receiptNumber = req.param('receiptNumber');
	var sql = 'insert into XaiMarsh.till_sales values('+receiptNumber+', '+invID+', '+quantity+')';
	var newQuantity = 0;

	async.series([
		function(callback){
			connection.query(sql, function(err,row,fields){
				if(err){console.log("We have an error:");
					console.log(err);}
				callback();
			});
		},
		function(callback){
			sql = 'select amount from XaiMarsh.till_inventory where id='+invID;
			connection.query(sql, function(err,row,fields){
				if (err) {console.log("We have an error:");
					console.log(err);}	
				newQuantity = row[0].amount - quantity;
				callback();
			});

		},
		function(callback){
			sql = 'update XaiMarsh.till_inventory set amount='+newQuantity+' where id='+invID;
			connection.query(sql, (function(res){return function(err,rows,fields){
				if(err){console.log("We have an error:");
					console.log(err);}
				res.send(err);
				callback();
			}})(res));
		}
	]);
});
app.listen(port);
