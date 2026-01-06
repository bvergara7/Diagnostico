<?php 

require_once 'config.php';

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] :'';

switch ($action) {
    case 'getBodegas':
        getBodegas($conn);
        break;
    case 'getSucursales':
        getSucursales($conn);
        break;
    case 'getMonedas':
        getMonedas($conn);
        break;
        
    case 'getMateriales':
        getMateriales($conn);
        break;
        
    case 'guardarProducto':
        guardarProducto($conn);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;  
    
}

#Funciones de Obtención de Datos
function getBodegas($conn) {
    $query = "SELECT id_bodega, nombre_bodega FROM bodegas ORDER BY nombre_bodega";
    $result = mysqli_query($conn, $query);
    
    $bodegas = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $bodegas[] = $row;
    }
    
    echo json_encode($bodegas);
}

function getSucursales($conn) {
    $id_bodega = isset($_GET['id_bodega']) ? intval($_GET['id_bodega']) : 0;
    
    if ($id_bodega > 0) {
        $query = "SELECT id_sucursal, nombre_sucursal FROM sucursales WHERE id_bodega = ? ORDER BY nombre_sucursal";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_bodega);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $sucursales = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $sucursales[] = $row;
        }
        
        mysqli_stmt_close($stmt);
        echo json_encode($sucursales);
    } else {
        echo json_encode(array());
    }

}

function getMonedas($conn){
    $query = "SELECT id_moneda, codigo_moneda, nombre_moneda FROM monedas ORDER BY nombre_moneda";
    $result = mysqli_query($conn, $query);
    $monedas = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $monedas[] = $row;
    }
    echo json_encode($monedas);
}

function getMateriales($conn){
    $query = "SELECT id_material, nombre_material FROM materiales ORDER BY nombre_material";
    $result = mysqli_query($conn, $query);

    $materiales = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $materiales[] = $row;
    }
    echo json_encode($materiales);
}

//Funcion para guardar producto

function guardarProducto($conn) {
    // Obtener datos de las variables del POST
    $codigo_producto = trim($_POST['codigo_producto']);
    $nombre_producto = trim($_POST['nombre_producto']);
    $id_bodega = intval($_POST['id_bodega']);
    $id_sucursal = intval($_POST['id_sucursal']);
    $id_moneda = intval($_POST['id_moneda']);
    $precio = floatval($_POST['precio']);
    $descripcion = trim($_POST['descripcion']);
    $materiales = json_decode($_POST['materiales'], true);
    
    // Validar que el código del producto no exista
    $query = "SELECT id_producto FROM productos WHERE codigo_producto = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $codigo_producto);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        mysqli_stmt_close($stmt);
        echo json_encode(array(
            'success' => false,
            'message' => 'El código del producto ya está registrado.'
        ));
        return;
    }
    mysqli_stmt_close($stmt);
    
    mysqli_begin_transaction($conn);
    
    try {
        // Insertar producto
        $query = "INSERT INTO productos (codigo_producto, nombre_producto, id_bodega, id_sucursal, id_moneda, precio, descripcion) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "ssiiids", 
            $codigo_producto,
            $nombre_producto,
            $id_bodega,
            $id_sucursal,
            $id_moneda,
            $precio,
            $descripcion
        );
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception('Error al insertar el producto');
        }
        
        $id_producto = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);
        
        // Insertar materiales del producto
        $query = "INSERT INTO producto_materiales (id_producto, id_material) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        
        foreach ($materiales as $id_material) {
            $id_material_int = intval($id_material);
            mysqli_stmt_bind_param($stmt, "ii", $id_producto, $id_material_int);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception('Error al insertar los materiales');
            }
        }
        
        mysqli_stmt_close($stmt);
        
        // Confirmar guardado
        mysqli_commit($conn);
        
        echo json_encode(array(
            'success' => true,
            'message' => 'Producto guardado exitosamente'
        ));
        
    } catch (Exception $e) {
   
        mysqli_rollback($conn);
        
        //Error guardado

        echo json_encode(array(
            'success' => false,
            'message' => 'Error al guardar el producto: ' . $e->getMessage()
        ));
    }
}


mysqli_close($conn);
?>