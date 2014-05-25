/* This file is required by app.js. 
 * It sets up the application endpoints/routes.
 * 2 routes possible:
	  - / 				(redirect to random chat room) 
	  - /chat/123456 	(specific chat room)
 */

module.exports = function(app, io){

	/* route 2: specific chat room */
	app.get('/chat/:id', function(req,res){		
		res.render('index.ejs');
	});


	/* route 1: redirect */
	app.get('/*', function(req, res){
		// generate random chat room ID
		var id = Math.round((Math.random() * 1000000));

		res.redirect('/chat/' + id);
	});

};