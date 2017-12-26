'use strict';

const gulp = require('gulp');
const conflict = require('gulp-conflict');
const template = require('gulp-template');
const rename = require('gulp-rename');
const inquirer = require('inquirer');
const npmInstallPackage = require('npm-install-package');

gulp.task('default', function (done) {
  const prompts = [{
    type: 'confirm',
    name: 'flow',
    message: 'Do you want to use flow?',
    default: true
  }]

  inquirer.prompt(prompts, function (answers) {
    const eslint = answers.eslint;

    const templates = [
      __dirname + '/templates/**/**'
    ]

    gulp
      .src(templates)
      .pipe(rename(function (file) {
        if (file.basename[0] === '@') {
          file.basename = file.basename.slice(1);
        }
      }))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .on('end', function () {
        const devDeps = [
          'eslint',
          'babel-eslint',
          'eslint-plugin-import',
          'eslint-plugin-jsx-a11y',
          'eslint-plugin-react',
          'eslint-config-airbnb'
        ]

        const installOptions = {
          saveDev: true,
          cache: true
        }

        npmInstallPackage(devDeps, installOptions, done);
      });
  });
});