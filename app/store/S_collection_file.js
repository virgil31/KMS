Ext.define('CL.store.S_collection_file',{
    extend: 'Ext.data.Store',

    autoSync: true,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_collection_file',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection_file/list.php',
            //create: 'data/collection/create.php', //fatto dall'uploader
            destroy: 'data/collection_file/destroy.php',
            update: 'data/collection_file/edit.php'
        },

        reader:{
            type:'json',
            rootProperty:'result'
        },

        writer: {
            type: 'json',
            encode: true,
            rootProperty: 'data',
            writeAllFields: true
        }
    }

});