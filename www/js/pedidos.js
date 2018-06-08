/**
 * Komanda módulo de ordena
 * @Author:      Roberto Ramirez
 * @Contact:     roberto_ramirez@avansys.com.mx
 * @Copyright:   Avansys
 * @Description: API utilizada para la gestión del módulo "Ordena".
 **/

var imageDefault  = "<img src='img/square.jpg' />";
var imageDefault2 = "<img class='img-responsive' src='img/square.jpg' />";

if( localStorage.getItem("shopping") || localStorage.getItem("promotions") ) {
    $("#shopping-cart").show();
    
    let number_shopping   = localStorage.getItem("shopping") != null ? JSON.parse(localStorage.getItem("shopping")).length : '';
    let number_promotions = localStorage.getItem("promotionsAll") != null ? JSON.parse(localStorage.getItem("promotionsAll")).length: '';
    $( "#number-cart" ).html(number_shopping + number_promotions);
}
else {
    $("#shopping-cart").hide();
    $( "#number-cart" ).html('');
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 02/10/2017
 * @function: getCategorys
 * @version:  1
 **/
async function getCategorys() {
    
    swal({
        title: 'Cargando menú...',
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
                funcion   : 'getCategorys',
                idCliente : cliente
            }
        })
        
        $.each(result, function(i, item) {
            $( "#menu-categorias ul" ).append( "<li class='col-12' onclick='goPlates("+item.Grupo+");' style='cursor: pointer;'><figure>"+imageDefault+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#' onclick='goPlates("+item.Grupo+");'><i class='fa fa-chevron-right'></i></a></div></li>" )
        })
        
        swal.close()

    } catch (error) {
        console.error(error);
        console.log("funcion: getCategorys()")
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 02/10/2017
 * @function: getPlates
 * @version:  1
 **/
async function getPlates(category) {
    
    swal({
        title: 'Cargando productos...',
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
                funcion  : 'getPlates',
                category : category
            }
        })
        
        $.each(result, function(i, item) {
            $( "#menu-categorias ul" ).append( "<li class='col-12' onclick=\"goPlate('"+item.Consecutivo+"');\" style='cursor: pointer;'><figure>"+imageDefault+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#' onclick=\"goPlate('"+item.Consecutivo+"');\"><i class='fa fa-chevron-right'></i></a></div></li>" )
        })
        
        swal.close()

    } catch (error) {
        console.error(error);
        console.log("funcion: getPlates()")
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: getAddons
 * @version:  1
 **/
async function getAddons(plate) {
    
    swal({
        title: 'Cargando producto...',
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
                funcion   : 'getAddons',
                plate     : plate,
                idCliente : cliente
            }
        })
        
        if ( result.length ) {
                
            //Hide h3 for count pieces
            $( "#plate-addons-count").addClass('hide')

            //Imagen
            $("#plate-img").append(imageDefault2)

            //Title
            $("#plate-title").append(result[0].Nombre+'<br/>$'+result[0].Precio+'.00 Pesos M.N.')
            
            if ( result[0].Agrupador !== null ) {
                
                //Addons
                $.each(result, function(i, item) {
                    $("#plate-addons").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="addon'+i+'" value="'+item.consecutivoComplemento+'" id="addon'+i+'">'+item.nombreComplemento+'</label></section>')
                });

                //Add max complements value
                $( "#addons-message-max" ).html(result[0].maximoProducto)

                $("#plate-addons input[type='checkbox']").change(function() {
                    let sort      = $("#plate-addons input:checked").length
                    let inputHow  = $(this).attr('id')
                    let nameLabel = $(this).parent('label').text()

                    if ( sort == result[0].maximoProducto ) {
                        $("#plate-addons input:checkbox:not(:checked)").prop( "disabled", true )
                    }
                    else {
                        $("#plate-addons input:checkbox").prop( "disabled", false )
                    }

                    //Add value select complements
                    let numberOfChecked = $('input:checkbox:checked').length
                    $( "#addons-message-how").html(numberOfChecked)

                    if (numberOfChecked > 0 && result[0].Cantidad > 0) {
                        $( "#plate-addons-count").removeClass('hide')
                    }
                    else {
                        $( "#plate-addons-count").addClass('hide')
                    }

                    //Flujo para complementos de más de una cantidad.
                    if ( result[0].Cantidad > 0 ) {
                        $( "#plate-addons-count").show();
                        $( "#addons-message-count").html(result[0].Cantidad);

                        if ( $(this).is( ":checked" ) ) {
                            $("#plate-addons-count").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-control-text" type="number" name="count-'+inputHow+'" value="" id="count-'+inputHow+'">'+nameLabel+'</label></section>')
                        }
                        else {
                            $("#count-"+inputHow+"").parent().parent().remove()
                        }

                        //Add average-max
                        $("#average-max").val(result[0].Cantidad)
                    }
                })
            }
            else {
                $("#light #plate-addons-count").remove()
                $("#light h3").remove()
                $("#light hr").remove()
                $( "#end" ).attr('onclick', 'addProduct(1, 0)')
                $( "#add" ).attr('onclick', 'addProduct(0, 0)')
                $( "#addons-message" ).remove()
            }
        }
        else {
            $("#light #plate-addons-count").remove()
            $("#light h3").remove()
            $("#light hr").remove()
            $("#plate-img").append(imageDefault2)
            $("#plate-title").append('Sin información')
            $( "#end" ).attr('onclick', 'addProduct(1, 0)')
            $( "#add" ).attr('onclick', 'addProduct(0, 0)')
            $( "#addons-message" ).remove()
        }
        
        swal.close()

    } catch (error) {
        console.error(error);
        console.log("funcion: getAddons()")
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: getBranches
 * @version:  1
 **/
function getBranches() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        data: {
            funcion   : 'getBranches'
        },
        success:function(resp){

            //Convertir a objetos los datos json
            resp = JSON.parse(resp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("funcion: getBranches()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: getLastPlate
 * @version:  1
 **/
function getLastPlate() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getLastPlate',
            tarjeta : localStorage.getItem('tarjeta')
        },
        success:function(data) {
            $.each(data, function(i, item) {
                $( "<tr><th>"+item.Fecha+"</th><th>"+item.Nombre+"</th><th>$"+item.Precio+".00</th><th><a href='#' onclick=\"goPlate('"+item.Consecutivo+"');\" class='btn-default'>Pedir</a></th></tr>" ).insertAfter( "#tablaEstadoCuenta .headers" )
            })
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getLastPlate()")
            console.log("Status: " + textStatus)
            console.log("Error: " + errorThrown)
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: goPlates
 * @version:  1
 **/
function goPlates(category) {
    
    //Insertando valor de categoria
    localStorage.setItem('category', category);
    
    //Redirigiendo a platillos.
    window.location = "ordenaProducto.html"
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 05/10/2017
 * @function: goPlate
 * @version:  1
 **/
function goPlate(plate) {
    
    //Insertando valor de categoria
    localStorage.setItem('plate', plate);
    
    //Redirigiendo a platillos.
    window.location = "ordenaPlatillo.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 23/10/2017
 * @function: goPromotion
 * @version:  1
 **/
function goPromotion(promotion, plate) {
    
    //Insertando valor de categoria
    localStorage.setItem('promotion', promotion);
    
    //Redirigiendo a platillos.
    window.location = "ordenaPromocion.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: goOrder
 * @version:  1
 **/
function goOrder() {
    //Redirigiendo a platillos.
    window.location = "ordenaOrdenes.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 04/10/2017
 * @function: addCategoriasCombo
 * @version:  1
 **/
async function addCategoriasCombo() {
    
    try {
        const result = await $.ajax({
            url: ruta,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion   : 'getCategorys',
                idCliente : cliente
            }
        })
        
        //Agregando opciones al combobox de categorias
        $.each(result, function (i, item) {
            if ( localStorage.getItem('category') == item.Grupo ) {
                $('#categoria').append($('<option>', {
                    value: item.Grupo,
                    text : item.Nombre,
                    selected: "selected"
                }));
            }
            else {
                $('#categoria').append($('<option>', {
                    value: item.Grupo,
                    text : item.Nombre
                }));
            }
        });

        //Evento onchange
        $('#categoria').on('change', function() {
            goPlates(this.value);
        })
        
        swal.close()

    } catch (error) {
        console.error(error);
        console.log("funcion: addCategoriasCombo()")
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: addProduct
 * @version:  1
 **/
function addProduct(cont, noComplements) {
    
    if (noComplements) {
        
        //Checkbox
        let sort = $("#plate-addons input:checked").length;

        if ( sort == 0 ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir algún complemento').show();
            return '';
        }

        //Inputs text
        let countAverage = 0;
        let maxAverage   = $( "#average-max" ).val();
        let bandera      = false;

        $( "input[id*='count-addon']" ).each(function( i, item ) {
            if( this.value == 0 ) {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;La cantidad del complemento no puede ser 0 o estar vacío').show();
                bandera = true;
                return '';
            }
            else {
                countAverage += parseInt(this.value);
                bandera = false;
            }
        });

        if (bandera) {
            return '';
        }

        if ( maxAverage != countAverage ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe de coincidir la cantidad máxima de: '+maxAverage+'').show();
            return '';
        }
    }
    
    //Declaration arrays
    let data     = new Array();
    let producto = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("shopping") )
        data = JSON.parse(localStorage.getItem("shopping"));
    
    //Add plate consecutivo id
    producto.push(localStorage.getItem("plate"));
    
    //Add complements
    $("input[id*='addon']:checked").each(function( i, item ) {
        let addonCount = $( "#count-"+this.id+"" ).val();
        let addon = [this.value, addonCount];
        
        producto.push(addon);
    });
    
    //Add producto
    data.push(producto);
    
    localStorage.setItem('shopping', JSON.stringify(data));
    
    if( cont ) {
        window.location = "ordenaEntrega.html";
    }
    else {
        window.location = "ordena.html";
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: addPaymethod
 * @version:  1
 **/
function addPaymethod(method) {
    localStorage.setItem('payMethod', JSON.stringify({
        'id'     : method,
        'Nombre' : method == 1 ? 'Paypal' : 'MercadoPago'
    }));
    
    window.location = "ordenaConfirma.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: setShoppingSummary
 * @version:  1
 **/
async function setShoppingSummary() {
    
    swal({
        title: 'Cargando pedido...',
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
                funcion   : 'getPlateInfo',
                summary   : localStorage.getItem('shopping'),
                promotion : localStorage.getItem('promotionsAll')
            }
        })
        
        //Total
        if ( result.total == '' ) {
            $("#average").remove();
            $("#average-modal").remove();
            $("#realizaPago").remove();
            $("#ordenaComentarios").remove();
            $("#send-pedido").remove();
            $("#deliver").remove();
            $("#shopping-cart").remove();
        }
        else {
            const costoEnvio = localStorage.getItem('collect_cost') === null ? 0 : parseInt(localStorage.getItem('collect_cost')) 
            const total      = parseInt(result.total) + costoEnvio 
            
            //Average payment
            $("#average").append("El total de tu pedido es de: $"+total+".00 pesos")
            $("#average-modal").append("$"+total+".00 pesos")
            localStorage.setItem('importe', total)
        }
        
        //Tabla de productos
        if ( result.html == '' ) {
            $( '<tr><td colspan="4">Sin productos</td></tr>' ).insertAfter( "#tablaEstadoCuenta tr:last" )
            localStorage.removeItem('shopping');
            localStorage.removeItem('promotions');
        }
        else {
            
            if ( localStorage.getItem("branchConf") === null ) {
                $( result.html ).insertAfter( "#tablaEstadoCuenta tr:last" )
                swal.close()
                return false
            }
            
            //Obtener configuración de la sucursal elegida
            const conf          = JSON.parse(localStorage.getItem("branchConf"))
            const compraMinima  = parseInt(conf.compraMinima)
            const importe       = localStorage.getItem("importe")
            const countShopping = JSON.parse(localStorage.getItem("shopping")).length
            
            //Productos Maximos
            if ( conf.productosMaximos < countShopping ) {
                swal({
                    title: '!Atención¡',
                    type: 'info',
                    confirmButtonText: 'Aceptar',
                    animation: false,
                    text: 'La sucursal '+conf.nombreAgencia+' cuenta con una lista de productos maximos de '+conf.productosMaximos+', usted cuenta con un total de productos de '+countShopping+'',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    preConfirm: () => {
                        $('#realizaPago').hide()
                    }
                })
            }
            else {
                $('#realizaPago').show()
            }

            //Compra minima
            if ( importe < compraMinima ) {
                swal({
                    title: '!Atención¡',
                    type: 'info',
                    confirmButtonText: 'Ir a productos',
                    animation: false,
                    text: 'La sucursal '+conf.nombreAgencia+' cuenta con una compra minima de $'+compraMinima+'.00, usted cuenta con un importe de $'+importe+'.00',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    preConfirm: () => {
                        window.location.replace("ordena.html")
                    }
                })

                return false
            }

            $( result.html ).insertAfter( "#tablaEstadoCuenta tr:last" )
        }
        
        swal.close()

    } catch (error) {
        console.error(error);
        console.log("funcion: setShoppingSummary()")
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 21/05/2018
 * @function: getMaxPlateMinutes
 * @version:  1
 **/
async function getMaxPlateMinutes() {
    
    try {
        const result = await $.ajax({
            url: ruta,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion   : 'getMaxPlateMinutes',
                summary   : localStorage.getItem('shopping'),
                promotion : localStorage.getItem('promotionsAll')
            }
        })
        
        localStorage.setItem('MaxMinutes', result)
        
    } catch (error) {
        console.error(error);
        console.log("funcion: getMaxPlateMinutes()")
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 11/10/2017
 * @function: deleteRow
 * @version:  1
 **/
function deleteRow(id, consecutivo) {
    
    $( "#light3" ).hide();
    $( "#fade" ).hide();
    
    //Declaration arrays
    let data = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("shopping") )
        data = JSON.parse(localStorage.getItem("shopping"))
    
    //Buy shopping cart with the current dish to find matches and deleted
    if ( data.length ) {
        
        let result = 'undefined';
        
        console.log(result);
        
        for( let i = 0, lenx = data.length; i < lenx; i++ ) {
            if( data[i][0] === consecutivo ) {
                
                result = i
                break
            }
            else {
                result = 'undefined'
            }
        }
        
        if ( result != 'undefined' ) {
            data.splice(result, 1)
        }
    }
    
    localStorage.setItem('shopping', JSON.stringify(data));
    
    //Delete info
    //$( "#deliver" ).html('');
    //$( "#payment" ).html('');
    $( "#average" ).html('');
    $( "#average-modal" ).html('');
    $( "#tablaEstadoCuenta" ).find("tr:gt(0)").remove();
    
    swal({
        title: 'Actualizando pedido...',
        allowOutsideClick: false,
        onOpen: () => {
            swal.showLoading()
        }
    })
        
    setShoppingSummary()
    .then( () => {
        let number_shopping = localStorage.getItem("shopping") != null ? JSON.parse(localStorage.getItem("shopping")).length : 0
        let number_promotions = localStorage.getItem("promotionsAll") != null ? JSON.parse(localStorage.getItem("promotionsAll")).length : 0

        $( "#number-cart" ).html(number_shopping + number_promotions)

        swal.close()
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 11/10/2017
 * @function: setPedido
 * @version:  1
 **/
function setPedido(idToken) {
    
    const comentarios = $( "#comentarios" ).val();
    const where       = localStorage.getItem('collect_where')
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion      : 'setPedido',
            tarjeta      : localStorage.getItem('tarjeta'),
            importe      : localStorage.getItem('importe'),
            collect_date : localStorage.getItem('collect_date'),
            collect_time : localStorage.getItem('collect_time'),
            comentarios  : comentarios,
            summary      : localStorage.getItem('shopping'),
            promotions   : localStorage.getItem('promotionsAll'),
            sucursal     : localStorage.getItem("branchConf"),
            userData     : localStorage.getItem('auth'),
            where        : localStorage.getItem('collect_where'),
            codigoPostal : localStorage.getItem('collect_postal'),
            cityArea     : ((where == 1) ? localStorage.getItem('collect_cityarea') : ''),
            cost         : ((where == 1) ? localStorage.getItem('collect_cost') : ''),
            street       : ((where == 1) ? localStorage.getItem('collect_street') : ''),
            numInt       : ((where == 1) ? localStorage.getItem('collect_numbint') : ''),
            numExt       : ((where == 1) ? localStorage.getItem('collect_numbext') : ''),
            referencias  : ((where == 1) ? localStorage.getItem('collect_reference') : ''),
            idToken      : idToken
        },
        success: function(resp) { 
            localStorage.setItem('historyPayment', resp);
            
            localStorage.removeItem('shopping')
            localStorage.removeItem('promotionsAll')
            localStorage.removeItem('promotions')
            localStorage.removeItem('collect_date')
            localStorage.removeItem('collect_time')
            localStorage.removeItem('importe')
            localStorage.removeItem('plate')
            localStorage.removeItem('branchConf')
            localStorage.removeItem('category')
            localStorage.removeItem('tokenPaypal')
            localStorage.removeItem('collect_where')
            localStorage.removeItem('collect_postal')
            localStorage.removeItem('collect_cityarea')
            localStorage.removeItem('collect_cost')
//            localStorage.removeItem('collect_street')
//            localStorage.removeItem('collect_numbint')
//            localStorage.removeItem('collect_numbext')
//            localStorage.removeItem('collect_reference')
            localStorage.removeItem('collect_state')
            localStorage.removeItem('collect_province')
            localStorage.removeItem('collect_latitude')
            localStorage.removeItem('collect_longitude')
            localStorage.removeItem('collect_country')
            localStorage.removeItem('orderIndex')
            localStorage.removeItem('orderLength')
            localStorage.removeItem('order_plate')
            localStorage.removeItem('orders')
            
            localStorage.removeItem('__paypal_storage__')
            
            window.location = "ordenaCompletado.html";  //redirect
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: setPedido()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function getTransactions() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getTransactions',
            tarjeta : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            $( resp.html ).insertAfter( "#tablaEstadoCuenta tr:last" );
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getTransactions()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 21/05/2018
 * @function: getTransactions
 * @version:  1
 **/
function ordenaDetalleTransaccion(order) {
    
    localStorage.setItem('historyTransaction', order)
    
    window.location = "ordenaDetalleTransaccion.html"
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function addFavorite() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'addFavorite',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            
            $( "#favorites" ).html('<button type="button" onclick="removeFavorite();" class="btn btn-danger btn-block"><i class="fa fa-times"></i> Remover de favoritos </button>');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("función: addFavorite()"); 
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function removeFavorite() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'removeFavorite',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            $( "#favorites" ).html('<button type="button" onclick="addFavorite();" class="btn btn-favoritos btn-block"><i class="fa fa-star"></i> Agregar a favoritos </button>');
            
            //$( "#check1" ).removeAttr('checked');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("función: removeFavorite()"); 
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function setFavorite() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'setFavorite',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            
            if( resp == 1 ) { 
                $( "#favorites" ).html('<button type="button" onclick="removeFavorite();" class="btn btn-danger btn-block"><i class="fa fa-times"></i> Remover de favoritos </button>')
            }
            else {
                $( "#favorites" ).html('<button type="button" onclick="addFavorite();" class="btn btn-favoritos btn-block"><i class="fa fa-star"></i> Agregar a favoritos </button>')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("función: setFavorite()")
            console.log("Status: " + textStatus)
            console.log("Error: " + errorThrown)
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }  
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getFavorites
 * @version:  1
 **/
function getFavorites() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'getFavorites',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success:function(data) {
            
            if ( data.length == 0 ) {
                $( "#menu-categorias ul" ).append( "<li class='col-12 text-center'>Ningún producto en favoritos</li>" );
            }
            else {
                $.each(data, function(i, item) {
                    $( "#menu-categorias ul" ).append( "<li class='col-12' onclick=\"goPlate('"+item.Consecutivo+"');\" style='cursor: pointer;'><figure>"+imageDefault+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#'><i class='fa fa-chevron-right'></i></a></div></li>" );
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getFavorites()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getHistoryPlates
 * @version:  1
 **/
function getHistoryPlates() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getHistoryPlates',
            tarjeta : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            
            if( resp != '') {  
                $( resp ).insertAfter( "#tablaEstadoCuenta tr:last" );
            }
            else {
                $( "#text-history" ).html('No hay platillos por mostrar')
                $( "#button-history" ).remove();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getHistoryPlates()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getPromotions
 * @version:  1
 **/
function getPromotions() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getPromotions'
        },
        success:function(data){
            $.each(data, function(i, item) {
                $( "#menu-categorias ul" ).append( "<li class='col-12' onclick=\"goPromotion('"+item.Promocion+"', '"+item.Promocion+"');\" style='cursor: pointer;'><figure>"+imageDefault+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#'><i class='fa fa-chevron-right'></i></a></div></li>" );
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getPromotions()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getOrderMyBranch
 * @version:  1
 **/
function getOrderMyBranch() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion  : 'getOrderMyBranch',
            sucursal : '1',
            comercio : cliente
        },
        success: function(resp) {
            console.log(resp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getOrderMyBranch()");
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown);
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            });
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: setAnswerOrder
 * @version:  1
 **/
function setAnswerOrder() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        //dataType: "json",
        data: {
            funcion  : 'setAnswerOrder',
            sucursal : '1',
            pedido   : '3',
            status   : '13,1|6,2',
            comments : 'Un pedido esta en proceso',
            comercio : cliente
        },
        success: function(resp) {
            console.log(resp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: setAnswerOrder()");
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown);
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            });
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 23/10/2017
 * @function: getPromotion
 * @version:  1
 **/
function getPromotion() {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getPromotion',
            promotion : localStorage.getItem('promotion'),
            idCliente : cliente
        },
        success:function(data){
            
            localStorage.setItem('promoLength', (data.length - 1));
            
            //Imagen
            $("#plate-img").append(imageDefault2);
            
            //Title
            $("#plate-title").append(data[localStorage.getItem('promoIndex')].Nombre+'<br/>$'+data[localStorage.getItem('promoIndex')].Precio+'.00 Pesos M.N.');
            
            $("#plate-description").append(data[localStorage.getItem('promoIndex')].nombreProducto);
            
            //Agregar complementos
            getAddonsPromotion(data[localStorage.getItem('promoIndex')].Consecutivo);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getPromotion()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 26/10/2017
 * @function: getAddonsPromotion
 * @version:  1
 **/
function getAddonsPromotion(plate) {
    
    localStorage.setItem('promotion_plate', plate);
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getAddons',
            plate     : plate,
            idCliente : cliente
        },
        success:function(data){
            
            if ( data.length ) {
                
                //Hide h3 for count pieces
                $( "#plate-addons-count").addClass('hide');
                
                //Addons
                $.each(data, function(i, item) {
                    $("#plate-addons").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="addon'+i+'" value="'+item.consecutivoComplemento+'" id="addon'+i+'">'+item.nombreComplemento+'</label></section>');
                });
                
                //Add max complements value
                $( "#addons-message-max" ).html(data[0].maximoProducto);
                
                $("#plate-addons input[type='checkbox']").change(function() {
                    let sort      = $("#plate-addons input:checked").length;
                    let inputHow  = $(this).attr('id');
                    let nameLabel = $(this).parent('label').text();

                    if ( sort == data[0].maximoProducto ) {
                        $("#plate-addons input:checkbox:not(:checked)").prop( "disabled", true );
                    }
                    else {
                        $("#plate-addons input:checkbox").prop( "disabled", false );
                    }
                    
                    //Add value select complements
                    let numberOfChecked = $('input:checkbox:checked').length;
                    $( "#addons-message-how").html(numberOfChecked);
                    
                    if (numberOfChecked > 0 && data[0].Cantidad > 0) {
                        $( "#plate-addons-count").removeClass('hide');
                    }
                    else {
                        $( "#plate-addons-count").addClass('hide');
                    }

                    //Flujo para complementos de más de una cantidad.
                    if ( data[0].Cantidad > 0 ) {
                        $( "#plate-addons-count").show();
                        $( "#addons-message-count").html(data[0].Cantidad);
                        
                        if ( $(this).is( ":checked" ) ) {
                            $("#plate-addons-count").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-control-text" type="number" name="count-'+inputHow+'" value="" id="count-'+inputHow+'">'+nameLabel+'</label></section>');
                        }
                        else {
                            $("#count-"+inputHow+"").parent().parent().remove();
                        }

                        //Add average-max
                        $("#average-max").val(data[0].Cantidad);
                    }
                    else {
                        $( "#plate-addons-count").hide();
                    }
                });
            }
            else {
                $( "#continue-promotion" ).attr('onclick', 'addPromotion(1);');
                $( "#addons-message" ).remove();
            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getAddonsPromotion()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 26/10/2017
 * @function: addPromotion
 * @version:  1
 **/
function addPromotion(noComplements) {
    
    if (!noComplements) {
        
        //Checkbox
        let sort = $("#plate-addons input:checked").length;

        if ( sort == 0 ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir algún complemento').show();
            return '';
        }

        //Inputs text
        let countAverage = 0;
        let maxAverage   = $( "#average-max" ).val();
        let bandera      = false;

        $( "input[id*='count-addon']" ).each(function( i, item ) {
            if( this.value == 0 ) {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;La cantidad del complemento no puede ser 0 o estar vacío').show();
                bandera = true;
                return '';
            }
            else {
                countAverage += parseInt(this.value);
                bandera = false;
            }
        });

        if (bandera) {
            return '';
        }

        if ( maxAverage != countAverage ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe de coincidir la cantidad máxima de: '+maxAverage+'').show();
            return '';
        }
    }
    
    //Declaration arrays
    let data       = new Array();
    let producto   = new Array();
    let promotions = new Array();
    let promotion  = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("promotions") )
        data = JSON.parse(localStorage.getItem("promotions"));
    
    //Add plate consecutivo id
    producto.push(localStorage.getItem("promotion_plate"));
    
    //Add complements
    $("input[id*='addon']:checked").each(function( i, item ) {
        let addonCount = $( "#count-"+this.id+"" ).val();
        let addon = [this.value, addonCount];
        
        producto.push(addon);
    });
    
    //Add producto
    data.push(producto);
    
    localStorage.setItem('promotions', JSON.stringify(data));
    
    //Flujo multiobjeto
    if( localStorage.getItem('promoIndex') == localStorage.getItem('promoLength') ) {
        
        //Get promotions car is exists.
        if( localStorage.getItem("promotionsAll") )
            promotion = JSON.parse(localStorage.getItem("promotionsAll"));
        
        //Add promotion id
        let promotions = [localStorage.getItem("promotion"), data];
        
        promotion.push(promotions);
        
        localStorage.setItem('promotionsAll', JSON.stringify(promotion));
        
        //Redirect
        window.location = "ordenaEntrega.html";
    }
    else {
        let promoIndex = parseInt(localStorage.getItem('promoIndex')) + 1;
        localStorage.setItem('promoIndex', promoIndex);
        goPromotion(localStorage.getItem('promotion'));
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 11/10/2017
 * @function: deleteRow
 * @version:  1
 **/
function deleteRowPromo(id, promo) {
    
    $( "#light4" ).hide();
    $( "#fade" ).hide();
    
    //Declaration arrays
    let data = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("promotionsAll") )
        data = JSON.parse(localStorage.getItem("promotionsAll"));
    
    //Buy shopping cart with the current dish to find matches and deleted
    if ( data.length ) {
        let result;
        for( let i = 0, len = data.length; i < len; i++ ) {
            if( data[i][0] === promo ) {
                result = i;
                break;
            }
            else {
                result = 'undefined';
            }
        }
        
        if ( result != 'undefined' ) {
            data.splice(result, 1);
        }
    }
    
    localStorage.setItem('promotionsAll', JSON.stringify(data));
    
    //Delete info
    //$( "#deliver" ).html('');
    //$( "#payment" ).html('');
    $( "#average" ).html('');
    $( "#average-modal" ).html('');
    $( "#tablaEstadoCuenta" ).find("tr:gt(0)").remove();
    
    setShoppingSummary()
    .then( () => {
        let number_shopping   = localStorage.getItem("shopping") != null ? JSON.parse(localStorage.getItem("shopping")).length : 0
        let number_promotions = localStorage.getItem("promotionsAll") != null ? JSON.parse(localStorage.getItem("promotionsAll")).length: 0
        $( "#number-cart" ).html(number_shopping + number_promotions)
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: orderMasive
 * @version:  1
 **/
function orderMasive() {
    
    let checked = $("#tablaEstadoCuenta input:checkbox:checked");
    
    if ( checked.length ) {
        let orders  = new Array();
        
        $.each(checked, function(i, item) {
            orders.push(this.value);
        });
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        window.location = "ordenaOrdenes.html";
    }
    else {
        $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Tienes que elegir alguna orden').show();
        return '';
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: getOrder
 * @version:  1
 **/
function getOrder() {
    
    if (localStorage.getItem("orders") === null || localStorage.getItem("orders") == '') {
        
        swal({
            title: '!Atención¡',
            type: 'error',
            confirmButtonText: 'Ir a historial',
            animation: false,
            text: 'No existen ordenes, por favor regresar al historial',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: () => {
                window.location.replace("ordenaPlatillos.html")
            }
        })
        
        return false
    }
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getOrder',
            orders    : localStorage.getItem('orders'),
            idCliente : cliente
        },
        success:function(data) {
            
            localStorage.setItem('orderLength', (data.length - 1))
            
            //Imagen
            $("#plate-img").append(imageDefault2)
            
            //Title
            $("#plate-title").append(data[localStorage.getItem('orderIndex')].Nombre+'<br/>$'+data[localStorage.getItem('orderIndex')].Precio+'.00 Pesos M.N.')
            
            //Agregar complementos
            getAddonsOrders(data[localStorage.getItem('orderIndex')].Consecutivo)
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getOrder()")
            console.log("Status: " + textStatus)
            console.log("Error: " + errorThrown)
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            });
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: getAddonsOrders
 * @version:  1
 **/
function getAddonsOrders(plate) {
    
    localStorage.setItem('order_plate', plate);
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getAddons',
            plate     : plate,
            idCliente : cliente
        },
        success:function(data){
            
            if ( data.length ) {
                
                //Hide h3 for count pieces
                $( "#plate-addons-count").addClass('hide');
                
                if ( data[0].Agrupador !== null ) {
                    
                    //Addons
                    $.each(data, function(i, item) {
                        $("#plate-addons").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="addon'+i+'" value="'+item.consecutivoComplemento+'" id="addon'+i+'">'+item.nombreComplemento+'</label></section>');
                    });

                    //Add max complements value
                    $( "#addons-message-max" ).html(data[0].maximoProducto);

                    $("#plate-addons input[type='checkbox']").change(function() {
                        let sort      = $("#plate-addons input:checked").length;
                        let inputHow  = $(this).attr('id');
                        let nameLabel = $(this).parent('label').text();

                        if ( sort == data[0].maximoProducto ) {
                            $("#plate-addons input:checkbox:not(:checked)").prop( "disabled", true );
                        }
                        else {
                            $("#plate-addons input:checkbox").prop( "disabled", false );
                        }

                        //Add value select complements
                        let numberOfChecked = $('input:checkbox:checked').length;
                        $( "#addons-message-how").html(numberOfChecked);

                        if (numberOfChecked > 0 && data[0].Cantidad > 0) {
                            $( "#plate-addons-count").removeClass('hide');
                        }
                        else {
                            $( "#plate-addons-count").addClass('hide');
                        }

                        //Flujo para complementos de más de una cantidad.
                        if ( data[0].Cantidad > 0 ) {
                            $( "#plate-addons-count").show();
                            $( "#addons-message-count").html(data[0].Cantidad);

                            if ( $(this).is( ":checked" ) ) {
                                $("#plate-addons-count").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-control-text" type="number" name="count-'+inputHow+'" value="" id="count-'+inputHow+'">'+nameLabel+'</label></section>');
                            }
                            else {
                                $("#count-"+inputHow+"").parent().parent().remove();
                            }

                            //Add average-max
                            $("#average-max").val(data[0].Cantidad);
                        }
                        else {
                            $( "#plate-addons-count").hide();
                        }
                    })
                }
                else {
                    $( "#continue-order" ).attr('onclick', 'addOrder(1);');
                    $( "#addons-message" ).remove();
                }
            }
            else {
                $( "#continue-order" ).attr('onclick', 'addOrder(1);');
                $( "#addons-message" ).remove();
            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getAddonsOrders()");
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
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 26/10/2017
 * @function: addPromotion
 * @version:  1
 **/
function addOrder(noComplements) {
    
    if (!noComplements) {
        
        //Checkbox
        let sort = $("#plate-addons input:checked").length;

        if ( sort == 0 ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir algún complemento').show();
            return '';
        }

        //Inputs text
        let countAverage = 0;
        let maxAverage   = $( "#average-max" ).val();
        let bandera      = false;

        $( "input[id*='count-addon']" ).each(function( i, item ) {
            if( this.value == 0 ) {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;La cantidad del complemento no puede ser 0 o estar vacío').show();
                bandera = true;
                return '';
            }
            else {
                countAverage += parseInt(this.value);
                bandera = false;
            }
        });

        if (bandera) {
            return '';
        }

        if ( maxAverage != countAverage ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe de coincidir la cantidad máxima de: '+maxAverage+'').show();
            return '';
        }
    }
    
    //Declaration arrays
    let data       = new Array();
    let producto   = new Array();
    let promotions = new Array();
    let promotion  = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("shopping") )
        data = JSON.parse(localStorage.getItem("shopping"));
    
    //Add plate consecutivo id
    producto.push(localStorage.getItem("order_plate"));
    
    //Add complements
    $("input[id*='addon']:checked").each(function( i, item ) {
        let addonCount = $( "#count-"+this.id+"" ).val();
        let addon = [this.value, addonCount];
        
        producto.push(addon);
    });
    
    //Add producto
    data.push(producto);
    
    localStorage.setItem('shopping', JSON.stringify(data));
    
    //Flujo multiobjeto
    if( localStorage.getItem('orderIndex') == localStorage.getItem('orderLength') ) {
        //Redirect
        window.location = "ordenaEntrega.html";
    }
    else {
        let orderIndex = parseInt(localStorage.getItem('orderIndex')) + 1;
        localStorage.setItem('orderIndex', orderIndex);
        goOrder();
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: PaymentPaypal
 * @version:  1
 **/
function PaymentPaypal(pay) {
    
    // let env = 'production';
    let env = 'sandbox';
    
    let client = {
        sandbox:    'AVjidpyq3AChF8N-XVSZWruvzR458hl_WwHrSUmtQf7ngpCHUWA17lNnUb89WCTdfXUYsKxCINhaiuj5',
        production: 'ASOuYaPFJfF02GiT8CsoPDsol_yO_rObixTr9jBcPBrtfFvvrLkO9EcBMPxiALfipoYFbmiNB_oaYlwh'
    }
    
    paypal.rest.payment.create(env, client, {
        payment: {
            transactions: [{
                amount: { total: pay, currency: 'MXN' }
            }],
            redirect_urls: {
                return_url: 'http://admin.lealtadprimero.com.mx/servicio/paypal.php?tarjeta='+localStorage.getItem('tarjeta'),
                cancel_url: 'cordova-app://cancel-url',
            }
        }
    }).then(function(token) {
        setToken(token);
        localStorage.setItem('tokenPaypal', token);
        let ref = cordova.InAppBrowser.open('https://www.sandbox.paypal.com/checkoutnow?token=' + token, '_blank', 'location=yes');
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: PaymentPaypal
 * @version:  1
 **/
function corroborarPedido(token) {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getConfirmOrder',
            token     : localStorage.getItem('tokenPaypal'),
            tarjeta   : localStorage.getItem('tarjeta'),
        },
        success:function(data){
            
            swal({
                title: 'Realizando registro...',
                timer: 1500,
                allowOutsideClick: false,
                onOpen: () => {
                    swal.showLoading()
                }
            }).then(() => {
                if ( data.id ) {
                    setPedido(data.id)
                    localStorage.setItem('tokenPaypal', '')
                }
                else {
                    swal({
                        title: '!Atención¡',
                        type: 'info',
                        confirmButtonText: 'Ir a página principal',
                        animation: false,
                        text: 'Ocurrio un problema con su pago, vuelva a realizar la compra o intente de nuevo.',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false,
                        preConfirm: () => {
                            window.location.replace("ordenaConfirma.html");
                        }
                    })
                }
            })
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: corroborarPedido()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 31/10/2017
 * @function: setToken
 * @version:  1
 **/
function setToken(token) {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        //dataType: "json",
        data: {
            funcion   : 'setToken',
            token     : token,
            tarjeta   : localStorage.getItem('tarjeta'),
        },
        success:function(data){
            console.log(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: setToken()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 31/10/2017
 * @function: getPaymentData
 * @version:  1
 **/
function getPaymentData(order) {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getPaymentData',
            tarjeta : localStorage.getItem('tarjeta'),
            order   : order
        },
        success:function(data){
            
            $( '#folio' ).html(data.Numero);
            $( '#id' ).html(data.PayerID);
            $( '#state' ).html(data.paymentId);
            $( '#cart' ).html(data.token);
            $( '#create_time' ).html(data.update_at);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getPaymentData()");
            console.log("Status: " + textStatus); 
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
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 16/05/2018
 * @function: getBranchsByCp
 * @version:  1
 **/
function getBranchsByCp(cp) {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getBranchsByCp',
            cp      : cp,
            cliente : cliente
        },
        success:function(data){
            
            //Hide alert
            $("#alertacp").hide()
            
            const countBranch = data.length
            const select      = $('#sucursales')
            const where       = localStorage.getItem('collect_where')
            
            if ( countBranch ) {
                
                //Removing options
                select.find("option:gt(0)").remove();
                
                $.each(data, function (i, item) {
                    if ( i == 0) {
                        setConfBranch(item.id)
                        
                        localStorage.setItem('collect_cost', item.costo)
                        
                        select.append($('<option>', {
                            value: item.id,
                            text : item.nombreAgencia + ((where == 1) ? ((item.costo > 0) ? ' ($'+item.costo+'.00 costo de envío)' : ' (envío gratis)') : ''),
                            selected: "selected",
                            dataCost: item.costo
                        }))
                    }
                    else {
                        select.append($('<option>', {
                            value: item.id,
                            text : item.nombreAgencia + ((where == 1) ? ((item.costo > 0) ? ' ($'+item.costo+'.00 costo de envío)' : ' (envío gratis)') : ''),
                            dataCost: item.costo
                        }))
                    }
                })
            }
            else {
                //Removing confBranch
                setConfBranch()
                
                //Removing options
                select.find("option:gt(0)").remove();
                
                //Show alert
                $("#alertacp").show()
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getBranchsByCp()")
            console.log("Status: " + textStatus)
            console.log("Error: " + errorThrown)
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 17/05/2018
 * @function: setConfBranch
 * @version:  1
 **/
function setConfBranch(idBranch) {
    
    if (!idBranch) {
        localStorage.removeItem('branchConf')
        
        return false
    }
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion  : 'setConfBranch',
            idBranch : idBranch,
            cliente  : cliente
        },
        success:function(data){
            //Set conf branch in Localstorage
            localStorage.setItem('branchConf', JSON.stringify(data));
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: setConfBranch()")
            console.log("Status: " + textStatus)
            console.log("Error: " + errorThrown)
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @date:     11/05/2018
 * @version:  1
 * @function: setDataCountryAndState
 **/
function fillCalendar() {
    
    const date = new Date()
    const maxMinutes = localStorage.getItem('MaxMinutes')
    
    /////////////////////////////////////////Set time
    let times    = {}
    const hour   = date.getHours()
    const minute = date.getMinutes()
    
    for ( let t = 1; t <= 23; t++ ) {
        if (t.toString().length == 1) {
            let tstring = "0" + t
            times[t] = tstring
        }
        else {
            times[t] = t
        }
    }
    
    $.each(times, function(key, value) {
        if ( (hour + 1) == value ) {
            $('#hour').append($('<option>', {
                value: key,
                text : value,
                selected: "selected"
            }))
        }
        else {
            $('#hour').append($('<option>', {
                value: key,
                text : value,
            }))
        }
    })
    
    let minutes  = {}
    
    for ( let m = 0; m <= 59; m++ ) {
        if (m.toString().length == 1) {
            let mstring = "0" + m
            minutes[m] = mstring
        }
        else {
            minutes[m] = m
        }
    }
    
    $.each(minutes, function(key, value) {
        if ( minute == value ) {
            $('#minute').append($('<option>', {
                value: key,
                text : value,
                selected: "selected"
            }))
        }
        else {
            $('#minute').append($('<option>', {
                value: key,
                text : value,
            }))
        }
    })
    
    /////////////////////////////////////////Set date
    const year   = date.getFullYear()
    const month  = date.getMonth()
    const day    = date.getDate()
    let days     = {}
    
    //Create object days
    for ( let d = 1 ; d <= 31; d++ ) {
        days[d] = d
    }
    
    //Fill options days
    $.each(days, function(key, value) {
        if ( day == value ) {
            $('#day').append($('<option>', {
                value: key,
                text : value,
                selected: "selected"
            }))
        }
        else {
            $('#day').append($('<option>', {
                value: key,
                text : value,
            }))
        }
    })
    
    let months = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ]
    
    //Fill options monts
    $.each(months, function(key, value) {
        if ( month == key ) {
            $('#month').append($('<option>', {
                value: key,
                text : value,
                selected: "selected"
            }))
        }
        else {
            $('#month').append($('<option>', {
                value: key,
                text : value,
            }))
        }
    })
    
    let years    = {}
    
    for ( let y = year; y <= year + 10; y++ ) {
        years[y] = y;
    }
    
    //Fill options years
    $.each(years, function(key, value) {
        if ( year == value ) {
            $('#year').append($('<option>', {
                value: key,
                text : value,
                selected: "selected"
            }))
        }
        else {
            $('#year').append($('<option>', {
                value: value,
                text : value,
            }))
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 16/05/2018
 * @function: getCityByCoverage
 * @version:  1
 **/
function getCityByCoverage(cp) {
    
    $.ajax({
        url: ruta,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getCityByCoverage',
            cp      : cp,
            cliente : cliente
        },
        success:function(data){
            
            //Hide alert
            $("#alertacp").hide()
            
            const countCity = data.length
            const select    = $('#collect_cityarea')
            
            if ( countCity ) {
                
                //Removing options
                select.find("option:gt(0)").remove();
                
                $.each(data, function (i, item) {
                    if ( countCity == 1) {
                        select.append($('<option>', {
                            value: item.id,
                            text : item.asentamiento,
                            selected: "selected"
                        }))
                    }
                    else {
                        select.append($('<option>', {
                            value: item.id,
                            text : item.asentamiento
                        }))
                    }
                })
            }
            else {
                //Removing options
                select.find("option:gt(0)").remove();
                
                //Show alert
                $("#alertacp").show()
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getCityByCoverage()")
            console.log("Status: " + textStatus)
            console.log("Error: " + errorThrown)
            
            swal({
                title: 'Error!',
                text: 'Ocurrio un error, por favor intentelo de nuevo',
                type: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar'
            })
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 16/05/2018
 * @function: geolocate
 * @version:  1
 **/
//function geolocate(postal_code) {
        
    //Get lat and log by postal code
//    let lat = ''
//    let lng = ''
//    let address = postal_code
//    let geocoder = new google.maps.Geocoder()
    
//    geocoder.geocode({'latLng': latlng}, function(results, status) {
//    geocoder.geocode( { 'address': postal_code }, function(results, status) {
//        
//        console.log(results)
//        console.log(status)
        
//        
//      if (status == google.maps.GeocoderStatus.OK) {
//         
//          lat = results[0].geometry.location.lat();
//          lng = results[0].geometry.location.lng();
////        });
//      } else {
//        alert("Geocode was not successful for the following reason: " + status);
//      }
//    });
    
//    console.log('Latitude: ' + lat + ' Logitude: ' + lng);

//    var defaultBounds = new google.maps.LatLngBounds(
//      new google.maps.LatLng(-33.8902, 151.1759),
//      new google.maps.LatLng(-33.8474, 151.2631));
//
//    var input = document.getElementById('searchTextField');
//    var options = {
//      bounds: defaultBounds,
//      types: ['establishment']
//    };
//
//    autocomplete = new google.maps.places.Autocomplete(input, options);

//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(function(position) {
//        
//            var geolocation = {
//                lat: position.coords.latitude,
//                lng: position.coords.longitude
//            };
//            
//            var circle = new google.maps.Circle({
//                center: geolocation,
//                radius: position.coords.accuracy
//            });
        
//            autocomplete.setBounds(circle.getBounds());
//        });
//    }
//}

/**
 * Autocomplete
 **/
//var input        = document.getElementById('collect_street');
//var autocomplete = new google.maps.places.Autocomplete(input, {
//    types: ["geocode"]
//});

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 16/05/2018
 * @function: orderSave
 * @version:  1
 **/
function orderSave() {
    
    $("#alertaRegistro").hide()
    //Validar cobertura para obtener configuraciones
    if (localStorage.getItem("branchConf") === null) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;No existe cobertura').show()
        
        return false
    }
    
    //Obtener configuración de la sucursal elegida
    const conf       = JSON.parse(localStorage.getItem("branchConf"))
    let   maxMinutes = localStorage.getItem('MaxMinutes')
    
    //Validar fecha
    let day    = parseInt($('#day').val())
    let month  = parseInt($('#month').val()) + 1
    let year   = parseInt($('#year').val())
    let fecha  = day+'/'+month+'/'+year
    
    //Validar si la fecha es anterior a hoy
    let today   = new Date()
    let compare = new Date(''+year+'-'+month+'-'+day+'')
    today.setHours(0,0,0,0);  // Lo iniciamos a 00:00 horas
    
    //Validar dias maximos
    let unixtime   = compare.getTime() / 1000;      //Convertir a unixtime
    let diasPedido = 60 * 60 * 24 * parseInt(conf.diasPedido)
    let now        = new Date();                    //Obtener el tiempo en este momento
    let maxDays    = (now / 1000) + diasPedido;     //Agregar los días limites
    
    //Validar horario de entrega
    let dateMin   = new Date(''+year+'-'+month+'-'+day+' '+conf.horaInicio+'')
    let dateMax   = new Date(''+year+'-'+month+'-'+day+' '+conf.horaFin+'')
    let hour      = $('#hour').val()
    let minute    = $('#minute').val()
    let dateRange = true
    
    if (hour.toString().length == 1) {
        hour = "0" + hour
    }
    
    if (minute.toString().length == 1) {
        minute = "0" + minute
    }
    
    //Get dateTime for validate
    let currentDate = new Date(''+year+'-'+month+'-'+day+' '+hour+':'+minute+':00')
    
    //Validar si el horario maximo se desborda
    if (conf.horaInicio > conf.horaFin) {
        
        //Obtener objeto de horario
        let dateMaxObj = conf.horaFin.split(':')
        
        //Agregar un día        
        let dateMaxAdd = (dateMax / 1000) + 86400; //Agregar 1 día
        dateMax = new Date(dateMaxAdd * 1000)
        dateMax.setHours(dateMaxObj[0], dateMaxObj[1], dateMaxObj[2], 0);  //Insertar fin
    }
    
    if (currentDate > dateMin && currentDate < dateMax ){
        dateRange = true
    }
    else {
        dateRange = false
    }
    
    //Validar que el horario de entrega no sea menor al tiempo de preparación y al menos 30 minutos de entrega
    let currentDateMaxMinute = new Date()
    currentDateMaxMinute     = (currentDateMaxMinute / 1000) + (maxMinutes * 60)
    currentDateMaxMinute     = new Date(currentDateMaxMinute * 1000)
    let compareMaxMinutes    = new Date(''+year+'-'+month+'-'+day+' '+hour+':'+minute+':00')
    
    if ( localStorage.getItem('collect_where') == 1 ) {     //DOMICILIO
        //Validate around
        if( !isDate(fecha) ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha no valida').show();
        }
        else if ( unixtime > maxDays ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha excedida para pedidos').show();
        }
        else if( compare < today ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha anterior a hoy').show();
        }
        else if( !dateRange ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;La hora no esta en horario de entrega').show();
        }
        else if( compareMaxMinutes < currentDateMaxMinute ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;El horario no puede ser menor a '+currentDateMaxMinute.getHours()+':'+currentDateMaxMinute.getMinutes()).show();
        }
        else if( $( "#collect_cityarea" ).val() == "" ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de insertar la colonia').show();
        }
        else if( $('#collect_street').val() == "" ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes insertar la calle').show();
        }
        else if( $('#collect_numbext').val() == "" ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes insertar número exterior').show();
        }
        else if ( $('#collect_reference').val() == "" ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de insertar referencias').show();
        }
        else {
            localStorage.setItem('collect_postal', $( "#collect_postal" ).val())
            localStorage.setItem('collect_date', ''+year+'-'+month+'-'+day+'')
            localStorage.setItem('collect_time', ''+hour+':'+minute+':00')
            localStorage.setItem('collect_cityarea', JSON.stringify({
                'id'     : $( "#collect_cityarea" ).find("option:selected").val(),
                'Nombre' : $( "#collect_cityarea" ).find("option:selected").text()
            }))
            localStorage.setItem('collect_street', $( "#collect_street" ).val());
            localStorage.setItem('collect_numbext', $( "#collect_numbext" ).val());
            localStorage.setItem('collect_numbint', $( "#collect_numbint" ).val());
            localStorage.setItem('collect_reference', $( "#collect_reference" ).val());

            window.location = "ordenaConfirma.html";
        }
    }
    else {  //SUCURSAL
        //Validate around
        if( !isDate(fecha) ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha no valida').show();
        }
        else if ( unixtime > maxDays ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha excedida para pedidos').show();
        }
        else if( compare < today ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha anterior a hoy').show();
        }
        else if( !dateRange ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;La hora no esta en horario de entrega').show();
        }
        else if( compareMaxMinutes < currentDateMaxMinute ) {
            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;El horario no puede ser menor a '+currentDateMaxMinute.getHours()+':'+currentDateMaxMinute.getMinutes()).show();
        }
        else {
            localStorage.setItem('collect_postal', $( "#collect_postal" ).val())
            localStorage.setItem('collect_date', ''+year+'-'+month+'-'+day+'')
            localStorage.setItem('collect_time', ''+hour+':'+minute+':00')

            window.location = "ordenaConfirma.html";
        }
    }
}
    