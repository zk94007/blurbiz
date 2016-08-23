(function () { 
	'use strict';

	angular
		.module('Blurbiz')
		.factory('UploadService', ['socket', Service]);
	
	function Service(socket) {	
		  
		var factory = {};	
		
		factory.uploadFile = function (file, cb) {

			var stream = ss.createStream();				
			console.log('file selected : '+file.name);
		    
		    // upload a file to the server.
		    ss(socket).emit('media_file_add', stream, {size: file.size , name:file.name});			    
		    var blobStream = ss.createBlobReadStream(file);		
		    blobStream.on('data', function(chunk) {
		    	// progressHandler(chunk);
		    	console.log(chunk.length);
 			});			    
		    blobStream.pipe(stream);
			blobStream.on('end', function(chunk) {
				console.log("Upload successful");
				if(cb) cb();
 			});		
		};		
		
		
		return factory;
	}
})();