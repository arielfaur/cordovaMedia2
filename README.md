# cordovaMedia2

This module is a rewrite of the `$cordovaMedia` class from ngCordova that takes advantage of Promises to fix the issue with
media duration and position. It does so by using the `notify` method of the Deferred API.

# Usage

## Simply include the `cordovaMedia2.js` file after `ngCordova.js`

```
<script src="lib/ngCordova/dist/ng-cordova.js"></script>
```

```
<script src="js/cordovaMedia2.js"></script>
```

## Inject `ngCordova.plugins.media2` in your app's module

`angular.module('app', ['ionic', 'ngCordova', 'ngCordova.plugins.media2'])`

## Inject `$cordovaMedia2` in your controller:

```
    controller('MusicCtrl', ['$scope', '$cordovaMedia2', function($scope, $cordovaMedia2) {
        var media;

        document.addEventListener("deviceready", function() {
            media = $cordovaMedia2.newMedia('mySong.mp3');
        }, false);

        $scope.playSomething = function() {
             media.play().then(function() {
                 // success
                 console.log('finished playback');
             }, null, function(data) {
                 console.log('track progress: ' + data.position);

                 if (data.status) {
                     console.log('track status change: ' + data.status);
                 }
                 if (data.duration) {
                     console.log('track duration: ' + data.duration);
                 }
             });
        };

        $scope.pauseSomething = function() {
            media.pause();
        };

        $scope.stopSomething = function() {
            media.stop();
        };

        $scope.$on('destroy', function() {
            media.release();
        });
    }])
```