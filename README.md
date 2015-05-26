# cordovaMedia2

This module is a rewrite of the $cordovaMedia class from ngCordova that takes advantage of Promises to fix the issue with
media duration and position. It does so by using the `notify` method of the Deferred API.

# Usage
Assuming you are already using ngCordova, simply include the `cordovaMedia2.js` file after `ngCordova.js`

````
<script src="lib/ngCordova/dist/ng-cordova.js"></script>
<script src="js/cordovaMedia2.js"></script>
````

Then inject `$cordovaMedia2` in your controller:

````
    .controller('MusicCtrl', ['$scope', '$cordovaMedia2', function($scope, $cordovaMedia2) {
        $scope.playSomething = function() {
            var url = 'song.mp3';
            var media = $cordovaMedia2.newMedia(url);

            media.play().then(function() {
                // success
                console.log('finished playback');
                media.release();
            }, function (err) {
                // error
                console.error(JSON.stringify(err));
            }, function(data) {
                // here we get progress in a JSON object
                // {status: 0, position: 55, duration: 125} }

                console.log(JSON.stringify(data));
            });

        }
    }])
````