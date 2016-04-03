
/**
 * Safe console logging
 */
var log = {

    _logLevelActive: function(level) {
        var self = this;
        var levelValue = function(level) {
            switch(level) {
                case self.DEBUG:
                    return 1;
                case self.INFO:
                    return 2;
                case self.WARNING:
                    return 3;
                case self.ERROR:
                    return 4;
                case self.OFF:
                    return 5;
                default:
                    throw new Error("Invalid log level: " + level);
            }
            return -1; // should never happen
        };
        return levelValue(level) >= levelValue(this.level);
    },

    _write: function(level, args) {
        if (this._logLevelActive(level)) {
            [].unshift.call(args, level);
            if (console && console.log) {
                if (console.log.apply) {
                    console.log.apply(console, args);
                } else {
                    console.log(args);
                }
            }
        }
    },

    DEBUG: "DEBUG",
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
    OFF: "OFF",

    debug: function() { this._write(this.DEBUG, arguments) },
    info: function() { this._write(this.INFO, arguments) },
    warning: function() { this._write(this.WARNING, arguments) },
    error: function() { this._write(this.ERROR, arguments) }
};
log.level = log.OFF;
