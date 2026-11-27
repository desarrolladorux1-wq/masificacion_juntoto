(() => {
  const $ = id => document.getElementById(id);
  const clave = 'petroperu.movil.no-conformidades';
  let editandoId = null;
  const proyectosAsignados = [
    { id: 'redes-cusco', core: 'Redes', nombre: 'Redes de distribución · Cusco', codigo: 'RED-CUS-001', ciudad: 'Cusco', distrito: 'Cusco', ubicacion: 'Frentes de redes externas asignados', actividad: 'Supervisión de redes de distribución', empresa: 'Empresa especializada asignada', responsable: 'Supervisor PETROPERÚ', detalle: 'Construcción y supervisión de redes externas de distribución.' },
    { id: 'redes-arequipa', core: 'Redes', nombre: 'Redes de distribución · Arequipa', codigo: 'RED-AQP-002', ciudad: 'Arequipa', distrito: 'Arequipa', ubicacion: 'Frentes de redes externas asignados', actividad: 'Supervisión de redes de distribución', empresa: 'Empresa especializada asignada', responsable: 'Supervisor PETROPERÚ', detalle: 'Ampliación de redes y conexiones en frentes asignados.' },
    { id: 'psr-cusco', core: 'PSR', nombre: 'PSR-GNL · Cusco', codigo: 'PSR-CUS-001', ciudad: 'Cusco', distrito: 'Cusco', ubicacion: 'PSR-GNL asignada', actividad: 'Supervisión de estación de regasificación', empresa: 'Empresa especializada asignada', responsable: 'Supervisor PETROPERÚ', detalle: 'Estación de regasificación y componentes asociados.' },
    { id: 'tdc-cusco', core: 'TDC', nombre: 'Tuberías de conexión · Cusco', codigo: 'TDC-CUS-001', ciudad: 'Cusco', distrito: 'Cusco', ubicacion: 'Frentes de conexiones asignados', actividad: 'Supervisión de tuberías de conexión', empresa: 'Empresa especializada asignada', responsable: 'Supervisor PETROPERÚ', detalle: 'Tuberías de conexión domiciliaria y acometidas.' }
  ];
  const hoy = () => new Date().toLocaleDateString('en-CA');
  const escapar = valor => String(valor || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const leer = () => {
    try {
      const datos = JSON.parse(localStorage.getItem(clave) || '[]');
      return Array.isArray(datos) ? datos.map((nc, indice) => ({
        ...nc, id: nc.id || `legacy-${indice}`, numeroNc: nc.numeroNc || nc.codigo || `NC-${String(indice + 1).padStart(3, '0')}`,
        fechaApertura: nc.fechaApertura || nc.fecha || '', descripcionNc: nc.descripcionNc || nc.descripcion || '',
        ubicacionEspecifica: nc.ubicacionEspecifica || nc.ubicacion || '', accionTratamiento: nc.accionTratamiento || nc.accion || '', estado: nc.estado || 'Abierta'
      })) : [];
    } catch (_) { return []; }
  };
  const guardar = datos => localStorage.setItem(clave, JSON.stringify(datos));
  const avisar = texto => { const aviso = $('aviso'); aviso.textContent = texto; aviso.classList.add('visible'); setTimeout(() => aviso.classList.remove('visible'), 2600); };
  const fecha = valor => valor ? valor.split('-').reverse().join('/') : 'Sin fecha';

  function cargarProyectos() {
    const filtro = $('filtroProyectoNc'); const proyectoFicha = $('proyectoNcPetro');
    const grupos = [...new Set(proyectosAsignados.map(proyecto => proyecto.core))];
    const opciones = grupos.map(core => `<optgroup label="${core}">${proyectosAsignados.filter(proyecto => proyecto.core === core).map(proyecto => `<option value="${proyecto.id}">${proyecto.nombre}</option>`).join('')}</optgroup>`).join('');
    filtro.innerHTML = opciones; proyectoFicha.innerHTML = opciones;
    mostrarDetalleProyecto();
  }

  function proyectoActual() { return proyectosAsignados.find(proyecto => proyecto.id === $('filtroProyectoNc').value) || proyectosAsignados[0]; }

  function mostrarDetalleProyecto() {
    const proyecto = proyectoActual();
    $('detalleProyectoNc').innerHTML = `<b>${proyecto.codigo} · ${proyecto.nombre}</b>${proyecto.detalle}<span>Elemento CORE: ${proyecto.core}</span>`;
  }

  function actualizarResumen(datos = leer()) {
    const abiertas = datos.filter(nc => nc.estado === 'Abierta').length;
    const subsanacion = datos.filter(nc => nc.estado === 'En subsanación').length;
    const cerradas = datos.filter(nc => nc.estado === 'Cerrada').length;
    ['contadorNcAbiertas', 'contadorNcAbiertasFicha'].forEach(id => { if ($(id)) $(id).textContent = abiertas; });
    ['contadorNcSubsanacion', 'contadorNcSubsanacionFicha'].forEach(id => { if ($(id)) $(id).textContent = subsanacion; });
    ['contadorNcCerradas', 'contadorNcCerradasFicha'].forEach(id => { if ($(id)) $(id).textContent = cerradas; });
  }

  function render() {
    const todos = leer(); const proyecto = proyectoActual();
    const datos = todos.filter(nc => !nc.proyectoId || nc.proyectoId === proyecto.id);
    actualizarResumen(datos);
    const lista = $('listaNcPetroMovil');
    lista.innerHTML = datos.length ? datos.map(nc => `<button type="button" class="nc-petro-item estado-${nc.estado.toLowerCase().replaceAll(' ', '-')}" data-abrir-nc="${nc.id}"><small>${escapar(nc.estado)} · ${escapar(nc.numeroNc)}</small><b>${escapar(nc.titulo || nc.tipoNc || 'No conformidad')}</b><span>${escapar(nc.proyecto || 'Proyecto sin registrar')} · ${fecha(nc.fechaApertura)}</span><p>${escapar(nc.descripcionNc || 'Sin descripción registrada')}</p><em>Ver ficha completa ›</em></button>`).join('') : '<p class="nc-vacio">No hay No Conformidades registradas.</p>';
    lista.querySelectorAll('[data-abrir-nc]').forEach(boton => boton.addEventListener('click', () => abrirFicha(boton.dataset.abrirNc)));
  }

  function limpiarFicha() {
    const form = $('formNcPetro');
    form.reset(); editandoId = null;
    const proyecto = proyectoActual();
    $('numeroNcPetro').value = `NC-${new Date().getFullYear()}-${String(leer().length + 1).padStart(3, '0')}`;
    $('proyectoNcPetro').value = $('filtroProyectoNc').value;
    $('fechaAperturaPetro').value = hoy();
    $('fechaIdentificacionPetro').value = hoy();
    form.elements.codigoProyecto.value = proyecto.codigo;
    form.elements.ciudad.value = proyecto.ciudad;
    form.elements.distrito.value = proyecto.distrito;
    form.elements.ubicacionEspecifica.value = proyecto.ubicacion;
    form.elements.actividad.value = proyecto.actividad;
    form.elements.empresaContratista.value = proyecto.empresa;
    form.elements.responsable.value = proyecto.responsable;
    $('tituloFichaNc').textContent = 'Registrar No Conformidad';
    $('guardarNcPetro').textContent = 'Registrar NC';
    $('estadoNcPetro').value = 'Abierta';
  }

  function abrirFicha(id) {
    const registro = leer().find(nc => nc.id === id);
    if (!registro) return;
    const form = $('formNcPetro');
    limpiarFicha(); editandoId = id;
    Object.entries(registro).forEach(([nombre, valor]) => {
      const campo = form.elements[nombre];
      if (!campo || ['id', 'evidencias'].includes(nombre)) return;
      if (campo instanceof RadioNodeList) {
        if (Array.isArray(valor)) [...campo].forEach(item => { item.checked = valor.includes(item.value); });
        else [...campo].forEach(item => { item.checked = item.value === valor; });
      } else campo.value = valor || '';
    });
    ['tipoRed', 'afectacion', 'especialidad'].forEach(nombre => {
      const valores = registro[nombre] || [];
      form.querySelectorAll(`[name="${nombre}"]`).forEach(campo => { campo.checked = valores.includes(campo.value); });
    });
    $('tituloFichaNc').textContent = `NC ${registro.numeroNc}`;
    $('guardarNcPetro').textContent = 'Guardar cambios';
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function datosFormulario() {
    const form = $('formNcPetro'); const fd = new FormData(form);
    const valor = nombre => String(fd.get(nombre) || '').trim();
    const valores = nombre => fd.getAll(nombre).filter(Boolean);
    return {
      id: editandoId || `${Date.now()}`, numeroNc: valor('numeroNc'), estado: valor('estado') || 'Abierta',
      proyectoId: valor('proyecto'), proyecto: proyectosAsignados.find(proyecto => proyecto.id === valor('proyecto'))?.nombre || valor('proyecto'), ciudad: valor('ciudad'), distrito: valor('distrito'), codigoProyecto: valor('codigoProyecto'),
      fechaApertura: valor('fechaApertura'), fechaCierre: valor('fechaCierre'), ubicacionEspecifica: valor('ubicacionEspecifica'), actividad: valor('actividad'), empresaContratista: valor('empresaContratista'), responsable: valor('responsable'),
      identificadoPor: valor('identificadoPor'), fechaIdentificacion: valor('fechaIdentificacion'), tipoRed: valores('tipoRed'), afectacion: valores('afectacion'), especialidad: valores('especialidad'),
      descripcionNc: valor('descripcionNc'), normaIncumplida: valor('normaIncumplida'), causaNc: valor('causaNc'), accionTratamiento: valor('accionTratamiento'), descripcionTratamiento: valor('descripcionTratamiento'),
      definidoPor: valor('definidoPor'), fechaDefinido: valor('fechaDefinido'), ejecutadoPor: valor('ejecutadoPor'), fechaEjecutado: valor('fechaEjecutado'), accionCorrectiva: valor('accionCorrectiva'),
      observacionesVerificacion: valor('observacionesVerificacion'), verificadoPor: valor('verificadoPor'), fechaVerificacion: valor('fechaVerificacion'),
      evidencias: [...form.querySelectorAll('input[type="file"]')].reduce((total, input) => total + input.files.length, 0)
    };
  }

  function validarFicha(form) {
    const faltante = [...form.querySelectorAll('[required]')].find(campo => !campo.value.trim());
    if (!faltante) return true;
    const etiqueta = faltante.closest('label')?.childNodes[0]?.textContent?.trim() || 'campo obligatorio';
    avisar(`Complete: ${etiqueta}.`);
    faltante.scrollIntoView({ behavior: 'smooth', block: 'center' });
    faltante.focus();
    return false;
  }

  function ir(vista) {
    document.querySelectorAll('.vista').forEach(seccion => seccion.classList.toggle('activa', seccion.id === vista));
    document.querySelectorAll('nav button').forEach(boton => boton.classList.toggle('activo', boton.dataset.ir === vista));
    document.querySelector('.contenido').scrollTo({ top: 0, behavior: 'smooth' });
  }

  const menuMovil = document.querySelector('.telefono nav');
  menuMovil?.querySelectorAll('button').forEach(boton => {
    [...boton.querySelectorAll('svg')].slice(1).forEach(icono => icono.remove());
    boton.querySelectorAll('.menu-icono-petro, .icono-menu-supervisor').forEach(icono => icono.remove());
  });
  document.querySelectorAll('[data-ir]').forEach(boton => boton.addEventListener('click', () => ir(boton.dataset.ir)));
  $('formLoginPetro').addEventListener('submit', evento => { evento.preventDefault(); $('pantallaLoginPetro').hidden = true; $('app').hidden = false; ir('inicio'); avisar('Sesión iniciada.'); });
  $('olvidoClavePetro').addEventListener('click', () => avisar('Ingrese su correo Gmail para recuperar la contraseña.'));
  $('filtroProyectoNc').addEventListener('change', () => { $('proyectoNcPetro').value = $('filtroProyectoNc').value; mostrarDetalleProyecto(); render(); });
  $('nuevaNcPetro').addEventListener('click', () => { const form = $('formNcPetro'); limpiarFicha(); form.hidden = false; form.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  ['cancelarNcPetro', 'cancelarNcPetroSuperior'].forEach(id => $(id).addEventListener('click', () => { $('formNcPetro').hidden = true; }));
  $('formNcPetro').addEventListener('submit', evento => {
    evento.preventDefault(); const form = evento.currentTarget;
    if (!validarFicha(form)) return;
    try {
      const registro = datosFormulario(); const datos = leer(); const indice = datos.findIndex(nc => nc.id === registro.id);
      if (indice >= 0) datos[indice] = registro; else datos.unshift(registro);
      guardar(datos); render(); $('formNcPetro').hidden = true; avisar(indice >= 0 ? 'Ficha NC actualizada.' : 'No Conformidad registrada.');
    } catch (error) {
      console.error(error); avisar('No se pudo guardar la NC. Intente nuevamente.');
    }
  });
  $('formPerfilPetro').addEventListener('submit', evento => { evento.preventDefault(); avisar('Datos del perfil guardados.'); });
  $('cerrarSesionPetro').addEventListener('click', () => { $('app').hidden = true; $('pantallaLoginPetro').hidden = false; avisar('Sesión cerrada.'); });
  cargarProyectos(); limpiarFicha(); render();
})();
