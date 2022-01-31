function StopWatch () {
    let countdownHandler = null;
    return {
        start: function (doneHandler, updateHandler, minutes, seconds) {
            let endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
            let hours, mins, msLeft, time;

            (function updateTimer() {
                msLeft = endTime - (+new Date);
                if (msLeft < 1000) {
                    updateHandler('Time is up!');
                    doneHandler();
                } else {
                    time = new Date(msLeft);
                    hours = time.getUTCHours();
                    mins = time.getUTCMinutes();
                    updateHandler((hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds()));
                    countdownHandler = setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
                }
            })();

            function twoDigits(n) {
                return (n <= 9 ? "0" + n : n);
            }
        },
        stop: function() {
            if (countdownHandler) {
                clearInterval(countdownHandler);
            }
        }
    }
}