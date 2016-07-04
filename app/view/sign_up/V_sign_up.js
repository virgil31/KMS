Ext.define('CL.view.sign_up.V_sign_up', {
    extend: 'Ext.panel.Panel',
    xtype: 'sign_up',
    itemId: 'sign_up_id',
    alias: 'widget.sign_up',

    bodyStyle: 'backgroundColor: transparent',

    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'center'
    },

    listeners: {
        afterRender: function(){
            this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                enter: function(){Ext.ComponentQuery.query('sign_up button[action=do_sign_up]')[0].fireEvent("click");}
            });
        }
    },

    padding: "30 0 30 0",

    items: [
        {
            xtype: 'image',
            src: 'images/colonna.png',
            height: 450,
            width: 300,
            alt: ' ',
            margin: '0 7 0 0'
        },
        {
            xtype: 'form',
            title: 'Registrazione KMS',

            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },

            width: 350,

            border: true,

            bodyPadding: 10,
            items: [
                {
                    xtype: 'textfield',
                    name: 'first_name',
                    fieldLabel: 'Nome',
                    width: '100%',
                    allowBlank: false,
                    value: 'pippo'
                },
                {
                    xtype: 'textfield',
                    name: 'last_name',
                    fieldLabel: 'Cognome',
                    width: '100%',
                    allowBlank: false,
                    value: 'pippi'
                },
                {
                    xtype: 'combobox',
                    name: 'ente_id',
                    fieldLabel: 'Ente Appartenenza',
                    queryMode: 'local',
                    anyMatch: true,
                    displayField: 'full_name',
                    valueField: 'id',
                    store: 'S_ente',
                    width: '100%',
                    forceSelection: true,
                    allowBlank: false,
                    value: '1'
                },
                {
                    xtype: 'textfield',
                    name: 'mail',
                    fieldLabel: 'Email',
                    width: '100%',
                    allowBlank: false,
                    value: 'lucacerini92@gmail.com'
                },
                {
                    xtype: 'textfield',
                    name: 'username',
                    fieldLabel: 'Username',
                    width: '100%',
                    allowBlank: false,
                    value: 'provaprova'
                },
                {
                    xtype: 'textfield',
                    name: 'password',
                    fieldLabel: 'Password',
                    inputType: 'password',
                    width: '100%',
                    allowBlank: false,
                    minLength: 7,
                    value: 'provaprova'
                }
            ],
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Conferma Dati',
                    formBind: true,
                    action: 'do_sign_up',
                    cls: 'mybutton',
                    icon: 'images/icons/icon_flag_ok.png'
                }
            ]
        },
        {
            xtype: 'image',
            src: 'images/colonna.png',
            height: 450,
            width: 300,
            alt: ' ',
	        margin: '0 0 0 7'
        }
    ]
});


