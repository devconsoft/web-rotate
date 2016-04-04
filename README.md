# web-rotate
Web-rotate is a simple framework for rotating content in a browser.
It's purpose is to show presentation material that should loop in a display
monitor or similar, where each "slide" is shown a specific amount of time.

## How to use

1. Create a configuration file with extension .json in the config directory.
1. Start the display by going to web-rotate/?cfg=YOURCONFIG

If cfg is not specified, it defaults to the default configuration.

## Configuration option

Look at config/test.json for examples of configuration options.

All top level configuration attributes can be overridden or set via the URL
query syntax, e.g. cfg?=test&logLevel=DEBUG&reload=true.

### time (number)
Time is the number of seconds a specific item should be shown.
A default time can be set on top level which will be used if time
is not specified for an item. Defaults to 5.

### logLevel (string)
See logging below. Defaults to OFF.

### reload (boolean)
reload can be set to true or false. If set to true, it reloads the configuration
at the end of a cycle. This will allow updates in configuration to take
effect without reloading the top web-page manually. Defaults to false.

### config (list)
config is a list of configuration items.
An item has a type, src and time (optional, see also time above).
Allowed types are image, page, web and client.

For image and page, the src is the name of a file in the image/page directory.
web is used for external pages and the src should be a full URL to the resource
to be displayed.

For client use, see below.

### index (integer)
Starting index, which item in the config list should be the first item to be loaded.
Defaults to zero. If used together with reload, it will have the effect that
items with lower index will never be shown.

## Special use of hash in URL
The hash part of the URL has special meaning to web rotate, it is used to pass
a one time start index.

## Test your installation
Test your installation by going to web-rotate/?cfg=test

## Web-rotate client
Some pages might not work inside an iframe. If the side you want to bring into
your rotation offers a way to inject content such as custom headers/footers,
the web-rotate client might work.
Make sure that the js/rotateclient.js file (or its content) is loaded on the
target site to activate the client. The framework will take care of the rest.

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
techniques to prevent them from being displayed in an iframe. That is a security
measure that will prevent web-rotate to work properly with these sites.

Some sites suffers from bad design/implementation that might also prevent the
use of iframes. It might be in the form of not the entire site being shown,
menus not showing or sections disappearing inside the iframe.

A work-around is to use the web-rotate client, see above.
