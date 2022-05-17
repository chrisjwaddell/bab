module.exports = {
    // searchstring: String.raw``,

    // outputfile: "G:\\My Drive\\search.txt",
    outputfile: "E:\\search.txt",
    recursive: true,

    excludedirs: [".history", ".git", "node_modules", "archive"],
    excludespecificdirs: ["E:\\System Volume Information"],
    excludefilenames: ["pagefile.sys"],
    excludespecificfilepaths: [],

    linesafter: 3,
    //fieldseperator: "\t", // tab seperator was causing formatting problems
    // fieldseperator: "|",

    filelistattop: true,
    topcolumn1: "----------------------------------------------------------------\r\n^{F}\r\n----------------------------------------------------------------",
    resultscolumn1: "{N}  ",
    bottomcolumn1: "",
    bottomcolumn2: "",
    bottomcolumn3: ""

}
