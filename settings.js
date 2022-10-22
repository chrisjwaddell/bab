// This config file is used by Kinder Finder, a text file search tool
module.exports = {
    outputfile: "C:\\search.txt",
    recursive: true,

    excludedirs: [".history", ".git", "node_modules", "archive"],
    excludespecificdirs: ["E:\\System Volume Information"],
    excludefilenames: ["pagefile.sys"],
    excludespecificfilepaths: [],

    linesafter: 3,

    filelistattop: false,
    topcolumn1: "----------------------------------------------------------------\r\n^{F}\r\n----------------------------------------------------------------",
    resultscolumn1: "{N}  ",
    bottomcolumn1: "",
    bottomcolumn2: "",
    bottomcolumn3: ""

}
