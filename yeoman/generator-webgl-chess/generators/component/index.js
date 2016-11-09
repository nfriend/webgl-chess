'use strict';
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const camelCase = require('camelcase');
const upperCamelCase = require('uppercamelcase');
const findRoot = require('find-root');
const path = require('path');

module.exports = yeoman.Base.extend({
  prompting: function () {

    this.log(yosay(
      'Generating a component for webgl-chess!'
    ));

    let prompts = [{
      type: 'input',
      name: 'componentName',
      message: 'What would like to name this component?',
      validate: input => {
        if (!/\S/.test(input)) {
          return 'Name cannot be blank';
        } else if (/\s/.test(input)) {
          return 'Name must not include whitespace';
        } else if (/[A-Z]+/.test(input)) {
          return 'Name must not contain capital letters.  Use dashes for word breaks instead';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
          return 'Name must be JavaScript-friendly (no weird characters)';
        } else if (/^[0-9]/.test(input)) {
          return 'Name cannot start with a number';
        } else {
          return true;
        }
      },
      default: process.cwd().split('\\').pop()
    }, {
      type: 'confirm',
      name: 'shouldCustomize',
      message: 'Would you like to customize this component?',
      default: false
    }, {
      when: response => response.shouldCustomize,
      name: 'directive',
      type: 'confirm',
      message: 'Include a directive?',
      default: true
    }, {
      when: response => response.shouldCustomize,
      name: 'controller',
      type: 'confirm',
      message: 'Include a controller?',
      default: true
    }, {
      when: response => response.shouldCustomize,
      name: 'template',
      type: 'confirm',
      message: 'Include an HTML template?',
      default: true
    }, {
      when: response => response.shouldCustomize,
      name: 'service',
      type: 'confirm',
      message: 'Include an service?',
      default: true
    }, {
      when: response => response.shouldCustomize,
      name: 'stylesheet',
      type: 'confirm',
      message: 'Include a stylesheet?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {

    // we will be editing the contents of index.ts to add
    // in references to our new files 
    let indexTsPath = path.join(findRoot(process.cwd()), 'app/index.ts');
    let indexTs = this.fs.read(indexTsPath);
    let relativeToIndexPath = './' + path.relative(path.join(findRoot(process.cwd()), 'app/'), process.cwd()).replace(/\\/g, '/');

    if (!this.props.shouldCustomize) {
      this.props.directive = this.props.controller = this.props.template = this.props.service = this.props.stylesheet = true;
    }

    this.props.uppercaseName = upperCamelCase(this.props.componentName);
    this.props.lowercaseName = camelCase(this.props.componentName);

    if (this.props.directive) {
      this.fs.copyTpl(
        this.templatePath('directive.ts.template'),
        this.destinationPath(this.props.componentName + '.directive.ts'),
        this.props
      );

      indexTs = addImportStatement(indexTs, this.props.uppercaseName + 'Directive', relativeToIndexPath + '/' + this.props.componentName + '.directive');
      indexTs = addRegistration(indexTs, this.props.uppercaseName + 'Directive', 'directive');
    }

    if (this.props.controller) {
      this.fs.copyTpl(
        this.templatePath('controller.ts.template'),
        this.destinationPath(this.props.componentName + '.controller.ts'),
        this.props
      );

      indexTs = addImportStatement(indexTs, this.props.uppercaseName + 'Controller', relativeToIndexPath + '/' + this.props.componentName + '.controller');
      indexTs = addRegistration(indexTs, this.props.uppercaseName + 'Controller', 'controller');
    }

    if (this.props.service) {
      this.fs.copyTpl(
        this.templatePath('service.ts.template'),
        this.destinationPath(this.props.componentName + '.service.ts'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('service.spec.ts.template'),
        this.destinationPath(this.props.componentName + '.service.spec.ts'),
        this.props
      );

      indexTs = addImportStatement(indexTs, this.props.uppercaseName + 'Service', relativeToIndexPath + '/' + this.props.componentName + '.service');
      indexTs = addRegistration(indexTs, this.props.uppercaseName + 'Service', 'service');
    }

    if (this.props.template) {
      this.fs.copyTpl(
        this.templatePath('template.html.template'),
        this.destinationPath(this.props.componentName + '.html'),
        this.props
      );
    }

    if (this.props.stylesheet) {
      this.fs.copyTpl(
        this.templatePath('stylesheet.scss.template'),
        this.destinationPath(this.props.componentName + '.scss'),
        this.props
      );
    }

    this.fs.write(indexTsPath, indexTs);
  },
});

function addImportStatement(fileText, importName, importPath) {
  let importBlockIndex = fileText.search(/\/\*\s*\/yeoman:importBlock\s*\*\//);
  if (importBlockIndex !== -1) {
    return fileText.slice(0, importBlockIndex) + `import { ` + importName + ` } from '` + importPath + `';\n` + fileText.slice(importBlockIndex);
  } else {
    return fileText;
  }
}

function addRegistration(fileText, className, type) {
  let registrationBlockIndex = fileText.search(/\/\*\s*\/yeoman:registrationBlock\s*\*\//);
  if (registrationBlockIndex !== -1) {
    if (type === 'directive') {
      return fileText.slice(0, registrationBlockIndex) + `.directive(` + className + `.injectionName, () => new ` + className + `)\n    ` + fileText.slice(registrationBlockIndex);
    } else {
      return fileText.slice(0, registrationBlockIndex) + `.` + type + `(` + className + `.injectionName, ` + className + `)\n    ` + fileText.slice(registrationBlockIndex);
    }
  } else {
    return fileText;
  }
}
