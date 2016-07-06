Ext.define('CL.controller.C_user_pool', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_user_pool'
    ],
    models: [
        'M_user_pool'
    ],
    views: [
        //'user_pool.V_profile'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    }
    ////////////////////////////////////////////////

});
