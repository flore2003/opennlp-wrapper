var mocha = require("mocha");
var should = require("should");
var path = require("path");
var async = require("async");

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

    describe("#_initializeSentenceDetector", function() {

        it("should load the sentence detector models and initialize the OpenNLP sentence detector module", function() {
            opennlp._initializeSentenceDetector();
            opennlp.javaRefs.should.have.property("SentenceModel");
            opennlp.javaRefs.should.have.property("SentenceDetectorME");
            opennlp.modules.should.have.property("sentenceDetector");
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

        it("should tokenize multiple inputs without reloading the models", function(done) {
            var inputs = [
                "This is a sample text!",
                "Another sample to test the tokenizer",
                "Yet another test sentence for testing purposes"
            ];

            async.mapSeries(inputs, function(input, done) {
                opennlp.tokenize(input, done);
            }, function(err, results) {
                if(err) return done(err);
                done();
            });

        });

    });

    describe("#detectSentences", function() {

        it("should tokenize the input using the OpenNLP tokenizer module", function(done) {
            var input = "This is sentence one. This is sentence two!";
            opennlp.detectSentences(input, function(err, result) {
                if(err) return done(err);
                result.should.eql(["This is sentence one.", "This is sentence two!"]);
                done();
            });
            
        });

    });

});