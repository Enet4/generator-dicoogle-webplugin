const Generator = require('yeoman-generator');
const capitalize = require('capitalize');

const PLUGIN_TYPES = ['menu', 'search', 'query', 'result', 'result-options', 'result-batch', 'settings' ];

module.exports = class WebpluginGenerator extends Generator {

  constructor(args, opts) {
    super(args, opts)

    this.helper = {
      cleanAppname(appname) {
        return appname.replace(/\s/g, '-');
      },
      makeCaption(appname) {
        if (appname.indexOf("dicoogle-") === 0) {
            appname = appname.substr(9);
        }
        if (appname.indexOf("-plugin") === appname.length - 7) {
            appname = appname.substr(0, appname.length - 7);
        }
        return capitalize.words(appname.replace(/\\-+/g, ' '));
      }
    };
  }

  initializing() {
    this.author = {};
    this.appname = this.helper.cleanAppname(this.appname);
    this.devDependencies = [
        'webpack@^2.2.0', 'babel-loader@^6.2.10',
        'babel-core@^6.22.1', 'babel-preset-es2015@^6.22.0'
        ];
  }

  prompting() {
      return this.prompt([
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
          name: 'slotId',
          message: 'What type of plugin (slot ID)?',
          choices: PLUGIN_TYPES,
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
      ]).then((answers) => {
        this.author = {
            name: answers.authorName,
            email: answers.authorEmail
        }
        this.data = {
            appname: this.helper.cleanAppname(answers.appname),
            description: answers.description,
            license: answers.license,
            dicoogle: {
                slotId: answers.slotId,
                caption: answers.caption
            },
            author: {
                name: answers.authorName,
                email: answers.authorEmail,
                github: answers.authorGithub
            }
        }
      });
  }

  writing() {
    const copyStatics = () => {
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('_babelrc'), this.destinationPath('.babelrc'));
      this.fs.copy(this.templatePath('_webpack.config.js'), this.destinationPath('webpack.config.js'));
    }
    const copyTemplates = () => {
      this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), this.data);
      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.data);
      this.fs.copyTpl(this.templatePath('src/_index.js'), this.destinationPath('src/index.js'), this.data);
    }
    copyStatics();
    copyTemplates();
  }

  install() {
    this.npmInstall(this.devDependencies, {'saveDev': true});
  }

  end() {
    console.log("The web plugin is ready for development!");
  }

};
