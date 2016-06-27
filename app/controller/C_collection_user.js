Ext.define('CL.controller.C_collection_user', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_collection_user'
    ],
    models: [
        'M_collection_user'
    ],
    views: [
        'collection_user.V_list_by_collection'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

        }, this);
    }
    /////////////////////////////////////////////////



});
