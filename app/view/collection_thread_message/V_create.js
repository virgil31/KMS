Ext.define('CL.view.collection_thread_message.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'collection_thread_message_create',
    itemId: 'collection_thread_message_create_id',
    alias: 'widget.collection_thread_message_create',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    buttonAlign: 'center',

    title: 'Rispondi alla discussione',

    width: 800,
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
                    xtype: 'htmleditor',
                    name: 'message',
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',

                    listeners: {
                        render:  function () {
                            this.bodyEl.setStyle("border","1px solid #dddddd");
                        }
                    },

                    enableColors: false,
                    enableAlignments: false,
                    enableFont: false,
                    enableFontSize: false,
                    enableLists: false,
                    enableSourceEdit: false
                    //enableFormat: false,
                    //enableLinks: false
                }
            ]
        }
    ],
    buttons:[
        {
            text: 'Invia Messaggio',
            action: 'do_create'
        }
    ]

});
