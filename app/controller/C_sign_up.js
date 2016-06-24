Ext.define('CL.controller.C_sign_up', {
    extend: 'Ext.app.Controller',

    routes: {
        'sign_up' : 'showView'
    },

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        'sign_up.V_sign_up'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    },
    /////////////////////////////////////////////////

    //SHOW VIEW
    showView: function(){
        if(Ext.ComponentQuery.query('sign_up').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'sign_up'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('sign_up_id'); 
    }
});
