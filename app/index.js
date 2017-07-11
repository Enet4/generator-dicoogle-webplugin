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
    this.devDependencies = [ 'webpack@^2.2.0' ];
    this.babelPresets = ['es2015', 'es2016'];
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
        /* {
          type: 'list',
          name: 'componentType',
          message: 'Would you like to write a bare DOM plugin or a React component?',
          choices: [
            {name: 'Bare DOM', value: 'dom'},
            {name: 'React component', value: 'react'}
          ],
          default: 'dom'
        }, */
        {
          type: 'list',
          name: 'projectType',
          message: 'Would you like to use JavaScript with Babel, or TypeScript?',
          choices: [
            {name: 'ECMAScript2016 with Babel', value: 'babel'},
            {name: 'TypeScript', value: 'typescript'}
          ],
          default: 'babel'
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
        // react components are not supported yet
        const componentType = 'dom';

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
            },
            componentType,
            projectType: answers.projectType
        }
        this.componentType = componentType;
        this.projectType = answers.projectType;

        if (this.projectType === 'typescript') {
          this.devDependencies.push(
            'typescript@~2.3.0',
            'ts-loader@^2.2.2');
        } else if (this.projectType === 'babel') {
            this.devDependencies.push(
              'babel-loader@^7.1.1',
              'babel-core@^6.24.1',
              'babel-preset-es2015@^6.24.1',
              'babel-preset-es2016@^6.24.1'
            );
        }

        if (this.componentType === 'react') {
          if (this.projectType === 'babel') {
            this.data.entry = './src/index.jsx';
            this.devDependencies.push('babel-preset-react@^6.24.1');

            this.babelPresets.push('react');
          } else if (this.projectType === 'typescript') {
            this.data.entry = './src/index.tsx';
          }
        } else if (this.componentType === 'dom') {
          if (this.projectType === 'babel') {
            this.data.entry = './src/index.js';
          } else {
            this.data.entry = './src/index.ts';
          }
        }
        this.data.babelPresets = this.babelPresets;
      });
  }

  writing() {
    const copyStatics = () => {
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
      //this.fs.copy(this.templatePath('_babelrc'), this.destinationPath('.babelrc'));

      if (this.projectType === 'typescript') {
        this.fs.copy(this.templatePath('src/_webcore.ts'), this.destinationPath('src/webcore.ts'));
        this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
      }
    };
    const copyTemplates = () => {
      this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), this.data);
      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.data);

      if (this.projectType === 'babel') {
        // ES2016 project

        this.fs.copyTpl(this.templatePath('_babel_webpack.config.js'), this.destinationPath('webpack.config.js'), this.data);

        if (this.componentType === 'dom') {
          this.fs.copyTpl(this.templatePath('src/_index.js'), this.destinationPath(this.data.entry), this.data);
        } else if (this.componentType === 'react') {
          this.fs.copyTpl(this.templatePath('src/_index.jsx'), this.destinationPath(this.data.entry), this.data);
        } else {
          throw 'unsupported component type';
        }

      } else if (this.projectType === 'typescript') {
        // TypeScript project

        this.fs.copyTpl(this.templatePath('_ts_webpack.config.js'), this.destinationPath('webpack.config.js'), this.data);

        if (this.componentType === 'dom') {
          this.fs.copyTpl(this.templatePath('src/_index.ts'), this.destinationPath(this.data.entry), this.data);
        } else if (this.componentType === 'react') {
          this.fs.copyTpl(this.templatePath('src/_index.tsx'), this.destinationPath(this.data.entry), this.data);
        } else {
          throw 'unsupported component type';
        }
      } else {
        throw 'unsupported project type';
      }
    };
    copyStatics();
    copyTemplates();
  }

  install() {
    this.npmInstall(this.devDependencies, {'saveDev': true});
    if (this.projectType === 'typescript') {
      this.npmInstall([
        'dicoogle-client@^4.1.1',
        '@types/react@^0.14.0',
        '@types/react-dom@^0.14.0'
      ], {'save': true});
    }
  }

  end() {
    console.log("The web plugin is ready for development!");
  }

};
