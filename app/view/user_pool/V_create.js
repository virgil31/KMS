Ext.define('CL.view.user_pool.V_create', {
    extend: 'Ext.window.Window',
    xtype: 'user_pool_create',
    itemId: 'user_pool_create_id',
    alias: 'widget.user_pool_create',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,
    resizable: false,

    title: 'Nuovo Gruppo',

    width: 350,

    items: [
        {
            xtype: 'form',
            padding: 10,
            defaults: {
                width: "100%"
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: 'Nome Gruppo',
                    labelAlign: 'top',
                    emptyText: "ad es. 'Tecnici Corsair'",
                    minLength: 10,
                    allowBlank: false
                },
                {
                    xtype: 'tagfield',
                    name: 'user_ids',
                    store: 'S_user',
                    fieldLabel: 'Seleziona Utenti',
                    labelAlign: 'top',
                    width: '100%',
                    filterPickList: true,
                    allowBlank: false,
                    hideTrigger: true,
                    minChars: 3,

                    displayField: 'full_name',
                    valueField: 'id',

                    queryMode: 'local',
                    anyMatch: true,

                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item"><b>{first_name} {last_name}</b> (#{id} - {group_name})</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{first_name} {last_name}',
                        '</tpl>'
                    )

                }
            ],
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Conferma!',
                    icon: 'images/icons/icon_flag_ok.png',
                    formBind: true,
                    handler: function(){ CL.app.getController("C_user_pool").doCreate(this); }
                }
            ]
        }
    ]

});