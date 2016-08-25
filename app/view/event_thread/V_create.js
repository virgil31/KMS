Ext.define('CL.view.event_thread.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'event_thread_create',
    itemId: 'event_thread_create_id',
    alias: 'widget.event_thread_create',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    buttonAlign: 'center',

    title: 'Crea una Nuova Discussione',

    width: 700,
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
                    xtype: 'label',
                    html: '<div style="text-align: center;;">Prima di iniziare una nuova discussione si prega <u>sempre</u> di: <ul><li>rispettare gli altri utenti</li><li>mantenere un profilo educato e pro-positivo </li><li>non scrivere TUTTO IN MAIUSCOLO</li><li><b>rispettare il buon senso comune :)</b></li></ul><br></div>'
                },
                {
                    xtype: 'combobox',
                    store: Ext.create('Ext.data.Store', {
                            data: [
                                {"value": "",                         "display": "-Nessun Prefisso-"},
                                {"value": "[DOMANDA]",                "display": "[DOMANDA]"},
                                {"value": "[PROBLEMA]",               "display": "[PROBLEMA]"},
                                {"value": "[GUIDA]",                  "display": "[GUIDA]"},
                                {"value": "[RICHIESTA MODIFICHE]",    "display": "[RICHIESTA MODIFICHE]"}
                            ]
                        }),
                    name: 'prefix',
                    width: '100%',
                    labelAlign: 'top',
                    fieldLabel: 'Prefisso',
                    displayField: "display",
                    valueField: "value",
                    editable: false,
                    allowBlank: false,
                    value: ""
                },
                {
                    xtype: 'textfield',
                    name: 'title',
                    minLength: 15,
                    maxLength: 80,
                    emptyText: "Titolo della discussione qui",
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',
                    fieldLabel: 'Titolo'
                },
                {
                    xtype: 'htmleditor',
                    name: 'message',
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',
                    fieldLabel: 'Messaggio',


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
            text: 'Avvia la Discussione!',
            action: 'do_create'
        }
    ]

});
