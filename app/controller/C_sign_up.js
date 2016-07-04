Ext.define('CL.controller.C_sign_up', {
    extend: 'Ext.app.Controller',

    routes: {
        'sign_up' : 'showView',
        'activate/:user_id/:user_salt': 'onActivate',
        'reset_psw/:user_id/:user_salt': 'onResetPassword'
    },

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        'sign_up.V_sign_up'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

            // DO SIGNUP
            "sign_up button[action=do_sign_up]":{
                click: this.doSignUp
            }

        }, this);
    },
    /////////////////////////////////////////////////

    //SHOW VIEW
    showView: function(){
        if(Ext.ComponentQuery.query('sign_up').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'sign_up'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('sign_up_id');

        // ^^
    },

    // ON RESET PSW
    onResetPassword: function (user_id,user_salt) {
        Ext.create("Ext.window.Window",{
            autoShow: true,
            closable: false,
            draggable: false,
            resizable: false,
            title: 'Reset Password',
            padding: 10,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items:[
                {
                    xtype: 'form',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'password',
                            inputType: 'password',
                            fieldLabel: 'Nuova Password',
                            labelWidth: 110,
                            allowBlank: false,
                            minLength: 7
                        }
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: 'Cambia Password',
                            formBind: true,
                            handler: function () {
                                var win = this.up("window"),
                                    form = win.down("form"),
                                    values = form.getValues();

                                win.body.mask("Attendere...");

                                Ext.Ajax.request({
                                    url: 'data/sign_up/reset_password.php',
                                    params: {
                                        user_id: user_id,
                                        user_salt: user_salt,
                                        password: btoa(btoa(btoa(values.password)))
                                    },
                                    success: function(response){
                                        win.body.unmask();
                                        Ext.Msg.alert("Successo!","Password correttamente resettata!");
                                        win.close();

                                        CL.app.getController("C_sign_up").redirectTo("#home");
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        });
    },

    // ON LOST PASSWORD
    onLostPassword: function () {
        var me = this;
        Ext.Msg.prompt( "Reset Password", "Inserisci la mail con cui ti sei registrato", function (btnId,mail) {
            if(btnId=="ok"){
                //alert("TODO: mando una mail contenente la username associata ed il link per il reset della password");
                Ext.Msg.alert("Info","Riceverà a breve una mail con le istruzioni da seguire per il reset della password");
                Ext.Ajax.request({
                    url: 'data/sign_up/lost_password.php',
                    params: {
                        mail: mail
                    }
                });
            }
        });
    },

    // ON ACTIVATE
    onActivate: function (user_id, user_salt) {
        this.redirectTo("home");
        console.log(user_id,user_salt);

        Ext.Ajax.request({
            url: 'data/sign_up/activate.php',
            params: {
                user_id: user_id,
                user_salt: user_salt
            },
            success: function (response) {
                Ext.getBody().unmask();
                var risposta = Ext.JSON.decode(response.responseText);
                if (risposta["success"]) {
                    Ext.create("Ext.window.Window",{
                        animateTarget: Ext.ComponentQuery.query("tbar button[name=app_icon]")[0].el,
                        autoShow: true,
                        modal: true,
                        closable: false,
                        draggable: false,
                        resizable: false,
                        title: 'Perfetto!',
                        padding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'center'
                        },
                        items: [
                            {
                                xtype: 'image',
                                src: 'images/icons/icon_ok.png',
                                alt: " ",
                                width: 60,
                                height: 60
                            },
                            {
                                xtype: 'label',
                                html: '<div style="text-align: center">Utente correttamente attivato!<br>E\' ora possibile effettuare il primo accesso!<br><br><b>Il SITAR ti dà il benvenuto!</b></div>',
                                margin: '10 0 10 0'
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: function () {
                                    this.up("window").close();
                                    CL.app.getController("C_sign_up").redirectTo("#home");
                                }
                            }
                        ]
                    });
                }
            }
        });
    },

    // DO SIGNUP
    doSignUp: function (btn) {
        var form = btn.up("form"),
            values = form.getValues();

        if(form.isValid()){

            Ext.getBody().mask("Attendere...");

            values.password = btoa(btoa(btoa(values.password)));

            Ext.Ajax.request({
                url: 'data/sign_up/sign_up.php',
                params: {
                    data: Ext.JSON.encode(values)
                },
                success: function(response){
                    Ext.getBody().unmask();
                    var risposta = Ext.JSON.decode(response.responseText);
                    if(risposta["success"]){

                        Ext.create("Ext.window.Window",{
                            animateTarget: Ext.ComponentQuery.query("sign_up button[action=do_sign_up]")[0].el,
                            autoShow: true,
                            modal: true,
                            closable: false,
                            draggable: false,
                            resizable: false,
                            title: 'Perfetto!',
                            padding: 10,
                            layout: {
                                type: 'vbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'image',
                                    src: 'images/icons/icon_ok.png',
                                    alt: " ",
                                    width: 60,
                                    height: 60
                                },
                                {
                                    xtype: 'label',
                                    html: '<div style="text-align: center">Informazioni salvate!<br>A breve riceverai un mail<br>contenente il link di attivazione!</div>',
                                    margin: '10 0 10 0'
                                }
                            ],
                            buttonAlign: 'center',
                            buttons: [
                                {
                                    text: 'Avanti',
                                    handler: function () {
                                        this.up("window").close();
                                        CL.app.getController("C_sign_up").redirectTo("#home");
                                    }
                                }
                            ]
                        });
                    }
                    else{
                        Ext.Msg.alert("Attenzione!",risposta["error_message"]);
                    }
                },
                failure: function () {
                    Ext.getBody().unmask();
                    Ext.Msg.alert("Ops...Questo non era previsto :(","Impossibile avviare la richiesta di registrazione: si è verificato un errore interno.<br>Si consiglia di riprovare più tardi e nel caso contattare gli amministratori di sistema.");
                }
            });
        }
    }
});
