![Logo](http://ishidres.eu/cdn/bd-js-logo.png)
# better-debugging.js
***An advanced but still easy to use debugging tool.***

#### Features:
- fast and easy-to-use
- automatic log saving and archiving
- priority logging
- url and/or token hiding

## Usage
```js
const BetterDebugging = require('better-debugging.js');
const debug = new BetterDebugging();

debug.log("Hello World!");
// [INFO] [9.0 MB][2019-04-28T12:49:34.251Z]: Hello World!
// [TYPE] [Memory Usage][DATE AND TIME]: MESSAGE
```

## Example Usage
```js
const BetterDebugging = require('better-debugging.js');
const debug = new BetterDebugging({
  archiveFolder: '../archive/',
  debugEnabled: true,
  minPriority: 0,
  hideTokens: false,
  spoofURLs: true
});

debug.log("This is a success! :)", "s");
debug.log("This is a warning?", "w");
debug.log("This is an error!", "e");
debug.log("Error with priority 4.", "e", 4);
debug.log("Only logged if 'debugEnabled' is enabled.", "d");
debug.log("This URL will be spoofed if you enabled so in the options:"
+ "\nhttps://www.youtube.com/watch?v=VvpWQkbyW2A");
debug.log("Also, the token will be hidden here if enabled in the options:"
+ "\nhttps://example.org/api?token=thisIsAToken");
```
![Screenshot](http://ishidres.eu/cdn/bd-js-screenshot.png)

## Docs
#### Object Declaration
```js
const debug = new BetterDebugging(options);
```
options (`object`):
```js
{
  archiveFolder (String): Folder to where logs should be saved (Default: './archive'),
  debugEnabled (Boolean): Wether to log messages with type "Debug",
  minPriority (Integer): Messages with lower priority won't be logged to console, but will still be saved,
  hideTokens (Boolean): Wether to hide possible tokens in URLs,
  spoofURLs (Boolean): Wether to short URLs in logs
}
```

#### Method Calling
```js
debug.log(message, type, priority);
```
message (`string`): The message which will be logged in console.
type (`string`): A different type will change the color and formatting of the logged message.
- "i": Info (Default)
- "s": Success
- "w": Warning
- "e": Error
- "d": Debug

priority (`integer`): Priorities are used to differentiate between saved logs.

#### Saved Logs
Logs are saved to the specific archive folder by this format:
**archive/`type`/`date`_(`priority`).txt**