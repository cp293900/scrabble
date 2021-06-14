const $round = $('.gameRound .value');
const $score = $('.gameInfo .score .value');
const $remain = $('.gameInfo .remain .value');
const $countdown = $('.gameInfo .countdown .value');
const maxRound = 5;
const maxRoundTime = 60;
let history = [];
let countdownHandler = null;

(function init() {
    dealingCards();
    initCheckButton();
    play();
})();

function createCard(letter, id) {
    return $('<div/>', {
        'class': 'card ' + id
    }).append(
        $('<div/>', {
            'class': 'face ratio'
        })
    ).append(
        $('<div/>', {
            'class': 'face front'
        }).append(
            $('<div/>', {
                'class': 'content',
            }).append(
                $('<img/>', {
                    'src': './resources/img/aurelia.svg',
                    'alt': 'aurelia'
                })
            )
        )
    ).append(
        $('<div/>', {
            'class': 'face back'
        }).append(
            $('<div/>', {
                'class': 'content',
            }).append(
                $('<div/>', {
                    'class': 'letter',
                    'text': letter.key
                })
            ).append(
                $('<div/>', {
                    'class': 'score',
                    'text': letter.score
                })
            )
        )
    ).on('click', function (e) {
        e.preventDefault();
        const $card = $(this);
        if ($card.hasClass('flip')) {
            const $faceBack = $card.find('.face.back');
            if ($faceBack.hasClass('done')) {
                return;
            }
            if ($faceBack.hasClass('selected')) {
                $faceBack.removeClass('selected');
                removeFromScrabbleWords(id);
            } else {
                $faceBack.addClass('selected');
                addToScrabbleWords(letter, id);
            }
        } else {
            let remain = getRemain();
            if (remain > 0) {
                setRemain(remain - 1);
                $card.addClass('flip');
            }
        }
    });

    function addToScrabbleWords(letter, id) {
        const $card = $('<div/>', {
            'class': 'card flip ' + id,
        }).append(
            $('<div/>', {
                'class': 'face ratio'
            })
        ).append(
            $('<div/>', {
                'class': 'face back selected'
            }).append(
                $('<div/>', {
                    'class': 'content',
                }).append(
                    $('<div/>', {
                        'class': 'letter',
                        'text': letter.key
                    })
                ).append(
                    $('<div/>', {
                        'class': 'score',
                        'text': letter.score
                    })
                )
            )
        );

        letter.id = id;
        $card.data('letter', letter);
        $('.scrabbled .letters').append($card);
    }

    function removeFromScrabbleWords(id) {
        $('.scrabbled .letters').find('.' + id).remove();
    }
}

/**
 * 讀取字母、分數設定
 */
function load() {
    return $.Deferred(function (dfd) {
        $.getJSON('./resources/assets/letters.json', function (response) {
            dfd.resolve(response);
        });
    });
}

/**
 * 陣列洗牌
 * @param {*} array 
 */
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function dealingCards() {
    load().then(function (letters) {
        let cards = [];
        letters.forEach((letter, idx) => {
            for (let i = 0; i < letter.qty; i++) {
                cards.push(createCard(letter, idx + '_' + i));
            }
        });
        cards = shuffle(cards);
        for (let i = 0; i < cards.length; i++) {
            $('.cards').append(cards[i]);
        }
    });
}

function initCheckButton() {
    const $checkBtn = $('#checkBtn');
    $checkBtn.buttonPlay({
        onBeforeClick: function () {
            return $('.scrabbled .letters').find('.card').length > 0;
        },
        onClick: function (successHandler, worngHandler) {
            let word = '';
            let score = 0;
            let ids = [];
            $.each($('.scrabbled .letters').find('.card'), function (index, element) {
                let letter = $(element).data('letter');
                word += letter.key;
                score += letter.score;
                ids.push(letter.id);
            });

            twinwordApi.queryDefinition(word).then(function (response) {
                response.ids = ids;
                if (response.result_code === '200') {
                    response.score = score;
                    successHandler(response);
                } else {
                    worngHandler();
                }
            });
        },
        onSuccess: function (response) {
            response.ids.forEach((id, index) => {
                $('.cards').find('.' + id).find('.face.back').addClass('done');
            });
            setScore(getScore() + response.score);
            addHistory(response);
            return true;
        },
        onWrong: function () {
            return true;
        },
        onComplete: function () {
            coverUndoneCards();
            clearScrabbled();
            setTimeout(() => {
                play();
            }, 500);
        }
    });
}

function coverUndoneCards() {
    const $flipCards = $('.cards .card.flip');
    $.each($flipCards, function (index, element) {
        const $card = $(element);
        const $faceBack = $card.find('.face.back');
        if (!$faceBack.hasClass('done')) {
            $faceBack.removeClass('selected');
            $card.removeClass('flip');
        }
    });
}

function clearScrabbled() {
    $('.scrabbled .letters .card').remove();
}

function play() {
    if (countdownHandler) {
        clearInterval(countdownHandler);
    }

    let round = getRound();
    if (round === maxRound) {
        pp.fire({
            'title': 'Game Over',
            'text': 'Your score is ' + getScore(),
            'confirmButtonText': 'Try again',
            'showCancelButton': false
        }).then(function (result) {
            if (result.value) {
                window.location.reload();
            }
        });
        return;
    }
    setRound(round + 1);

    openRollDice().then(function (response) {
        setRemain(response);

        let minutes = maxRoundTime / 60;
        let seconds = maxRoundTime % 60;
        countdown(function () {
            coverUndoneCards();
            clearScrabbled();
            setTimeout(() => {
                play();
            }, 500);
        }, minutes, seconds);
    });
}

function countdown(handler, minutes, seconds) {
    let endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
    let hours, mins, msLeft, time;

    (function updateTimer() {
        msLeft = endTime - (+new Date);
        if (msLeft < 1000) {
            setCountdown('Time is up!');
            handler();
        } else {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            setCountdown((hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds()));
            countdownHandler = setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
    })();

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }
}

function openRollDice() {
    return $.Deferred(function (dfd) {
        const $content = $('<div/>', {
            'class': 'dices'
        }).append(
            $('<div/>', {
                'class': 'dice_1'
            })
        ).append(
            $('<div/>', {
                'class': 'dice_2'
            })
        );

        let $dice_1;
        let $dice_2;
        pp.fire(
            {
                'class': 'roll_dice',
                'confirmButtonText': 'Roll',
                'showCancelButton': false,
                'html': $content,
                'onAfterOpen': function ($pp) {
                    $dice_1 = $pp.find('.dice_1').dice();
                    $dice_2 = $pp.find('.dice_2').dice();
                },
                'preConfirm': function ($pp) {
                    const $rollBtn = $pp.find('.btn');
                    $rollBtn.addClass('disabled').text('processing');
                    $.when($dice_1.roll(), (function () {
                        return $.Deferred(function (dfd_in) {
                            setTimeout(function () {
                                $dice_2.roll().then(function (response) {
                                    dfd_in.resolve(response);
                                });
                            }, 200);
                        });
                    })()).then(function (response1, response2) {
                        const result = response1 + response2;
                        $rollBtn.removeClass('disabled').text('You\'ve got ' + result);
                        $rollBtn.off('click');
                        $rollBtn.on('click', function (e) {
                            e.preventDefault();
                            pp.close(result);
                        });
                    });
                    return false;
                },
                'onAfterClose': function (result) {
                    dfd.resolve(result.value);
                }
            });
    });
}

function setRound(value) {
    $round.text(value);
    $round.data('value', value);
}

function getRound() {
    return $round.data('value') ? parseInt($round.data('value')) : 0;
}

function setScore(value) {
    $score.text(value);
    $score.data('value', value);
}

function getScore() {
    return $score.data('value') ? parseInt($score.data('value')) : 0;
}

function setRemain(value) {
    $remain.text(value);
    $remain.data('value', value);
}

function getRemain() {
    return $remain.data('value') ? parseInt($remain.data('value')) : 0;
}

function setCountdown(value) {
    $countdown.text(value);
    $countdown.data('value', value);
}

function getCountdown() {
    return $countdown.data('value') ? $countdown.data('value') : 0;
}

function addHistory(word) {
    const $word = $('<div/>', {
        'class': 'word'
    }).append(
        $('<div/>', {
            'text': history.length + 1 + '. ' + word.request
        })
    )

    if (word.meaning.adjective && word.meaning.adjective.length > 0) {
        $word.append(
            $('<div/>', {
                'text': '(adj) ' + word.meaning.adjective
            })
        )
    } else if (word.meaning.adverb && word.meaning.adverb.length > 0) {
        $word.append(
            $('<div/>', {
                'text': '(adv) ' + word.meaning.adverb
            })
        )
    } else if (word.meaning.noun && word.meaning.noun.length > 0) {
        $word.append(
            $('<div/>', {
                'text': '(n) ' + word.meaning.noun
            })
        )
    } else if (word.meaning.verb && word.meaning.verb.length > 0) {
        $word.append(
            $('<div/>', {
                'text': '(v) ' + word.meaning.verb
            })
        )
    }

    $('.history').append($word);
    history.push(word);
}