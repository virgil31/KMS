Ext.define('CL.view.collection_user.V_create_group', {
    extend: 'Ext.window.Window',
    xtype: 'collection_user_create_group',
    itemId: 'collection_user_create_group_id',
    alias: 'widget.collection_user_create_group',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,

    buttonAlign: 'center',

    title: 'Aggiungi Gruppo di Collaboratori',

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
                    name: 'pool_id',
                    emptyText: 'Cerca gruppo da aggiungere (puoi usare anche il suo ID)',
                    labelAlign: 'top',
                    width: '100%',
                    store: 'S_user_pool',
                    queryMode: 'local',
                    anyMatch: true,
                    displayField: 'pool_full_name',
                    valueField: 'pool_id',
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item"><b>{pool_name}</b> (#{pool_id})</div>',
                        '</tpl>'
                    ),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{pool_name}',
                        '</tpl>'
                    ),
                    listeners:{
                        select: function () {
                            var pool_id = this.getValue(),
                                pool_name = this.getRawValue(),
                                combo = this;

                            Ext.Msg.confirm("Info","Sicuro di voler aggiungere tutti gli utenti nel gruppo:<br> <b>"+pool_name+"</b>?",function (btnId) {
                                if(btnId == "yes"){
                                    CL.app.getController("C_collection_user").doCreateGroup(pool_id);
                                    combo.up("window").close();
                                }
                                else
                                    combo.reset();
                            });
                        }
                    }
                },
                {
                    xtype: 'label',
                    html: '<b>Oppure</b><br><br>'
                },
                {
                    xtype: 'button',
                    cls: 'mybutton',
                    text: 'Crea/Gestisci i tuoi gruppi!',
                    handler: function () {
                        alert("todo manage my group");
                    }
                }
            ]
        }
    ]

});
