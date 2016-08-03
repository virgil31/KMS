Ext.define('CL.store.S_user_activity',{
    extend: 'Ext.data.Store',

    autoSync: false,
    autoLoad: false,
    //remoteSort: true,

    pageSize: 10,

    model: 'CL.model.M_user_activity',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/user_activity/list.php'
        },

        reader:{
            type:'json',
            
            rootProperty: 'result',
            successProperty: 'success'
        }/*,

        writer: {
            type: 'json',
            encode: true,
            rootProperty: 'data',
            writeAllFields: true
        }*/
    }

});