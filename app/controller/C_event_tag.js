Ext.define('CL.controller.C_event_tag', {
    extend: 'Ext.app.Controller',

    stores: [
        'S_event_tag'
    ],
    models: [
        'M_event_tag'
    ],
    views: [
        'event_tag.V_list_by_event',
        'event_tag.V_create'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

            //ON CREATE
           'event_tag_list_by_event button[action=on_create]':{
               click: this.onCreate
           },

            //DO CREATE
            "event_tag_create button[action=do_create]":{
                click: this.doCreate
            }

        }, this);
    },
    /////////////////////////////////////////////////
    
    // ON CREATE
    onCreate: function (btn) {
        var event_id = (window.location.hash.split("/"))[1];

        CL.app.getController("C_permessi").canWriteEvent(event_id, true,function(){
            Ext.widget("event_tag_create",{
                animateTarget: btn.el
            });
        });
    },

    // DO CREATE
    doCreate: function (btn) {
        var win = btn.up("window"),
            form = win.down("form"),
            values = form.getValues();

        values.event_id = (window.location.hash.split("/"))[1];
        

        if(form.isValid()){
            win.mask("Tagging in corso...");

            Ext.StoreManager.lookup("S_event_tag").add(values);

            Ext.StoreManager.lookup("S_event_tag").sync({
                callback: function () {
                    win.close();
                    Ext.StoreManager.lookup("S_event_tag").reload();

                    setTimeout(function(){
                        Ext.toast({
                            title: 'Successo',
                            html: 'TAG aggiunto correttamente!',
                            align: 'br'
                        });
                    }, 500);
                }
            });
        }
    }
    
});
