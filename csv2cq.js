
// Dependencies ///////////////////////////////////////////////////////////////

var fs      = require('fs'),
    mkdirp  = require('mkdirp'),    // Like 'mkdir -p', but in node.js
    csv     = require('csv'),       // Full featured CSV parser
    mu      = require('mu2');       // A Mustache template engine

// Initialization /////////////////////////////////////////////////////////////

// Just some help strings in case this script isn't correctly used
var commandLineSyntax  = process.argv[0]+' '+process.argv[1].replace(process.env.PWD+'/', '')+' config.js',
    configScriptSyntax = 'module.exports = {\n\
\t\'csv\'       : \'content.csv\',\n\
\t\'transform\' : function (content) {\n\
\t\tcontent.importFile     = \'.content.xml\';\n\
\t\tcontent.importPath     = \'content/\'+content.name;\n\
\t\tcontent.importTemplate = \'template.mustache.xml\';\n\
\t\treturn content;\n\
\t}\n\
}';

if (process.argv.length < 3) {
    console.error('\nYou must specify a config script.\n\nSyntax:\n'+commandLineSyntax+'\n');
    return;
}

var config = require('./'+process.argv[2]),
    keys = null; // This will contain the keys that are set on the 1st row of the CSV data

if (!('csv' in config &&'transform' in config)) {
    console.error('\nThe "'+process.argv[2]+'" config script must define a '+(('csvc' in config) ? 'transform function' : 'a csv file')+'.\n\nExample syntax:\n'+configScriptSyntax+'\n');
    return;
}

// Import /////////////////////////////////////////////////////////////////////

csv()
    .fromPath(config.csv)
    .on('data', function (contentArray, index) {
        // The first line contains the variable keys
        if (index == 0) {
            keys = contentArray;
            
        } else {
            // Thanks to the keys of the first line, let's tranform the contentArray of this line to an object
            var content = {};
            for (var i = 0; i < keys.length; ++i) {
                content[keys[i]] = contentArray[i];
            }
            content = config.transform(content);
            
            // Now let's execute the template with that content object
            if ('importFile' in content && 'importPath' in content && 'importTemplate' in content) {
                // Create file path
                mkdirp(content.importPath, function () {
                    var writeStream = fs.createWriteStream(content.importPath+'/'+content.importFile);
                    
                    // Render template
                    mu.compileAndRender(content.importTemplate, content)
                        .on('data', function (text) {
                            writeStream.write(text);
                        })
                        .on('end', function () {
                            writeStream.end();
                            console.log('imported row #'+index);
                        });
                });
            
            // Nice error handling for missing import path or import template
            } else {
                var missingVar = '';
                if (!('importFile' in content)) missingVar = 'importFile';
                if (!('importPath' in content)) missingVar = 'importPath';
                if (!('importTemplate' in content)) missingVar = 'importTemplate';
                console.error('Error on CSV line number '+index+'\nThe "'+process.argv[2]+'" config script must define an '+missingVar+' variable.\n\nExample syntax:\n'+configScriptSyntax+'\n');
            }
        }
    })
    .on('error', function (error) {
        console.log(error.message);
    });

