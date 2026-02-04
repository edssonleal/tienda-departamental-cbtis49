// 1. Datos del Sistema
const tienda = {
    almacenes: ["Norte", "Sur", "Este", "Oeste", "Central"],
    proveedores: ["Distribuidora Global", "Tecno-Abasto MX"],
    productos: [
        { id: 101, nombre: "Laptop Pro", stock: [10, 5, 2, 8, 15], precio: 15000, min: 10 },
        { id: 102, nombre: "Mouse Optico", stock: [50, 20, 10, 30, 40], precio: 350, min: 30 }
    ]
};

// 2. Navegación
function showSection(section) {
    const content = document.getElementById('content');
    document.getElementById('orden-compra-container').style.display = 'none';

    if (section === 'inventario') {
        renderInventario();
    } else if (section === 'ventas' || section === 'compras') {
        content.innerHTML = `
            <h2>Registrar ${section.toUpperCase()}</h2>
            <div class="card">
                <p>Seleccione producto, almacén y cantidad:</p>
                <select id="prod-select">
                    ${tienda.productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
                </select>
                <select id="alm-idx">
                    ${tienda.almacenes.map((a, i) => `<option value="${i}">${a}</option>`).join('')}
                </select>
                <input type="number" id="cant" value="1" min="1">
                <button onclick="ejecutarAccion('${section}')">Procesar Operación</button>
            </div>`;
    } else if (section === 'reportes') {
        generarInformeEstado();
    }
}

// 3. Renderizar Inventario
function renderInventario() {
    let html = `<h2>Estado General de Almacenes</h2>
                <table border="1">
                <tr><th>Producto</th>${tienda.almacenes.map(a => `<th>${a}</th>`).join('')}<th>Total Global</th></tr>`;

    tienda.productos.forEach(p => {
        let total = p.stock.reduce((a, b) => a + b, 0);
        html += `<tr><td><strong>${p.nombre}</strong></td>
                    ${p.stock.map(s => `<td>${s}</td>`).join('')}
                    <td><strong>${total}</strong></td></tr>`;
    });
    html += `</table>`;
    document.getElementById('content').innerHTML = html;
}

// 4. Lógica de Negocio
function ejecutarAccion(tipo) {
    const id = parseInt(document.getElementById('prod-select').value);
    const cant = parseInt(document.getElementById('cant').value);
    const idx = parseInt(document.getElementById('alm-idx').value);
    const p = tienda.productos.find(prod => prod.id === id);

    if (tipo === 'ventas') {
        if (p.stock[idx] >= cant) {
            p.stock[idx] -= cant;
            alert("Venta realizada con éxito");
            renderInventario();
        } else {
            alert("¡Error! Stock insuficiente en almacén " + tienda.almacenes[idx]);
        }
    } else {
        p.stock[idx] += cant;
        alert("Compra registrada y stock actualizado");
        renderInventario();
    }
}

// 5. Reportes y Alertas
function generarInformeEstado() {
    let html = '<h2>Alertas de Reabastecimiento</h2>';
    let hayAlertas = false;

    tienda.productos.forEach(p => {
        const total = p.stock.reduce((a, b) => a + b, 0);
        if (total <= p.min) {
            hayAlertas = true;
            html += `
                <div class="card" style="border-left: 5px solid red;">
                    <p><strong>ALERTA:</strong> ${p.nombre} tiene solo ${total} unidades (Mínimo: ${p.min}).</p>
                    <button onclick="prepararOrden(${p.id})">Generar Orden de Compra</button>
                </div>`;
        }
    });

    if (!hayAlertas) html += '<p>Todo el stock está en niveles óptimos.</p>';
    document.getElementById('content').innerHTML = html;
}

function prepararOrden(id) {
    const p = tienda.productos.find(prod => prod.id === id);
    const container = document.getElementById('orden-compra-container');
    container.style.display = 'block';
    document.getElementById('folio-orden').textContent = "OC-" + Math.floor(Math.random()*1000);
    document.getElementById('fecha-orden').textContent = new Date().toLocaleDateString();
    document.getElementById('detalle-orden').innerHTML = `
        <p>Se solicita al proveedor <strong>${tienda.proveedores[0]}</strong> la cantidad de 
        <strong>${p.min * 2}</strong> unidades de <strong>${p.nombre}</strong> para reabastecimiento.</p>`;
    container.scrollIntoView();
}