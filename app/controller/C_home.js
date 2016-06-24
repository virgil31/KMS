Ext.define('CL.controller.C_home', {
    extend: 'Ext.app.Controller',

    routes: {
        'home' : 'showView'
    },

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        'home.V_home'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({

            // LOAD USER
            'home button[action=load_user]':{
                click: this.loadUser
            },


            // TEST WINDOW
            'home button[action=test_window]':{
                click: this.testWindow
            },

            //GO TO OTHER VIEW
            'home button[action=go_to_second_view]':{
                click: this.goToSecondView
            }


        }, this);
    },
    /////////////////////////////////////////////////

    //ROUTES

    showView: function(){
        //Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);
        
        if(Ext.ComponentQuery.query('home').length == 0)
            Ext.ComponentQuery.query('viewport panel[name=card]')[0].add({xtype: 'home'});

        Ext.ComponentQuery.query('viewport panel[name=card]')[0].getLayout().setActiveItem('home_id'); 
    },

    /////////////////////////////////////////////////


    //LOAD USER
    loadUser: function(){
        Ext.ComponentQuery.query('home grid')[0].getStore().load();
    },


    // TEST WINDOW
    testWindow: function(btn){
        Ext.create('Ext.window.Window',{
            title: 'Test Window',

            autoShow: true,
            constrain: true,

            bodyPadding: 10,

            animateTarget: btn,

            modal: true,

            layout: 'fit',

            width: 300,
            height: 200,

            maximizable: true,

            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'username',
                            fieldLabel: 'Username',
                            width: '100%',
                            allowBlank: false
                        }, 
                        {
                            xtype: 'textfield',
                            name: 'password',
                            fieldLabel: 'Password',
                            width: '100%',
                            inputType: 'password',
                            allowBlank: false
                        }
                    ],
                    buttons: [
                        {
                            text: 'Login',
                            formBind: true,
                            action: 'do_login'
                        }
                    ]
                }
            ] 
        });
    },

    
    //GO TO OTHER VIEW
    goToSecondView: function(){
        var aaa = Math.floor((Math.random() * 100) + 1);
        var bbb = Math.floor((Math.random() * 100) + 1);
        this.redirectTo('second/'+aaa+"/"+bbb);
    }
    

});
