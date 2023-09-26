const path = require('path');
const helpers = require('yeoman-test');
const child_process = require('child_process');

describe('generator test 3: result-batch webplugin project in TypeScript', () => {
    /** @type {helpers.RunResult}  */
    let runResult;

    beforeEach(async () => {
        runResult = await helpers
            .create(path.join(__dirname, '..'))
            .withPrompts({
                appname: "plugin3",
                description: "A test plugin (#3)",
                slotId: "result-batch",
                caption: "Test3",
                minimumVersion: "3.3.2",
                projectType: "typescript",
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
            name: "plugin3",
            description: "A test plugin (#3)",
            license: "MIT",
            scripts: {
                "build": /.+/,
            },
            dicoogle: {
                "slot-id": "result-batch",
                "caption": "Test3",
                "module-file": "module.js"
            },
            devDependencies: {
                webpack: /.+/,
            }
        });

        // has source files and build files
        // has source files and build files
        runResult.assertFile([
            'src/index.ts',
            'build-package-json.js',
            '.gitignore',
            'README.md',
        ]);

        runResult.assertFileContent('src/index.ts', 'export default class MyPlugin');
        runResult.assertFileContent('src/index.ts', "slot.addEventListener('result-selection-ready', (ev) => {");

        // force running npm install on target directory
        child_process.execSync('npm install --no-audit', {cwd: runResult.cwd});

        // has the output file module.js via `prepare`
        runResult.assertFileContent('dist/module.js', 'module.exports');
        // has the simplified output file package.json
        runResult.assertJsonFileContent('dist/package.json', {
            name: "plugin3",
            description: "A test plugin (#3)",
            license: "MIT",
            dicoogle: {
                "slot-id": "result-batch",
                "caption": "Test3",
                "module-file": "module.js"
            }
        });
    });
});
