(function load() {
    let myJson = localStorage.getItem('my');
    if (!myJson) {
        return;
    }

    const my = JSON.parse(myJson);

    const $times = $('.box-times');
    const $avg = $('.box-avg');
    const $max = $('.box-max');
    const $correct = $('.box-correct');
    const $longest = $('.box-longest');
    const $heigest = $('.box-heigest');
    const $vocabulary = $('.box-vocabulary');

    $times.find('.content').text(my.times ? my.times : 0);
    $avg.find('.content').text(my.avg ? my.avg : 0);
    $max.find('.content').text(my.max ? my.max : 0);
    $correct.find('.content').text(my.correctPercent ? my.correctPercent : 0);
    $longest.find('.content').text(my.longest.word);
    $heigest.find('.content').text(my.heigest.word);

    let total = 0;
    const $list = $vocabulary.find('.list');
    Object.keys(my.vocabulary).forEach((word, index) => {
        let vocabulary = my.vocabulary[word];
        total += vocabulary.score;
        const $word = $('<div/>', {
            'class': 'item'
        }).append($('<div/>', {
            'class': 'word',
            'text': word
        }).append($('<span/>', {
            'class': 'class',
            'text': '(' + vocabulary.class + ')'
        }))).append($('<div/>', {
            'class': 'score',
            'text': vocabulary.score
        }))
        $list.append($word);

        $word.on('click', function(e) {
            e.preventDefault();

            const $meaning = vocabulary.meaning.replace(/\n/g, "<br/><br/>");
            const $content = $('<div/>', {
                'class': 'pp_vacb'
            }).append($('<div/>', {
                'class': 'title',
                'text': word
            })).append($('<div/>', {
                'class': 'meaning'
            }).html($meaning));

            pp.fire({
                'html': $content,
                'confirmButtonText': 'OK',
                'showCancelButton': false
            });
        });
    });

    const $footer = $vocabulary.find('.footer');
    $footer.find('.sum .num').text(my.vocabulary ? Object.keys(my.vocabulary).length : 0);
    $footer.find('.total').text(total);
})();