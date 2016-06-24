Ext.define('CL.controller.C_collection_file', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_collection_file'
    ],
    models: [
        'M_collection_file'
    ],
    views: [
        'collection_file.V_list_by_collection',
        'collection_file.V_edit'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({
            'collection_file_edit button[action=do_edit]':{
                click: this.doEdit
            }
        }, this);
    },
    /////////////////////////////////////////////////

    //ON EDIT
    onEdit: function(record){
        var win = Ext.widget("collection_file_edit"),
            form = win.down("form").getForm();

        form.loadRecord(record);
    },

    //DO EDIT
    doEdit: function(btn){
        var window = btn.up('window'),
            form = window.down("form").getForm(),
            record = form.getRecord(),
            values = form.getValues();

        console.log(record);

        Ext.Msg.confirm('Attenzione!', "Modificare il documento?",function(btn){
            if (btn === 'yes'){
                record.set(values);
                window.close();
            }
        });
    }

});
