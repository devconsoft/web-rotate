
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
 * Converts the provided path to a framework path. If path is absolute specified
 * URL, it is left unmodified. Initial slash indicates framework absolute
 * path. The resulting path will have the specified extension if given.
 * @function
 * @param {string} path           Path
 * @param {folder} folder         Default framework folder.
 * @param {extension} [extension] Optional, default file extension, not including the dot.
 * @returns {string}              framework path
 */
function urlToFrameworkFile(path, folder, extension) {
    if (path.substr(0, 4) === "http") {
        return path;
    }
    if (path.substr(0, 1) === "/") {
        return path.substr(1);
    }
    if (extension && !path.endsWith('.' + extension)) {
        path += '.' + extension;
    }
    return folder + '/' + path;
}

/**
 * Retrieves a file and returns its content as a string.
 * @param {string} path Path to file.
 */
function getFileContent(path) {
    var result = "";
    var error = null;
    var req = new XMLHttpRequest();
    req.open("GET", path, false);
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200 || req.status == 0) {
                result = req.responseText;
            } else {
                error = true;
            }
        } else {
            log.error({ "path": path,
                  "state": req.readyState,
                  "status": req.status });
        }
    };
    req.send();
    if (error) {
        throw new Error("Failed to retrieve file ('" + path + "')");
    }
    return result;
}

/**
 * Reads and parses a JSON string from a JavaScript file. Will be executed in sync mode
 * @param {string} fileName Path to file to be read and parsed.
 */
function readConfig(fileName) {
   var json = getFileContent(fileName);
   try {
        return JSON.parse(json);
    } catch (e) {
        log.error(JSON.stringify(e));
        log.error(e.message);
        log.error(json);
        throw new Error('File ' + fileName + ' was not found or format is wrong!');
    }
}

/**
  * Merge conf2 into conf1, excluding properties in exclude list
  * @param {Object} conf1 primary configuration object, destination
  * @param {Object} conf2 secondary configuration object, read from
  * @return conf1
  */
function mergeConfig(conf1, conf2) {
    for (prop in conf2) {
        conf1[prop] = conf2[prop];
    }
    return conf1;
}

/**
 * Returns the config based on the query string argument in the location URL.
 * Uses default config if config/cfg is not specified.
 * The configuration should be an array with configuration items.
 */
function getConfig() {
    var args = getQueryStringParams();
    var configFile = args['cfg'] || "default";
    configFile = urlToFrameworkFile(configFile, "config", "json");
    var config = readConfig(configFile);
    config = mergeConfig(config, args);
    return config;
}

