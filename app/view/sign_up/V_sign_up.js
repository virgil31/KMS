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
                    name: 'username',
                    fieldLabel: 'Username',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'mail',
                    fieldLabel: 'Email  ',
                    allowBlank: false
                },  
                {
                    xtype: 'textfield',
                    name: 'password',
                    fieldLabel: 'Password',
                    inputType: 'password',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'ripet_password',
                    fieldLabel: 'Ripeti Password',
                    inputType: 'password',
                    allowBlank: false
                }
            ],
            buttons: [
                {
                    text: 'sign_up',
                    formBind: true,
                    action: 'do_sign_up'
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


