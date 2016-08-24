Ext.define('CL.view.event_external_resource.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'event_external_resource_create',
    itemId: 'event_external_resource_create_id',
    alias: 'widget.event_external_resource_create',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    buttonAlign: 'center',

    title: 'Aggiungi Riferimento a Risorsa Esterna',

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
                    xtype: 'label',
                    html: '<div style="text-align: center">Una risorsa esterna racchiude del contenuto<br>presente su piattaforme al di fuori di KMS. Potrebbe essere utile ad esempio<br>per associare dei video <b>senza dover ripetere il loro caricamento</b>.</div><br>'

                },
                {
                    xtype: 'textfield',
                    emptyText: 'https://www.youtube.com/watch?v=t8Xaet7OpaM',
                    name: 'url',
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'right',
                    labelWidth: 35,
                    fieldLabel: 'Url'
                },
                {
                    xtype: 'textfield',
                    name: 'title',
                    emptyText: "Presentazione nuovo sistema d'illuminazione",
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'right',
                    labelWidth: 35,
                    fieldLabel: 'Titolo'
                },
                {
                    xtype: 'combobox',
                    forceSelection: true,
                    labelWidth: 35,
                    name: 'type_id',
                    emptyText: 'Video',
                    fieldLabel: 'Tipo',
                    labelAlign: 'right',
                    width: '100%',
                    allowBlank: false,
                    store: 'S_external_resource_type',
                    queryMode: 'local',
                    anyMatch: true,
                    displayField: 'name',
                    valueField: 'id'

                }
            ]
        }
    ],
    buttons:[
        {
            text: 'Aggiungi risorsa esterna',
            action: 'do_create'
        }
    ]

});
