
// Dependencies ///////////////////////////////////////////////////////////////

var fs      = require('fs'),
    mkdirp  = require('mkdirp'),    // Like 'mkdir -p', but in node.js
    csv     = require('csv'),       // Full featured CSV parser
    mu      = require('mu2');       // A Mustache template engine

// Initialization /////////////////////////////////////////////////////////////

var commandLineSyntax = process.argv[0]+' '+process.argv[1].replace(process.env.PWD+'/', '')+' controller.js',
    controllerScriptSyntax = 'module.exports = {\n\t\'csv\'       : \'products.csv\',\n\t\'transform\' : function (csvData) {\n\t\tdata.importFile = \'.content.xml\';\n\t\tdata.importPath = \'import/\'+csvData.pageName;\n\t\tdata.importTemplate = \'template.mustache\';\n\t\treturn data;\n\t}\n}';

if (process.argv.length < 3) {
    console.error('\nYou must specify a controller script.\n\nSyntax:\n'+commandLineSyntax+'\n');
    return;
}

var controller = require('./'+process.argv[2]),
    importCount = 0;
    keys = null;

if (!('csv' in controller &&'transform' in controller)) {
    console.error('\nThe "'+process.argv[2]+'" controller script must define a '+(('csvc' in controller) ? 'transform function' : 'a csv file')+'.\n\nExample syntax:\n'+controllerScriptSyntax+'\n');
    return;
}

// Import /////////////////////////////////////////////////////////////////////

csv()
    .fromPath(controller.csv)
    .on('data', function (dataArray, index) {
        // The first line contains the variable keys
        if (index == 0) {
            keys = dataArray;
            
        } else {
            // Thanks to the keys of the first line, let's tranform the dataArray of this line to an object
            var data = {};
            for (var i = 0; i < keys.length; ++i) {
                data[keys[i]] = dataArray[i];
            }
            data = controller.transform(data);
            
            // Now let's execute the template with that data object
            if ('importFile' in data && 'importPath' in data && 'importTemplate' in data) {
                // Create file path
                mkdirp(data.importPath, function () {
                    var writeStream = fs.createWriteStream(data.importPath+'/'+data.importFile);
                    
                    // Render template
                    mu.compileAndRender(data.importTemplate, data)
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
                if (!('importFile' in data)) missingVar = 'importFile';
                if (!('importPath' in data)) missingVar = 'importPath';
                if (!('importTemplate' in data)) missingVar = 'importTemplate';
                console.error('Error on CSV line number '+index+'\nThe "'+process.argv[2]+'" controller script must define an '+missingVar+' variable.\n\nExample syntax:\n'+controllerScriptSyntax+'\n');
            }
        }
    })
    .on('error', function (error) {
        console.log(error.message);
    });

