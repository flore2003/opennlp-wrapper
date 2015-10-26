var mocha = require("mocha");
var should = require("should");
var path = require("path");

var OpenNLP = require("../lib/opennlp");

describe("OpenNLP", function() {

    var opennlp;

    before(function() {
        opennlp = new OpenNLP({
            "models": {
                "posTagger": path.join(__dirname, '../opennlp/en-pos-maxent.bin'),
                "tokenizer": path.join(__dirname, '../opennlp/en-token.bin'),
                "sentenceDetector": path.join(__dirname, '../opennlp/en-sent.bin')
            },
            "jarPath": path.join(__dirname, '../opennlp/opennlp-tools-1.6.0.jar')
        });
    });

    describe("#constructor", function() {

        it("should initialize the OpenNLP wrapper", function() {
            opennlp.should.have.property("models");
            opennlp.should.have.property("javaRefs");
            opennlp.should.have.property("modules");
        });

    });

    describe("#_initializeTokenizer", function() {

        it("should load the tokenizer models and initialize the OpenNLP tokenizer module", function() {
            opennlp._initializeTokenizer();
            opennlp.javaRefs.should.have.property("TokenizerModel");
            opennlp.javaRefs.should.have.property("TokenizerME");
            opennlp.modules.should.have.property("tokenizer");
        });

    });

    describe("#tokenize", function() {

        it("should tokenize the input using the OpenNLP tokenizer module", function(done) {
            var input = "This is a sample text!";
            opennlp.tokenize(input, function(err, result) {
                if(err) return done(err);
                result.should.be.eql(['This', 'is', 'a', 'sample', 'text', '!']);
                done();
            });
            
        });

    });

});