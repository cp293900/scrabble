; (function ($) {
    $.fn.dice = function (inOptions) {
        const $dice = $(this);
        let $one, $two, $three, $four, $five, $six, $currentFace;

        let disabled = false;
        $dice.roll = function () {
            if (!disabled) {
                disabled = true;
                hideFace($currentFace);
                rollDice();
                const num = generateNum();
                switch (num) {
                    case 1:
                        $currentFace = $one;
                        break;
                    case 2:
                        $currentFace = $two;
                        break;
                    case 3:
                        $currentFace = $three;
                        break;
                    case 4:
                        $currentFace = $four;
                        break;
                    case 5:
                        $currentFace = $five;
                        break;
                    case 6:
                        $currentFace = $six;
                        break;
                }
                return $.Deferred(function (dfd) {
                    showFace($currentFace);
                    setTimeout(() => {
                        stopRoll();
                        disabled = false;
                        dfd.resolve(num);
                    }, 3000);
                });
            }
        }

        function showFace($face) {
            $face.addClass("fadeIn");
            setTimeout(function () {
                $face.removeClass("fadeOut");
                $face.removeClass("hidden");
            }, 900);
        }

        function hideFace($face) {
            $face.addClass("fadeOut");
            setTimeout(function () {
                $face.removeClass("fadeIn");
                $face.addClass("hidden");
            }, 900);
        }

        function rollDice() {
            $dice.addClass("roll");
        }

        function stopRoll() {
            $dice.removeClass("roll");
        }

        function generateNum() {
            return Math.floor(Math.random() * 6) + 1;
        }

        (function init() {
            const $one_face = $('<div/>', {
                'class': 'one hidden'
            }).append(
                $('<div/>', {
                    'class': 'dot'
                })
            );
            const $two_face = $('<div/>', {
                'class': 'two hidden'
            }).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            );
            const $three_face = $('<div/>', {
                'class': 'three hidden'
            }).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            );
            const $four_face = $('<div/>', {
                'class': 'four hidden'
            }).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            );
            const $five_face = $('<div/>', {
                'class': 'five hidden'
            }).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot center'
                })
            );
            const $six_face = $('<div/>', {
                'class': 'six'
            }).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            ).append(
                $('<div/>', {
                    'class': 'dot'
                })
            );

            $dice.append($one_face);
            $dice.append($two_face);
            $dice.append($three_face);
            $dice.append($four_face);
            $dice.append($five_face);
            $dice.append($six_face);

            $one = $dice.find(".one");
            $two = $dice.find(".two");
            $three = $dice.find(".three");
            $four = $dice.find(".four");
            $five = $dice.find(".five");
            $six = $dice.find(".six");
            $currentFace = $six;

            if (!$dice.hasClass('dice')) {
                $dice.addClass('dice');
            }
        })();

        return $dice;
    }
}(jQuery));