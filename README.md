
CSV2CQ
======

A node.js script to convert a CSV file into CQ5 .content.xml files.

---

### Install ###

1.  This script needs node.js, you can install it from here:  
    http://nodejs.org/#download

2.  Install the following node.js packages: mkdirp, csv and mu2.  
    To do so, type the following into your command line:
    > npm install mkdirp  
    > npm install csv  
    > npm install mu2  

### Import ###

1.  In Excel, export the file in CSV format.  
    *Note:* The 1st row defines the name of the variables for the
    following rows.
2.  Convert the exported CSV file to utf-8
    (eg. using Mac TextMate => Save As => utf-8).
3.  In the command line, use node.js to run the csv2cq.js script.
    Provide the config.js script as arugment:
    > node csv2cq.js config.js

This should have created a content folder with the whole product
structure underneath. Don't forget that the generated files are
named ".content.xml" and are thus hidden on UNIX systems.

### Implementation ###

This importer consists of 4 parts:

**csv2cq.js:**  
This script acts like a micro import framework that iterates over
a CSV file and for each line will call a mustache template to
render the output. It requires a config.js script as argument,
for the import-specific information.

**config.js:**  
This script provides all import-specific information, like the CSV
file to import and a "transform" function that will be called for
each CSV row. This function allows to edit the data before the
template is rendered. It is important that for each row the following
variables are set:

* *importFile:* the name of the file that will contain the output of
  the rendered template.
* *importPath:* the path where to write the importFile.
* *importTemplate:* the mustache template to use to write the output.

**template.mustache.xml:**  
The Mustache template syntax is explained here:  
http://mustache.github.com/mustache.5.html

**content.csv:**  
This file contains all data to be imported. Before running the
import script, make sure that the CSV file is in UTF-8 format.  
The 1st row defines the name of the variables to access each column.

