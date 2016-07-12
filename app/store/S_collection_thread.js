Ext.define('CL.store.S_collection_thread',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: false,
    //remoteSort: true,

    model: 'CL.model.M_collection_thread',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection_thread/list.php',
            create: 'data/collection_thread/create.php',
            destroy: 'data/collection_thread/destroy.php',
            update: 'data/collection_thread/edit.php' 
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