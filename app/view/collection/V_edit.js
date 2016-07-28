Ext.define('CL.view.collection.V_edit', {
    extend: 'Ext.window.Window',
    xtype: 'collection_edit',
    itemId: 'collection_edit_id',
    alias: 'widget.collection_edit',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,


    title: 'Modifica Informazione Collezione',

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
                    xtype: 'textfield',
                    name: 'title',
                    minLength: 15,
                    maxLength: 80,
                    emptyText: "Titolo",
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',
                    fieldLabel: 'Titolo'
                },
                {
                    xtype: 'textareafield',
                    name: 'description',
                    minLength: 15,
                    maxLength: 270,
                    emptyText: "Descrizione",
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',
                    fieldLabel: 'Descrizione'
                },
                {
                    xtype: 'combobox',
                    name: 'license_id',
                    fieldLabel: 'Licenza',
                    width: '100%',
                    allowBlank: false,
                    labelAlign: 'top',
                    editable: false,
                    store: 'S_license',
                    valueField: 'id',
                    displayField: 'name',
                    tpl: Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain" ><tpl for=".">',
                        '<li role="option" class="x-boundlist-item" data-qtip="{description}">' +
                        '{name}' +
                        '</li>',
                        '</tpl></ul>'
                    )
                }
            ],
            buttonAlign: 'center',
            buttons:[
                {
                    text: 'Salva Modifiche',
                    action: 'do_edit',
                    formBind: true
                }
            ]
        }
    ]

});
