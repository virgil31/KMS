Ext.define('CL.store.S_collection_user',{
    extend: 'Ext.data.Store',

    autoSync: true,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_collection_user',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection_user/list.php',
            //create: 'data/collection/create.php', //fatto dall'uploader
            //destroy: 'data/collection_user/destroy.php',
            //update: 'data/collection_user/edit.php'
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