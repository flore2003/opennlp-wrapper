/**
 * OpenNLP for fun and profit
 * @author Florian Reifschneider <florian@rocketloop.de>
 */

var java = require('java');

var OpenNLP = function(options) {
    this.options = options;
    this._initialize(options);
};

OpenNLP.prototype._initialize = function(options) {
    this.models = options.models;
    java.classpath.push(options.jarPath);
    this.javaRefs = {
        "FileInputStream": java.import("java.io.FileInputStream")
    };
    this.modules = {};
};

OpenNLP.prototype._initializeTokenizer = function() {
    this._tokenizerQueue = [];

    this.javaRefs["TokenizerModel"] =  java.import('opennlp.tools.tokenize.TokenizerModel');
    this.javaRefs["TokenizerME"] = java.import('opennlp.tools.tokenize.TokenizerME');

    var fis = new this.javaRefs.FileInputStream(this.models.tokenizer);
    var model = new this.javaRefs.TokenizerModel(fis);
    var tokenizer = new this.javaRefs.TokenizerME(model);

    this.modules.tokenizer = tokenizer;
};

OpenNLP.prototype._initializeSentenceDetector = function() {
    this._sentenceDetectorQueue = [];

    this.javaRefs["SentenceModel"] =  java.import('opennlp.tools.sentdetect.SentenceModel');
    this.javaRefs["SentenceDetectorME"] = java.import('opennlp.tools.sentdetect.SentenceDetectorME');

    var fis = new this.javaRefs.FileInputStream(this.models.sentenceDetector);
    var model = new this.javaRefs.SentenceModel(fis);
    var sentenceDetector = new this.javaRefs.SentenceDetectorME(model);

    this.modules.sentenceDetector = sentenceDetector;
};

OpenNLP.prototype.tokenize = function(input, callback) {
    if(this._tokenizing) { // semaphore
        this._tokenizerQueue.push({
            "input": input,
            "callback": callback
        });
    }
    else {
        this._tokenizing = true;
        if(!this.modules.tokenizer) {
            this._initializeTokenizer();
        }
        this.modules.tokenizer.tokenize(input, function(err, result) {
            callback(err, result);
            this._tokenizing = false;
            var next = this._tokenizerQueue.shift();
            if(next) {
                this.tokenize(next.input, next.callback);
            }
        }.bind(this));
    }
};

OpenNLP.prototype.detectSentences = function(input, callback) {
    if(this._detectingSentence) { // semaphore
        this._sentenceDetectorQueue.push({
            "input": input,
            "callback": callback
        });
    }
    else {
        this._detectingSentence = true;
        if(!this.modules.sentenceDetector) {
            this._initializeSentenceDetector();
        }
        this.modules.sentenceDetector.sentDetect(input, function(err, result) {
            callback(err, result);
            this._detectingSentence = false;
            var next = this._sentenceDetectorQueue.shift();
            if(next) {
                this.detectSentences(next.input, next.callback);
            }
        }.bind(this));
    }
};

module.exports = OpenNLP;