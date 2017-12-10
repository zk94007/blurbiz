(function () { 
	'use strict';

	angular
		.module('Blurbiz')
		.factory('UploadService', ['socket', Service]);
	
	function Service(socket) {	
		  
		var factory = {};	
		
		factory.uploadFile = function (file, properties, cb) {
			console.log(properties);
			var stream = ss.createStream();				
			console.log('file selected : '+file.name);
		    
		    // upload a file to the server.
		    console.log("ss socket based file upload run");

			var extendedProperties = _.extend(properties, {size: file.size, name: file.name});
			if(!properties.overlay) {
				console.log('Png');
				console.log(stream, extendedProperties);
				ss(socket).emit('media_file_add', stream, extendedProperties);			    
			} else {
				// console.log('emit');
				ss(socket).emit('overlay_png', stream, extendedProperties);
			}
		    
		    var blobStream = ss.createBlobReadStream(file, { highWaterMark: 102400 * 5});		
		  //   blobStream.on('data', function(chunk) {
		  //   	// progressHandler(chunk);
		  //   	console.log(chunk.length);
			 // });			     

			blobStream.pipe(stream);
			blobStream.on('end', function(chunk) {
				console.log("Upload successful");
				if(cb) cb();
 			});		
		};

		factory.uploadGoogleFile = function(file, projectId, cb) {

		};
		
		return factory;
	}
})();