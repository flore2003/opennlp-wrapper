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
    console.log("_initialize");
    this.javaRefs = {
        "FileInputStream": java.import("java.io.FileInputStream")
    };
    this.modules = {};
};

OpenNLP.prototype._initializeTokenizer = function() {
    this.javaRefs["TokenizerModel"] =  java.import('opennlp.tools.tokenize.TokenizerModel');
    this.javaRefs["TokenizerME"] = java.import('opennlp.tools.tokenize.TokenizerME');

    var fis = new this.javaRefs.FileInputStream(this.models.tokenizer);
    var model = new this.javaRefs.TokenizerModel(fis);
    var tokenizer = new this.javaRefs.TokenizerME(model);

    this.modules.tokenizer = tokenizer;
};

OpenNLP.prototype.tokenize = function(input, callback) {
    if(!this.modules.tokenizer) {
        this._initializeTokenizer();
    }
    this.modules.tokenizer.tokenize(input, callback);
};

module.exports = OpenNLP;