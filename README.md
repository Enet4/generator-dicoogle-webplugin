# generator-dicoogle-webplugin [![npm version](https://badge.fury.io/js/generator-dicoogle-webplugin.svg)](https://badge.fury.io/js/generator-dicoogle-webplugin)
> A Yeoman generator for Dicoogle web UI plugin projects.

Since version 2.1.0 of [Dicoogle](https://github.com/bioinformatics-ua/dicoogle), the user interface can be extended with plugins that are dynamically loaded into the web page. Please see the [Web UI Plugins section of the Dicoogle Learning Pack](https://bioinformatics-ua.github.io/dicoogle-learning-pack/docs/webplugins/) and the [Dicoogle Webcore Readme](https://github.com/bioinformatics-ua/dicoogle/tree/master/webcore#creating-plugins) for more information on how to create your own plugins.

## Installation
First make sure that yeoman is globally installed. If not:

    npm install -g yo

Then, install the generator (also globally):

    npm install -g generator-dicoogle-webplugin

## Usage
Create a directory for the web UI plugin project and run the generator on it:

    mkdir webplugin-project # or your directory name of choice
    cd webplugin-project
    yo dicoogle-webplugin

Then simply follow the instructions. The generated project will contain a README file with building and deployment instructions.

## License

MIT
