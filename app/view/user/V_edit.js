Ext.define('CL.view.user.V_edit', {
    extend: 'Ext.panel.Panel',
    xtype: 'user_sign_up',
    itemId: 'user_edit_id',
    alias: 'widget.user_edit',

    bodyStyle: 'backgroundColor: transparent',

    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'center'
    },

    padding: "30 0 30 0",

    items: [
        {
            xtype: 'image',
            src: 'images/colonna.png',
            height: 450,
            width: 250,
            alt: ' ',
            margin: '0 7 0 0'
        },
        {
            xtype: 'form',
            title: 'Modifica Informazioni Profilo',

            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },

            width: 450,

            border: true,

            bodyPadding: 10,
            items: [
                {
                    xtype: 'textfield',
                    name: 'first_name',
                    fieldLabel: 'Nome',
                    width: '100%',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'last_name',
                    fieldLabel: 'Cognome',
                    width: '100%',
                    allowBlank: false
                },
                {
                    xtype: 'combobox',
                    name: 'affiliation_id',
                    fieldLabel: 'Ente Appartenenza',
                    queryMode: 'local',
                    anyMatch: true,
                    displayField: 'full_name',
                    valueField: 'id',
                    store: 'S_ente',
                    width: '100%',
                    forceSelection: true,
                    allowBlank: false
                }
            ],
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Salva Modifiche',
                    formBind: true,
                    action: 'do_edit',
                    cls: 'mybutton',
                    icon: 'images/icons/icon_flag_ok.png'
                }
            ]
        },
        {
            xtype: 'image',
            src: 'images/colonna.png',
            height: 450,
            width: 250,
            alt: ' ',
            margin: '0 0 0 7'
        }
    ]
});


