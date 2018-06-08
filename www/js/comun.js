/**
 * Conexión a internet
 **/
document.addEventListener("offline", checkConnectionOffline, true)

function checkConnectionOffline() {

    var networkState = navigator.connection.type;

    if (networkState === Connection.NONE) {
        swal({
            title: '!Atención¡',
            type: 'error',
            confirmButtonText: 'Reintentar',
            animation: false,
            text: 'No cuentas con conexión a internet, para esta aplicación es necesaria la conexión, intenta de nuevo',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: () => {
                window.location.replace("index.html");
            }
        })
    }
}

/*
function onOffline() {
    // Handle the offline event
    console.log("Se perdio la conexión de internet, intenta de nuevo")
    
//    swal({
//        title: '!Atención¡',
//        type: 'error',
//        confirmButtonText: 'Reintentar',
//        animation: false,
//        text: 'Se perdio la conexión de internet, intenta de nuevo',
//        showLoaderOnConfirm: true,
//        allowOutsideClick: false,
//        preConfirm: () => {
//            window.location.replace("index.html")
//        }
//    })
//    
//    throw new Error("Something went badly wrong!")
}

document.addEventListener("online", onOnline, false)

function onOnline() {

    var networkState = navigator.connection.type;

    var states = {};

    states[Connection.UNKNOWN]  = 'Conexión desconocida'
    states[Connection.ETHERNET] = 'Conexión ethernet'
    states[Connection.WIFI]     = 'Conexión wiFi'
    states[Connection.CELL_2G]  = 'Conexión Red 2G'
    states[Connection.CELL_3G]  = 'Conexión Red 3G'
    states[Connection.CELL_4G]  = 'Conexión Red 4G'
    states[Connection.CELL]     = 'Conexión generica'
    states[Connection.NONE]     = 'No hay conexión a internet'

    if (networkState !== Connection.NONE) {
        console.log('Connection type: ' + networkState)
    }
    else {
        console.log('No cuentas con conexión a internet, para esta aplicación es necesaria la conexión, intenta de nuevo')
        
//        swal({
//            title: '!Atención¡',
//            type: 'error',
//            confirmButtonText: 'Reintentar',
//            animation: false,
//            text: 'No cuentas con conexión a internet, para esta aplicación es necesaria la conexión, intenta de nuevo',
//            showLoaderOnConfirm: true,
//            allowOutsideClick: false,
//            preConfirm: () => {
//                window.location.replace("index.html");
//            }
//        })
        
        throw new Error("Something went badly wrong!")
    }
}
*/

var auth    = {};
var confApp = {};
var ruta    = "http://admin.lealtadprimero.com.mx/servicio/index.php";
var cliente = '9999';

/**
 * Document Ready
 **/
$( document ).ready(function() {
    if(localStorage.getItem('auth') !== null) {
        refresh();
    }
    
//    getConf();
});

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : refresh()
 **/
function refresh() {
    
    let registro = JSON.parse(localStorage.getItem('auth'));
    
    try {
        $("#lblNombreMenu").html(registro.nombre);
        $("#lblPuntos").html("Tienes "+registro.puntos+" puntos.");
    }
    catch(errorThrown) {
        console.log("funcion: refresh()");
        console.log("Error: " + errorThrown);

        swal({
            title: 'Error!',
            text: 'Ocurrio un error, por favor intentelo de nuevo',
            type: 'error',
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar'
        })
    } 
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : consumedPoints()
 **/
function consumedPoints() {

    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion       : 'puntosUsados',
            numeroTarjeta : localStorage['tarjeta'],
            idCliente     : '2' //Se cambio a 2 para que apunte a wingstop 
        },
        success: function(resp) {
            $('#p_cons').html((resp.puntos+"") == "null" ? "0" : resp.puntos+" pts.");
        },
        error: function (errorThrown) {
            console.log("funcion: consumedPoints()");
            console.log("Error: " + errorThrown);

            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            });
        }
    }); 
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : getConf()
 **/
//function getConf() {
//    
//    let configApp = JSON.parse(localStorage.getItem('confApp'));
//    
//    if( configApp == null ) {
//        
//        $.ajax({
//            method: 'POST',
//            url: ruta,
//            data: {
//                funcion  : 'configuracion',
//                idCliente: cliente  
//            },
//            processData: true,
//            dataType: 'JSON',
//            success: function(data) {
//                localStorage.setItem("confApp", JSON.stringify(data));
//            },
//            error: function(XMLHttpRequest, textStatus, errorThrown) {
//                console.log("funcion: getConf()");
//                console.log("Status: " + textStatus); 
//                console.log("Error: " + errorThrown);
//                
//                swal({
//                    title: 'Error!',
//                    text: 'Ocurrio un error, por favor intentelo de nuevo',
//                    type: 'error',
//                    allowOutsideClick: false,
//                    confirmButtonText: 'Aceptar'
//                })
//            }
//        });
//    }
//}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : authentication()
 **/
function authentication() {
    
    //Ocultar warning
    $("#alertaLogin").html("").hide();
    
    if( $("#numeroTarjeta" ).val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu usuario').show();
    }   
    else if( $("#contrasena").val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu contraseña').show();
    }
    else {
        $("#alertaLogin").html("").hide();
        
        async function doAjax() {
            swal({
                title: 'Espere un momento...',
                text: 'Validando usuario',
                allowOutsideClick: false,
                onOpen: () => {
                    swal.showLoading()
                }
            })
            
            try {
                const result = await $.ajax({
                    url: ruta,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        funcion       : 'ingreso',
                        idCliente     : '2',    //Se cambio a 2 para que apunte a wingstop
                        numeroTarjeta : $("#numeroTarjeta").val().trim(),
                        password      : $("#contrasena").val().trim(),
                    }
                })
                
                if( result.error == '' ) {
                    localStorage.setItem('seLogueo', '1')
                    localStorage.setItem('tarjeta', result.numeroTarjeta)
                    auth.login(result.nombre, result.email, result.puntos, result.puntosPorPeso, result.codigo)
                }
                else {
                    $("#alertaLogin").html(result.error).show()
                    swal.close() 
                }

            } catch (error) {
                console.error(error);
                console.log("funcion: authentication()")
                console.log("Error: " + error)

                swal({
                    title: 'Error!',
                    text: 'Ocurrio un error, por favor intentelo de nuevo',
                    type: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: 'Aceptar'
                })
            }
        }
        
        doAjax()
    }
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : changePassword()
 **/
function changePassword() {
    
    let email        = $("#email").val().trim();
    let valida_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if( email == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu email').show();
    }
    else if (!valida_email.test(email)) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Correo Invalido').show();
    }
    else {
        $("#alertaLogin").html("").hide();
        
        $.ajax({
            url: ruta,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion   : 'recuperarContrasena',
                idCliente : '2',    //Se cambio a 2 para que apunte a wingstop
                email     : $("#email").val().trim()},
            success:function(resp) { 
                swal({
                    title: 'Espere un momento...',
                    text: 'Validando email',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    timer: 1500,
                    onOpen: () => {
                        swal.showLoading()
                    }
                }).then(() => {
                    if( resp.error == '' ) {
                        swal({
                            title: '!Atención¡',
                            type: 'info',
                            confirmButtonText: 'Ir a página principal',
                            animation: false,
                            text: 'Su contraseña ha sido a enviada por correo electrónico.',
							showLoaderOnConfirm: true,
                            allowOutsideClick: false,
							preConfirm: () => {
								window.location.replace("index.html");
							}
					    })
                    }
                    else {
                        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;'+resp.error).show();
                    }
                })
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("funcion: changePassword()");
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown);
                
                swal({
                    title: 'Error!',
                    text: 'Ocurrio un error, por favor intentelo de nuevo',
                    type: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: 'Aceptar'
                })
            }
        });
    }
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : getLoyaltyPiercings()
 **/
function getLoyaltyPiercings() {
    
    $.ajax({
        method: 'POST',
        url: ruta,
        data: {
            funcion       : 'damePerforaciones',
            idCliente     : '2', //Se cambio a 2 para que apunte a Wingstop
            numeroTarjeta : localStorage['tarjeta']
        },
        processData: true,
        dataType: "json",
        success: function(data) {
            for( let i = 1; i <= parseInt(data.mensaje); i++ ) {
                $("#slot"+i).attr('src', 'https://a5f8e58372715ad8da92-946fca8d31c7ab353cb4968b59b10204.ssl.cf1.rackcdn.com/2262536f08131599f960793987440ae4-20170228T180318Z.png');
            }
        },
        error: function (errorThrown){
            console.log("funcion: ready");
            console.log("Error: " + errorThrown);

            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    });
}
/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : obtenerDatosPersonales
 *  @desc     : función para obtener los datos personales del usuarios
 **/
function obtenerDatosPersonales() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion       : 'perfil',
            idCliente     : '2',    //Se cambio a 2 para que apunte a wingstop
            numeroTarjeta : localStorage['tarjeta']
        },
        success:function(resp) {
            
            if ( resp.nacimiento != '0000-00-00' ) {
                $('#txtCumple').prop('disabled', 'disabled');
            }
            
            if( resp.error == '' ) {
                $("#txtTarjeta").html(localStorage['tarjeta']);    
                $("#txtNombre").html(resp.nombre);
                $("#txtSexo").val(resp.sexo);
                $("#txtCumple").val(resp.nacimiento);
                $("#txtCorreo").val(resp.email); 
                $("#txtTelefono").val(resp.telefonoTrabajo); 
                $("#txtEstado").val(resp.idEstado); 
                $("#txtColonia").val(resp.colonia); 
                $("#txtMunicipio").val(resp.idMunicipio);
                $("#txtCp").val(resp.cp);
                $("#txtpass").val(resp.password);  
                $("#txtTelefono2").val(resp.telefonoHogar);
                
                $.ajax({
                    url: ruta,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        funcion   : 'municipios',
                        idCliente : cliente,
                        idEstado  : resp.idEstado
                    },
                    success:function(re) {
                        
                        var d = document.getElementById('txtMunicipio');
                        
                        while( d.hasChildNodes() )
                            d.removeChild(d.firstChild);
                        
                        for( var i = 0; i < re.length; i++ ) {
                            if( re[i].id == resp.idMunicipio ){
                                $('#txtMunicipio').append('<option value="'+re[i].id+'">'+re[i].nombre+'</option>')
                            }
                        }
                    },
                    error: function(re){
                        swal({
                            title: 'Error!',
                            text: 'Ocurrio un error, por favor intentelo de nuevo',
                            type: 'error',
                            allowOutsideClick: false,
                            confirmButtonText: 'Aceptar'
                        })
                    }
                });
            }
            else {
                swal({
                    title: 'Error!',
                    text: 'Ocurrio un error, por favor intentelo de nuevo',
                    type: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: 'Aceptar'
                })
            }    
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: obtenerDatosPersonales()");
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown);
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    });
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : register()
 **/
function register() {
    
    //Limpiar warning
    $("#alertaRegistro").hide();
        
    //Validar fecha
    let dia   = $('#fecha_dia').val();
    let mes   = $('#fecha_mes').val();
    let anio  = $('#fecha_ano').val();
    let fecha = dia+'/'+mes+'/'+anio;
    
    //Validar email
    let email        = $("#email").val().trim();
    let valida_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if( !$("#politicas")[0].checked ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Antes tienes que estar de acuerdo con las políticas de privacidad.').show();
    }
    else if( $('#nombre').val() == "" || $('#email').val() == "" || $('#sexo').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Verifique que todos los campos estén llenos').show();
    }
    else if( !isDate(fecha) ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha no valida').show();
    }
    else if (!valida_email.test(email)) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Correo Invalido').show();
    }
    else {
        $.ajax({
            method: 'POST',
            url: ruta,
            dataType: 'JSON',
            data: {
                funcion         : 'preregistroSinQr',
                idCliente       : '2',  //Se cambio a 2 para que apunte a wingstop
                nombre          : $('#nombre').val(),
                email           : $('#email').val(),
                sexo            : $('#sexo').val(),
                fechaNacimiento : fecha
            },
            success: function(data) {
                
                swal({
                    title: 'Espere un momento...',
                    text: 'Validando email',
                    allowOutsideClick: false,
                    showLoaderOnConfirm: true,
                    timer: 1500,
                    onOpen: () => {
                        swal.showLoading()
                    }
                }).then(() => {
                    if( data.error != '' ) {
                        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;'+data.error).show();
                    }
                    else {
                        swal({
                            title: '¡Muchas gracias por registrarte!',
                            text: 'En breve recibirás un mail para activar tu cuenta y contraseña.',
                            imageUrl: 'img/logo_background.png',
                            imageWidth: 200,
                            imageHeight: 200,
                            imageAlt: 'Logo',
                            animation: false,
                            confirmButtonText: 'Ir a página principal',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                            preConfirm: () => {
                                window.location.replace("index.html");
                            }
                        })
                    }
                })
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("funcion: register()");
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown);
                
                swal({
                    title: 'Error!',
                    text: 'Ocurrio un error, por favor intentelo de nuevo',
                    type: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: 'Aceptar'
                })
            }
        });
    }
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : saveData()
 **/
function saveData() {
    
    //Limpiar warning
    $("#alertaRegistro").hide();
    
    //Validar email
    let email        = $("#txtCorreo").val().trim();
    let valida_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if( !$('#politicas').is(':checked') ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes aceptar las politicas de privacidad para continuar').show();
    }
    else if( $('#txtSexo').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes seleccionar sexo').show();
    }
    else if( $('#txtCorreo').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes ingresar el correo').show();
    }
    else if( $('#txtTelefono').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes ingresar número de celular').show();
    }
    else if( $('#txtpass').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes ingresar la contraseña').show();
    }
    else if( $('#txtpass2').val() != "" && $('#txtpass').val() != $('#txtpass2').val()) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;La contraseña no coincide').show();
    }
    else if (!valida_email.test(email)) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Correo Invalido').show();
    }
    else {
        $.ajax({
            url: ruta,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion         : 'actualiza',
                idCliente       : '2',  //Se cambio a 2 para que apunte a wingstop
                password        : $('#txtpass').val(),
                numeroTarjeta   : $('#txtTarjeta').text().trim(),
                nombre          : $('#txtNombre').text().trim(),
                sexo            : $('#txtSexo').val(),
                email           : $('#txtCorreo').val(),
                colonia         : $('#txtColonia').val(),
                idEstado        : $('#txtEstado').val(),
                idMunicipio     : $('#txtMunicipio').val(),
                cp              : $('#txtCp').val(),
                nacimiento      : $('#txtCumple').val(),
                telefonoTrabajo : $('#txtTelefono').val(),
                telefonoHogar   : $('#txtTelefono2').val(),
            },
            success: function(resp) {
                
                swal({
                    title: 'Espere un momento...',
                    text: 'Actualizando información',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    timer: 1500,
                    onOpen: () => {
                        swal.showLoading()
                    }
                }).then(() => {
                    if( resp.error != '' ) {
                        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;'+resp.error).show();
                    }
                    else {
                        //Update data auth
                        $.ajax({
                            url: ruta,
                            type: 'POST',
                            dataType: 'JSON',
                            data: {
                                funcion       :'ingreso',
                                idCliente     : '2',
                                numeroTarjeta : $('#txtTarjeta').text().trim(), 
                                password      : $('#txtpass').val().trim()
                            },
                            success: function(respNext) {
                                if ( respNext.error != '' ) {
                                    $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Error: '+respNext.error).show();
                                }
                                else {
                                    swal({
                                        title: '¡Información guardada!',
                                        imageUrl: 'img/logo_background.png',
                                        imageWidth: 200,
                                        imageHeight: 200,
                                        imageAlt: 'Logo',
                                        animation: false,
                                        confirmButtonText: 'Ir a página principal',
                                        showLoaderOnConfirm: true,
                                        allowOutsideClick: false,
                                        preConfirm: () => {
                                            auth.login(resp.nombre, resp.email, resp.puntos);
                                            window.location.replace("home.html");
                                        }
                                    })
                                }
                            }
                        });
                    }
                })                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("funcion: saveData()");
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown);
                
                swal({
                    title: 'Error!',
                    text: 'Ocurrio un error, por favor intentelo de nuevo',
                    type: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: 'Aceptar'
                })
            }
        });
    }     
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : estados()
 **/
function estados() {
    
    $.ajax({
        url:ruta,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion   : 'estados',
            idCliente : '2' //Se cambio a 2 para que apunte a wingstop
        },
        success:function(re) {
            for(var i = 0; i < re.length; i++ ){
                $('#txtEstado').append('<option value="'+re[i].id+'">'+re[i].nombre+'</option>')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: estados()");
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown);
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    });
}

/**
 *  @author   : Roberto Ramírez
 *  @contct   : roberto_ramirez@avansys.com.mx
 *  @date     : 07/05/2018
 *  @function : municipios()
 **/
function municipios() {
    
    let est = $('#txtEstado').val();
    
    $.ajax({
        url:ruta,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion   : 'municipios',
            idCliente : '2',    //Se cambio a 2 para que apunte a wingstop
            idEstado  : est
        },
        success:function(re){
              
            let d = document.getElementById('txtMunicipio');
               
            while( d.hasChildNodes() )
                d.removeChild(d.firstChild);
           
            for( var i = 0; i < re.length; i++ ) {
                $('#txtMunicipio').append('<option value="'+re[i].id+'">'+re[i].nombre+'</option>')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: municipios()");
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown);
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    });
}

/**
 * @class    : Auth
 * @author   : Roberto Ramírez
 * @contact  : roberto_ramirez@avansys.com.mx
 * @date     : 07/05/2018
 * @function : login
 **/
auth.login = function(nombre, email, puntos, regla, codigo) {
    
    try {
        localStorage.setItem('auth', JSON.stringify({
            'nombre' : nombre,
            'email'  : email,
            'puntos' : puntos,
            'regla'  : regla,
            'codigo' : codigo
        }));
        
        localStorage.setItem('cliente', email);
        location.href = 'home.html';
    }
    catch(errorThrown) {
        console.log("funcion: login()"); 
        console.log("Error: " + errorThrown);
        
        swal({
            title: 'Error!',
            text: 'Ocurrio un error, por favor intentelo de nuevo',
            type: 'error',
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar'
        })
    }
}

/**
 * @class    : Auth
 * @author   : Roberto Ramírez
 * @contact  : roberto_ramirez@avansys.com.mx
 * @date     : 07/05/2018
 * @function : isLogged
 **/
auth.isLogged = function() {
    if( localStorage.getItem('auth') != null ) {
        return true;
    }
    else {
        return false;
    }
};

/**
 * @class    : Auth
 * @author   : Roberto Ramírez
 * @contact  : roberto_ramirez@avansys.com.mx
 * @date     : 07/05/2018
 * @function : deleteToken
 **/
auth.deleteToken = function() {
    
    try {
        localStorage.removeItem('auth');
        location.href = 'index.html';
    }
    catch(errorThrown) {
        console.log("funcion: deleteToken()"); 
        console.log("Error: " + errorThrown);
        
        swal({
            title: 'Error!',
            text: 'Ocurrio un error, por favor intentelo de nuevo',
            type: 'error',
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar'
        })
    }
};

/**
 * @author   : Roberto Ramírez
 * @contact  : roberto_ramirez@avansys.com.mx
 * @date     : 07/05/2018
 * @function : showCoupons
 **/
async function showCoupons() {
    
    swal({
        title: 'Cargando promociones...',
        allowOutsideClick: false,
        onOpen: () => {
            swal.showLoading()
        }
    })

    try {
        const result = await $.ajax({
            url: ruta,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion   : 'cuponesSucursalQrSimple',
                idCliente : '2' //Se cambio a 2 para que apunte a wingstop
            }
        })
        
        let content = "<table border='0' width='100%'>";
        
        for( let i = 0; i <= result.length - 1; i++ ) {

            if(result[i].imagen != '' && result[i].paraMapa == '1' ) {

                let str  = result[i].terminosYCondiciones.replace(/(?:\r\n|\r|\n)/g, '<br />')
                let str1 = result[i].descripcion.replace(/(?:\r\n|\r|\n)/g, '<br />')
                let str2 = result[i].nombre.replace(/(?:\r\n|\r|\n)/g, '<br />')

                if(result[i].imagen != '' && result[i].paraMapa == '1' ) {
                    content += '<tr>'
                    content +=     '<td>'
                    content +=          '<div class="inline imgPromos">'
                    content +=               '<img onclick=\'showCouponDetail("CP|'+result[i].codigoQR+'", "'+result[i].imagen+'", "'+str2+'", "'+str1+'", "'+str+'");\' src="'+result[i].imagen+'">'
                    content +=               '<div class="sombra"><img src="img/imgSombraHorizontal.png" /></div>'
                    content +=          '</div>'
                    content +=     '</td>'
                    content += '</tr>'
                }
            }
        }

        content += '</table>'
        $("#contenedorPromociones").html(content)
        
        swal.close()

    } catch (error) {
        console.error(error);
        console.log("funcion: showCoupons()")
        console.log("Error: " + error)

        swal({
            title: 'Error!',
            text: 'Ocurrio un error, por favor intentelo de nuevo',
            type: 'error',
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar'
        })
    }
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : showCouponDetail
 **/
function showCouponDetail(a, rutaImg, nombre, descripcion, terminos) {
    localStorage['cupon_tem'] = a;
    localStorage['cupon_img'] = rutaImg;
    localStorage['cupon_nom'] = nombre;
    localStorage['cupon_txt'] = descripcion;
    localStorage['cupon_ter'] = terminos;

    window.location="detalle.html";
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : soloNumeros
 **/
function soloNumeros(e) {
	var key = window.Event ? e.which : e.keyCode
	return (key >= 48 && key <= 57)
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : isDate
 **/
function isDate(txtDate) {
    
    var currVal = txtDate;
    
    if( currVal == '' )
        return false;
    
    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray       = currVal.match(rxDatePattern); // is format OK?
    
    if (dtArray == null)
        return false;
    
    var dtDay   = dtArray[1];
	var dtMonth = dtArray[3];
    var dtYear  = dtArray[5]; 
    
    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay> 31) 
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) 
        return false;
    else if (dtMonth == 2) {    
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        
        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
            return false;
    }
    
    return true;
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : esEmail
 **/
function esEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return re.test(email);
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : home
 **/
function home() {
    window.location="home.html";
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : index
 **/
function index() {
    window.location="index.html";
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : salir
 **/
function salir() {
    localStorage.clear()
    
    auth.deleteToken()
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : politicas
 **/
function politicas() {
    
    swal({
        title: 'Aviso de privacidad',
        type: 'info',
        html: 
            '<p class="text-justify">'+
                'De conformidad con lo establecido en la Ley Federal de Protección de Datos personales de los'+ 'particulares WIS MASTER MEXICO S.A. DE C.V; pone a su disposición el siguiente aviso de privacidad:'+
                '<br><br>'+
                ''+
                'WIS MASTER MEXICO S.A. DE C.V; es responsable del uso y protección de sus datos personales, en este'+ 'sentido y atendiendo las obligaciones legales establecidas en la Ley Federal de Protección de Datos'+ 'personales en posesión de los particulares, a través de este instrumento se informa a los titulares de'+ 'los datos, la información que de ellos se recaba y los fines que se le darán a dicha información.'+
                '<br><br>'+

                'Además de lo anterior, informamos a Usted que WIS MASTER MEXICO S.A. DE C.V; tiene su domicilio'+ 'ubicado en: Av. Mariano Escobedo 366, quinto piso, Colonia Anzures, Código Postal 11590, '+ 
                'Hidalgo en Delegación Miguel la Ciudad de México.'+
                '<br><br>'+
                
                'Los datos personales que recabamos de usted serán utilizados para las siguientes finalidades las '+ 'cuales son necesarias para concretar nuestra relación con Usted, así como atender los servicios '+
                'y/o pedidos que solicite:'+
                '<br><br>'+
                
                '1.- Campañas de Publicidad.<br>'+
                '2.- Campañas de Fidelidad.<br>'+
                '3.- Información y prestación de servicios.<br>'+
                '4.- Actualización de la base de datos.<br>'+
                '5.- Evaluación de nuestros estándares de calidad en el servicio que les brindamos.<br>'+
                '6.- Cualquier finalidad análoga o compatible con las anteriores.<br>'+
                '7.- Compartirlos con proveedores de bienes y servicios que se consideren de su interés y beneficio.'+
                '<br><br>'+

                'Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos'+
                'los siguientes datos personales:<br><br>'+
                
                '1.- Nombre.<br>'+
                '2.- Sexo.<br>'+
                '3.- Fecha de nacimiento.<br>'+
                '4.- Correo electrónico.<br>'+
                '5.- Teléfono Fijo.<br>'+
                '6.- Teléfono celular.<br>'+
                '7.- Colonia.<br>'+
                '8.- Código Postal.<br>'+
                '9.- Estado.<br>'+
                '10.- Municipio.<br><br>'+

                'Usted tiene en todo momento el derecho a conocer que datos personales tenemos de Usted, para qué los utilizamos y las condiciones del uso que les damos (acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que este desactualizada, sea inexacta o incompleta (rectificación); de igual manera tiene derecho a que su información se elimine de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (cancelación); así como también a oponerse al uso de sus datos personales para fines específicos (oposición). Estos derechos se conocen como derechos ARCO.<br><br>'+

                'Para el ejercicio de cualquiera de los derechos ARCO se deberá presentar las solicitudes respectivas a través del contacto al e-mail: <a href="mailto:minoni@lealtadprimero.com.mx">minoni@lealtadprimero.com.mx.</a><br><br>'+

                'Lo anterior también servirá para conocer el procedimiento y requisitos para el ejercicio de los derechos ARCO.'+
                '<br><br>'+
                'En todo caso la respuesta a la solicitud se dará a través del siguiente correo electrónico: <a href="mailto:minoni@lealtadprimero.com.mx">minoni@lealtadprimero.com.mx</a>.<br><br>'+

                'Los datos del contacto de la persona o departamento de datos personales, que está a cargo de dar trámite a las solicitudes de derechos ARCO son los siguientes:<br><br>'+

                'A)	NOMBRE DEL RESPONSABLE;<br>'+
                'B)	DOMICILIO;<br>'+
                'C)	TELEFONO;<br><br>'+

                'En cualquier momento; Usted puede revocar su consentimiento para el uso de sus datos personales. Del Mismo modo, Usted puede revocar su consentimiento para el uso de sus datos personales. Del mismo modo, Usted puede revocar el consentimiento, que, en su caso, nos haya otorgado para el tratamiento de sus datos personales.<br><br>'+

                'Asimismo, Usted deberá considerar que, para ciertos fines, la revocación de su consentimiento implicara que no podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.<br><br>'+

                'Para revocar el consentimiento que Usted otorga en este acto o para limitar su divulgación, se deberá presentar la solicitud respectiva a través de a través del contacto al e-mail:<a href="mailto:minoni@lealtadprimero.com.mx">minoni@lealtadprimero.com.mx.</a><br><br>'+

                'Del mismo modo, podrá solicitar la información para conocer el procedimiento y requisitos para la revocación del consentimiento, así como limitar el uso y divulgación de su información personal.<br><br>'+

                'En cualquier caso, la respuesta a las peticiones se dará a conocer en un plazo de 5 días hábiles, y se comunicaran de la siguiente forma: a través del contacto al e-mail:<a href="mailto:minoni@lealtadprimero.com.mx">minoni@lealtadprimero.com.mx.</a><br><br>'+

                'Este aviso de privacidad podrá ser modificado por WIS MASTER MEXICO S.A. DE C.V; dichas modificaciones serán oportunamente informados a través de correo electrónico, teléfono, o cualquier otro medio de comunicación que WIS MASTER MEXICO S.A. DE C.V; determine para tal efecto.'+
            '</p>',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        confirmButtonColor: '#F57E20',
        animation: false,
    })
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : terminos
 **/
function terminos() {
    swal({
        title: '¿Deseas canjear esta promoción?',
        html: localStorage.getItem("cupon_ter"),
        type: 'info',
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: '#d33 !important',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        animation: false,
    }).then((result) => {
        if (result.value) {
            swal({
                title: '¡Operación exitosa!',
                text: 'Puedes hacer valida esta promoción presentando este mensaje a tu mesero.',
                type: 'info',
                confirmButtonText: 'Ir a página principal',
                animation: false,
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                preConfirm: () => {
                    window.location.replace("index.html");
                }
            })
        }
    })
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : terminosYCondiciones
 **/
function terminosYCondiciones() {
    
    swal({
        title: 'Minoni Fan',
        type: 'info',
        html: 
            '<p class="text-justify">'+
                '<br/>'+
                '<b>¿Cómo funciona Mi Minoni Fan ID?</b>'+
                '<br/>'+
                '<br/>'+
                '1.	Descarga nuestra App Minoni México disponible para dispositivos Android ™ o iPhone®'+
                '<br/>'+
                '2.	Regístrate con todos los datos y comienza a disfrutar de los beneficios de nuestro nivel Green'+
                '<br/>'+
                '3.	Podrás acumular puntos en cada compra, donde 1 punto = 1 peso y formar parte de nuestros tres niveles'+
                '<br/>'+
                '<br/>'+
                '<b>•	Nivel Green</b>, acumula el 5% de tus compras en cada *'+
                '<br/>'+
                '<b>•	Nivel Gold</b>, al obtener 20 visitas y 300 puntos subirás a este nivel, podrás acumular el 7.5% en puntos en cada*'+
                '<br/>'+
                '<b>•	Nivel Platinum</b>, al obtener 25 visitas y 300 puntos, podrás acumular el 10% en puntos en cada*'+
                '<br/>'+
                '<br/>'+

                '<label style="font-size: 10px;">*Nota: Aplican restricciones en consumos con promociones y/o descuentos, revisar en Términos y Condiciones</label>'+

                '<br/>'+
                '<br/>'+
                
                '<b>¿Cómo registro mis consumos de Minoni?</b>'+
                '<br/>'+
                '<br/>'+
                'Visita cualquiera de nuestras sucursales Minoni del país y pídele a tu experto en alitas que lea tu código QR o digite tu Minoni ID en tu cuenta y ya estarás acumulando puntos y visitas Minoni Fan'+
                '<br/>'+
                '<br/>'+
                '<label style="font-size: 10px;">*Nota: recuerda que solo puedes registrar tus consumos al momento de tu visita</label>'+
                '<br/>'+
                '<br/>'+
                '<b>Términos y condiciones</b>'+
                '<br/>'+
                '<br/>'+
                'Al expresar su consentimiento positivo al programa de recompensas denominado "MINONI FAN ID" reconoce que el uso de las recompensas correspondientes, se deberán regir por los siguientes términos y condiciones siguientes o los que le substituyan y que sean publicados en la página  <a href="www.pizzasminoni.com">http://pizzasminoni.com/</a> los cuales podrán ser modificados en cualquier momento, por lo que su uso en cualquier tiempo implica su aceptación de acuerdo con los mismos.'+

                '<br/>'+
                '<br/>'+

                '•	Las redenciones y acumulación de puntos Minoni no aplican en consumos con promociones y/o descuentos'+
                '<br/>'+
                '•	La redención y acumulación de puntos Minoni solo aplica una cuenta por mesa y/o consumo'+
                '<br/>'+
                '•	Los puntos Minoni Fan no puede ser cambiados y/o transferidos entre usuarios, no tienen ningún tipo de valor monetario '+
                '<br/>'+
                '•	Los puntos del programa Minoni Fan serán vigentes durante un periodo de 12 meses a partir de la fecha de afiliación, al término de este periodo serán reiniciados'+
                '<br/>'+
            '</p>',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        confirmButtonColor: '#F57E20',
        animation: false,
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @date:     11/05/2018
 * @version:  1
 * @function: myPosition
 **/
function myPosition() {
    
    swal({
        title: 'Cargando mi ubicación...',
        allowOutsideClick: false,
        onOpen: () => {
            swal.showLoading()
        }
    })
    
    return new Promise( (resolve, reject) => {
        
        navigator.geolocation.getCurrentPosition(function(position) {
            
            let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

            //Set position user
            localStorage.setItem('collect_latitude', position.coords.latitude)
            localStorage.setItem('collect_longitude', position.coords.longitude)

            //Set state and region
            setDataCountryAndState(latlng).
            then( () => {
                swal.close()
                resolve()
            })
            .catch( () => {
                reject()
            })
        },function(error) {
            reject()
        },{
            maximumAge : 3000,
            timeout    : 5000, 
            enableHighAccuracy: true 
        })
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @date:     11/05/2018
 * @version:  1
 * @function: setDataCountryAndState
 **/
function setDataCountryAndState(latlng) {
    
    return new Promise( (resolve, reject) => {
        
        let region   = '';
        let country  = '';
        let postal   = '';
        let province = '';
        let geocoder = new google.maps.Geocoder()

        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {

                    //console.log(results[0])

                    for (var i = 0; i < results[0].address_components.length; i++) {
                        if (results[0].address_components[i].types[0] == "administrative_area_level_1") {
                            region = results[0].address_components[i];
                        }
                        if ( results[0].address_components[i].types[0] == "administrative_area_level_3" ||  results[0].address_components[i].types[0] == "locality" ) {
                            province = results[0].address_components[i];
                        }
                        if (results[0].address_components[i].types[0] == "country") {
                            country = results[0].address_components[i];
                        }
                        if (results[0].address_components[i].types[0] == "postal_code") {
                            postal = results[0].address_components[i];
                        }   
                    }

                    $( "#collect_country" ).val(country.long_name)
                    $( "#collect_state" ).val(region.long_name)
                    $( "#collect_province" ).val(province.long_name)

                    if ( localStorage.getItem("collect_where") === null ) {
                        $( "#collect_postal" ).val(postal.long_name)  
                    }

                    //Set value
                    localStorage.setItem('collect_country', country.long_name)
                    localStorage.setItem('collect_state', region.long_name)
                    localStorage.setItem('collect_province', province.long_name)

                    if ( localStorage.getItem("collect_where") === null ) {
                        localStorage.setItem('collect_postal', postal.long_name)

                        //Get branchs and set conf branch
                        getBranchsByCp(postal.long_name)

                        //Get citys
                        getCityByCoverage(postal.long_name);
                    }

                    //Fill data calendar
                    fillCalendar()
                }
                else {
                    return reject()
                }
                
                resolve()
            }
            else {
                reject()
            }
        })  
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @date:     11/05/2018
 * @version:  1
 * @function: multisort
 **/
if( typeof helper == 'undefined' ) {
    var helper = { } ;
}

helper.arr = {
    /**
     * Function to sort multidimensional array
     * 
     * <a href="/param">@param</a> {array} [arr] Source array
     * <a href="/param">@param</a> {array} [columns] List of columns to sort
     * <a href="/param">@param</a> {array} [order_by] List of directions (ASC, DESC)
     * @returns {array}
     */
    multisort: function(arr, columns, order_by) {
            
        if(typeof columns == 'undefined') {
            
            columns = []
            
            for(x=0;x<arr[0].length;x++) {
                columns.push(x);
            }
        }
        
        if(typeof order_by == 'undefined') {
            order_by = []
            for( x = 0; x < arr[0].length; x++ ) {
                order_by.push('ASC');
            }
        }
        
        function multisort_recursive(a, b, columns, order_by, index) { 
            
            var direction  = order_by[index] == 'DESC' ? 1 : 0;
            var is_numeric = !isNaN(+a[columns[index]] - +b[columns[index]]);
            var x          = is_numeric ? +a[columns[index]] : a[columns[index]].toLowerCase();
            var y          = is_numeric ? +b[columns[index]] : b[columns[index]].toLowerCase();
            
            if(x < y) {
                return direction == 0 ? -1 : 1;
            }
            
            if(x == y)  {               
                return columns.length-1 > index ? multisort_recursive(a, b, columns, order_by, index+1) : 0;
            }
            
            return direction == 0 ? 1 : -1;
        }
        
        return arr.sort(function (a,b) {
            return multisort_recursive(a, b, columns, order_by, 0);
        });
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @date:     11/05/2018
 * @version:  1
 * @function: multisort
 **/
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : info
 **/
function info(string) {
    
    swal({
        title: '¡Atención!',
        type: 'info',
        html: string,
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        confirmButtonColor: '#F57E20'
    })
}

/**
 *  @author   : Roberto Ramírez
 *  @contact  : roberto_ramirez@avansys.com.mx
 *  @date     : 08/05/2018
 *  @function : spanishDate
 **/
function spanishDate(d) {
    
    let weekday   = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    let monthname = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    
    return weekday[d.getDay()]+" "+d.getDate()+" de "+monthname[d.getMonth()]+" de "+d.getFullYear()
}
