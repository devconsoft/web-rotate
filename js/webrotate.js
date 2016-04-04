/**
 * Get the config, setup the application, including logging, and
 * start the dispatcher.
 */
function startWebRotate() {
    var cfg = getConfig();
    setIndex(cfg);
    log.level = cfg.logLevel || log.level;
    dispatch(cfg);
}

/**
 *
 * @param {Object} config
 */
function setIndex(config) {
    var hash = window.location.hash.substr(1);
    config.index = hash || config.index || 0;
    window.location.hash = "";
}

/**
 * Dispatches/loads the item in the content iframe
 * @param item
 */
function dispatchItem(item) {
    log.debug(item.type, item);
    var src = "";
    switch(item.type) {
        case "image":
            src = urlToFrameworkFile(item.src, "images");
            break;
        case "page":
            src = urlToFrameworkFile(item.src, "pages");
            break;
        case "web":
            src = item.src;
            break;
        default:
            var errorMsg = "Unknown configuration item type: " + item;
            log.error(errorMsg);
            throw new Error(errorMsg);
    }
    document.getElementById('mainframe').src = src;
}

/**
 * Dispatch the current item (decided by current index)
 * from the config (list) and schedule an update after the items specified time.
 * Start over or reload the entire page, if at end of list.
 * @param cfg (config object)
 */
function dispatch(cfg) {
    if (cfg.index >= cfg.config.length) { // end of list
        if (cfg.reload !== "false" || cfg.reload) {
            log.debug("Reloading page");
            window.location.reload(true);
            return;
        }
        log.debug("Restarting from beginning");
        cfg.index = 0;
    }
    var item = cfg.config[cfg.index];
    var timeInSec = item.time || cfg.time || 5;
    log.debug("Loading item [" + cfg.index + "], time: " + timeInSec + "s");
    dispatchItem(item);
    cfg.index++;

    setTimeout(function() { dispatch(config); }, timeInSec * 1000);
}
