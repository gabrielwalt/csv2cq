
module.exports = {
    'csv'       : 'import.csv',
    'transform' : function (data) {
        
        // import file
        data.importFile = '.content.xml';
        
        // import path
        if (data.mainTag == 'tagApparel') {
            data.importPath = 'content/geometrixx-outdoors/en/'+data.tagGender+'/'+data.tagApparel+'/'+data.pageName;
        } else if (data.mainTag == 'tagActivity') {
            data.importPath = 'content/geometrixx-outdoors/en/equipment/'+data.tagActivity+'/'+data.pageName;
        } else {
            data.importPath = 'content/geometrixx-outdoors/en/seasonal/'+data.tagSeason+'/'+(data.tagApparel||data.tagGender||data.tagActivity)+'/'+data.pageName;
        }
        
        // import template
        data.importTemplate = 'template.mustache.xml';
        
        // resourceType
        if (!data.sizes) {
            data.sling_resourceType = 'geometrixx-outdoors/components/product/product_unisize';
        } else if (data.tagApparel == 'footwear') {
            data.sling_resourceType = 'geometrixx-outdoors/components/product/product_footwear';
        } else {
            data.sling_resourceType = 'geometrixx-outdoors/components/product';
        }
        
        // fileReference
        if (data.tagApparel) {
            data.fileReference = '/content/dam/geometrixx-outdoors/products/'+data.tagApparel+'/'+data['jcr:title']+'.jpg';
        } else if (data.tagActivity) {
            data.fileReference = '/content/dam/geometrixx-outdoors/products/equipment/'+data['jcr:title']+'.jpg';
        } else {
            data.fileReference = '/content/dam/geometrixx-outdoors/products/'+data.tagGender+'/'+data['jcr:title']+'.jpg';
        }
        
        // tags
        data.cq_tags = '';
        if (data.tagActivity) data.cq_tags += ',/etc/tags/geometrixx-outdoors/activity/'+data.tagActivity;
        if (data.tagApparel)  data.cq_tags += ',/etc/tags/geometrixx-outdoors/apparel/'+data.tagApparel;
        if (data.tagSeason)   data.cq_tags += ',/etc/tags/geometrixx-outdoors/season/'+data.tagSeason;
        if (data.tagGender)   data.cq_tags += ',/etc/tags/geometrixx-outdoors/gender/'+data.tagGender;
        data.cq_tags = data.cq_tags.substr(1);
        
        // features
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
