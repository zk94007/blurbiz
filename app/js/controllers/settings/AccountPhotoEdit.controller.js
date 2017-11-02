(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('AccountPhotoEditController', AccountPhotoEditController);

    function AccountPhotoEditController($uibModalInstance, $scope, socket, file, LocalStorageService) {
        var vm = this;

        vm.myImage = URL.createObjectURL(file);
        vm.myCroppedImage = '';
        vm.savePhoto = savePhoto;
        vm.cancel = cancel;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function savePhoto() {
            var blobPhoto = dataURItoBlob(vm.myCroppedImage)
            console.log(blobPhoto)
            blobPhoto.name = "test.png";

            uploadAccountPhoto(blobPhoto, function() {
                
            });


            socket.on('update_account_photo_response', function (msg) {
                if (msg == null) {
                    console.log('ERROR: msg is null');
                }
                else if (msg.success == false) {
                    console.log('ERROR: expected answer - { success: true }, err: ');
                } else {
                    console.log('PHOTO UPDATED');
                    $uibModalInstance.close(msg.photo);
                    return;
                }
                $uibModalInstance.dismiss('cancel');
            });
        }

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        }


        function uploadAccountPhoto(file, cb) {
            var stream = ss.createStream();
            console.log('file selected : '+file.name);
            // upload a file to the server.
            console.log("ss socket based file upload run");
            ss(socket).emit('update_account_photo', stream, {size: file.size , name:file.name, token: LocalStorageService.getToken()});
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
        }
    }
})();