'use strict';

const gulp = require('gulp');
const template = require('gulp-template');
const conflict = require('gulp-conflict');
const jeditor = require('gulp-json-editor');
const inquirer = require('inquirer');
const npmInstallPackage = require('npm-install-package');

gulp.task('default', function (done) {
  inquirer.prompt(questions).then(answers => {
    const templates = [
      __dirname + '/templates/**/**'
    ];

    gulp
      .src(templates)
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .on('end', function () {
        const devDeps = [
          'eslint',
          'babel-preset-react',
          'babel-preset-flow',
          'flow-bin',
          'babel-eslint',
          'eslint-plugin-import',
          'eslint-plugin-jsx-a11y',
          'eslint-plugin-react',
          'eslint-config-airbnb',
          'prettier-eslint',
          'eslint-config-prettier'
        ];

        const installOptions = {
          saveDev: true,
          cache: true
        };

        npmInstallPackage(devDeps, installOptions, done);
      });

    // adding some flow commands
    gulp.src('./package.json')
      .pipe(jeditor(function(json) {
        json.dependencies['flow:start'] = "flow start";
        json.dependencies['flow:stop'] = "flow stop";
        json.dependencies['flow:status'] = "flow status";
        json.dependencies['flow:coverage'] = "flow coverage";
        return json;
      }))
      .pipe(gulp.dest("."));
  });
});