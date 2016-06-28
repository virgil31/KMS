Ext.define('CL.store.S_collection_user',{
    extend: 'Ext.data.Store',

    autoSync: false,
    //autoLoad: true,

    //remoteSort: true,

    model: 'CL.model.M_collection_user',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/collection_user/list.php',
            create: 'data/collection_user/create.php',
            destroy: 'data/collection_user/destroy.php',
            update: 'data/collection_user/edit.php' //usato solamente per l'elezione del gestore dei collaboratori
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