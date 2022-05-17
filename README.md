

Searches text files
_____ searches for text in multiple file. You can include lines of text after the search, you can include line number and you can format the output.
Config files can keep your default search settings such as excluding directories and files.
Out of the box, it excludes *\*.git, node_modules, .history*, and some Windows and Linux operating system files.

You can use regular expressions to search for text with.
It is similar to Unix/Linux *grep* but with some unique features.

<name> is very fast because it uses streams to search and you have great option on what diretories and files to exclude. And you can save these lists as template searches.


# How to use it
Change directory to the directory you want to be the search root.
`node ____.js "require" *app.js?`

To enter a search string that has a regular expression, you can use *!* which puts you into regular expression mode. This stops any clashes with the command line and characters that need escaping like *"*.

It shows the line number and three (default) lines of code. You can automatically run this script to find certain text with some nice options.

Regular expression searches don't save in the CLI history, so you can use *!!* which uses the search string from the config settings file.

To find of *require("bcrypt")* OR *require('bcrypt')* (double or single quote), you can use a regular expression.
stringsearch - `require\(['"]?`
*['"]* - This means *'* or *"*

Searching all **js** files for **require\(['"]?** in **E:\Webistes** would produce output like this:

Filetype can use  * -  any character zero or more times. ? is zero or 1 of any character.
You cannot put a directory name in here eg *src/\*.css* will not work. It searches on the current working directory and downwards. Change to the *src* directory to do this search.
Filetype must have *.* in it, a filename part and an extension part.



<name> uses a stream to search the text so it's more performant.



`
----------------------------------------------------------------
E:\Websotes\scripts\jquery-3.3.1.js
----------------------------------------------------------------
25	// e.g. var jQuery = require("jquery")(window);
26	// See ticket #14549 for more info.
27	module.exports = global.document ?
28	factory( global, true ) :

----------------------------------------------------------------
E:\Websotes\style\bootstrap-4.3.1-dist\js\bootstrap.bundle.js
----------------------------------------------------------------
7	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
8	typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
9	(global = global || self, factory(global.bootstrap = {}, global.jQuery));
10	}(this, function (exports, $) { 'use strict';

----------------------------------------------------------------
E:\Websotes\style\bootstrap-4.3.1-dist\js\bootstrap.js
----------------------------------------------------------------
7	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
8	typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
9	(global = global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));
10	}(this, function (exports, $, Popper) { 'use strict';
`


Exclude
To make it faster and if you get a permission error
if there are Permission errors with directories, add them to excludespecificdirs
Errors with specific files eg pagefile.sys, add it to excludefilenames


# How to install

clone it
config file

You need Node installed


node search.js ./search-config.js
You must be in the path you want to be the root search path

filetype search path


-----

Show output in a pic or code
whats a good example?


-----


# Settings

*directory root* -
*Filetype* - The default is text files - 'txt'.
*Search string* - The string you want to search files for.
*Output file* - Write the results to this file. If this is blank and there is no *-o* setting in command line, the results will go to the screen.

*Lines after* - Number of lines to show after the matching text. The default is 3.

*Recursive* - Recursively go into sub-directories of the root directory. The default yes.

*Exclude directories* - These are general directory names that could be in any directory such as *.git* or *.history*. It's an array of directory names. The default is [".history", ".git", "node_modules"].
*Exclude specific directories* - An array of specific directories eg *C:\\pics*.

*Field seperator* - A seperator for each of the three fields. The first field is line number, the second is the text, the third is a blank column. The default field seperator is '\t'.
*Line seperator* - A string that seperates each match. The default is '\r\n'.

*filesattop* - Show a file list of files found at the top. This can be handy if you use macros to flick between file results fast.
*topcolumn1* - For each result - put in a format for displaying the start of the results. '---------------{F} ------------" will show the filename with dashes around it.
*resultscolumn1* - Column one is for filename and/or line number. {F} to display filepath, {N} to display line number, you can put space characters in.
*bottomcolumn1*
*bottomcolumn2*
*bottomcolumn3*


### Search result output
The results layout can be customized. Here is also where you select if and where to display the filename and line number.
There are 3 sections and 3 columns to the results section

topcolumn1 - Text that signified a beginning of a new file match. It can the filename and/or a series of dashes.
You can insert filename anywhere. Use *{F}* to insert filename.

result - column 1 - line number and/or filename is suggested.
Use *{N}* to insert line number.

bottom - 1st column
bottom - 2nd column
bottom - 3rd column
You can insert filename anywhere *{F}*.


### Config files
Config files are used to keep different default settings, such as the default output file, recursion and directories to exclude from the search path.
You can have as many config files as you want. *settings.js* is the root config file and should not be removed.
<name> only looks for config files in either the <Name>app root directory or in the current directory you are in.
When referring to config files. They must be referred by filename alone without the path.
`node <name>.js -s logs.js`
Note - logs.js is the config file located in the <name> app root directory.

The order of priority of settings (from highest priority to lowest):
Command line options - these overwrite all config settings.
Config file options - Create new config files for different purposes.
*settings.json* config file options - These should be your default preferred settings.
Default settings (factory settings) - This is the default variable settings in the oode eg the default output filepath is none, recursive is *true*, default lines after the search match is *3*.



### Output file path
The config file, the output file path is relative to the current directory or you can enter an absolute file path in the command line or enter a relative or absolute path in the config files.

Relative file path ie current directory:
`node <name>.js -o search-logs.csv`

OR absolute file path:
`node <name>.js -o C:\logs\search-logs.csv`

If no output file path is provided in the command line or in *settings.json*, results display to the screen.

You can redirect the output by redirect (*>*) on the command line but Cygwin based terminals can have problems redirecting (*>*) the search results in the command line. Git bash especially, sometimes Powershell and DOS but sometimes not. You can use
`bash -c 'node <name> "searchstring" "txt" > C:\logs\logsfiltered.txt'`



# Some handy uses

Use it to search a group of files for certain text. Search your log files for specific text. Search your .js javascript files for specific text, or text files.


Tips
Search log files
js files
search your text files using markers and tags
search all your coding files for specific code

Tip
"Tag" or "marker"
Use it for markers in your text files and code or prioritize things eg
^Heading
^DOM
^1, ^2 - priority one or two
^Todo
* come up with better examples

I have a system where if I want to keep as a backup, I put them in a directory specifically named *archive*. I include *archive* in my exclude directories list.




# Contributions
Any contributions would be greatly welcomed. Use the *develop* branch and make a pull request on the *develop* branch.


# Further improvement feature ideas
There are further ideas to develop the functionality of <search-text-files>
One feature idea is, showing the lines after the text match up until a specified string instead of a fixed number of lines after the match as it does now.
The next occurrence of xxx string till EOL or till the next empty line

Exclude certain searches, search features like search 'id=' but not 'id=Z'

