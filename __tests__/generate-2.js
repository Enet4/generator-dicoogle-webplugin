const path = require('path');
const helpers = require('yeoman-test');
const child_process = require('child_process');

describe('generator test 2: result-options webplugin project in ECMAScript', () => {
    /** @type {helpers.RunResult}  */
    let runResult;

    beforeEach(async () => {
        runResult = await helpers
            .create(path.join(__dirname, '..'))
            .withPrompts({
                appname: "plugin2",
                description: "A test plugin (#2)",
                slotId: "result-options",
                caption: "Test2",
                minimumVersion: "2.5.0",
                projectType: "babel",
                license: "MIT",
                authorName: "John Doe",
                authorEmail: "doe.j@nowhere",
                authorGithub: "",
            })
            .run();
    });
    afterEach(() => {
        if (runResult) {
            runResult.restore();
        }
    });

    it('generates correctly', () => {
        // contains package.json
        runResult.assertJsonFileContent('package.json', {
            name: "plugin2",
            description: "A test plugin (#2)",
            license: "MIT",
            scripts: {
                "build": /.+/,
            },
            dicoogle: {
                "slot-id": "result-options",
                "caption": "Test2",
                "module-file": "module.js"
            },
            devDependencies: {
                webpack: /.+/,
            }
        });

        // has source files and build files
        runResult.assertFile([
            'src/index.js',
            'webpack.common.js',
            'webpack.dev.js',
            'webpack.prod.js',
            '.gitignore',
            'README.md',
        ]);

        runResult.assertFileContent('src/index.js', 'export default class MyPlugin');

        // force running npm install on target directory
        child_process.execSync('npm install --no-audit', {cwd: runResult.cwd});

        // has the output file module.js via `prepare`
        runResult.assertFileContent('module.js', 'module.exports');
    });
});
