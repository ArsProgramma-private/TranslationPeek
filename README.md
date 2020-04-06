# ReadMe
This is a straightforward solution for a developers translation-mapping issues.
Essentialy it does do the following:
if you hover a word in your code or markup that matches an id inside your json-translation-mapping,
a tooltip is shown. 
This tooltip either contains the first or all translations found for the hovered id.

## Install
Just like any other VSCode extension.
Restart VSCode (just to be sure)

## Configure
Via user- or workspace settings:
  - **Json-Name** filename (without directory) of the json-file containing translation mapping.
  - **Prefix** _(optional)_ prefix that is common to the translation keys. 
  - **Take** Strategy for tooltip information
    - _first:_ only show translation of first hit
    - _all:_ show every translation found for the hovered key

## Develop
For information on how to buld, test and publish this extension 
please have a look at ```vsc-extension-quickstart.md```

### Preperations
```npm i -g vsce```

### Test in Debug mode
Just start VSCode's debuger. That's basically it

### Install for local pre-publish-testing
  - ```npm run build:vsix```
  - ```Ctrl+P```, >Extensions: Install from VSIX...
  - Select the newly built package located at project-root
