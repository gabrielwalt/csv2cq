
module.exports = {
    'csv'       : 'products.csv',
    
    'transform' : function (data) {
        
        // Set page name
        data.pageName = data.jcr_title.toLowerCase().replace(/[^a-z0-9\-\_]/g, '-');
        
        // Set import file
        data.importFile = '.content.xml';
        
        // Set import path
        data.importPath = 'content/'+data.pageName;
        
        // Set import template
        data.importTemplate = 'template.mustache.xml';
        
        // Set features text
        var features = data.features.split('\r');
        data.features = '';
        for (var i = 0; i < features.length; ++i) {
            data.features += '<li>'+features[i]+'</li>';
        }
        if (data.features) {
            data.features = '<ul>'+data.features+'</ul>';
        }
        
        return data;
    }
};
