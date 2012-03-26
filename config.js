
module.exports = {
    'csv'       : 'content.csv',
    
    'transform' : function (content) {
        
        // Set page name
        content.pageName = content.jcr_title.toLowerCase().replace(/[^a-z0-9\-\_]/g, '-');
        
        // Set import file
        content.importFile = '.content.xml';
        
        // Set import path
        content.importPath = 'content/'+content.pageName;
        
        // Set import template
        content.importTemplate = 'template.mustache.xml';
        
        // Set features text
        var features = content.features.split('\r');
        content.features = '';
        for (var i = 0; i < features.length; ++i) {
            content.features += '<li>'+features[i]+'</li>';
        }
        if (content.features) {
            content.features = '<ul>'+content.features+'</ul>';
        }
        
        return content;
    }
};
