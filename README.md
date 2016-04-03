# web-rotate
Web-rotate is a simple framework for rotating content in a browser.
It's purpose is to show presentation material that should loop in a display
monitor or similar, where each "slide" is shown a specific amount of time.

## How to use

1. Create a configuration file with extension .json in the config directory.
1. Start the display by going to web-rotate/?cfg=YOURCONFIG

## Configuration option

Look at config/test.json for examples of configuration options.

### time
Time is the number of seconds a specific item should be shown.
A default time can be set on top level which will be used if time
is not specified for an item.

### logLevel
See logging below

### reload
reload can be set to true or false. If set to true, it reloads the configuration
at the end of a cycle. This will allow updates in configuration to take
effect without reloading the top web-page manually.

### config
config is a list of configuration items.
An item has a type, src and time (optional, see also time above). Allowed types are image, page and web.
For image and page, the src is the name of a file in the image/page directory.
web is used for external pages and the src should be a full URL to the resource
to be displayed.

## Test your installation
Test your installation by going to web-rotate/?cfg=test

## Logging

In production environment it is suggested to set logLevel to OFF.

The different log-levels are:

1. DEBUG
1. INFO
1. WARNING
1. ERROR
1. OFF

## Trouble shooting
Make sure that your installation works, see Test your installation.
Web-rotate uses iframes to show the content. Many modern sites uses various
technics to prevent them from being displayed in an iframe. That is a security
measure that will prevent web-rotate to work properly with these sites.
