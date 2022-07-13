# Kinder Finder

Kinder Finder searches for text in multiple text files by traversing down from the current directory. It can show lines of text after the matching text, you can include line number and you can format the output.
Config files can keep your default search settings such as excluding directories and files.
It uses Node so you must have Node installed.
Out of the box, it excludes *.git, node_modules, .history*, and some Windows and Linux operating system files.

You can use regular expressions to search for text with.
It is similar to Unix/Linux *grep* but with some unique features.

Kinder Finder is very fast because it uses streams to search and you have great option on what diretories and files to exclude. And you can save these lists as template searches.


# How to use it
Change directory to the directory you want to search.\
The format is:\
*kf [search-pattern] [filetype] [options]*\
eg `kf "require" *app.js?`\
`kf "hello world" *.txt -s search-config.js`

To enter a search string that has a regular expression, you can use *!* which puts you into regular expression mode. This stops any clashes with the command line and characters that need escaping like *"*.

The results show the line number and three (default) lines after the text match.

To find *require("bcrypt")* OR *require('bcrypt')* (double or single quote), you can use a regular expression.\
stringsearch - `require\(['"]?`\
*['"]* - This means *'* or *"*.

### Example of results
Searching all *\*.js* files for *require\('* or *require\("* in *E:\Websites* use this regular expression - *require\(['"]?*, which would produce output like this:

<pre>Search string - require\(['"]?, Filetype - *.js
3 matches found in 3 files.
----------------------------------------------------------------
E:\Websites\scripts\jquery-3.3.1.js
----------------------------------------------------------------
25	// e.g. var jQuery = require("jquery")(window);
26	// See ticket #14549 for more info.
27	module.exports = global.document ?
28	factory( global, true ) :

----------------------------------------------------------------
E:\Websites\style\bootstrap-4.3.1-dist\js\bootstrap.bundle.js
----------------------------------------------------------------
7	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
8	typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
9	(global = global || self, factory(global.bootstrap = {}, global.jQuery));
10	}(this, function (exports, $) { 'use strict';

----------------------------------------------------------------
E:\Websites\style\bootstrap-4.3.1-dist\js\bootstrap.js
----------------------------------------------------------------
7	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
8	typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
9	(global = global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));
10	}(this, function (exports, $, Popper) { 'use strict';
</pre>



# How to install
You need Node installed.

### To install on Windows
In DOS or Powershell. \
Go to the root of the C: drive and paste in: \
*git clone https://github.com/chrisjwaddell/kinderfinder.git*

`
C:> git clone https://github.com/chrisjwaddell/kinderfinder.git
`

Then type in:\
`cd kinderfinder`\
`npm install`


Go to the Start button, type in *env*, and choose *Edit the system environment variables*. \
Click the *Environment Variables…* button. \
Under the *System Variables* section (the lower half), find the row with *Path* in the first column, and click *Edit...*. \
The *Edit environment variable* UI will appear. Here, you can click *New*.\
Type in *C:\kinderfinder*. \
Dismiss all of the dialogs by choosing *OK*.



# Settings

### Command line

kf [search-pattern] [filetype] [options]\
Search for text in multiple files. The current directory is where it starts the search. \
Example: *kf "console.log" "\*.txt"* \
*kf "status" \*.log -o logs.js*


**Mandatory fields** \
[search-pattern]
This must be the first argument. It must be the search text you want to search for. If you want to enter a regular expression, use '!' to go into regular expression mode. It stops escaped character clashes with the command line.
Regular expression searches don't save in the CLI history, so you can use *!!* which uses the search string from the config settings file.

[filetype]
The file extension. You must enter two parts with a dot (*.*) seperating them, a filename and an file extension. This can be a single filetype or an array of filetypes eg "\*logs\*.txt" or "\*.log" or multiple filetypes - [\*log\*.txt,\*.log]. \
\* is any character one or more times.
? is - or 1 of any character.\
You cannot enter a directory name in here. It searches on the current working directory and downwards. Filetype must have \* .\* in it, a filename part and an extension part.



**Options**

Output
-o [output-file]\
Search results go into this output file. This can be relative (relative to the current directory) or absolute. If no output file is provided in the command line or in config files such as the default ./settings.js, it prints to screen. You can use the redirect (>) on the command line. This works only in non cygwin terminals. Use this '-o' switch to get past that problem or use `bash -c 'kf "search string" "*.txt" > output.txt'`.


Do the flags seperately eg -i -r not -ir\
-r                      Recursive. Recursively search sub-directories of the root directory. The default yes.\
-n                      Non-recursive\
-i                      Case insensitive\
-c                      Case sensitive

Settings config file
-s or --settings [settings file]\
This is a config settings .js file. It can be in the app root directory or in the current directory. You can have different template config search settings. Command line options will always overwrite config settings eg  -r (recursion) will overwrite any settings in config files that say no recusion. settings.js (default) is the lowest level settings file. Lower than that is factory settings.



### Config files
Config files are used to keep different default settings, such as the default output file, recursion and directories to exclude from the search path.\
You can have as many config files as you want. *settings.js* is the root config file and should not be removed.\
Kinder Finder only looks for config files in either the Kinder Finder app root directory or in the current directory you are in.\
When referring to config files. They must be referred by filename alone without the path.\
`kf "status" *.log -s logs.js`\
Note - logs.js is the config file located in the Kinder Finder app root directory.

The order of priority of settings (from highest priority to lowest):\
Command line options - these overwrite all config settings.\
Config file options - Create new config files for different purposes.\
*settings.json* config file is the default which contains your default preferred settings.\
Default settings (factory settings) - This is the default variable settings in the oode eg the default output filepath is none, recursive is *true*, default lines after the search match is *3*.



### Exclude directories
To make it faster and if you get a permission errors, exclude the directories or files.\
If there are Permission errors with directories, add them to *excludespecificdirs*.\
Errors with specific files eg *pagefile.sys*, add it to *excludefilenames*.

*Exclude directories* - These are general directory names that could be in any directory such as *.git* or *.history*. It's an array of directory names. The default is [".history", ".git", "node_modules"].\
*Exclude specific directories* - An array of specific directories eg *C:\\pics*.\
*Exclude filenames* - These are general filenames.\
*Exclude specific filenames* - An array of specific filenames. They could be operating system files eg *C:\pagefile.sys*.\



*Lines after* - Number of lines to show after the matching text. The default is 3.

### Search result output
The results layout can be customized. Here is also where you select if and where to display the filename and line number.\
You can insert filename anywhere by putting in *{F}*. Insert a line number by inserting *{N}*.\
There are 3 sections and 3 columns to the results section.


*Filelist at top* - Show a file list of files found at the top. This can be handy if you use macros to flick between file results fast.\
*topcolumn1* - Text that signified a beginning of each matching result. You can put in a format for displaying the start of the results. '---------------{F} ------------" will show the filename with dashes around it.\
*resultscolumn1* - Column one is for filename and/or line number. {F} to display filepath, {N} to display line number, you can put space characters in.\
*bottomcolumn1*\
*bottomcolumn2*\
*bottomcolumn3*


# Contributions
Any contributions would be greatly welcomed. Use the *develop* branch and make a pull request on the *develop* branch.


# Further improvement feature ideas
There are further ideas to develop the functionality of Kinder Finder.\
One feature idea is, showing the lines after the text match up until a specified string instead of a fixed number of lines after the match as it does now.\
The next occurrence of xxx string till EOL or till the next empty line.

Exclude certain searches, search for 'id=' but not 'id=Z'.

