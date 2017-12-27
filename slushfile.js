'use strict';

const gulp = require('gulp');
const template = require('gulp-template');
const conflict = require('gulp-conflict');
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
          'babel-eslint',
          'eslint-plugin-import',
          'eslint-plugin-jsx-a11y',
          'eslint-plugin-react',
          'eslint-config-airbnb',
          'flow-bin',
          'babel-preset-flow',
          'babel-preset-react'
        ];

        const installOptions = {
          saveDev: true,
          cache: true
        };

        npmInstallPackage(devDeps, installOptions, done);
      });
  });
});