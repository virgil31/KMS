Ext.define('CL.store.S_license',{
    extend: 'Ext.data.Store',

    autoLoad: true,

    model: 'CL.model.M_generic',

    proxy:{
        type:'ajax',
        api: {
            read: 'data/license/list.php'
        },

        reader:{
            type:'json',
            rootProperty: 'result',
            successProperty: 'success'
        }
    }

});