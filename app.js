// app.js - Lógica completa

let presupuestoItems = [];

// Renderizar select de prestaciones
function renderSelectPrestaciones() {
    const select = document.getElementById('selectPrestacion');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar prestación</option>';
    prestacionesCompletas.forEach(prest => {
        const option = document.createElement('option');
        option.value = prest.nombre;
        option.textContent = `${prest.nombre} (${prest.upe} UPE - ${prest.tiempo} min)`;
        select.appendChild(option);
    });
}

// Calcular precio
function calcularPrecio(prestacionNombre, tipo, cantidad) {
    const prest = prestacionesCompletas.find(p => p.nombre === prestacionNombre);
    if (!prest) return { total: 0, upe: 0, valorUnitario: 0 };
    const valorUnitario = prest.valores[tipo];
    const total = valorUnitario * cantidad;
    return { total, upe: prest.upe, valorUnitario };
}

function getTipoNombre(tipo) {
    const tipos = { CD: 'Consultorio Diurno', CN: 'Consultorio Nocturno', DD: 'Domicilio Diurno', DN: 'Domicilio Nocturno' };
    return tipos[tipo] || tipo;
}

// Actualizar calculadora
function actualizarCalculadora() {
    const prestacionNombre = document.getElementById('selectPrestacion').value;
    const tipo = document.getElementById('tipoServicio').value;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    
    if (!prestacionNombre) {
        document.getElementById('precioCalculado').innerText = '$0,00';
        document.getElementById('detalleUpe').innerText = 'Seleccioná una prestación';
        return;
    }
    const prest = prestacionesCompletas.find(p => p.nombre === prestacionNombre);
    if (!prest) return;
    
    const { total, upe } = calcularPrecio(prestacionNombre, tipo, cantidad);
    const tipoNombre = getTipoNombre(tipo);
    document.getElementById('precioCalculado').innerHTML = `$${total.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    document.getElementById('detalleUpe').innerHTML = `${prest.nombre} · ${upe} UPE x ${cantidad} = ${total.toLocaleString('es-AR', {minimumFractionDigits: 2})} (${tipoNombre})`;
}

// Agregar al presupuesto
function agregarAlPresupuesto() {
    const prestacionNombre = document.getElementById('selectPrestacion').value;
    const tipo = document.getElementById('tipoServicio').value;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!prestacionNombre) {
        alert('Seleccioná una prestación primero');
        return;
    }
    const prest = prestacionesCompletas.find(p => p.nombre === prestacionNombre);
    if (!prest) return;
    const { total, upe, valorUnitario } = calcularPrecio(prestacionNombre, tipo, cantidad);
    
    const item = {
        id: Date.now() + Math.random(),
        nombre: prestacionNombre,
        tipo: tipo,
        tipoNombre: getTipoNombre(tipo),
        upe: upe,
        cantidad: cantidad,
        subtotal: total,
        valorUnitarioMostrado: valorUnitario
    };
    presupuestoItems.push(item);
    renderPresupuesto();
}

function eliminarItemPresupuesto(id) {
    presupuestoItems = presupuestoItems.filter(item => item.id !== id);
    renderPresupuesto();
}

function renderPresupuesto() {
    const tbody = document.getElementById('presupuestoTbody');
    const totalPresupuestoElem = document.getElementById('totalPresupuesto');
    if (!tbody) return;
    
    if (presupuestoItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-400">No hay items. Agregá desde la calculadora.</td></tr>';
        totalPresupuestoElem.innerText = '$0,00';
        return;
    }
    
    let totalGeneral = 0;
    tbody.innerHTML = '';
    presupuestoItems.forEach(item => {
        totalGeneral += item.subtotal;
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50';
        row.innerHTML = `
            <td class="px-4 py-3 font-medium">${item.nombre}</td>
            <td class="px-4 py-3 text-sm">${item.tipoNombre}</td>
            <td class="px-4 py-3">${item.upe}</td>
            <td class="px-4 py-3">${item.cantidad}</td>
            <td class="px-4 py-3 font-semibold text-emerald-700">$${item.subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
            <td class="px-4 py-3"><button onclick="eliminarItemPresupuesto(${item.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button></td>
        `;
        tbody.appendChild(row);
    });
    totalPresupuestoElem.innerText = `$${totalGeneral.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
}

function exportarPresupuestoCSV() {
    if (presupuestoItems.length === 0) {
        alert('No hay items en el presupuesto');
        return;
    }
    let csvContent = "Prestación,Modalidad,UPE,Cantidad,Subtotal\n";
    presupuestoItems.forEach(item => {
        csvContent += `"${item.nombre}",${item.tipoNombre},${item.upe},${item.cantidad},${item.subtotal}\n`;
    });
    const total = presupuestoItems.reduce((sum, i) => sum + i.subtotal, 0);
    csvContent += `"TOTAL",,,,${total}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `presupuesto_enfermeria_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Calculadora hora de enfermería
function actualizarHoraEnfermeria() {
    const tipoPaciente = document.getElementById('tipoPaciente').value;
    const complejidad = document.getElementById('complejidad').value;
    const turno = document.getElementById('turnoHora').value;
    
    let upePorHora = 0;
    if (tipoPaciente === 'adulto') {
        if (complejidad === 'minimo') upePorHora = HORA_ENFERMERIA.adulto.minimo;
        else if (complejidad === 'moderado') upePorHora = HORA_ENFERMERIA.adulto.moderado;
        else upePorHora = HORA_ENFERMERIA.adulto.especial;
    } else {
        if (complejidad === 'minimo') upePorHora = HORA_ENFERMERIA.pediatrico.minimo;
        else if (complejidad === 'moderado') upePorHora = HORA_ENFERMERIA.pediatrico.moderado;
        else upePorHora = HORA_ENFERMERIA.pediatrico.especial;
    }
    
    const valorUPE = VALORES_UPE[turno];
    const totalHora = upePorHora * valorUPE;
    document.getElementById('valorHoraEnfermeria').innerHTML = `$${totalHora.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    document.getElementById('detalleHora').innerHTML = `${upePorHora} UPE/hora · ${getTipoNombre(turno)}`;
}

// Tabla completa con filtro
function renderTablaNomenclador(filtro = '') {
    const tbody = document.getElementById('tablaNomencladorBody');
    if (!tbody) return;
    let filtered = prestacionesCompletas;
    if (filtro.trim() !== '') {
        filtered = prestacionesCompletas.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));
    }
    tbody.innerHTML = '';
    filtered.forEach(prest => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50';
        row.innerHTML = `
            <td class="px-4 py-3 font-medium text-sm">${prest.nombre}</td>
            <td class="px-4 py-3 text-sm">${prest.tiempo}'</td>
            <td class="px-4 py-3 font-mono text-sm">${prest.upe}</td>
            <td class="px-4 py-3 text-sm">$${prest.valores.CD.toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
            <td class="px-4 py-3 text-sm">$${prest.valores.CN.toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
            <td class="px-4 py-3 text-sm">$${prest.valores.DD.toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
            <td class="px-4 py-3 text-sm font-semibold text-emerald-700">$${prest.valores.DN.toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
        `;
        tbody.appendChild(row);
    });
    if(filtered.length === 0){
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-slate-400">No se encontraron prestaciones</td></tr>';
    }
}

// Búsqueda en vivo para calculadora
function configurarBuscador() {
    const inputBusqueda = document.getElementById('searchPrestacion');
    const select = document.getElementById('selectPrestacion');
    if(!inputBusqueda) return;
    inputBusqueda.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const options = Array.from(select.options);
        let firstMatch = null;
        options.forEach(opt => {
            if(opt.value === "") return;
            const text = opt.textContent.toLowerCase();
            if(text.includes(term)) {
                opt.style.display = '';
                if(!firstMatch) firstMatch = opt.value;
            } else {
                opt.style.display = 'none';
            }
        });
        if(firstMatch && term !== "") {
            select.value = firstMatch;
            actualizarCalculadora();
        } else if(term === "") {
            options.forEach(opt => opt.style.display = '');
            select.value = "";
            actualizarCalculadora();
        }
    });
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    renderSelectPrestaciones();
    renderTablaNomenclador();
    actualizarCalculadora();
    actualizarHoraEnfermeria();
    configurarBuscador();
    
    document.getElementById('selectPrestacion').addEventListener('change', actualizarCalculadora);
    document.getElementById('tipoServicio').addEventListener('change', actualizarCalculadora);
    document.getElementById('cantidad').addEventListener('input', actualizarCalculadora);
    document.getElementById('btnAgregarPresupuesto').addEventListener('click', agregarAlPresupuesto);
    document.getElementById('exportarPresupuesto').addEventListener('click', exportarPresupuestoCSV);
    document.getElementById('tipoPaciente').addEventListener('change', actualizarHoraEnfermeria);
    document.getElementById('complejidad').addEventListener('change', actualizarHoraEnfermeria);
    document.getElementById('turnoHora').addEventListener('change', actualizarHoraEnfermeria);
    document.getElementById('filtroTabla').addEventListener('input', (e) => renderTablaNomenclador(e.target.value));
    
    window.eliminarItemPresupuesto = eliminarItemPresupuesto;
});