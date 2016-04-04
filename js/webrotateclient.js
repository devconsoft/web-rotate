
(function() {
    /**
     * Returns an associative arrays with key-value pairs based on the
     * query string part of an url.
     * If no search string is provided, it uses an empty string.
     * Multiple uses of a key results in all the associated values being saved in
     * a single array associated with that key.
     *
     * @param {string} [searchStr] Search string
     *
     * @returns {Object} Object of search string key-value parameters.
     */
    function getQueryStringParams() {

        var searchStr = window.location.search
        // If search string not set, empty search string.
        if (typeof searchStr === 'undefined') {
            searchStr = "?";
        }
        var match;
        var pl = /\+/g;  // Regex for replacing addition symbol with a space
        var search = /([^&=]+)=?([^&]*)/g;
        var decode = function(s) {
            return decodeURIComponent(s.replace(pl, " "));
        };
        var query = searchStr.substring(1);
        var result = {};
        var key = "";
        var value = "";

        while (match = search.exec(query)) {
            key = decode(match[1]);
            value = decode(match[2]);
            if (key in result) {
                var oldValue = result[key];
                if (oldValue instanceof Array) {
                    oldValue.push(value);
                } else {
                    result[key] = [oldValue, value];
                }
            } else {
                result[key] = value;
            }

        }
        return result;
    }

    /**
     * Parser the query string for web-rotate parameters and dispatches
     * a time-delayed relocation back to next index of the sent web-rotate URL.
     */
    function startWebRotateClient() {
        var cfg = getQueryStringParams();
        var url = cfg.webRotateURL;
        var index = cfg.webRotateIndex;
        var timeInSec = cfg.webRotateTime;

        if (url && index && timeInSec) {
            var nextIndex = 1 + parseInt(index);
            var src = url + nextIndex;
            setTimeout(function() {
                // the URL sent from web-rotate will always end with #.
                window.location.replace(src);
            }, timeInSec * 1000)
        }

    }

    startWebRotateClient();
})();
