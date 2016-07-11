Ext.define('CL.store.S_user_pool',{
    extend: 'Ext.data.Store',

    //autoLoad: true,

    pageSize: 10,

    model: 'CL.model.M_user_pool',

    remoteSort: true,
    sorters: { property: 'pool_name', direction : 'ASC' },

    proxy:{
        type:'ajax',
        api: {
            read: 'data/user_pool/list.php'
            //update: 'data/us_document/edit.php',
            //destroy: 'data/us_document/destroy.php'
            //create: 'data/us/create.php',
        },

        reader:{
            type:'json',
            rootProperty:'result'
        }

        /*writer: {
            type: 'json',
            encode: true,
            root: 'data'
        }*/
    }

});