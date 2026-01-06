document.addEventListener('DOMContentLoaded', function() {
    cargarBodegas();
    cargarMonedas();
    cargarMateriales();
});

// Cargar bodegas
function cargarBodegas() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api.php?action=getBodegas', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const bodegas = JSON.parse(xhr.responseText);
            const select = document.getElementById('bodega');
            
            bodegas.forEach(function(bodega) {
                const option = document.createElement('option');
                option.value = bodega.id_bodega;
                option.textContent = bodega.nombre_bodega;
                select.appendChild(option);
            });
        }
    };
    xhr.send();
}

// Cargar sucursales 
document.getElementById('bodega').addEventListener('change', function() {
    const idBodega = this.value;
    const selectSucursal = document.getElementById('sucursal');
    
    // Limpiar sucursales
    selectSucursal.innerHTML = '<option value="">Seleccione una sucursal</option>';
    
    if (idBodega) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'api.php?action=getSucursales&id_bodega=' + idBodega, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const sucursales = JSON.parse(xhr.responseText);
                
                sucursales.forEach(function(sucursal) {
                    const option = document.createElement('option');
                    option.value = sucursal.id_sucursal;
                    option.textContent = sucursal.nombre_sucursal;
                    selectSucursal.appendChild(option);
                });
            }
        };
        xhr.send();
    }
});

// Cargar monedas
function cargarMonedas() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api.php?action=getMonedas', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const monedas = JSON.parse(xhr.responseText);
            const select = document.getElementById('moneda');
            
            monedas.forEach(function(moneda) {
                const option = document.createElement('option');
                option.value = moneda.id_moneda;
                option.textContent = moneda.nombre_moneda + ' (' + moneda.codigo_moneda + ')';
                select.appendChild(option);
            });
        }
    };
    xhr.send();
}

// Cargar materiales 
function cargarMateriales() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api.php?action=getMateriales', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const materiales = JSON.parse(xhr.responseText);
            const container = document.getElementById('materiales');
            
            materiales.forEach(function(material) {
                const div = document.createElement('div');
                div.className = 'checkbox-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'material_' + material.id_material;
                checkbox.name = 'materiales[]';
                checkbox.value = material.id_material;
                
                const label = document.createElement('label');
                label.htmlFor = 'material_' + material.id_material;
                label.textContent = material.nombre_material;
                
                div.appendChild(checkbox);
                div.appendChild(label);
                container.appendChild(div);
            });
        }
    };
    xhr.send();
}

// Validación del formulario
document.getElementById('formProducto').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validarFormulario()) {
        guardarProducto();
    }
});


function validarFormulario() {    
    // Validar código del producto
    const codigoProducto = document.getElementById('codigo_producto').value.trim();
    if (codigoProducto === '') {
        alert('El código del producto no puede estar en blanco.');
        return false;
    }
    
    // Validar formato respecto al codigo: al menos una letra y un número
    const regexCodigo = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
    if (!regexCodigo.test(codigoProducto)) {
        alert('El código del producto debe contener letras y números');
        return false;
    }
    
    // Validar longitud del codigo del producto
    if (codigoProducto.length < 5 || codigoProducto.length > 15) {
        alert('El código del producto debe tener entre 5 y 15 caracteres.');
        return false;
    }
    
    // Validar nombre del producto
    const nombreProducto = document.getElementById('nombre_producto').value.trim();
    if (nombreProducto === '') {
        alert('El nombre del producto no puede estar en blanco.');
        return false;
    }
    
    if (nombreProducto.length < 2 || nombreProducto.length > 50) {
        alert('El nombre del producto debe tener entre 2 y 50 caracteres.');
        return false;
    }
    
    // Validacion de la bodega
    const bodega = document.getElementById('bodega').value;
    if (bodega === '') {
        alert('Debe seleccionar una bodega.');
        return false;
    }
    
    // Validacion de la sucursal
    const sucursal = document.getElementById('sucursal').value;
    if (sucursal === '') {
        alert('Debe seleccionar una sucursal para la bodega seleccionada.');
        return false;
    }
    
    // Validacion moneda
    const moneda = document.getElementById('moneda').value;
    if (moneda === '') {
        alert('Debe seleccionar una moneda para el producto.');
        return false;
    }
    
    // Validacion del precio
    const precio = document.getElementById('precio').value.trim();
    if (precio === '') {
        alert('El precio del producto no puede estar en blanco.');
        return false;
    }
    
    const regexPrecio = /^\d+(\.\d{1,2})?$/;
    if (!regexPrecio.test(precio) || parseFloat(precio) <= 0) {
        alert('El precio del producto debe ser un número positivo con hasta dos decimales.');
        return false;
    }
    
    // Validacion materiales (se deben seleccionar dos al menos)
    const materiales = document.querySelectorAll('input[name="materiales[]"]:checked');
    if (materiales.length < 2) {
        alert('Debe seleccionar al menos dos materiales para el producto.');
        return false;
    }
    
    // Validacion de la descripción
    const descripcion = document.getElementById('descripcion').value.trim();
    if (descripcion === '') {
        alert('La descripción del producto no puede estar en blanco.');
        return false;
    }
    
    if (descripcion.length < 10 || descripcion.length > 1000) {
        alert('La descripción del producto debe tener entre 10 y 1000 caracteres.');
        return false;
    }
    
    return true;
}

function guardarProducto() {
    const formData = new FormData();
    
    formData.append('codigo_producto', document.getElementById('codigo_producto').value.trim());
    formData.append('nombre_producto', document.getElementById('nombre_producto').value.trim());
    formData.append('id_bodega', document.getElementById('bodega').value);
    formData.append('id_sucursal', document.getElementById('sucursal').value);
    formData.append('id_moneda', document.getElementById('moneda').value);
    formData.append('precio', document.getElementById('precio').value.trim());
    formData.append('descripcion', document.getElementById('descripcion').value.trim());
    
    const materiales = document.querySelectorAll('input[name="materiales[]"]:checked');
    const vectorMateriales = [];
    materiales.forEach(function(checkbox) {
        vectorMateriales.push(checkbox.value);
    });
    formData.append('materiales', JSON.stringify(vectorMateriales));
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api.php?action=guardarProducto', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            
            if (response.success) {
                alert('Producto guardado exitosamente');
                document.getElementById('formProducto').reset();
                // Limpiar sucursales
                document.getElementById('sucursal').innerHTML = '<option value="">Seleccione una sucursal</option>';
            } else {
                alert(response.message);
            }
        } else {
            alert('Error al guardar el producto. Intente nuevamente.');
        }
    };
    xhr.send(formData);
}