'use strict';

var assert = require('assert');
var gutil = require('gulp-util');
var fs = require('fs');
var jsondata = require('../index');

describe('gulp-json-data', function () {

  it('should read json file', function (done) {

    var that = this;
    var once = false;
    var stream = jsondata({
      jsonPath: './test/fixture/*.json',
      keyName: 'data',
      extName: '.html',
      separator: '_',
      sepKey: 'test'
    });
    var html = fs.readFileSync('./test/src/index.html', 'utf-8');

    stream.on('data', function (file) {

      if (once === false) {
        once = true;
        var extname = 'test_test.jade';
        var expect = 'test_test.jade';
        assert.equal(extname, expect);
        done();
      }

    });

    stream.write(new gutil.File({
      contents: new Buffer(html)
    }));

    stream.end();
  });

});