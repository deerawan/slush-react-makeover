'use strict';

const gulp = require('gulp');
const template = require('gulp-template');
const conflict = require('gulp-conflict');
const jeditor = require('gulp-json-editor');
const inquirer = require('inquirer');
const npmInstallPackage = require('npm-install-package');

gulp.task('default', function (done) {
    const templates = [
      __dirname + '/templates/**/**'
    ];

    gulp
      .src(templates, { dot: true })
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .on('end', function () {
        const eslintDeps = [
          'eslint',
          'babel-preset-react',
          'babel-eslint',
          'eslint-plugin-react',
          'eslint-plugin-import',
          'eslint-plugin-jsx-a11y',
          'eslint-config-airbnb',
        ];

        // flow
        const flowDeps = [
          'babel-preset-flow',
          'flow-bin'
        ];

        // prettier
        const prettierDeps = [
          'prettier-eslint',
          'eslint-config-prettier'
        ];

        // husky
        const huskyDeps = [
          'husky',
          'lint-staged'
        ];

        const devDeps = [
          ...eslintDeps,
          ...flowDeps,
          ...prettierDeps,
          ...huskyDeps
        ];

        const installOptions = {
          saveDev: true,
          cache: true
        };

        npmInstallPackage(devDeps, installOptions, done);
      });

    // adding some commands
    gulp.src('./package.json')
      .pipe(jeditor(function(json) {
        json.scripts = {
          ...json.scripts,
          'flow:start': 'flow start',
          'flow:stop': 'flow stop',
          'flow:status': 'flow status',
          'flow:coverage': 'flow coverage',
          'precommit': 'lint-staged'
        }
        json['lint-staged'] = {
          "*.{js,jsx,json,css,md}": ["prettier --write", "git add"]
        }
        return json;
      }))
      .pipe(gulp.dest("."));
});