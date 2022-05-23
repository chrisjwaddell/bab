var fs = require('fs');
var path = require('path');
let process = require("process")
var prompt = require('prompt-sync')();

let configFile = './settings.js';

// let testmode = "test"

let appRoot = process.cwd()

let dirRoot = appRoot;
let filetype = "txt";
let arrFiletype
let re
let regEx
let outputfile = ''

let linesBefore = 0 // Not implemented yet
let linesAfter = 3
let recursive = true
let fieldSeperator = '\t'

let excludeDirs = [".history", ".git", "node_modules", "archive"]
let excludeSpecificDirs = []
let excludeFilenames = []
let excludeSpecificFilepaths = []

let fileListAtTop = false
let topCol1 = "----------------------------------------------------------------\r\n{F}\r\n" +
    "----------------------------------------------------------------"
let resultsCol1 = "{N}  "
let bottomCol1 = ""
let bottomCol2 = ""
let bottomCol3 = ""

let matchesCount = 0
let matchesFiles = 0
let strOutput = ''
let searchSummary = ''

let arrFilesFound = []
let arrFilesMatch = []


const dirExclude = (dir) => excludeDirs.find(cv => cv === dir)
const dirExcludeSpecific = (dir) => excludeSpecificDirs.find(cv => cv === dir)
const fileExclude = (file) => excludeFilenames.find(cv => cv === file)
const fileExcludeSpecific = (file) => excludeSpecificFilepaths.find(cv => cv === file)

const textLine = (txt) => txt.replace(/\r?\n?/g, '').trim()

const strtopCol1 = (filename) => topCol1.replace("{F}", filename)
const strresultCol1 = (filename, linenumber) => resultsCol1.replace("{F}", filename).replace("{N}", linenumber)
const strbottomCol1 = (filename) => bottomCol1.replace("{F}", filename)
const strbottomCol2 = (filename) => bottomCol2.replace("{F}", filename)
const strbottomCol3 = (filename) => bottomCol3.replace("{F}", filename)


function fileRead(filePath) {
    const inStream2 = fs.createReadStream(filePath, "utf8");
    let lines = ''
    let fileMatch = false

    let linenumber = 0

    return new Promise((resolve, reject) => {

        inStream2.on('data', function (chunk) {
            lines = chunk.split('\n')

            if (!arrFilesFound.includes(filePath)) {
                // File already searched
                arrFilesFound.push(filePath)
            } else {
                // fileMatch = true
                resolve("already searched")
            }

            let foundLine = -1
            lines.forEach((cv, i) => {
                if (cv.match(regEx)) {
                    matchesCount += 1
                    if (!fileMatch) {
                        matchesFiles += 1
                        strOutput += strtopCol1(filePath) + "\r\n"
                        fileMatch = true
                        arrFilesMatch.push(filePath)
                    }
                    foundLine = i
                }
                linenumber += 1

                if (foundLine !== -1) {
                    if ((i - foundLine >= 0) && (i - foundLine <= linesAfter)) {
                        strOutput += strresultCol1(filePath, String(linenumber + 1)) + fieldSeperator + textLine(cv) + fieldSeperator + "\r\n"
                    } else if (i - foundLine === linesAfter + 1) {
                        strOutput += strbottomCol1(filePath) + fieldSeperator + strbottomCol2(filePath) + fieldSeperator + strbottomCol3(filePath) + '\r\n'
                    }
                }

            })
        })

        inStream2.on('error', function (err) {
            console.log(err);
            reject(err)
        });

        inStream2.on('close', function (err) {
            resolve("close")
        });

    })
}

function configFileRead(settingsFile) {
    // console.log(`Start - configFileRead - settingsFile - ${settingsFile}`)
    return new Promise((resolve, reject) => {
        let config = require(settingsFile)
        const jsonString = JSON.stringify(config, null, 2);

        filetype = config.filetype || "txt";

        re = config.searchstring;
        regEx = new RegExp(re, "i");

        outputfile = config.outputfile || '';
        linesBefore = 0 // Not implemented yet
        linesAfter = config.linesafter || 3;
        recursive = config.recursive === false ? false : true;
        fieldSeperator = config.fieldseperator || '\t'
        excludeDirs = config.excludedirs || [".history", ".git", "node_modules"];
        excludeSpecificDirs = config.excludespecificdirs || [];
        excludeFilenames = config.excludefilenames || [];
        excludeSpecificFilepaths = config.excludespecificfilepaths || [];

        fileListAtTop = config.filelistattop || false;
        topCol1 = config.topcolumn1 || "----------------------------------------------------------------\r\n{F}\r\n" + "----------------------------------------------------------------";
        resultsCol1 = config.resultscolumn1 || "{N}";
        bottomCol1 = config.bottomcolumn1 || "";
        bottomCol2 = config.bottomcolumn2 || "";
        bottomCol3 = config.bottomcolumn3 || ""

        // console.log(`End - configFileRead - settingsFile - ${settingsFile}`)
        resolve("Finished config read");
    })
}


async function argsRead() {
    return new Promise(async (resolve, reject) => {

        const script = __filename

        let argStart = process.argv.indexOf(script)
        argStart += 1

        const args = process.argv.slice(argStart);

        if (args.findIndex(cv => cv === "--help") !== -1) {
            helpInfo()
            // return false
            reject("Help")
        }


        // A settings file other than ./settings.js from -s or --settings
        //  can overwrite ./settings.js. But command line switches
        // have the final say.
        // I need to read this before even checking that required fields
        // are filled in because I don't want to overwrite command line
        // settings with config settings.
        if (args.findIndex(cv => ((cv === "-s") || (cv === "--settings"))) !== -1) {
            if (typeof args[args.findIndex(cv => ((cv === "-s") || (cv === "--settings"))) + 1] !== "undefined") {
                let settingsargtfile = args[args.findIndex(cv => ((cv === "-s") || (cv === "--settings"))) + 1]

                try {
                    if (fs.existsSync(path.join(__dirname, settingsargtfile))) {
                        //file exists
                        await configFileRead(path.join(__dirname, settingsargtfile))
                    } else {
                        if (fs.existsSync(path.join(appRoot, settingsargtfile))) {
                            await configFileRead(path.join(appRoot, settingsargtfile))
                        } else {
                            console.log("Settings file - " + settingsargtfile + " doesn't exist. Resuming search anyway.")
                        }
                    }
                } catch (err) {
                    console.log("There was a problem reading settings file - " + settingsargtfile + ". Resuming search anyway.")
                }
            } else {
                console.log("Settings file is missing. The search is resuming without it.")
            }
        }


        if (typeof args[0] === "undefined") {
            usage()
            reject()
        } else {
            if (args[0] === '!') {
                var regex = prompt('Enter Regular expression: ');
                re = String.raw `${regex}`;
                regEx = new RegExp(re, "i");
            } else if (args[0] === '!!') {
                // Get the search string from the previous search
                re = String.raw `${re}`;
                regEx = new RegExp(re, "i");
            } else {
                re = String.raw `${args[0]}`;
                try {
                    regEx = new RegExp(re, "i");
                } catch (err) {
                    // console.log("An error occurred")
                    regularExpressionWrong()
                    reject()
                }
            }

            searchSummary = 'Search string - ' + re
        }

        if (typeof args[1] === "undefined") {
            usage()
            reject()
        } else {
            filetype = args[1];
            searchSummary += ', Filetype - ' + filetype

            arrFiletype = filetypeArray(filetype)
            if (arrFiletype === '') {
                console.log("Error in filetype expression. Use square brackets [ ] for more than one file type. Can't search on text.")
                searchSummary += "\r\nError in filetype expression. Use closing square brackets [ ] for more than one file type. Can't search on text."
            }
        }



        if (args.findIndex(cv => cv === "-o") !== -1) {
            if (typeof args[args.findIndex(cv => cv === "-o") + 1] !== "undefined") {
                outputfile = args[args.findIndex(cv => cv === "-o") + 1]
            } else {
                console.log("-o switch in but no output file. Output will go to the screen.")
            }
        }



        if (args.find(cv => cv === "-i")) {
            regEx = new RegExp(re, "i");
        }

        if (args.find(cv => cv === "-c")) {
            regEx = new RegExp(re);
        }

        if (args.find(cv => cv === "-r")) {
            recursive = true
        }

        if (args.find(cv => cv === "-n")) {
            recursive = false
        }

        resolve("Good")


        // Takes the filetype argument from the command line and turns it
        // into an array
        function filetypeArray(str) {
            if (str[0] === "[") {
                if (str[str.length - 1] !== "]") {
                    return ''
                } else {
                    return str.slice(1, str.length - 1).split(",")
                }
            } else {
                return [str]
            }
        }

    })

    function regularExpressionWrong() {
        strError = "Error - Invalid Regular expression for the search string." + "\r\n"
        strError += "You can use '!' to enter special characters such as *, ' in the regular expression." + "\r\n"
        strError += "USAGE: kf [search-pattern] [filetype] [options] \r\nTry 'node search.js --help' for more information."
        console.log(strError)
    }

    function usage() {
        console.log("USAGE: kf [search-pattern] [filetype] [options] \r\nTry 'node search.js --help' for more information.");
    }

    function helpInfo() {
        strHelpInfo = `USAGE: kf [search-pattern] [filetype] [options]
Search for text in multiple files. The current directory is where it starts the search.
Example: kf "console.log" "txt"

Mandatory fields
[search-pattern]        This must be the first argument. It must be the search text you want to search for.
                        If you want to enter a regular expression, use '!' to go into regular expression mode.
                        It stops escaped character clashes with the command line.
[filetype]              The file extension eg "*logs*.txt" or "*.log" or multiple filetypes
                        - [*log*.txt,*.log].
                        * is any character one or more times. ? is - or 1 of any character. You cannot enter a
                        directory name in here. It searches on the current working directory and downwards.
                        Filetype must have * .* in it, a filename part and an extension part.


Output
-o [output-file]        Search results go into this output file. This can be relative (relative to the
                        current directory) or absolute. If no output file is provided in the command line
                        or in config files such as the default ./settings.js, it prints to screen. You can use
                        the redirect (>) on the command line. This works only in non cygwin terminals.
                        Use this '-o' switch to get past that problem or use
                        'bash -c 'kf "search string" "txt" > output.txt'.


Options
Do the flags seperately eg not -ri,  but -i -r
-r                      Recursive
-n                      Non-recursive
-i                      Case insensitive
-c                      Case sensitive

Settings
-s or --settings [settings file]    This is a config settings .js file. It can be in the app root directory
                         or in the current directory. You can have different template config search settings.
                         Command line options will always overwrite config settings eg  -r (recursion) will
                         overwrite any settings in config files that say no recusion. settings.js (default) is
                         the lowest level settings file. Lower than that is factory settings.
`
        console.log(strHelpInfo)

    }

}


async function main() {
    if (configFile == undefined) {
        console.log("USAGE: node search [config-file]");
    } else {
        await configFileRead(path.join(__dirname, 'settings.js'))
            .then(async a => {
                let argsGood = await argsRead()
                    .then(async msg => {

                        for (let i = 0; i < arrFiletype.length; i++) {
                            let p = new Promise(async (resolve) => {
                                // console.log("before directoriesLoop")
                                let li = arrFiletype[i].lastIndexOf(".")
                                if (li === -1) {
                                    // display error
                                    // console.log("Filetype - " + arrFiletype[i] + " has no dot (.), each filetype must be in this format: <filename>.<extension> eg *.txt or *logs.htm?")
                                    searchSummary += "\r\nFiletype - " + arrFiletype[i] + " has no dot (.), each filetype must be in this format: <filename>.<extension> eg *.txt or *logs.htm?"
                                } else {
                                    // console.log(arrFiletype[i])
                                    await directoriesLoop(dirRoot, arrFiletype[i])
                                        .then(d => {
                                            if (i === arrFiletype.length - 1) {
                                                setTimeout(() => {
                                                    // console.log(outputfile)
                                                    resultsShow()
                                                }, 2000)
                                            }

                                        })
                                        .catch((err) => {
                                            console.log(err)
                                        })

                                }

                            })
                        }

                    })
                    .catch((err) => {
                        // console.error(err)
                    })
            })
            .catch((err) => {
                console.error(err)
            })
    }

}


async function directoriesLoop(dir, ext) {
    // console.log(`directoriesLoop - dir - ${dir} - ext - ${ext}`)
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(dir)) {
            resolve(true)
        }

        let files = fs.readdirSync(dir);
        let l = files.length;
        let lastOne = false

        for (let i = 0; i < l; i++) {
            lastOne = (dir === dirRoot) && (i + 1 === l) ? true : false

            let fileName = path.join(dir, files[i]);
            if (files[i][0] !== "$") {
                if ((!dirExclude(files[i])) && (!dirExcludeSpecific(fileName)) && (!fileExclude(files[i])) && (!fileExcludeSpecific(fileName))) {

                    try {
                        let isDir = fs.lstatSync(fileName);
                        if (isDir.isDirectory()) {
                            if (recursive) {
                                // If it's in exclude list, don't look in that dir
                                await directoriesLoop(fileName, ext);
                                // resolve(true)
                            }
                        } else {
                            // if (path.extname(fileName) === "." + ext) {
                            if (fileName.includes("PROJECTS")) {
                                // console.log("fileName - " + fileName + " - ext - " + ext + " - " + filenameValid(fileName, ext))
                                // console.log(fileName, ext, filenameValid(fileName, ext))
                            }
                            if (filenameValid(fileName, ext)) {
                                await fileRead(fileName, true)
                                // resolve(true)
                            }
                        }


                    } catch (e) {
                        // if (e.code !== "EPERM") {
                        console.log("An error has occurred. If this is a file or directory you don't have the right permissions for, you may need to add it to the exclude directories or files settings. See the ./settings.js file.")
                        console.error(e);
                        // }
                    }
                }
            } else {
                // console.log(`Excluded - dir - ${dir} - fileName - ${fileName}`)
            }

            if ((dir === dirRoot) && (i === l - 1)) {
                // setTimeout(() => {
                //     // console.log(outputfile)
                //     resultsShow()
                // }, 2000)

                resolve(true)
            }

        }
        resolve(true)

    })

}


function resultsShow() {

    searchSummary += "\r\n" + matchesCount + " matches found in " + matchesFiles + " files."
    let fileList = ''
    arrFilesMatch.forEach(cv => {
        // console.log
        fileList += cv + '\r\n'
    })

    // console.log(arrFilesFound)
    // console.log(fileList)
    if (fileListAtTop) {
        strOutput = searchSummary + '\r\n' + '\r\n' + '\r\n' + fileList + '\r\n' + strOutput
    } else {
        strOutput = searchSummary + '\r\n' + '\r\n' + strOutput
    }


    if (outputfile === '') {
        console.log(strOutput)
    } else {
        outputWrite(strOutput)

    }

    // It creates the output if it doesn't exist and overwrites it if it does
    function outputWrite(content) {
        // console.log(/\\/.test(String.raw `${outputfile}`))
        if ((outputfile[0] === ".") || (!/\\/.test(String.raw `${outputfile}`))) {
            outputfile = path.join(__dirname, outputfile)
        }
        fs.writeFile(outputfile, content, (err) => {
            if (err) {
                console.error(err)
                return
            } else {
                console.log("Search results written to " + outputfile)
            }
        })
    }
}


// Check a filename matching to actual filenames eg *.tx?
// Only 2 matching characters can be used: * and ?
function filenameValid(filename, filetype) {
    const strCharsAllowedWindows = String.raw `[A-Za-z0-9\s_\-~@\!#%&'\{\}\(\)]`
    // Replace * with allowed chars
    let replaceStars = filetype.replace(/\*/g, strCharsAllowedWindows + "*")
    let replaceQuestion = replaceStars.replace(/\?/g, strCharsAllowedWindows + "?") + "$"

    // ? and * mean the same thing in terms of repetition in  regular expression and file matching
    // For some reason @ doesn't work in regex, even if escaped
    // But @ is an accepted character in a Windows filename
    let regex = new RegExp(replaceQuestion)
    return regex.test(filename) // this works
}


if (typeof testmode === 'undefined') {
    main()
} else {
    test()
}


function test() {
    //console.log(filenameValid("E:\wamp64\www\Github-Repos\search-text-in-directories\dev\0-Dev-notes.txt", "txt"))

    //E:\wamp64\www\Github-Repos\search-text-in-directories\dev\search-20220507.js *search*.js
    // console.log(filenameValid2("E:\wamp64\www\Github-Repos\search-text-in-directories\dev\search-20220507.js", "*search*.txt"))
    console.log(filenameValid2("search-20220507.js", "*search*.js"))
    console.log(filenameValid2("search-20220507.js", "search*.js"))


    function filenameValid2(filename, filetype) {
        console.log("filenameValid", filename, filetype)
        const strCharsAllowedWindows = String.raw `[A-Za-z0-9\s_\-~@\!#%&'\{\}\(\)]`
        // Replace * with allowed chars
        let replaceStars = filetype.replace(/\*/g, strCharsAllowedWindows + "*")
        let replaceQuestion = replaceStars.replace(/\?/g, strCharsAllowedWindows + "?") + "$"

        console.log(replaceQuestion)

        // ? and * mean the same thing in terms of repetition in  regular expression and file matching
        // For some reason @ doesn't work in regex, even if escaped
        // But @ is an accepted character in a Windows filename
        let regex = new RegExp(replaceQuestion)
        return regex.test(filename) // this works
    }
}
