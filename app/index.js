const Generator = require('yeoman-generator');
const capitalize = require('capitalize');
const semver = require('semver');

const PLUGIN_TYPES = ['menu', 'result-options', 'result-batch', 'settings' ];
const EXPERIMENTAL_PLUGIN_TYPES = [...PLUGIN_TYPES, 'search', 'query', 'result' ];

/** Dependencies which are already in Dicoogle webapp
 * and should not be bundled into the web plugin by default.
 */
const EXTERNAL_DEPENDENCIES = [
  'react', 'react-dom', 'dicoogle-client', 'dicoogle-webcore', 'reflux', 'react-bootstrap',
  'react-bootstrap-table', 'react-imageloader', 'react-router', 'react-router-bootstrap'
];

module.exports = class WebpluginGenerator extends Generator {

  constructor(args, opts) {
    super(args, opts)
  
    // Add optional argument for experimental features.
    this.argument('experimental', { type: String, optional: true, default: "" });
  
    this.helper = {
      cleanAppname(appname) {
        return appname.replace(/\s/g, '-');
      },
      makeCaption(appname) {
        appname = this.trimAppname(appname);
        return capitalize.words(appname.replace(/\\-+/g, ' '));
      },
      trimAppname(appname) {
        if (appname.indexOf("dicoogle-") === 0) {
          appname = appname.substr(9);
        }
        if (appname.indexOf("-plugin") === appname.length - 7) {
            appname = appname.substr(0, appname.length - 7);
        }
        return appname;
      }
    };

    this.helper.makeCaption = this.helper.makeCaption.bind(this.helper);
    this.helper.trimAppname = this.helper.trimAppname.bind(this.helper);
  }

  initializing() {
    this.author = {};
    this.appname = this.helper.cleanAppname(this.appname);
    this.devDependencies = ['parcel@^2.7.0'];
  }

  prompting() {
      const questions = [
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
          choices: this.options['experimental'] === 'experimental' ? EXPERIMENTAL_PLUGIN_TYPES : PLUGIN_TYPES,
          default: 'menu'
        },
        {
          type: 'input',
          name: 'caption',
          message: 'Enter a caption for your plugin.',
          default: this.helper.makeCaption(this.appname)
        },
        {
          type: 'list',
          name: 'minimumVersion',
          message: 'Please specify the minimum version of Dicoogle required for this plugin.',
          choices: [
            {name: '3.3.2', value: '3.3.2'},
            {name: '3.1.0', value: '3.1.0'},
            {name: '2.5.0 (legacy)', value: '2.5.0'},
          ],
          default: '3.3.2'
        },
        {
          type: 'list',
          name: 'projectType',
          message: 'Would you like to use plain JavaScript or TypeScript?',
          choices: [
            {name: 'JavaScript', value: 'javascript'},
            {name: 'TypeScript', value: 'typescript'}
          ],
          default: 'javascript'
        }];

      if (this.options['experimental'] === 'experimental') {
        questions.push({
          type: 'list',
          name: 'componentType',
          message: 'Would you like to write a bare DOM plugin or a React component?',
          choices: [
            {name: 'Bare DOM', value: 'dom'},
            {name: 'React component', value: 'react'}
          ],
          default: 'dom'
        });
      }
        
      questions.push({
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
      );

      return this.prompt(questions).then((answers) => {
        const componentType = answers.componentType || 'dom';

        this.author = {
            name: answers.authorName,
            email: answers.authorEmail
        };
        this.data = {
            appname: this.helper.cleanAppname(answers.appname),
            trimmedAppname: this.helper.trimAppname(answers.appname),
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
            projectType: answers.projectType,
            minimumVersion: answers.minimumVersion,
            semver
        };
        this.componentType = componentType;
        this.projectType = answers.projectType;

        if (this.componentType === 'react') {
          if (this.projectType === 'javascript') {
            this.data.entry = 'src/index.jsx';

            this.babelPresets.push('@babel/react');
          } else if (this.projectType === 'typescript') {
            this.data.entry = 'src/index.tsx';
            this.devDependencies.push('@types/react@^0.14.0');
          }
        } else if (this.componentType === 'dom') {
          if (this.projectType === 'javascript') {
            this.data.entry = 'src/index.js';
          } else {
            this.data.entry = 'src/index.ts';
          }
        }
      });
  }

  buildPackageJson() {
    const {
      appname,
      description,
      license,
      author,
      minimumVersion,
      dicoogle,
    } = this.data;

    const source = this.data.entry;

    const pkg = {
      name: appname,
      version: "0.1.0",
      description: description,
      source,
      main: "dist/module.js",
      files: [
        "dist/module.js"
      ],
      scripts: {
        "build": "node build-package-json.js && parcel build --no-source-maps",
        "build-debug": "node build-package-json.js && parcel build --no-optimize",
        "build-watch": "node build-package-json.js && parcel watch",
        "prepare": "npm run build"
      },
      keywords: [
        "dicoogle", "dicoogle-plugin"
      ],
      dicoogle: {
        "slot-id": dicoogle.slotId,
        "module-file": "module.js"
      },
      engines: {
        node: ">= 16"
      },
      targets: {
        main: {
          context: "browser",
          outputFormat: "commonjs",
          isLibrary: false,
          includeNodeModules: {
            "@swc/helpers": true,
          },
          optimize: true,
          sourceMap: {
            inline: true
          },
          engines: {
            browsers: "> 1%, last 2 versions, not dead"
          },
        },
      },
    };

    // external dependencies
    for (const dep of EXTERNAL_DEPENDENCIES) {
      pkg.targets.main.includeNodeModules[dep] = false;
    }

    if (author.name && author.email) {
      pkg.author = author.name + " " + author.email;
    } else if (author.name) {
      pkg.author = author.name;
    }
    if (typeof license === 'string') {
      pkg.license = license;
    }
    
    if (author.github) {
      pkg.repository = {
          "type": "git",
          "url": author.github + "/" + appname,
      };
    }
    if (dicoogle.caption && dicoogle.caption !== '') {
        pkg.dicoogle.caption = dicoogle.caption;
    }

    // dev dependencies
    pkg.devDependencies = {};
    for (const dep of this.devDependencies) {
      let splitPoint = dep.lastIndexOf('@');
      let name = dep.slice(0, splitPoint);
      let req = dep.slice(splitPoint + 1);
      pkg.devDependencies[name] = req;
    }
    if (this.projectType === 'typescript') {
      let dicoogleClientVersion = semver.gte(minimumVersion, '3.1.0') ? '5.1.0' : '^4.1.1';
      pkg.devDependencies['dicoogle-client'] = dicoogleClientVersion;
      if (this.componentType === 'react') {
        pkg.devDependencies['@types/react'] = "^0.14.0";
        pkg.devDependencies['@types/react-dom'] = "^0.14.0";
      }
    }

    return pkg;
  }

  writing() {
    const pkgJson = this.buildPackageJson();
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

    const copyStatics = () => {
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('_build-package-json.js'), this.destinationPath('build-package-json.js'));

      if (this.projectType === 'typescript') {
        this.fs.copy(this.templatePath('src/_webcore.ts'), this.destinationPath('src/webcore.ts'));
        this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
      }
    };
    const copyTemplates = () => {
      this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), this.data);

      if (this.projectType === 'javascript') {
        // JavaScript project

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

  end() {
    console.log("The web plugin is ready for development!");
  }

};
