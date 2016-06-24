Ext.define('CL.model.M_collection_file', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'collection_id',            type: 'int'},
        {name: 'file_id',            type: 'int'},
        {name: 'title',         type: 'string'},

        {name: 'full_title',         type: 'string'}, //titolo+estensione
        {name: 'type',          type: 'string'}
    ]
});