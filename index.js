'use strict'

var through2 = require('through2');
var gutil = require('gulp-util');
var glob = require('glob');
var fs = require('fs');
var async = require('async');
var path = require('path');
var assign = require('object-assign');

var PLUGIN_NAME = 'gulp-json-data';

module.exports = function (opts) {
  return through2.obj( function (file, enc, cb) {

    var defaultOptions = {
      jsonPath: '*.json',
      keyName: '',
      extName: '.html',
      separetor: '_',
      sepKey: ''
    };
    var options = assign({}, defaultOptions, opts);

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if (options.jsonPath == null) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'json path is required'));
      return cb();
    }

    if (typeof options.keyName !== "string" || options.keyName === '') {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Key name must be specified'));
      return cb();
    }

    var that = this;
    var files = glob.sync(options.jsonPath);
    var keys = [];

    async.each(files, function (aFile) {
      var data = fs.readFileSync(aFile, 'utf-8');
      var json = JSON.parse(data);
      if (typeof json[options.keyName] === 'string') {
        keys.push(json[options.keyName]);
      } else if (Array.isArray(json[options.keyName])) {
        keys = json[options.keyName];
      } else {
        keys = json[options.keyName];
      }
    });

    async.each(keys, function (key, callback) {

      var newFile = new gutil.File({
        path: file.path,
        base: file.base,
        cwd: file.cwd,
        contents: file.contents
      });

      if (options.sepKey === '' || options.sepKey == null) {
        newFile.basename = key + options.extName;
      } else {
        newFile.basename = options.sepKey + options.separetor + key + options.extName
      }
      that.push(newFile);

    });

    cb();

  });
};