describe('cordovaMedia2 test suite', function() {
    var NewMedia, $interval;

    beforeEach(module('ngCordova.plugins.media2'));

    beforeEach(inject(function(_NewMedia_, _$interval_){
        NewMedia = _NewMedia_;
        $interval = _$interval_;
    }));

    it('should resolve promise and report 120s', function(done) {
        var myMedia = new NewMedia('mySong.mp3');
        expect(myMedia.media).toBeDefined();

        spyOn(Media.prototype, 'getDuration').and.returnValue(120);

        var duration;
        myMedia.getDuration().then(function(dur) {
            duration  = dur;
        });

        myMedia.play();
        $interval.flush(1000);

        expect(duration).toBe(120);
        done();
    });

    it('should not resolve promise and report nothing', function(done) {
        var myMedia = new NewMedia('mySong.mp3');
        expect(myMedia.media).toBeDefined();

        spyOn(Media.prototype, 'getDuration').and.returnValue(-1);

        var duration;
        myMedia.getDuration().then(function(dur) {
            // unreachable code
            duration  = dur;
        });

        myMedia.play();
        $interval.flush(1000);

        expect(duration).toBeUndefined();
        done();
    });

});