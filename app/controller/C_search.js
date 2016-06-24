Ext.define('CL.controller.C_search', {
    extend: 'Ext.app.Controller',

    routes: {
        'search' : 'showView',
        'search/' : 'showView',
        'search/:aaa' : 'showView'
    },

    stores: [
        'S_search'
    ],
    models: [
        'M_search'
    ],
    views: [
        'search.V_search'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    },
    /////////////////////////////////////////////////

    //SHOW VIEW
    showView: function(param1){
        if(Ext.ComponentQuery.query('search').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'search'});            

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('search_id');

        if(param1 != undefined) {
            Ext.ComponentQuery.query('search textfield[name=query_search]')[0].setRawValue(param1);
            Ext.StoreManager.lookup('S_search').proxy.extraParams.query = param1;
            Ext.StoreManager.lookup('S_search').loadPage(1);
        }

    }

});
