# ReadMe
This is a straightforward solution for a developers translation-mapping issues.
Essentialy it does do the following:
if you hover a word in your code or markup that matches an id inside your json-translation-mapping,
a tooltip is shown. 
This tooltip either contains the first or all translations found for the hovered id.

- [ReadMe](#readme)
  - [Example](#example)
    - [Basic example 1](#basic-example-1)
    - [Basic example 2 (Usage of prefix-setting)](#basic-example-2-usage-of-prefix-setting)
    - [Basic example 3 (Multiple languages in one file)](#basic-example-3-multiple-languages-in-one-file)
    - [Basic example 4 (nested translations)](#basic-example-4-nested-translations)
    - [Basic example 5](#basic-example-5)
  - [Roadmap](#roadmap)
  - [Install](#install)
  - [Configure](#configure)
  - [Develop](#develop)
    - [Preperations](#preperations)
    - [Test in Debug mode](#test-in-debug-mode)
    - [Install for local pre-publish-testing](#install-for-local-pre-publish-testing)

## Example
### Basic example 1
Assuming you have some dedicated JSON-translation file inside your project named `en-US.json` with the follwing content:

```json
{
  "mypro": "My Project",
  "text": "Some kind of text",
  "header": "Headline",
  "subheader": "Subheadline"
}
```

As an configuration for this you might come up, defining the translation-files name like this:

![Settings for example 1](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/settings_example_1.png)

Whenever you find some string inside your project's files you may hover it
to see the translation of that key as a hovering tooltip:

![Usage for example 1](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/usage_example_1.png)

### Basic example 2 (Usage of prefix-setting)
However this approach can be optimized in terms of performance if you have translation-keys that share a common prefix:

```json
{
    "IDS_1": "My Project",
    "IDS_2": "Some kind of text",
    "IDS_3": "Headline",
    "IDS_4": "Subheadline",
    "IDS_5": "Article",
    "IDS_6": "Comments"
}
```

As an configuration for this you might come up with something like:

![Settings for example 2](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/settings_example_2.png)

Whenever you find some string inside your project's files you may hover it
to see the translation of that key as a hovering tooltip:

![Usage for example 2](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/usage_example_1_2.png)

### Basic example 3 (Multiple languages in one file)
However it might happen you do not have one single translation language inside the same file, but multiple. As an example it might look like:

```json
{
    "en": {
        "IDS_1": "My Project",
        "IDS_2": "Some kind of text",
        "IDS_3": "Headline",
        "IDS_4": "Subheadline",
        "IDS_5": "Article",
        "IDS_6": "Comments"
    },
    "de": {
        "IDS_1": "Mein Projekt",
        "IDS_2": "Irgendein Text",
        "IDS_3": "Überschrift",
        "IDS_4": "Überschnitt für Abschnitt",
        "IDS_5": "Artikel",
        "IDS_6": "Kommentare"
    }
}
```

In such a situation it's likely you want to see all translations at once.
To enable such a behavior just set the ```Take```-setting to ```all```

![Settings for example 3](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/settings_example_3.png)

When hovering a translation key now, you will see this:

![Usage for example 3](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/usage_example_3.png)

### Basic example 4 (nested translations)
As you can see, the nesting of your keys does not matter,
so that you can access also access translations at different depth of nesting:

```json
{
    "en": {
        "nested": {
            "IDS_1": "My Project",
            "deeper": {
                "IDS_2": "Some kind of text",
                "IDS_3": "Headline",
                "IDS_4": "Subheadline"
            },
            "IDS_5": "Article",
            "IDS_6": "Comments"
        }
    },
    "de": {
        "IDS_1": "Mein Projekt",
        "IDS_2": "Irgendein Text",
        "IDS_3": "Überschrift",
            "other-nesting": {
            "IDS_4": "Überschnitt für Abschnitt",
            "IDS_5": "Artikel",
            "IDS_6": "Kommentare"
        }
    }
}
```

In action this will work just as well as before:

![Usage for example 4](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/usage_example_4.png)

### Basic example 5
As of v0.0.2 it is possible to use multiple json-files as sources for translations.

Think of having two files, `en-US.json` containing the english translations:

```json
{
    
    "IDS_1": "My Project",
    "IDS_2": "Some kind of text",
    "IDS_3": "Headline",
    "IDS_4": "Subheadline",
    "IDS_5": "Article",
    "IDS_6": "Comments"
}

and maybe `de-DE.json` for the german ones:

```
```json   
{
    "IDS_1": "Mein Projekt",
    "IDS_2": "Irgendein Text",
    "IDS_3": "Überschrift",
    "IDS_4": "Überschnitt für Abschnitt",
    "IDS_5": "Artikel",
    "IDS_6": "Kommentare"
}
```

When setting multiple files as translations sources by adding them via the `Add files`-button you can setup a configuration like this:
![Settings for example 5](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/settings_example_5.png)

In action this will work just as well as before:
![Usage for example 5](https://raw.githubusercontent.com/ArsProgramma/TranslationPeek/master/src/readme-asests/usage_example_5.png)

However be **aware** that setting `Take` to `first` will now only return the first match of the first file you defined.

## Roadmap
  - Update translations automatically when they were edited.

## Install
Just like any other VSCode extension.
Restart VSCode (just to be sure)

## Configure
Via user- or workspace settings:
  - **Json-Names** filenames (without directory) of the json-files containing translation mappings.
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
