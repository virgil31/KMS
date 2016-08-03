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
            Ext.ComponentQuery.query('search textfield[name=query_search]')[0].setRawValue(decodeURI(param1.trim()));

            var store = Ext.StoreManager.lookup('S_search');

            store.proxy.extraParams.query = decodeURI(param1.trim());

            Ext.ComponentQuery.query('search grid')[0].body.mask("Ricerca...");

            store.loadPage(1,{
                callback: function () {
                    Ext.ComponentQuery.query('search grid')[0].body.unmask();
                }
            });

        }

    }

});
