/**
 * Get the config, setup the application, including logging, and
 * start the dispatcher.
 */
function startWebRotate() {
    var cfg = getConfig();
    setLogLevel(cfg);
    setIndex(cfg);
    setPageTitle(cfg);
    logConfig(cfg);
    dispatch(cfg);
}

function logConfig(cfg) {
    log.debug("Configuration");
    for (var attr in cfg) {
        if (attr == "config") {
            log.debug("  config items:");
            var configItems = cfg[attr]
            for (var item in configItems) {
                log.debug("    ", configItems[item]);
            }
        } else {
            log.debug("  " + attr + ":", cfg[attr]);
        }
    }
    log.debug("--------")
}

function setPageTitle(cfg) {
    document.title = cfg.title || "Web Rotate";
    log.debug("Updated page title: " + document.title);
}

function setLogLevel(cfg) {
    log.level = cfg.logLevel || log.level;
    log.debug("Updated log level: " + log.level);
}

/**
 *
 * @param {Object} cfg
 */
function setIndex(cfg) {
    var hash = parseInt(window.location.hash.substr(1));
    cfg.index = hash || cfg.index || 0;
    window.location.hash = "";
}

/**
 * Dispatches/loads the item in the content iframe
 * @param item
 */
function dispatchItem(item) {
    log.debug(item);
    var src = "";
    switch(item.type) {
        case "image":
            src = urlToFrameworkFile(item.src, "images");
            document.getElementById('mainframe').src = "image.html" +
                "?imageUrl=" + encodeURIComponent(src);
            break;
        case "page":
            src = urlToFrameworkFile(item.src, "pages");
            document.getElementById('mainframe').src = src;
            break;
        case "web":
            src = item.src;
            document.getElementById('mainframe').src = src;
            break;
        case "client":
            var url = document.createElement('a');
            url.href = item.src;
            url.search = url.search.substr(1) +
                "&webRotateURL=" + encodeURIComponent(window.location.href) +
                "&webRotateIndex=" + item.index +
                "&webRotateTime=" + item.time
            window.location.replace(url.href);
            break;
        default:
            var errorMsg = "Unknown configuration item type: " + item.type;
            log.error(errorMsg);
            throw new Error(errorMsg);
    }
}

/**
 * Dispatch the current item (decided by current index)
 * from the config (list) and schedule an update after the items specified time.
 * Start over or reload the entire page, if at end of list.
 * @param cfg (config object)
 */
function dispatch(cfg) {
    if (cfg.index >= cfg.config.length) { // end of list
        if (cfg.reload) {
            log.debug("Reloading page");
            window.location.reload(true);
            return;
        }
        log.debug("Restarting from beginning");
        cfg.index = 0;
    }
    var item = cfg.config[cfg.index];
    item.time = item.time || cfg.time || 5;
    item.index = cfg.index;
    log.debug("Loading item [" + item.index + "], time: " + item.time + "s");
    dispatchItem(item);
    cfg.index++;
    setTimeout(function() { dispatch(cfg); }, item.time * 1000);
}
