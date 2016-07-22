Ext.define('CL.store.S_search',{
    extend: 'Ext.data.Store',

    //autoLoad: true,

    model: 'CL.model.M_quick_search',
    pageSize: 20,

    //remoteSort: true,
    //sorters: { property: 'first_name', direction : 'ASC' },

    listeners:{
        beforeload: function () {
            Ext.Ajax.abortAll();
        }
    },

    proxy:{
        type:'ajax',
        api: {
            read: 'data/search/list.php'
        },

        reader:{
            type:'json',
            rootProperty:'result'
        }
    }

});