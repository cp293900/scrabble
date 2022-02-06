;(function (global, $) {

    const defaults = {
        'class': undefined,
        'title': undefined,
        'text': undefined,
        'html': undefined,
        'confirmButtonText': 'OK',
        'cancelButtonText': 'Cancel',
        'showConfirmButton': true,
        'showCancelButton': true,
        'onAfterOpen': undefined,
        'onBeforeClose': undefined,
        'onAfterClose': undefined,
        'preConfirm': undefined
    };

    const pp = function () {
        let newArgs;
        return {
            fire: function (args) {
                newArgs = $.extend({}, defaults, args);
                return $.Deferred(function (dfd) {
                    create(newArgs, dfd);
                    show(newArgs);
                });
            },
            close: function (result) {
                close(newArgs, result);
            }
        };
    };

    let $wrapper = $('.wrapper');
    let $popupbox = undefined;

    function create(args, dfd) {
        const $content = $('<div/>', {
            'class': 'pp_tent'
        });
        if (args.title) {
            $content.append(
                $('<div/>', {
                    'class': 'pp_tlt',
                    'text': args.title
                })
            )
        }
        if (args.text) {
            $content.append(
                $('<div/>', {
                    'class': 'pp_p',
                }).html(args.text)
            )
        }
        if (args.html) {
            $content.append(args.html);
        }
        if (args.showConfirmButton || args.showCancelButton) {
            const $pp_btnbox = $('<div/>', {
                'class': 'pp_btnbox flexBox',
            });
            if (args.showCancelButton) {
                $pp_btnbox.append(
                    $('<a/>', {
                        'href': 'javascript:void(0);',
                        'class': 'btn gray',
                        'text': args.cancelButtonText
                    }).on('click', function (e) {
                        e.preventDefault();
                        dfd.resolve({value: false}, $popupbox);
                        close(undefined, false);
                    })
                )
            }
            if (args.showConfirmButton) {
                $pp_btnbox.append(
                    $('<a/>', {
                        'href': 'javascript:void(0);',
                        'class': 'btn',
                        'text': args.confirmButtonText
                    }).on('click', function (e) {
                        e.preventDefault();
                        if(args && args.preConfirm && typeof args.preConfirm === 'function') {
                            if(!args.preConfirm($popupbox)) {
                                return;
                            }
                        }
                        dfd.resolve({value: true}, $popupbox);
                        close(args, true);
                    })
                )
            }
            $content.append($pp_btnbox);
        }

        $popupbox = $('<div/>', {
            'class': 'popupbox ' + (args.class ? args.class : '')
        }).append(
            $('<div/>', {
                'class': 'cover flexBox'
            }).append($content)
        );
    }

    function show(args) {
        $wrapper.removeClass('popOpen').addClass('popOpen');
        if ($popupbox) {
            $wrapper.append($popupbox);
            $popupbox.fadeIn(200, function () {
                if(args && args.onAfterOpen && typeof args.onAfterOpen === 'function') {
                    args.onAfterOpen($popupbox);
                }
                const cTt = $(window).scrollTop();
                $('body').css(
                    {
                        'top': '-' + cTt + 'px'
                    });
                $('body').addClass('locked');
                $popupbox.data('scroll', cTt);
            });
        }
    }

    function close(args, result) {
        if(args && args.onBeforeClose && typeof args.onBeforeClose === 'function') {
            if(!args.onBeforeClose($popupbox)) {
                return;
            }
        }

        $wrapper.removeClass('popOpen');
        if ($popupbox) {
            $popupbox.fadeOut(150, function () {
                const cTt = $popupbox.data('scroll');
                $popupbox.remove();
                $('body').removeClass('locked');
                $(window).scrollTop(cTt);

                if(args && args.onAfterClose && typeof args.onAfterClose === 'function') {
                    if(result) {
                        args.onAfterClose({value: result});
                    } else {
                        args.onAfterClose({value: false});
                    }
                }
            });
        }
    }

    global.pp = pp();
}(window, jQuery));