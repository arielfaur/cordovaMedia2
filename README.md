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
            media = $cordovaMedia2.newMedia($scope.tracks[0].url);
        }, false);

        $scope.playSomething = function() {
            media.getDuration().then(function(duration) {
                console.log('media duration: ' + duration);
            });

            media.getCurrentPosition().then(function() {
                console.log('finished playback')
            }, null, function(position) {
                console.log('position ' + position)
            });

            media.play().then(function() {
                // success
                console.log('finished playback');
            }, null, function(status) {
                console.log('status: ' + status);
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