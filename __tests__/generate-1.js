const path = require('path');
const helpers = require('yeoman-test');
const child_process = require('child_process');

describe('generator test 1: menu webplugin project in TypeScript', () => {
    /** @type {helpers.RunResult}  */
    let runResult;

    beforeEach(async () => {
        runResult = await helpers
            .create(path.join(__dirname, '..'))
            .withPrompts({
                appname: "plugin1",
                description: "A test plugin (#1)",
                slotId: "menu",
                caption: "Test1",
                minimumVersion: "3.1.0",
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
            name: "plugin1",
            description: "A test plugin (#1)",
            license: "MIT",
            scripts: {
                "build": /.+/,
            },
            dicoogle: {
                "slot-id": "menu",
                "caption": "Test1",
                "module-file": "module.js"
            },
            devDependencies: {
                webpack: /.+/,
                // only Dicoogle 3.1.0 uses dicoogle client v5
                "dicoogle-client": /\^5/,
            }
        });

        // has source files and build files
        runResult.assertFile([
            'src/index.ts',
            'webpack.common.js',
            'webpack.dev.js',
            'webpack.prod.js',
            'tsconfig.json',
            '.gitignore',
            'README.md',
        ]);

        runResult.assertFileContent('src/index.ts', 'export default class MyPlugin');

        // force running npm install on target directory
        child_process.execSync('npm install --no-audit', {cwd: runResult.cwd});

        // has the output file module.js via `prepare`
        runResult.assertFileContent('module.js', 'module.exports');
    });
});
