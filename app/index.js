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
    this.devDependencies = [ 'webpack@^3.8.1', 'webpack-merge@^4.1.1', 'babel-minify-webpack-plugin@^0.2.0'];
    this.babelPresets = [['@babel/env', {
      targets: {
        browsers: [
          "> 1%",
          "last 2 versions"
        ]
      }
    }]];
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
            {name: 'ECMAScript2016+ with Babel', value: 'babel'},
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
            // cannot upgrade TypeScript further due to React type definitions
            // (see issue DefinitelyTyped/DefinitelyTyped#17578)
            'typescript@~2.3.1',
            'ts-loader@^2.2.2');
        } else if (this.projectType === 'babel') {
            this.devDependencies.push(
              'babel-loader@^8.0.0-beta.0',
              '@babel/core@^7.0.0-beta.31',
              '@babel/preset-env@^7.0.0-beta.31'
            );
        }

        if (this.componentType === 'react') {
          if (this.projectType === 'babel') {
            this.data.entry = './src/index.jsx';
            this.devDependencies.push('@babel/preset-react@^7.0.0-beta.31');

            this.babelPresets.push('@babel/react');
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

      if (this.projectType === 'typescript') {
        this.fs.copy(this.templatePath('src/_webcore.ts'), this.destinationPath('src/webcore.ts'));
        this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
      }
    };
    const copyTemplates = () => {
      this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), this.data);
      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.data);
      this.fs.copyTpl(this.templatePath('_webpack.dev.js'), this.destinationPath('webpack.dev.js'), this.data);
      this.fs.copyTpl(this.templatePath('_webpack.prod.js'), this.destinationPath('webpack.prod.js'), this.data);
      
      if (this.projectType === 'babel') {
        // ES2016 project

        this.fs.copyTpl(this.templatePath('_babel_webpack.common.js'), this.destinationPath('webpack.common.js'), this.data);

        let indexFile;
        if (this.componentType === 'dom') {
          indexFile = 'src/_index.js';
        } else if (this.componentType === 'react') {
          indexFile = 'src/_index.jsx';
        } else {
          throw 'unsupported component type';
        }
        this.fs.copyTpl(this.templatePath(indexFile), this.destinationPath(this.data.entry), this.data);

      } else if (this.projectType === 'typescript') {
        // TypeScript project

        this.fs.copyTpl(this.templatePath('_ts_webpack.common.js'), this.destinationPath('webpack.common.js'), this.data);

        let indexFile;
        if (this.componentType === 'dom') {
          indexFile = 'src/_index.ts';
        } else if (this.componentType === 'react') {
          indexFile = 'src/_index.tsx';
        } else {
          throw 'unsupported component type';
        }
        this.fs.copyTpl(this.templatePath(indexFile), this.destinationPath(this.data.entry), this.data);
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
