Ext.define('CL.view.collection_user.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'collection_user_create',
    itemId: 'collection_user_create_id',
    alias: 'widget.collection_user_create',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    buttonAlign: 'center',

    title: 'Aggiungi Collaboratore',

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
                    html: '<div style="text-align: center">I collaboratori potranno aiutarti a compilare<br>la scheda della Collezione e a <b>caricare nuovi documenti!</b></div><br>'
                },
                {
                    xtype: 'combobox',
                    hideTrigger: true,
                    forceSelection: true,
                    name: 'user_id',
                    emptyText: 'Cerca utente da aggiungere (puoi usare anche il suo ID)',
                    labelAlign: 'top',
                    width: '100%',
                    allowBlank: false,
                    store: 'S_user',
                    queryMode: 'local',
                    anyMatch: true,
                    displayField: 'full_name',
                    valueField: 'id',

                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                            '<div class="x-boundlist-item"><b>{first_name} {last_name}</b> (#{id} - {group_name})</div>',
                        '</tpl>'
                    )
                }
            ]
        }
    ],
    buttons:[
        {
            text: 'Conferma Collaboratore',
            action: 'do_create'
        }
    ]

});
