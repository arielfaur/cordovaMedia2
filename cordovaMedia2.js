/**
 * A rewrite of the $cordovaMedia class (ngCordova) that properly reports media position and duration using Promises
 *
 * Author: Ariel Faur
 * Version 1.0.0
 * Date 26/05/2015.
 */

// install   :      cordova plugin add org.apache.cordova.media
// link      :      https://github.com/apache/cordova-plugin-media

angular.module('ngCordova.plugins.media', [])

.service('NewMedia', ['$q', '$interval', function ($q, $interval) {
  var q, mediaStatus = null, mediaPosition = -1, mediaTimer, mediaDuration = -1;

  function setTimer(media) {
      mediaTimer = $interval(function () {
          if (mediaDuration < 0) {
              mediaDuration = media.getDuration();
          }

          media.getCurrentPosition(
            // success callback
            function (position) {
                if (position > -1) {
                    mediaPosition = position;
                }
            },
            // error callback
            function (e) {
                console.log("Error getting pos=" + e);
            });

          if (angular.isDefined(q)) {
              q.notify({status: mediaStatus, position: mediaPosition, duration: mediaDuration});
          }
      }, 1000);
  }

  function clearTimer() {
      if (angular.isDefined(mediaTimer)) {
          $interval.cancel(mediaTimer);
          mediaTimer = undefined;
      }
  }

  function resetValues() {
      mediaPosition = -1;
      mediaDuration = -1;
  }

  function NewMedia(src) {
      this.media = new Media(src,
        function (success) {
            clearTimer();
            resetValues();
            if (angular.isDefined(q)) {
                q.resolve(success);
            }
        }, function (error) {
            clearTimer();
            resetValues();
            if (angular.isDefined(q)) {
                q.reject(error);
            }
        }, function (status) {
            mediaStatus = status;
            if (angular.isDefined(q)) {
                q.notify({status: mediaStatus, position: mediaPosition, duration: mediaDuration});
            }
        });
  }

  // iOS quirks :
  // -  myMedia.play({ numberOfLoops: 2 }) -> looping
  // -  myMedia.play({ playAudioWhenScreenIsLocked : false })
  NewMedia.prototype.play = function (options) {
      q = $q.defer();

      if (typeof options !== "object") {
          options = {};
      }
      this.media.play(options);

      setTimer(this.media);

      return q.promise;
  };

  NewMedia.prototype.pause = function () {
      clearTimer();
      this.media.pause();
  };

  NewMedia.prototype.stop  = function () {
      this.media.stop();
  };

  NewMedia.prototype.release  = function () {
      this.media.release();
      this.media = undefined;
  };

  NewMedia.prototype.seekTo  = function (timing) {
      this.media.seekTo(timing);
  };

  NewMedia.prototype.setVolume = function (volume) {
      this.media.setVolume(volume);
  };

  NewMedia.prototype.startRecord = function () {
      this.media.startRecord();
  };

  NewMedia.prototype.stopRecord  = function () {
      this.media.stopRecord();
  };

  return NewMedia;

}])
.factory('$cordovaMedia2', ['NewMedia', function (NewMedia) {
  return {
      newMedia: function (src) {
          return new NewMedia(src);
      }
  };
}]);
