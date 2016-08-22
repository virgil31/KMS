Ext.define('CL.store.S_collection_tag',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_collection_tag',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection_tag/list.php',
            create: 'data/collection_tag/create.php',
            destroy: 'data/collection_tag/destroy.php'
            //update: 'data/collection_external_resource/edit.php'
        },

        reader:{
            type:'json',
            rootProperty: 'result',
            successProperty: 'success'
        },

        writer: {
            type: 'json',
            encode: true,
            rootProperty: 'data',
            writeAllFields: true
        }
    }

});