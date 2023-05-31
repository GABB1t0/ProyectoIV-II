import { url } from './urls.js';

const { url_resumen_ventas, url_sesiones } = url;

const d = document,
$fecha_resumen = d.querySelector('#fecha_resumen'),
$lista_resumen_ventas = d.querySelector('#lista_resumen_ventas'),
$fragment = d.createDocumentFragment();

const show_data_ventas = (data) => {

    //Template HTML
    const $items_lista_resumen_ventas = d.querySelector('#items_lista_resumen_ventas').content;

    const asignarvalores = (id_venta,cliente,monto,acciones) => {
        //Insertamos los datos en el template
        $items_lista_resumen_ventas.querySelector('.codigo_factura').textContent = id_venta;
        $items_lista_resumen_ventas.querySelector('.cliente').textContent = cliente;
        $items_lista_resumen_ventas.querySelector('.monto_total').textContent = monto;
        $items_lista_resumen_ventas.querySelector('.acciones').innerHTML = acciones;
        $items_lista_resumen_ventas.querySelector('.info-resumen-ventas') !== null ?   $items_lista_resumen_ventas.querySelector('.info-resumen-ventas').dataset.id = id_venta : '';
        //guardamos una copia de la estrutura actual del template en la variable $node
        let $clone = $items_lista_resumen_ventas.cloneNode(true);
        //Guardamos el nodo en el fragment
        $fragment.append($clone)
        
    }

    if(data.length > 0){

        data.forEach(element => {
            asignarvalores(
                element.idVenta,
                element.cliente.nombre_empresa,
                element.montoVenta,
                '<button type="button" class="mdl-button mdl-button--icon mdl-js-button button_resumen"><i class="zmdi zmdi-more  info-resumen-ventas"></i></button>'
            );
        });

    }else{
        asignarvalores('No hay ventas Concretadas','','','');
    }

    //Limpiamos la lista
    $lista_resumen_ventas.innerHTML = "";
    //Insertamos el fragment en la lista
    $lista_resumen_ventas.append($fragment);
}

const show_num_ventas_and_monto_total_ventas = (monto_total,num_ventas) => {
    d.querySelector('#num_ventas').innerHTML = num_ventas;
    d.querySelector('#monto_total_ventas').innerHTML = monto_total;
}

const extraer_datos_ventas = async (fecha,url) => {
    try {
        const res = await fetch(`${url}?extraerVentas=${fecha}`);
        const data = await res.json();
        return data.success;
    } catch (error) {
        console.log(error);
    }
}

const calcular_monto_total_venta_diaria = (data) => {

    let monto_total = 0;

    data.forEach(venta => {
        monto_total += Number(venta.montoVenta); 
    })

    return monto_total;

}

const crear_variable_session_resumen_ventas = async(id_venta,url) => {
    try {
        const res = await fetch(`${url}?resumen_ventas=${id_venta}`);
        if(!res.ok) throw {status : res.status, statusText : res.statusText};
        const data = await res.json();
        console.log(data)
        if(data.data !== ""){
            window.location = 'visualizar_resumen_venta';
        }
    } catch (error) {
        console.log(error)
        let titulo = error.status || "Error";
        let mensaje = error.statusText || "Ocurrio un error, Contacte al Administrador";
        alerta({
            titulo,
            mensaje,
            tipo_mensaje: "error"
        });
    }
}

$fecha_resumen.addEventListener('change', async e => {
    const data_ventas = await extraer_datos_ventas($fecha_resumen.value, url_resumen_ventas);
    console.log(data_ventas)
    const monto_total_venta_diaria = calcular_monto_total_venta_diaria(data_ventas);
    show_data_ventas(data_ventas);
    show_num_ventas_and_monto_total_ventas(monto_total_venta_diaria,data_ventas.length);
});

d.addEventListener('click', e => {

    if($lista_resumen_ventas.contains(e.target)){
        
        if(e.target.classList.contains('info-resumen-ventas')){
            e.preventDefault();
            
            const id_venta = e.target.dataset.id;
            console.log(id_venta);

            crear_variable_session_resumen_ventas(id_venta,url_sesiones);
        }

        if(e.target.classList.contains('button_resumen')){
            e.preventDefault();

            const id_venta = e.target.firstChild.dataset.id;
            console.log(id_venta);

            crear_variable_session_resumen_ventas(id_venta,url_sesiones);
        }

    }
})

d.addEventListener('DOMContentLoaded', async e => {

    //Insertamos la fecha actual al input date

    // Paso 1: Crear una nueva instancia de Date
    const currentDate = new Date();

    // Paso 2: Formatear la fecha
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Paso 3: Asignar el valor al input date
    $fecha_resumen.value = formattedDate;

    console.log(formattedDate)

    //Realizamos una consulta para extraer todas las ventas realizadas en la fecha actual
    const data_ventas = await extraer_datos_ventas(formattedDate,url_resumen_ventas)
    console.log(data_ventas);
    //Calculamos el monto total diario de las ventas realizadas
    const monto_total_venta_diaria = calcular_monto_total_venta_diaria(data_ventas);
    //Mostramos los datos de la venta en pantalla
    show_data_ventas(data_ventas);
    show_num_ventas_and_monto_total_ventas(monto_total_venta_diaria,data_ventas.length);

});

