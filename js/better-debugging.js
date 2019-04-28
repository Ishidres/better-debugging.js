const fs = require('fs');

class BetterDebugging {

  constructor (options) {
    if (!options) options = {};

    this.archive = options.archiveFolder;
    this.debugging = options.debugEnabled;
    this.minPriority = options.minPriority;
    this.hideTokens = options.hideTokens;
    this.spoofURLs = options.spoofURLs;

    if (!this.archive) this.archive = './archive';
    if (!this.debugging) this.debugEnabled = false;
    if (!this.minPriority) this.minPriority = 0;
    if (!this.hideTokens) this.hideTokens = false;
    if (!this.spoofURLs) this.spoofURLs = false;
    
    // './archive/' -> './archive'
    if (this.archive[this.archive.length-1] === '/')
      this.archive = this.archive.slice(0, this.archive.length-1);

    if (!fs.existsSync(__dirname + '/' + this.archive))
      fs.mkdirSync(__dirname + '/' + this.archive);

    if (!fs.existsSync(__dirname + '/' + this.archive + '/infos'))
      fs.mkdirSync(__dirname + '/' + this.archive + '/infos');
   
    if (!fs.existsSync(__dirname + '/' + this.archive + '/successes'))
      fs.mkdirSync(__dirname + '/' + this.archive + '/successes');
    
    if (!fs.existsSync(__dirname + '/' + this.archive + '/warnings'))
      fs.mkdirSync(__dirname + '/' + this.archive + '/warnings');
    
    if (!fs.existsSync(__dirname + '/' + this.archive + '/errors'))
      fs.mkdirSync(__dirname + '/' + this.archive + '/errors');
    
    if (!fs.existsSync(__dirname + '/' + this.archive + '/debugs'))
      fs.mkdirSync(__dirname + '/' + this.archive + '/debugs');
  }

  log (message, type, priority) {
    var colorType = "";
    var resetType = "\x1b[0m";

    var used_mem = (((process.memoryUsage().heapTotal) / 1024) / 1024);
    
    if (used_mem >= 10)
      used_mem = used_mem.toFixed(0);

    if (used_mem >= 1 && used_mem < 10)
      used_mem = used_mem.toFixed(1);

    if (used_mem >= 0 && used_mem < 1)
      used_mem = used_mem.toFixed(2);

    // if type and priority got mixed up
    if (isNaN(type) === false && isNaN(priority)) {
      var newPriority = type;
      type = priority;
      priority = newPriority;
    }

    if (this.spoofURLs) {
      // Search the debug message for possible url and hide it
      message = hideURLs(message, ' ');

      // Do the same thing with possible line breaks
      message = hideURLs(message, '\n');
    }

    // No need to search for tokens if the url is hidden already
    if (this.hideTokens && this.spoofURLs !== true) {
      // Search the debug message for possible tokens and hide them
      message = hideTokens(message, ' ', '?');
      message = hideTokens(message, ' ', '&');
      message = hideTokens(message, '\n', '?');
      message = hideTokens(message, '\n', '&');
    }

    if (type === "i") {var type_ = "[INFO]"; resetType = "";}
    if (type === "s") {var type_ = "[SUCCESS]"; colorType = "\x1b[1m\x1b[32m";}
    if (type === "w") {var type_ = "[WARNING]"; colorType = "\x1b[1m\x1b[33m";}
    if (type === "e") {var type_ = "[ERROR]"; colorType = "\x1b[1m\x1b[31m";}
    if (type === "d") {var type_ = "[DEBUG]"; colorType = "\x1b[1m\x1b[36m";}

    if (priority === undefined) {priority = 0;}
    if (type === undefined) {type = "i"; var type_ = "[INFO]"; resetType = "";}

    if (type === "d" && this.debugging !== true)
      return;

    // Don't log things with too low priority
    if (priority >= this.minPriority) {
      console.log(
        colorType + type_ + resetType
        + " [" + used_mem + " MB][" + (new Date().toISOString()) + "]:"
        + colorType, message, resetType
      );
    }
    
    var archiveDebug = "[" + used_mem + " MB][" + (new Date().toISOString()) + "]: " + message;
    var dateToday = new Date().toLocaleDateString();

    if (type === "i")
      fs.appendFileSync(this.archive + '/infos/' + dateToday + '_(' + priority + ')' + '.txt', "[" + new Date().toISOString() + "]: " + archiveDebug + "\n");    

    if (type === "s")
      fs.appendFileSync(this.archive + '/successes/' + dateToday + '_(' + priority + ')' + '.txt', "[" + new Date().toISOString() + "]: " + archiveDebug + "\n");          

    if (type === "w")
      fs.appendFileSync(this.archive + '/warnings/' + dateToday + '_(' + priority + ')' + '.txt', "[" + new Date().toISOString() + "]: " + archiveDebug + "\n");    

    if (type === "e")
      fs.appendFileSync(this.archive + '/errors/' + dateToday + '_(' + priority + ')' + '.txt', "[" + new Date().toISOString() + "]: " + archiveDebug + "\n");    

    if (type === "d")
      fs.appendFileSync(this.archive + '/debugs/' + dateToday + '_(' + priority + ')' + '.txt', "[" + new Date().toISOString() + "]: " + archiveDebug + "\n");    
  }

}

// Source: https://stackoverflow.com/a/5717133/7941073
function validURL (str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function hideURLs (message, splitting) {
  var words = message.split(splitting);

  for (var w=0; w<words.length; w++) {
    if (words[w].startsWith('http://') === false && words[w].startsWith('https://') === false) continue;

    // Remove 'http(s)://'
    if (words[w].startsWith('http://'))
      words[w] = words[w].split('http://')[1];

    if (words[w].startsWith('https://'))
      words[w] = words[w].split('https://')[1];

    // Remove 'www.'
    if (words[w].startsWith('www.'))
      words[w] = words[w].split('www.')[1];

    // Limit to up to 1 path behind domain and add last 3 chars of link
    var newSplitWord = words[w].split('/')[0] + '/' + words[w].split('/')[1].substr(0, 5);
    newSplitWord = newSplitWord + '...' + words[w].substr(words[w].length - 3);

    words[w] = newSplitWord;
  }

  return words.join(splitting);
}

function hideTokens (message, splitting, querySplitting) {
  var words = message.split(splitting);

  for (var w=0; w<words.length; w++) {
    if (validURL(words[w])) {
      var queries = words[w].split(querySplitting);

      for (var q=0; q<queries.length; q++) {
        if (queries[q].startsWith('access_token'))
          queries[q] = 'access_token=TOKEN';

        if (queries[q].startsWith('token'))
          queries[q] = 'token=TOKEN';
      }
      
      words[w] = queries.join(querySplitting);
    }
  }

  return words.join(splitting);
}

module.exports = BetterDebugging;