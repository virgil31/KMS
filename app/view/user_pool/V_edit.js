Ext.define('CL.view.user_pool.V_edit', {
    extend: 'Ext.window.Window',
    xtype: 'user_pool_edit',
    itemId: 'user_pool_edit_id',
    alias: 'widget.user_pool_edit',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,
    resizable: false,

    title: 'Modifica Gruppo',

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
                    name: 'pool_name',
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
                        '<div class="x-boundlist-item"><b>{last_name} {first_name}</b> (#{id} - {group_name})</div>',
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
                    handler: function(){ CL.app.getController("C_user_pool").doEdit(this); }
                }
            ]
        }
    ]

});