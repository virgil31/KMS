Ext.define('CL.store.S_user_pool',{
    extend: 'Ext.data.Store',

    //autoLoad: true,
    autoSync: false,

    pageSize: 10,

    model: 'CL.model.M_user_pool',

    remoteSort: true,
    sorters: { property: 'pool_name', direction : 'ASC' },

    proxy:{
        type:'ajax',
        api: {
            read: 'data/user_pool/list.php',
            update: 'data/user_pool/edit.php',
            destroy: 'data/user_pool/destroy.php',
            create: 'data/user_pool/create.php'
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