const twinwordApi = (function initialize() {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://twinword-word-graph-dictionary.p.rapidapi.com",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "6a5eb6986emsh37c65da6e21947ap17c16ejsnc8290a4e910e",
            "x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com"
        }
    };
    return {
        queryDefinition: function (word) {
            let mySettings = Object.assign({}, settings);
            mySettings.url = mySettings.url.concat('/definition/?entry=' + word);
            return $.ajax(mySettings);
        },
        queryExample: function (word) {
            let mySettings = Object.assign({}, settings);
            mySettings.url = mySettings.url.concat('/example/?entry=' + word);
            return $.ajax(mySettings);
        }
    }
})();


