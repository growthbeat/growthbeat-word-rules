"use strict"

var gulp = require("gulp");
var path = require("path");
var fs = require("fs");
var concat = require('gulp-concat');
var parser = require("wzeditor-word-rules-parser");
var es = require("event-stream");
var prh = require("prh");

gulp.task("build", function (taskCallback) {
    var allContents = [];
    gulp.src("dict/*.yml")
        .pipe(es.map(function (file, cb) {
            var config = prh.fromYAMLFilePath(file.path);
            var results = config.rules.map(function (rule) {
                var result = {
                    "pattern": rule.pattern.source,
                    "expected": rule.expected
                };
                var flag = rule.pattern.flags || rule.pattern.toString().match(/[gimuy]*$/)[0];
                if (flag != null) {
                    var compressFlag = flag.replace(/[gm]*/g, "");
                    if (compressFlag) {
                        result["flag"] = compressFlag;
                    }
                }
                return result;
            });
            allContents = allContents.concat(results);
            cb(null, results);
        }))
        .on("end", function () {
            fs.writeFile("all.json", JSON.stringify(allContents), taskCallback);
        });
});

gulp.task('default', ['build']);