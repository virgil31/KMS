Ext.define('CL.store.S_collection_thread_message',{
    extend: 'Ext.data.Store',

    autoSync: false,
    autoLoad: false,
    //remoteSort: true,

    pageSize: 25,

    model: 'CL.model.M_collection_thread_message',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection_thread_message/list.php',
            create: 'data/collection_thread_message/create.php'
            //destroy: 'data/collection_thread_message/destroy.php',
            //update: 'data/collection_thread_message/edit.php'
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