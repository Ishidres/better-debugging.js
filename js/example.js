const BetterDebugging = require('./better-debugging.js');
const debug = new BetterDebugging({
  archiveFolder: '../archive/',
  debugEnabled: true,
  minPriority: 0,
  hideTokens: false,
  spoofURLs: true
});

// We add console.log() to be able to see the differences in console more clearly

console.log();

debug.log("Hello World!");

console.log();

debug.log("This is a success! :)", "s");

console.log();

debug.log("This is a warning?", "w");

console.log();

debug.log("This is an error!", "e");

console.log();

debug.log("This error even has priority! Go check the archive folder: " + debug.archive, "e", 4);

console.log();

debug.log("And this is for debugging."
+ "\nYou can only see it, because you enabled 'debugEnabled' in the options.", "d");

console.log();

debug.log("This URL will be spoofed if you enabled so in the options:"
+ "\nhttps://www.youtube.com/watch?v=VvpWQkbyW2A");

console.log();

debug.log("Also, the token will be hidden here if enabled in the options:"
+ "\nhttps://example.org/api?token=thisIsAToken"
+ "\nBut if you enable 'spoofURLs' the token won't be visible anyway because of the spoofed url.");

console.log();