Ext.define('CL.view.event_file.V_edit', {
    extend: 'Ext.window.Window',
    xtype: 'event_file_edit',
    itemId: 'event_file_edit_id',
    alias: 'widget.event_file_edit',



    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    listeners: {
        //fadein on show
        show : function(window) {
            window.getEl().setOpacity(0);
            window.getEl().fadeIn({duration: 500});
        },
        //fadeout on close
        beforeclose : function(window) {
            if(!window.shouldClose) {
                window.getEl().fadeOut({duration: 500, callback: function() {
                    window.shouldClose = true;
                    window.close();
                }});
            }
            return window.shouldClose ? true : false; //window.shouldClose ? true : false;
        }
    },

    buttonAlign: 'center',

    title: 'Modifica Documento',

    width: 500,
    padding: 15,

    items: [
        {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'title',
                    fieldLabel: 'Titolo',
                    labelAlign: 'top',
                    width: '100%',
                    allowBlank: false
                }
            ]
        }
    ],
    buttons:[
        {
            text: 'Salva e Conferma',
            action: 'do_edit'
        }
    ]

});
