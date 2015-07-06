#!/usr/bin/env node

var inquirer = require('inquirer');
var Promise = require('bluebird');
var brightness = Promise.promisifyAll(require('brightness'));

var value = null;

brightness.getAsync().then(function(data) {
	value = data;
	return brightness.setAsync(value);
}).then(function() {
	var choices = [];
  for (var i = 0 ; i < 10 ; i++) {
    choices.push(Math.round((i + 1) * 0.1 * 10) / 10 + '');
  }

  var q = function() {
    inquirer.prompt({
      type: 'list',
      name: 'a',
      message: 'Set brightness',
      default: value * 10 - 1,
      choices: choices
    }, function(answers) {
      value = parseFloat(answers.a);

      brightness.set(value, function (err) {
        if (err) {
          console.log(err);
          process.exit(1);
        }
      });

      q();
    });
  };

  q();
}).catch(function(e) {
	console.log(e.message);
	process.exit(1);
});

