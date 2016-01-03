var generators = require('yeoman-generator');
var capitalize = require('capitalize');

module.exports = generators.Base.extend({
  helper: {
    cleanAppname: function(appname) {
      return appname.replace(/\s/g, '-');
    },
    makeCaption: function(appname) {
      if (appname.indexOf("dicoogle-") === 0) {
          appname = appname.substr(9);
      }
      if (appname.indexOf("-plugin") === appname.length - 7) {
          appname = appname.substr(0, appname.length - 7);
      }
      return capitalize.words(appname.replace(/\\-+/g, ' '));
    }
  },

  initializing: function() {
    this.author = {};
    this.appname = this.helper.cleanAppname(this.appname);
    this.devDependencies = [
        "babel-cli", "babel-preset-es2015"
        ];
  },

  prompting: function() {
      var done = this.async();
      
      this.prompt([
        {
          type: 'input',
          name: 'appname',
          message: 'Enter the project name.',
          default: this.appname
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter the description of your project.'
        },
        {
          type: 'list',
          name: 'slot-id',
          message: 'What type of plugin (slot ID)?',
          choices: ['menu', 'search', 'query', 'result', 'settings' ],
          default: 'menu'
        },
        {
          type: 'input',
          name: 'caption',
          message: 'Enter a caption for your plugin.',
          default: this.helper.makeCaption(this.appname)
        },
        {
          type: 'input',
          name: 'license',
          message: 'Enter a license for this project.',
          default: 'MIT'
        },
        {
          type: 'input',
          name: 'authorName',
          message: 'Enter your name.',
          store: true
        },
        {
          type: 'input',
          name: 'authorEmail',
          message: 'Enter your e-mail address.',
          store: true
        },
        {
          type: 'input',
          name: 'authorGithub',
          message: 'Enter your Github User name.',
          store: true
        }
      ], function(answers) {
        this.author = {
            name: answers.authorName,
            email: answers.authorEmail
        }
        this.data = {
            appname: this.helper.cleanAppname(answers.appname),
            description: answers.description,
            license: answers.license,
            dicoogle: {
                slotId: answers['slot-id'],
                caption: answers.caption
            },
            author: {
                name: answers.authorName,
                email: answers.authorEmail,
                github: answers.authorGithub
            }
        };
        done();
      }.bind(this));
  },

  configuring: {
  },

  default: {
  },

  writing: {
    copyStatics: function() {
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('_babelrc'), this.destinationPath('.babelrc'));
    },
    
    copyTemplates: function() {
      this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), this.data);
      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.data);
      this.fs.copyTpl(this.templatePath('src/_index.js'), this.destinationPath('src/index.js'), this.data);
    }
  },

  conflicts: {
  },

  install: function() {
        this.npmInstall(this.devDependencies, {'saveDev': true});
  },

  end: {
  }
});
