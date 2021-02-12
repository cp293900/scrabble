;(function ($) {
    $.fn.buttonPlay = function (inOptions) {
        let options = {
            onBeforeClick: function() {
                console.log('before click');
                return true;
            },
            onClick: function (successHandler, worngHandler) {
                console.log('click');
                setTimeout(() => {
                    let result = Math.floor(Math.random() * Math.floor(2));
                    if(result == 0) {
                        successHandler(result);
                    } else {
                        worngHandler(result);
                    }
                }, 1800);
            },
            onSuccess: function () {
                console.log('success');
                return true;
            },
            onWrong: function () {
                console.log('wrong');
                return true;
            },
            onComplete: function() {
                console.log('complete');
            }
        };
        options = $.extend(options, inOptions);
        const $buttonPlay = $(this);

        let disabled = false;
        let successHandler = function(args) {
            // Completed stage
            $buttonPlay.addClass('complete');
            $buttonPlay.removeClass('loading');
            setTimeout(() => {
                if(options.onSuccess(args) === true) {
                    setTimeout(() => {
                        // Reset button so user can select it again
                        disabled = false;
                        $buttonPlay.addClass('ready');
                        $buttonPlay.removeClass('complete');
                        options.onComplete();
                    }, 3000);
                }
            }, 320);
        }
        let worngHandler = function(args) {
            // Error stage
            $buttonPlay.addClass('error');
            $buttonPlay.removeClass('loading');
            setTimeout(() => {
                if(options.onWrong(args) === true) {
                    setTimeout(() => {
                        // Reset button so user can select it again
                        disabled = false;
                        $buttonPlay.addClass('ready');
                        $buttonPlay.removeClass('error');
                        options.onComplete();
                    }, 3000);
                }
            }, 320);
        }
        let clickHandler = function() {
            if(options.onBeforeClick() === true) {
                // Loading stage
                $buttonPlay.addClass('loading');
                $buttonPlay.removeClass('ready');
                options.onClick(successHandler, worngHandler);
            } else {
                disabled = false;
            }
        }

        $buttonPlay.on('click', function(e) {
            e.preventDefault();
            if (!disabled) {
                disabled = true;
                clickHandler(e);
            }
        });

        (function init() {
            const $submitMessage = $('<div/>', {
                'class': 'message submitMessage'
            }).append(
                $(makeSVG('svg', {
                    'viewBox': '0 0 13 12.2'
                })).append(
                    $(makeSVG('polyline', {
                        'stroke': 'currentColor',
                        'points': '7.1,2 11.1,6.5 7.1,11'
                    }))
                ).append(
                    $(makeSVG('line', {
                        'stroke': 'currentColor',
                        'x1': '1.2',
                        'y1': '6.5',
                        'x2': '10.3',
                        'y2': '6.5'
                    }))
                )
            ).append(
                $('<span/>', {
                    'class': 'button-text',
                    'text': 'Submit'
                })
            );
            const $loadingMessage = $('<div/>', {
                'class': 'message loadingMessage'
            }).append(
                $(makeSVG('svg', {
                    'viewBox': '0 0 19 17'
                })).append(
                    $(makeSVG('circle', {
                        'class': 'loadingCircle',
                        'cx': '2.2',
                        'cy': '10',
                        'r': '1.6'
                    }))
                ).append(
                    $(makeSVG('circle', {
                        'class': 'loadingCircle',
                        'cx': '9.5',
                        'cy': '10',
                        'r': '1.6'
                    }))
                ).append(
                    $(makeSVG('circle', {
                        'class': 'loadingCircle',
                        'cx': '16.8',
                        'cy': '10',
                        'r': '1.6'
                    }))
                )
            );
            const $successMessage = $('<div/>', {
                'class': 'message successMessage'
            }).append(
                $(makeSVG('svg', {
                    'viewBox': '0 0 13 11'
                })).append(
                    $(makeSVG('polyline', {
                        'stroke': 'currentColor',
                        'points': '1.4,5.8 5.1,9.5 11.6,2.1'
                    }))
                )
            ).append(
                $('<span/>', {
                    'class': 'button-text',
                    'text': 'Success'
                })
            );
            const $wrongMessage = $('<div/>', {
                'class': 'message errorMessage'
            }).append(
                $(makeSVG('svg', {
                    'viewBox': '0 0 13 10.2'
                })).append(
                    $(makeSVG('polyline', {
                        'stroke': 'currentColor',
                        'points': '2.1,9.5 10,2.1'
                    }))
                ).append(
                    $(makeSVG('polyline', {
                        'stroke': 'currentColor',
                        'points': '10,9.5 2.1,2.1'
                    }))
                )
            ).append(
                $('<span/>', {
                    'class': 'button-text',
                    'text': 'Wrong'
                })
            );

            $buttonPlay.addClass('play').addClass('ready');
            $buttonPlay.append($submitMessage);
            $buttonPlay.append($loadingMessage);
            $buttonPlay.append($successMessage);
            $buttonPlay.append($wrongMessage);

            $.each($buttonPlay.find('.button-text'), function(index, element) {
                let characters = $(element).text().split('');
                let characterHTML = '';
                characters.forEach((letter, index) => {
                    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
                });
                $(element).html(characterHTML);
            });
        })();

        function makeSVG(tag, attrs) {
            var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs)
                el.setAttribute(k, attrs[k]);
            return el;
        }
    }
}(jQuery));