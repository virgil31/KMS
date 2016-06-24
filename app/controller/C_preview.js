Ext.define('CL.controller.C_preview', {
    extend: 'Ext.app.Controller',

    showWindowPreview: function(animateTarget,file_id,title){

        var main_panel;

        Ext.Ajax.request({
            url: 'data/preview/getExtensionById.php',
            params:{
                file_id: file_id
            },
            success: function(response, opts) {
                var obj = Ext.JSON.decode(response.responseText);

                switch (obj["extension"]){
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'tif':
                    case 'tiff':
                        main_panel = {
                            xtype: "imageviewer",
                            src: 'data/preview/image.php?file_id='+file_id,
                            height: 830
                        };
                        break;

                    case 'pdf':
                        main_panel = {
                            xtype: "component",
                            width: '100%',
                            height: '100%',
                            autoEl: {
                                tag: "iframe",
                                //src: "lib/pdfjs/web/viewer.html?file=compressed.tracemonkey-pldi-09.pdf"  //DEFAULT
                                src: "lib/pdfjs/web/viewer.html?file=..%2F..%2F..%2Fdata%2Fpreview%2Fpdf.php%3Ffile_id%3D"+file_id
                            }
                        };
                        break;

                    case "txt":
                    case "sql":
                    case "jgw":
                    case "tmp":
                    case "tfw":
                        main_panel =  {
                            xtype: "component",
                            name: 'comp_preview',
                            width: '100%',
                            height: '100%',
                            border: false,
                            autoEl: {
                                tag: "iframe",
                                src: 'data/preview/textual.php?file_id='+file_id
                            }
                        };
                        break;

                    // DOCX -> http://stackoverflow.com/questions/4587216/how-can-i-convert-a-docx-document-to-html-using-php
                    // ZIP - RAR
                    case "doc":
                    case "docx":
                        main_panel =  {
                            xtype: "component",
                            name: 'comp_preview',
                            width: '100%',
                            height: '100%',
                            border: false,
                            autoEl: {
                                tag: "iframe",
                                src: 'data/preview/office_iframe.php?file_id='+file_id
                            }
                        };
                        break;


                    default:
                        Ext.Msg.alert("Attenzione!","Impossibile vedere l'anteprima del formato <b>"+obj["extension"]+"</b>");
                        return;
                }


                Ext.create("Ext.window.Window",{
                    resizable: false,
                    constrain: true,
                    modal: true,
                    autoShow: true,
                    title: "Anteprima di <b>" + title + "</b>",//'Anteprima Documento',
                    width: 950,
                    height: 800,
                    animateTarget: animateTarget,
                    items: [
                        main_panel
                    ]
                });


            }
        });




    }

});
