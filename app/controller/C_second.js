Ext.define('CL.controller.C_second', {
    extend: 'Ext.app.Controller',

    routes: {
        'second/:aaa' : 'showView',
        'second/:aaa/:bbb' : 'showView'
    },

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        'second.V_second'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({
            

        }, this);
    },
    /////////////////////////////////////////////////

    //SHOW VIEW
    showView: function(param1,param2){
        //Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);

        if(Ext.ComponentQuery.query('second').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'second'});            

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('second_id'); 

        Ext.ComponentQuery.query('second textfield[name=param1]')[0].setValue(param1);
        Ext.ComponentQuery.query('second textfield[name=param2]')[0].setValue(param2);
    }

});
