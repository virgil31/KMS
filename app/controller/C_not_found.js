Ext.define('CL.controller.C_not_found', {
    extend: 'Ext.app.Controller',

    //routes: {
    //    'not_found' : 'showView'
    //},

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        'not_found.V_not_found'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({
            'not_found button[action=go_to_home]':{
                click: this.goToHome
            }
        }, this);
    },
    /////////////////////////////////////////////////

    //SHOW VIEW
    /*showView: function(){
        if(Ext.ComponentQuery.query('not_found').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'not_found'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('not_found_id'); 
    },*/

    /////////////////////////////////////////////////

    goToHome: function(){
        this.redirectTo('home');
        location.reload();
    }
});
