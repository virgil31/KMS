Ext.define('CL.controller.C_event_external_resource', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_event_external_resource'
    ],
    models: [
        'M_event_external_resource'
    ],
    views: [
        'event_external_resource.V_list_by_event',
        'event_external_resource.V_create',
        'event_external_resource.V_edit'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

            //ON CREATE
           'event_external_resource_list_by_event button[action=on_create]':{
               click: this.onCreate
           },

            //DO CREATE
            "event_external_resource_create button[action=do_create]":{
                click: this.doCreate
            },

            //DO EDIT
            "event_external_resource_edit button[action=do_edit]":{
                click: this.doEdit
            }
        }, this);
    },
    /////////////////////////////////////////////////

    // ON CREATE
    onCreate: function (btn) {
        var event_id = (window.location.hash.split("/"))[1];

        CL.app.getController("C_permessi").canWriteEvent(event_id, true,function(){
            Ext.widget("event_external_resource_create",{
                animateTarget: btn.el
            });
        });
    },

    // DO CREATE
    doCreate: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues();


        var event_id = (window.location.hash.split("/"))[1];
        values.event_id = event_id;

        if(form.isValid()){
            Ext.StoreManager.lookup("S_event_external_resource").add(values);
            Ext.StoreManager.lookup("S_event_external_resource").sync();
            win.close();
            setTimeout(function(){
                Ext.toast({
                    title: 'Successo',
                    html: 'Risorsa aggiunta correttamente!',
                    align: 'br'
                });
            }, 500);
        }
    },

    //ON EDIT
    onEdit: function(record, targetEl){

        var win = Ext.widget("event_external_resource_edit",{
            animateTarget: targetEl
        });

        var form = win.down("form").getForm();

        form.loadRecord(record);
    },

    //DO EDIT
    doEdit: function(btn){
        var window = btn.up('window'),
            form = window.down("form").getForm(),
            record = form.getRecord(),
            values = form.getValues();

        Ext.Msg.confirm('Attenzione!', "Modificare le info della risorsa esterna?",function(btn){
            if (btn === 'yes'){
                record.set(values);
                Ext.StoreManager.lookup("S_event_external_resource").sync({
                    callback: function () {
                        Ext.StoreManager.lookup("S_event_external_resource").reload();
                        setTimeout(function(){
                            Ext.toast({
                                title: 'Successo',
                                html: 'Risorsa modificata correttamente!',
                                align: 'br'
                            });
                        }, 500);
                    }
                });
                window.close();
            }
        });
    }

    /*
    //ON EDIT
    onEdit: function(record){
        var win = Ext.widget("event_external_resource_edit"),
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
    }*/

});