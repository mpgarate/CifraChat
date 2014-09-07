/* This file is required by app.js. 
 * It sets up the application endpoints/routes.
 * 2 routes possible:
	  - / or or /foo		(redirect to random chat room)
	  - /chat/123456 		(specific chat room)
 */

module.exports = function(app, io){

	// specific chat room request
	app.get('/chat/:id', function(req,res){		
		res.render('index.ejs');
	});

	app.get('/about', function(req,res){		
		res.render('about.ejs');
	});

	// any other request -> redirect to new chat room
	app.get('/*', function(req, res){
		// generate random chat room ID
		var id = Math.round((Math.random() * 1000000));

		res.redirect('chat/' + id);
	});


};
