(function () {
  const $ = id => document.getElementById(id);
  // La ficha de proyecto vive como una vista del módulo; los diálogos quedan
  // reservados para flujos puntuales (planificación, cronograma y mapas).
  const vistaCrearProyecto = $('crear-proyectos');
  const vistaPlanificacionTecnica = $('planificacion-tecnica');
  const vistaCronogramaProyecto = $('cronograma-proyecto');
  const vistaDashboardMasificacion = $('dashboard');
  const vistaBandejaMasificacion = $('bandeja-entrada');
  const vistaPlaneamientoMasificacion = $('planeamiento');
  const actualizarCabeceraSatcontrol = etiqueta => {
    const titulo=document.querySelector('.cabecera-satcontrol-identidad strong');
    if(titulo)titulo.innerHTML=etiqueta;
  };
  document.querySelector('.contenido-principal')?.append(vistaCrearProyecto,vistaPlanificacionTecnica);
  vistaCrearProyecto.querySelector('.panel-formulario-proyecto')?.append(vistaCronogramaProyecto);
  const mostrarVistaCrearProyecto = () => {
    if(location.hash!=='#ficha-proyecto')vistaCrearProyecto.classList.remove('vista-ficha-directa');
    vistaCrearProyecto.hidden = false;
    vistaPlanificacionTecnica.hidden = true;
    vistaCronogramaProyecto.hidden = true;
    vistaDashboardMasificacion.hidden = true;
    vistaBandejaMasificacion.hidden = true;
    vistaPlaneamientoMasificacion.hidden = true;
    $('satcontrol').hidden = true;
    if(location.hash !== '#crear-proyectos') history.replaceState(null, '', '#crear-proyectos');
    document.querySelectorAll('.enlace-menu[data-etiqueta]').forEach(enlace =>
      enlace.classList.toggle('activo', enlace.getAttribute('href') === '#crear-proyectos'));
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const mostrarVistaPlanificacionTecnica = () => {
    vistaCrearProyecto.hidden = true;
    vistaPlanificacionTecnica.hidden = false;
    vistaCronogramaProyecto.hidden = true;
    vistaDashboardMasificacion.hidden = true;
    vistaBandejaMasificacion.hidden = true;
    vistaPlaneamientoMasificacion.hidden = true;
    $('satcontrol').hidden = true;
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const mostrarVistaCronogramaProyecto = () => {
    mostrarVistaCrearProyecto();
    mostrarPasoAsistenteProyecto(5);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const mostrarVistaDashboardMasificacion = () => {
    vistaCrearProyecto.hidden = true;
    vistaPlanificacionTecnica.hidden = true;
    vistaCronogramaProyecto.hidden = true;
    $('satcontrol').hidden = true;
    vistaDashboardMasificacion.hidden = false;
    vistaBandejaMasificacion.hidden = true;
    vistaPlaneamientoMasificacion.hidden = true;
    if(location.hash !== '#dashboard')history.replaceState(null,'','#dashboard');
    document.querySelectorAll('.enlace-menu[data-etiqueta]').forEach(enlace=>enlace.classList.toggle('activo',enlace.getAttribute('href')==='#dashboard'));
    renderDashboardMasificacion();
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const mostrarVistaBandejaMasificacion = () => {
    vistaCrearProyecto.hidden = true;
    vistaPlanificacionTecnica.hidden = true;
    vistaCronogramaProyecto.hidden = true;
    vistaDashboardMasificacion.hidden = true;
    $('satcontrol').hidden = true;
    vistaBandejaMasificacion.hidden = false;
    vistaPlaneamientoMasificacion.hidden = true;
    if(location.hash !== '#bandeja-entrada')history.replaceState(null,'','#bandeja-entrada');
    document.querySelectorAll('.enlace-menu[data-etiqueta]').forEach(enlace=>enlace.classList.toggle('activo',enlace.getAttribute('href')==='#bandeja-entrada'));
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const mostrarVistaSatcontrol = () => {
    vistaCrearProyecto.hidden = true;
    vistaPlanificacionTecnica.hidden = true;
    vistaCronogramaProyecto.hidden = true;
    vistaDashboardMasificacion.hidden = true;
    vistaBandejaMasificacion.hidden = true;
    vistaPlaneamientoMasificacion.hidden = true;
    $('satcontrol').hidden = false;
    actualizarCabeceraSatcontrol('MASIFICACIÓN');
    if(location.hash !== '#satcontrol')history.replaceState(null,'','#satcontrol');
    document.querySelectorAll('.enlace-menu[data-etiqueta]').forEach(enlace=>enlace.classList.toggle('activo',enlace.getAttribute('href')==='#satcontrol'));
    setTimeout(()=>mapa?.invalidateSize(),0);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const requisitosPlaneamiento=[['Saneamiento físico legal',82],['Acceso terrestre disponible',96],['Área mínima 3,500 m²',74],['Geometría regular / frente suficiente',88],['Pendiente y compactación adecuada',68],['Estudio geotécnico / suelos',52],['Sin afectación por fajas o canales',91],['Disponibilidad de servicios básicos',79],['Ubicación adecuada respecto a centros urbanos',85],['Zonificación / habilitación urbana compatible',71],['Partida registral del titular público',63]];
  const romanosPlaneamiento=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  const renderizarMatrizPap=()=>{
    const cabecera=$('cabeceraMatrizPap'),cuerpo=$('cuerpoMatrizPap');
    if(!cabecera||!cuerpo)return;
    cabecera.innerHTML=`<tr><th>N.°</th><th>Departamento</th><th>Provincia</th><th>Distrito / localidad</th>${romanosPlaneamiento.map(numero=>`<th>${numero}</th>`).join('')}<th>% avance</th><th>TUPA prov.</th><th>TUPA dist.</th><th>Escombrera</th><th>DIA</th><th>CIRA</th></tr>`;
    cuerpo.innerHTML=ciudades.map((proyecto,indice)=>{
      const variacion=(indice%4)*3;
      const valores=requisitosPlaneamiento.map(([,valor],numero)=>Math.max(35,Math.min(100,valor-variacion-((numero+indice)%3)*4)));
      const avance=Math.round(valores.filter(valor=>valor>=75).length/valores.length*100);
      const celdas=valores.map(valor=>{const clase=valor>=75?'cumple':'pendiente';return `<td class="estado ${clase}" title="${valor}%" aria-label="${valor>=75?'Cumple requisito':'No cumple requisito'}"></td>`;}).join('');
      return `<tr><td>${indice+1}</td><td>${proyecto.departamento||'—'}</td><td>${proyecto.provincia||'—'}</td><td><strong>${proyecto.distrito||'—'}</strong><small>${proyecto.nombre||''}</small></td>${celdas}<td class="avance-matriz ${avance>=70?'revision':'pendiente'}">${avance>=40?`${avance}%`:'NO APTO'}</td><td class="estado pendiente">–</td><td class="estado pendiente">–</td><td class="estado pendiente">–</td><td class="estudio-matriz">No realizado</td><td class="estudio-matriz">No realizado</td></tr>`;
    }).join('');
  };
  let mapaPlaneamiento=null,capaPlaneamientoDistritos=null,capaPlaneamientoCumplidores=null,mapaFichaPredio=null,marcadorFichaPredio=null,modoProgramarPlaneamiento=false;
  const limpiarCumplidoresPlaneamiento=()=>{
    capaPlaneamientoCumplidores?.clearLayers();
    $('elementosCumplenPlaneamiento').hidden=true;
  };
  const restablecerPlaneamiento=()=>{
    const departamento=$('departamentoPlaneamiento'),provincia=$('provinciaPlaneamiento'),distrito=$('distritoPlaneamiento');
    departamento.value='';provincia.value='';distrito.value='';
    modoProgramarPlaneamiento=false;
    $('programarPlaneamiento').classList.remove('activo');
    $('programarPlaneamiento').textContent='＋ Programar nueva';
    vistaPlaneamientoMasificacion.querySelector('.cabecera-planeamiento').hidden=false;
    vistaPlaneamientoMasificacion.querySelector('.planeamiento-contenido').hidden=false;
    $('fichaPredioPlaneamiento').hidden=true;
    actualizarFiltrosPlaneamiento();
    limpiarCumplidoresPlaneamiento();
    mapaPlaneamiento?.setView([-9.19,-75.02],5);
    setTimeout(()=>mapaPlaneamiento?.invalidateSize(),80);
  };
  const mostrarCumplidoresPlaneamiento=(requisito,valor,proyectos,numero)=>{
    const cumplidores=proyectos.map((proyecto,indice)=>({proyecto,puntaje:Math.max(0,Math.min(100,valor-((indice*11+numero*3)%33)))})).filter(item=>item.puntaje>=70);
    $('elementosCumplenPlaneamiento').hidden=false;
    $('tituloCumplidoresPlaneamiento').textContent=`${requisito} · ${valor}%`;
    $('listaCumplidoresPlaneamiento').innerHTML=cumplidores.length?cumplidores.map(item=>`<tr><td><strong>${item.proyecto.codigo}</strong><small>${item.proyecto.nombre}</small></td><td>${item.proyecto.distrito}</td><td><b>${item.puntaje}%</b></td></tr>`).join(''):'<tr class="sin-cumplidores-planeamiento"><td colspan="3">No se identificaron elementos que cumplan este requisito en el filtro actual.</td></tr>';
    capaPlaneamientoCumplidores?.clearLayers();
    const ubicaciones=[];
    cumplidores.filter(item=>item.proyecto.lat&&item.proyecto.lng).forEach(item=>{
      const ubicacion=[item.proyecto.lat,item.proyecto.lng];ubicaciones.push(ubicacion);
      L.circleMarker(ubicacion,{radius:11,color:'#eafff2',weight:3,fillColor:'#2ec47d',fillOpacity:.96}).bindPopup(`<strong>${item.proyecto.nombre}</strong><br>${requisito}: ${item.puntaje}%`).addTo(capaPlaneamientoCumplidores);
    });
    if(ubicaciones.length===1)mapaPlaneamiento?.setView(ubicaciones[0],12);
    else if(ubicaciones.length>1)mapaPlaneamiento?.fitBounds(ubicaciones,{padding:[45,45],maxZoom:11});
  };
  const actualizarFichaVisualPredio=proyecto=>{
    const ficha=$('fichaPredioPlaneamiento');
    let mapaFicha=ficha.querySelector('.ficha-mapa-predio'),kpis=ficha.querySelector('.ficha-kpis-predio');
    if(!mapaFicha){
      mapaFicha=document.createElement('section');mapaFicha.className='ficha-mapa-predio';mapaFicha.innerHTML='<header><span>UBICACIÓN DEL PREDIO</span><b>Mapa</b></header><div id="mapaFichaPredio" aria-label="Ubicación del predio seleccionado"></div>';
      ficha.querySelector('header').insertAdjacentElement('afterend',mapaFicha);
      kpis=document.createElement('section');kpis.className='ficha-kpis-predio';kpis.innerHTML='<article><i class="icono-kpi requisitos" aria-hidden="true">▣</i><strong id="totalRequisitosFicha">11</strong><span>requisitos técnicos</span></article><article class="cumple"><i class="icono-kpi cumple" aria-hidden="true">✓</i><strong id="cumplidosFicha">0</strong><span>cumplidos</span></article><article class="pendiente"><i class="icono-kpi pendiente" aria-hidden="true">◷</i><strong id="pendientesFicha">0</strong><span>pendientes</span></article><article><i class="icono-kpi documento" aria-hidden="true">▤</i><strong>DIA</strong><span>No realizado</span></article><article><i class="icono-kpi documento" aria-hidden="true">▤</i><strong>CIRA</strong><span>No realizado</span></article>';
      ficha.querySelector('.ficha-predio-cabecera').insertAdjacentElement('afterend',kpis);
    }
    const porcentajes=[...$('listaRequisitosPlaneamiento').querySelectorAll('.dona-requisito-planeamiento b')].map(item=>Number(item.textContent.replace('%',''))),cumplidos=porcentajes.filter(valor=>valor>=75).length;
    $('totalRequisitosFicha').textContent=porcentajes.length||11;$('cumplidosFicha').textContent=cumplidos;$('pendientesFicha').textContent=Math.max(0,porcentajes.length-cumplidos);
    const pendientes=Math.max(0,porcentajes.length-cumplidos),cumplimiento=Math.round((cumplidos/Math.max(1,porcentajes.length))*100),graficos=$('donaFichaPredio').closest('.ficha-graficos-predio');
    graficos.innerHTML=`<h3>5. Gráficos y visualizaciones</h3><div class="tres-graficos-ficha"><article class="grafico-dona-ficha"><h4>Cumplimiento de requisitos</h4><div class="dona-ficha-predio" style="--cumplimiento:${cumplimiento}%"><b>${cumplimiento}%</b></div><div><span class="leyenda-cumple">● Cumple <b>${cumplidos}</b></span><span class="leyenda-pendiente">● Pendiente <b>${pendientes}</b></span></div></article><article class="grafico-barras-ficha"><h4>Estado de requisitos</h4><div class="eje-barras-ficha"><span>0</span><span>4</span><span>8</span></div><div class="barras-ficha"><div><i style="height:${Math.max(12,cumplidos/Math.max(1,porcentajes.length)*100)}%"></i><b>${cumplidos}</b><span>Cumple</span></div><div><i style="height:${Math.max(12,pendientes/Math.max(1,porcentajes.length)*100)}%"></i><b>${pendientes}</b><span>Pendiente</span></div></div></article><article class="grafico-linea-ficha"><h4>Avance del proceso</h4><div class="pasos-proceso-ficha"><span class="completo">✓<b>Identificación</b></span><span class="activo">2<b>Evaluación técnica</b></span><span>3<b>Trámites</b></span><span>4<b>Estudios FISE</b></span><span>5<b>Aprobación final</b></span></div></article></div>`;
    const romanos=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
    $('requisitosFichaPredio').querySelectorAll('article').forEach((fila,indice)=>{
      if(fila.querySelector('.numero-romano-requisito'))return;
      const numero=document.createElement('i');numero.className='numero-romano-requisito';numero.textContent=romanos[indice]||String(indice+1);
      fila.prepend(numero);
    });
    setTimeout(()=>{
      const lat=Number(proyecto?.lat)||-9.19,lng=Number(proyecto?.lng)||-75.02,zoom=proyecto?.lat&&proyecto?.lng?13:5;
      if(!mapaFichaPredio){mapaFichaPredio=L.map('mapaFichaPredio',{zoomControl:true}).setView([lat,lng],zoom);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapaFichaPredio);}
      mapaFichaPredio.invalidateSize();mapaFichaPredio.setView([lat,lng],zoom);
      if(marcadorFichaPredio)marcadorFichaPredio.remove();
      marcadorFichaPredio=L.marker([lat,lng]).addTo(mapaFichaPredio).bindPopup(`<strong>${proyecto?.nombre||'Predio seleccionado'}</strong><br>${proyecto?.distrito||'Ubicación pendiente'}`).openPopup();
    },80);
  };
  const renderPlaneamientoDistrito=()=>{
    const selector=$('distritoPlaneamiento'),distrito=selector.value,esResumenGeneral=!distrito,indice=Math.max(0,[...selector.options].findIndex(opcion=>opcion.value===distrito)-1),variacion=indice%4*3,datos=esResumenGeneral?ciudades:ciudades.filter(proyecto=>proyecto.distrito===distrito),kilometros=datos.reduce((total,proyecto)=>total+(Number(proyecto.longitud)||0),0);
    const listaRequisitos=$('listaRequisitosPlaneamiento'),panelCumplidores=$('elementosCumplenPlaneamiento');
    if(panelCumplidores.parentElement===listaRequisitos)listaRequisitos.after(panelCumplidores);
    $('resumenDistritoPlaneamiento').innerHTML=esResumenGeneral?`<small>INFORMACIÓN GENERAL</small><strong>Todos los distritos</strong><span>${datos.length} proyecto(s) identificado(s) · ${kilometros.toFixed(1)} km de red referencial.</span>`:`<small>INFORMACIÓN DEL DISTRITO</small><strong>${distrito}</strong><span>${datos.length||1} proyecto(s) identificado(s) · ${kilometros.toFixed(1)} km de red referencial.</span>`;
    const requisitos=requisitosPlaneamiento.map(([nombre,valor])=>[nombre,esResumenGeneral?valor:Math.max(35,Math.min(100,valor-variacion))]);
    listaRequisitos.innerHTML=requisitos.map(([nombre,valor],numero)=>`<article class="requisito-planeamiento-accion" role="button" tabindex="0" aria-label="Ver elementos que cumplen ${nombre}: ${valor}%"><span>${String(numero+1).padStart(2,'0')}</span><strong>${nombre}</strong><i class="dona-requisito-planeamiento" style="--avance-requisito:${valor}%"><b>${valor}%</b></i></article>`).join('');
    listaRequisitos.querySelectorAll('.requisito-planeamiento-accion').forEach((fila,numero)=>{const abrir=()=>{mostrarCumplidoresPlaneamiento(requisitos[numero][0],requisitos[numero][1],datos,numero);fila.insertAdjacentElement('afterend',panelCumplidores);};fila.addEventListener('click',abrir);fila.addEventListener('keydown',evento=>{if(evento.key==='Enter'||evento.key===' '){evento.preventDefault();abrir();}});});
    const promedio=Math.round(requisitos.reduce((total,item)=>total+item[1],0)/requisitos.length);
    $('avanceGeneralPlaneamiento').textContent=`${promedio}%`;
    $('abrirFichaPredioPlaneamiento').disabled=!distrito;
    $('abrirFichaPredioPlaneamiento').hidden=!distrito;
    $('abrirFichaPredioPlaneamiento').dataset.distrito=distrito;
    if(distrito){const proyecto=datos[0];if(proyecto?.lat&&proyecto?.lng)mapaPlaneamiento?.setView([proyecto.lat,proyecto.lng],10);}
  };
  const iniciarPlaneamiento=()=>{const selector=$('distritoPlaneamiento');const distritos=[...new Set(ciudades.map(proyecto=>proyecto.distrito).filter(Boolean))].sort();selector.replaceChildren(new Option('Seleccione un distrito',''),...distritos.map(distrito=>new Option(distrito,distrito)));if(!mapaPlaneamiento){mapaPlaneamiento=L.map('mapaPlaneamiento',{zoomControl:true}).setView([-9.19,-75.02],5);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapaPlaneamiento);capaPlaneamientoDistritos=L.layerGroup().addTo(mapaPlaneamiento);capaPlaneamientoCumplidores=L.layerGroup().addTo(mapaPlaneamiento);ciudades.filter(proyecto=>proyecto.lat&&proyecto.lng).forEach(proyecto=>L.circleMarker([proyecto.lat,proyecto.lng],{radius:8,color:'#75d0e8',weight:2,fillColor:'#2869a5',fillOpacity:.9}).bindTooltip(proyecto.distrito||proyecto.nombre).on('click',()=>{selector.value=proyecto.distrito||'';renderPlaneamientoDistrito();}).addTo(capaPlaneamientoDistritos));selector.addEventListener('change',renderPlaneamientoDistrito);$('limpiarCumplidoresPlaneamiento').addEventListener('click',limpiarCumplidoresPlaneamiento);$('abrirFichaPredioPlaneamiento').addEventListener('click',()=>{const distrito=selector.value,requisitos=[...$('listaRequisitosPlaneamiento').querySelectorAll('.dona-requisito-planeamiento b')].map(item=>Number(item.textContent.replace('%',''))),promedio=Math.round(requisitos.reduce((a,b)=>a+b,0)/requisitos.length);$('tituloFichaPredio').textContent=`Predio candidato · ${distrito}`;$('subtituloFichaPredio').textContent=`Distrito ${distrito} · evaluación preliminar territorial`;$('datosFichaPredio').innerHTML=`<span>Código<strong>PLN-${distrito.slice(0,3).toUpperCase()}-001</strong></span><span>Distrito<strong>${distrito}</strong></span><span>Responsable<strong>FISE / SATCONTROL</strong></span><span>Fecha de corte<strong>${new Date().toLocaleDateString('es-PE')}</strong></span>`;$('requisitosFichaPredio').innerHTML=requisitosPlaneamiento.map(([nombre],i)=>`<article><span>${nombre}</span><b class="${requisitos[i]>=75?'cumple':'pendiente'}">${requisitos[i]>=75?'Cumple':'Pendiente'}</b></article>`).join('');$('cumplimientoFichaPredio').textContent=`${promedio}%`;$('donaFichaPredio').style.setProperty('--cumplimiento',`${promedio}%`);$('donaFichaPredio').querySelector('b').textContent=`${promedio}%`;vistaPlaneamientoMasificacion.querySelector('.planeamiento-contenido').hidden=true;$('fichaPredioPlaneamiento').hidden=false;});$('volverPlaneamiento').addEventListener('click',()=>{vistaPlaneamientoMasificacion.querySelector('.planeamiento-contenido').hidden=false;$('fichaPredioPlaneamiento').hidden=true;setTimeout(()=>mapaPlaneamiento.invalidateSize(),80);});$('programarPlaneamiento').addEventListener('click',()=>{modoProgramarPlaneamiento=!modoProgramarPlaneamiento;$('programarPlaneamiento').classList.toggle('activo',modoProgramarPlaneamiento);$('programarPlaneamiento').textContent=modoProgramarPlaneamiento?'✓ Seleccione un punto en el mapa':'＋ Programar nueva';});}renderPlaneamientoDistrito();setTimeout(()=>mapaPlaneamiento.invalidateSize(),80);};
  const actualizarFiltrosPlaneamiento=()=>{
    const departamento=$('departamentoPlaneamiento'),provincia=$('provinciaPlaneamiento'),distrito=$('distritoPlaneamiento');
    const provincias=[...new Set(ciudades.filter(item=>!departamento.value||item.departamento===departamento.value).map(item=>item.provincia).filter(Boolean))].sort();
    if(!provincias.includes(provincia.value))provincia.value='';
    provincia.replaceChildren(new Option('Todas las provincias',''),...provincias.map(item=>new Option(item,item)));
    const distritos=[...new Set(ciudades.filter(item=>(!departamento.value||item.departamento===departamento.value)&&(!provincia.value||item.provincia===provincia.value)).map(item=>item.distrito).filter(Boolean))].sort();
    if(!distritos.includes(distrito.value))distrito.value='';
    distrito.replaceChildren(new Option('Todos los distritos',''),...distritos.map(item=>new Option(item,item)));
    renderPlaneamientoDistrito();
  };
  const inicializarFiltrosPlaneamiento=()=>{
    const departamento=$('departamentoPlaneamiento'),provincia=$('provinciaPlaneamiento'),distrito=$('distritoPlaneamiento');
    if(departamento.dataset.inicializado)return actualizarFiltrosPlaneamiento();
    const departamentos=[...new Set(ciudades.map(item=>item.departamento).filter(Boolean))].sort();
    departamento.replaceChildren(new Option('Todos los departamentos',''),...departamentos.map(item=>new Option(item,item)));
    departamento.dataset.inicializado='true';
    departamento.addEventListener('change',()=>{provincia.value='';distrito.value='';actualizarFiltrosPlaneamiento();});
    provincia.addEventListener('change',()=>{distrito.value='';actualizarFiltrosPlaneamiento();});
    distrito.addEventListener('change',renderPlaneamientoDistrito);
    document.addEventListener('keydown',evento=>{
      if(evento.key!=='Escape'||vistaPlaneamientoMasificacion.hidden)return;
      evento.preventDefault();
      departamento.value='';provincia.value='';distrito.value='';
      vistaPlaneamientoMasificacion.querySelector('.cabecera-planeamiento').hidden=false;
      vistaPlaneamientoMasificacion.querySelector('.planeamiento-contenido').hidden=false;
      $('fichaPredioPlaneamiento').hidden=true;
      actualizarFiltrosPlaneamiento();
      limpiarCumplidoresPlaneamiento();
      mapaPlaneamiento?.setView([-9.19,-75.02],5);
      setTimeout(()=>mapaPlaneamiento?.invalidateSize(),80);
    });
    actualizarFiltrosPlaneamiento();
  };
  const mostrarVistaPlaneamiento=()=>{vistaCrearProyecto.hidden=true;vistaPlanificacionTecnica.hidden=true;vistaCronogramaProyecto.hidden=true;vistaDashboardMasificacion.hidden=true;vistaBandejaMasificacion.hidden=true;$('satcontrol').hidden=true;vistaPlaneamientoMasificacion.hidden=false;vistaPlaneamientoMasificacion.querySelector('.cabecera-planeamiento').hidden=false;vistaPlaneamientoMasificacion.querySelector('.planeamiento-contenido').hidden=false;$('fichaPredioPlaneamiento').hidden=true;actualizarCabeceraSatcontrol('MASIFICACIÓN <i>·</i> PLANEAMIENTO');if(location.hash!=='#planeamiento')history.replaceState(null,'','#planeamiento');document.querySelectorAll('.enlace-menu[data-etiqueta]').forEach(enlace=>enlace.classList.toggle('activo',enlace.getAttribute('href')==='#planeamiento'));iniciarPlaneamiento();inicializarFiltrosPlaneamiento();window.scrollTo({top:0,behavior:'smooth'});};
  $('abrirMatrizPap')?.addEventListener('click',()=>{renderizarMatrizPap();$('modalMatrizPap')?.showModal();});
  $('restablecerPlaneamiento')?.addEventListener('click',restablecerPlaneamiento);
  $('abrirFichaPredioPlaneamiento')?.addEventListener('click',()=>{
    if($('abrirFichaPredioPlaneamiento').disabled)return;
    vistaPlaneamientoMasificacion.querySelector('.cabecera-planeamiento').hidden=true;
    modoProgramarPlaneamiento=false;
    $('programarPlaneamiento').classList.remove('activo');
    $('programarPlaneamiento').textContent='＋ Programar nueva';
    setTimeout(()=>actualizarFichaVisualPredio(ciudades.find(proyecto=>proyecto.distrito===$('distritoPlaneamiento').value)||{}),0);
  });
  $('volverPlaneamiento')?.addEventListener('click',()=>vistaPlaneamientoMasificacion.querySelector('.cabecera-planeamiento').hidden=false);
  const cerrarVistaCrearProyecto = () => document.querySelector('.enlace-menu[href="#satcontrol"]')?.click();
  const botonResumenMasificacion = $('botonResumenMasificacion');
  const colores = { Proyectada: '#4e7de1', 'En ejecución': '#e5a510', Instalada: '#3fac79' };
  let datosDashboardNagasco={titulo:'Dashboard de proyectos de Masificación',periodo:'Cargando datos…',proyectos:[]};
  function renderDashboardMasificacion(){
    const referencias=new Map((datosDashboardNagasco.proyectos||[]).map(item=>[item.codigo,item])),cartera=Array.isArray(ciudades)&&ciudades.length?ciudades:[];
    const proyectos=cartera.map((item,indice)=>{const referencia=referencias.get(item.codigo)||{},avance=Math.max(0,Math.min(100,Number(item.avance)||0)),longitud=Math.max(0,Number(item.longitud)||0),parcial=Number(referencia.montoParcial)||Math.round((longitud*180000)+(indice+1)*95000),libros=Number(referencia.libros)||Math.max(1,Math.ceil(longitud/6)),finalRegistrado=Number(referencia.montoFinalRegistrado)||Math.round(parcial*(avance/100)*.25),librosFinal=Number(referencia.librosFinal)||Math.round(libros*(avance/100));return{proyecto:`${item.codigo} · ${item.nombre}`,libros,parcial,finalRegistrado,finalEsperado:parcial*.25,total:parcial*1.25,librosFinal};});
    const moneda=valor=>`US$ ${valor.toLocaleString('en-US',{maximumFractionDigits:0})}`,totalLibros=proyectos.reduce((suma,item)=>suma+item.libros,0),totalParcial=proyectos.reduce((suma,item)=>suma+item.parcial,0),totalFinal=proyectos.reduce((suma,item)=>suma+item.finalRegistrado,0),finalEsperado=proyectos.reduce((suma,item)=>suma+item.finalEsperado,0),librosFinal=proyectos.reduce((suma,item)=>suma+item.librosFinal,0),librosPendientes=totalLibros-librosFinal,pendiente=Math.max(0,finalEsperado-totalFinal),porcentajeFinal=totalLibros?Math.round(librosFinal/totalLibros*1000)/10:0;
    $('dashboardTotalProyectos').textContent=totalLibros;$('dashboardRedInstalada').textContent=proyectos.length;$('dashboardEnEjecucion').textContent=moneda(totalParcial);$('dashboardAvancePromedio').textContent=moneda(totalFinal);$('donaTotalDashboard').textContent=totalLibros;
    const destacados=[...proyectos].sort((a,b)=>b.total-a.total).slice(0,5),maximoTotal=Math.max(1,...destacados.map(item=>item.total));
    $('barrasAvanceDashboard').innerHTML=destacados.map(item=>`<article><div><strong>${item.proyecto}</strong><span>${moneda(item.total)}</span></div><i><b style="width:${item.total/maximoTotal*100}%"></b></i></article>`).join('');
    const gradiente=`#53b782 0deg ${Math.round(librosFinal/totalLibros*360)}deg, #d78767 ${Math.round(librosFinal/totalLibros*360)}deg 360deg`;$('donaEstadosDashboard').style.background=`conic-gradient(${gradiente})`;
    $('leyendaEstadosDashboard').innerHTML=`<li><i style="background:#53b782"></i><span>Final registrado</span><strong>${librosFinal}</strong></li><li><i style="background:#d78767"></i><span>Final pendiente</span><strong>${librosPendientes}</strong></li><li><i style="background:#5e87cb"></i><span>% liquidación final</span><strong>${porcentajeFinal}%</strong></li>`;
    const comparativo=[...proyectos].sort((a,b)=>b.parcial-a.parcial).slice(0,5),maximoParcial=Math.max(1,...comparativo.map(item=>item.parcial));
    $('barrasRedDashboard').innerHTML=comparativo.map(item=>`<article><div><strong>${item.proyecto}</strong><span>${moneda(item.parcial)} / ${moneda(item.finalRegistrado)}</span></div><i class="doble"><b class="parcial" style="width:${item.parcial/maximoParcial*100}%"></b><b class="final" style="width:${item.finalRegistrado/maximoParcial*100}%"></b></i></article>`).join('');
    $('dashboardVisitasPendientes').textContent=`${moneda(pendiente)} pendientes de liquidación final.`;$('dashboardAvancePendiente').textContent=`${porcentajeFinal}% de libros con final registrado.`;$('dashboardLibrosPendientes').textContent=`${librosPendientes} libros permanecen pendientes de liquidación final.`;
    $('tituloDashboardMasificacion').textContent=datosDashboardNagasco.titulo||'Dashboard de proyectos de Masificación';
    $('periodoDashboard').textContent=datosDashboardNagasco.periodo||'Datos demostrativos';
  }
  const fasesMapa = {
    Anteproyecto: {abreviatura:'ANT', color:'#657fe0'},
    Proyecto: {abreviatura:'PRO', color:'#3f8fc4'},
    Construcción: {abreviatura:'CON', color:'#d89222'},
    Operación: {abreviatura:'OPE', color:'#35a06f'}
  };
  const iconoProyecto = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20V5h9M6 8h13M15 5l4 3-4 3M11 8v5"/><path d="M8.5 13h5v5h-5z"/></svg>';
  const ciudadesBase = [
    ['FISE-2026-001','PROYECTO SAUNA 1','Arequipa','Arequipa','Cerro Colorado',-16.37,-71.56,'En evaluación',0,0],
    ['MAS-002','Red Metropolitana Sur','Lima','Lima','Villa El Salvador',-12.21,-76.94,'En ejecución',61,24.8],
    ['MAS-003','Corredor Gas Arequipa','Arequipa','Arequipa','Cerro Colorado',-16.37,-71.56,'Instalada',77,15.2],
    ['MAS-004','Expansión Trujillo','La Libertad','Trujillo','Trujillo',-8.11,-79.03,'Proyectada',32,29.6],
    ['MAS-005','Red Urbana Chiclayo','Lambayeque','Chiclayo','José Leonardo Ortiz',-6.76,-79.84,'En ejecución',58,21.1],
    ['MAS-006','Conexión Cusco','Cusco','Cusco','San Sebastián',-13.53,-71.89,'Proyectada',27,17.8],
    ['MAS-007','Anillo Piura','Piura','Piura','Castilla',-5.19,-80.63,'Instalada',91,13.7],
    ['MAS-008','Expansión Ica','Ica','Ica','Subtanjalla',-14.02,-75.76,'En ejecución',69,16.3],
    ['MAS-009','Red Huancayo','Junín','Huancayo','El Tambo',-12.04,-75.22,'Proyectada',38,19.5],
    ['MAS-010','Conexión Chimbote','Áncash','Santa','Nuevo Chimbote',-9.12,-78.52,'Instalada',88,14.9]
  ].map((p,i)=>({codigo:p[0],nombre:p[1],departamento:p[2],provincia:p[3],distrito:p[4],lat:p[5],lng:p[6],estado:p[7],avance:p[8],longitud:p[9],responsableLider:p[0]==='FISE-2026-001'?'Oliver Gonzales':'-- Seleccione --',empresaContratista:'',elementos:`Válvulas ${8+i} · Tuberías PE ${12+i} · Estaciones ${1+i%3}`}));
  const clavePasosSatcontrol='masificacion.pasos-satcontrol';
  const claveProyectosSatcontrol='masificacion.proyectos-guardados';
  const leerPasosSatcontrol=()=>{try{return JSON.parse(localStorage.getItem(clavePasosSatcontrol)||'{}')}catch{return {}}};
  const leerProyectosSatcontrol=()=>{try{return JSON.parse(localStorage.getItem(claveProyectosSatcontrol)||'[]')}catch{return []}};
  const aplicarPasosSatcontrol=proyectos=>{
    const guardados=leerPasosSatcontrol();
    return proyectos.map(proyecto=>{
      const pasos=guardados[proyecto.codigo];
      return pasos?{...proyecto,pasosSatcontrol:pasos}:proyecto;
    });
  };
  const guardarPasosSatcontrol=proyecto=>{
    const guardados=leerPasosSatcontrol();
    guardados[proyecto.codigo]=proyecto.pasosSatcontrol||{};
    localStorage.setItem(clavePasosSatcontrol,JSON.stringify(guardados));
  };
  const restaurarProyectosSatcontrol=proyectos=>{
    const porCodigo=new Map(proyectos.map(proyecto=>[proyecto.codigo,proyecto]));
    leerProyectosSatcontrol().forEach(proyecto=>porCodigo.set(proyecto.codigo,proyecto));
    return aplicarPasosSatcontrol([...porCodigo.values()].map(prepararVersionesProyecto));
  };
  const guardarProyectoSatcontrol=proyecto=>{
    const proyectos=leerProyectosSatcontrol().filter(item=>item.codigo!==proyecto.codigo);
    proyectos.unshift(proyecto);
    localStorage.setItem(claveProyectosSatcontrol,JSON.stringify(proyectos));
  };
  let ciudades = restaurarProyectosSatcontrol(ciudadesBase.map(prepararVersionesProyecto));
  const proyectoReferenciaFicha=()=>prepararVersionesProyecto({codigo:'FISE-2026-CUS-001',nombre:'Proyecto Especial de Masificación · Cusco',departamento:'Cusco',provincia:'Cusco',distrito:'San Jerónimo',lat:-13.532,lng:-71.947,estado:'En evaluación',avance:0,longitud:25,responsableLider:'Oliver Gonzales',empresaContratista:'PA-FARMIN / NAGASCO',elementos:'Válvulas 8 · Tuberías PE 12 · Estaciones 1'});
  const estadosVisibles = new Set(Object.keys(colores));
  let mapa, capaBase, capaProyectos, capaGis, capaManzanas, capaPredios, capaInfluencia, proyectoSeleccionado=null, datosGeo=[], manzanasUrbanas=[], estratosInei=[], filtroEstratoActivo='todos';
  let mapaUbicacionProyecto=null,mapaResumenProyecto=null,capaPoligonoUbicacion=null,capaTerritorialUbicacion=null,puntosPoligonoUbicacion=[],circuloDibujoUbicacion=null,modoDibujoAreaProyecto='poligono',herramientaDibujoAreaActiva=false,origenMapaCrearProyecto=false,nivelMapaProyecto='pais',departamentoMapaProyecto=null,provinciaMapaProyecto=null,distritoMapaProyecto=null,terrenoActivoProyecto='A';
  const geoUbicacionCache={};
  let herramientaActiva=null,capaDibujo,puntosDibujo=[],centroCirculo=null,figuraTemporal=null,dibujoProyectoPendiente=null,geometriaProyectoBorrador=null;
  let seleccionMapa=[],beneficiarioSeleccionadoMasificacion=null,datosExportacionActual=[],registrosProyectoPosicionados=[];
  let proyectoEdicionSeleccionado=null, proyectoPendienteEliminar=null, liquidacionProyectoVinculado=null, filaLiquidacionResumenPendiente=null;
  let cronogramaBorrador=[];
  let pasoAsistenteProyecto=1;
  let planificacionBorrador=null;
  const requisitosTerrenoBase=[['Área del terreno','≥ 3,500 m²'],['Geometría del terreno','Preferentemente rectangular, aprox. 60 m × 60 m'],['Pendiente del terreno','≤ 5%'],['Disponibilidad de planos','Ubicación, área, perímetro y accesos'],['Partida registral','Titular público y vigencia preferente de 3 meses'],['Zonificación o tipo de uso','Compatible con una planta PSR-GNL'],['Estudio de mecánica de suelos','Napa freática, relleno y conformidad de uso'],['Interferencias en superficie','Sin edificaciones, árboles o cables incompatibles'],['Interferencias subterráneas','Sin cauces, canales, acequias u otras interferencias'],['Vía de acceso para GNL','Ancho mínimo de 4 a 6 m y giro para cisterna'],['Suministro eléctrico','Factibilidad entre 12 kW y 45 kW'],['Distancia a residencias','Máximo 5 km del centro de consumo'],['Puntos de reunión cercanos','Alejado de iglesias, estadios y concurrencia masiva']];
  const formulariosFisePorComponente={
    psr:{nombre:'PSR-GNL / Planta de regasificación',formularios:[
      ['F01 · Parámetros de la PSR-GNL','Registre únicamente los datos técnicos y contractuales de la planta.',[['Alcance de la planta',[['Cantidad de PSR-GNL','number',true],['Capacidad / especificación','text',true],['Monto contractual','currency',true]]],['Responsables del componente',[['Contratista','text'],['Interventor','text'],['Responsable FISE','text',true]]]]],
      ['F02 · Viabilidad de terreno PSR','Verifique predio, acceso, entorno y evidencias técnicas.',[['Predio',[['Área útil (m²)','number',true],['Partida registral','text'],['Zonificación compatible','select:Sí|No|Pendiente',true]]],['Acceso y entorno',[['Vía de acceso para cisterna','select:Cumple|No cumple|Pendiente',true],['Interferencias identificadas','textarea'],['Distancia al centro de consumo','text']]],['Evidencias',[['Plano o croquis','file'],['Informe de visita','file']]]]],
      ['F03 · Parámetros contractuales PSR','Defina hitos, entregables y flujo de aprobación.',[['Hitos de pago',[['Hito contractual','text',true],['Porcentaje del hito','number',true],['Fecha programada','date']]],['Workflow',[['Revisor FISE','text',true],['Estado de revisión','select:Borrador|En revisión|Aprobado|Observado',true],['Observaciones','textarea']]]]],
      ['F04 · Revisión / aprobación de hito PSR','Documente la revisión técnica y contractual del hito.',[['Revisión',[['Hito evaluado','text',true],['Resultado','select:Aprobado|Observado|Rechazado',true],['Informe técnico','file']]],['Aprobación',[['Aprobador FISE','text',true],['Fecha de decisión','date'],['Comentarios','textarea']]]]],
      ['F05 · Liquidación PSR-GNL','Consolide metrado, conformidad y liquidación del componente.',[['Liquidación',[['Monto liquidado','currency',true],['Conformidad técnica','select:Sí|No|Pendiente',true],['Acta de conformidad','file']]],['Cierre',[['Responsable FISE','text',true],['Observaciones de cierre','textarea']]]]],
      ['F06 · Resolución y pago PSR','Prepare la resolución y el expediente de pago.',[['Resolución y pago',[['Número de resolución','text'],['Monto aprobado','currency',true],['Fecha de pago','date'],['Expediente de pago','file']]]]]
    ]},
    redes:{nombre:'Redes de distribución',formularios:[
      ['F01 · Ingeniería de Redes','Registre los entregables de ingeniería. La ubicación, alcance y datos del proyecto ya se tomaron en el paso inicial.',[['Control de ingeniería',[['Código o versión de ingeniería','text',true],['Estado de ingeniería','select:Borrador|En revisión|Aprobada',true],['Responsable técnico FISE','text',true]]],['Entregables',[['Plano de redes','file',true],['Memoria descriptiva','file'],['Especificaciones técnicas','file'],['Metrados de diseño','file']]]]],
      ['F02 · Catálogo de precios y reglas Redes','Registre las partidas del baremo aplicable, su precio unitario y vigencia.',[['Precios',[['Código de partida','text',true],['Partida o actividad','text',true],['Unidad de medida','text',true],['Precio unitario','currency',true]]],['Reglas',[['Vigencia desde','date',true],['Vigencia hasta','date'],['Aprobación FISE','select:Pendiente|Aprobado|Observado',true]]]]],
      ['F03 · Liquidación de Redes','Registre cada liquidación parcial o final con sus metrados, valorización y deducciones.',[['Cabecera de liquidación',[['Número de liquidación','text',true],['Tipo','select:Parcial|Final',true],['Fecha de liquidación','date',true],['Acta de conformidad','file']]],['Validación FISE',[['Responsable FISE','text',true],['Estado de revisión','select:Borrador|En revisión|Conforme|Observado',true],['Informe técnico','file']]]]],
      ['F04 · Resolución / pago Redes','Vincule cada resolución y desembolso con la liquidación aprobada.',[['Control FISE',[['Responsable FISE','text',true]]]]]
    ]},
    tc:{nombre:'Tuberías de conexión',formularios:[
      ['F01 · Lote maestro de TCs','Registre solo el lote y el padrón de conexiones del componente.',[['Lote',[['Código de lote','text',true],['Cantidad de TCs','number',true]]],['Padrón',[['Padrón de beneficiarios','file',true],['Responsable FISE','text',true],['Estado del padrón','select:Borrador|Validado|Observado',true]]]]],
      ['F02 · Reglas de habilitación TC','Defina requisitos para habilitar cada conexión.',[['Habilitación',[['Regla de habilitación','textarea',true],['Documento de sustento','file'],['Estado de validación','select:Pendiente|Aprobado|Observado',true]]],['Responsables',[['Revisor FISE','text',true],['Fecha de validación','date']]]]],
      ['F03 · Liquidación de TCs','Consolide las conexiones habilitadas y la liquidación.',[['Liquidación',[['TCs habilitadas','number',true],['Monto liquidado','currency',true],['Acta de conformidad','file']]],['Cierre',[['Conformidad técnica','select:Sí|No|Pendiente',true],['Observaciones','textarea'],['Responsable FISE','text',true]]]]]
    ]}
  };
  let formularioFiseActivo=0;
  const componentesProyectoCompletados=new Set();
  let calendarioCronograma={dias:new Set([1,2,3,4,5]),horarios:{1:['08:00','13:00','14:00','17:00'],2:['08:00','13:00','14:00','17:00'],3:['08:00','13:00','14:00','17:00'],4:['08:00','13:00','14:00','17:00'],5:['08:00','13:00','14:00','17:00'],6:['08:00','13:00','14:00','17:00'],0:['08:00','13:00','14:00','17:00']},feriados:[]};
  let versionCartograficaActiva='planificacion';
  let subproyectoSeleccionado='';
  const proyectosExpandidos=new Set();
  const beneficiariosEdicionPorProyecto=new Map();
  const capasContexto={};
  const bases = {};
  const mapasVersiones={planificacion:null,asbuilt:null};
  const capasMapasVersiones={planificacion:null,asbuilt:null};

  function prepararVersionesProyecto(proyecto) {
    if(proyecto.versiones)return proyecto;
    const datosBase={estado:proyecto.estado,avance:proyecto.avance,longitud:proyecto.longitud,elementos:proyecto.elementos};
    proyecto.versiones={
      planificacion:{...datosBase,estado:proyecto.codigo==='FISE-2026-001'?'En evaluación':'Proyectada',avance:proyecto.codigo==='FISE-2026-001'?0:Math.min(100,Math.round((proyecto.avance||0)*.35))},
      asbuilt:{...datosBase}
    };
    proyecto.versionActiva='planificacion';
    return proyecto;
  }
  function aplicarVersionCartografica(proyecto,version=versionCartograficaActiva) {
    prepararVersionesProyecto(proyecto);
    proyecto.versionActiva=version;
    Object.assign(proyecto,proyecto.versiones[version]);
  }
  function cambiarVersionCartografica(version) {
    versionCartograficaActiva=version;
    ciudades.forEach(proyecto=>aplicarVersionCartografica(proyecto,version));
    document.querySelectorAll('[data-version-proyecto]').forEach(boton=>boton.classList.toggle('activo',boton.dataset.versionProyecto===version));
    document.querySelectorAll('[data-version-modal]').forEach(boton=>boton.classList.toggle('activo',boton.dataset.versionModal===version));
    const descripcionVersion=$('descripcionVersionProyecto');
    if(descripcionVersion)descripcionVersion.textContent=version==='asbuilt'?'Estado construido validado en campo (as-built).':'Alcance del anteproyecto e ingeniería básica/detalle.';
    document.querySelector('.mapa-panel')?.classList.toggle('vista-asbuilt',version==='asbuilt');
    const indicadorVersion=$('indicadorVersionMapa');
    if(indicadorVersion){indicadorVersion.textContent=version==='asbuilt'?'AS-BUILT · RED CONSTRUIDA':'PLANIFICACIÓN · ANTEPROYECTO';indicadorVersion.classList.toggle('asbuilt',version==='asbuilt');}
    actualizarFiltros(); actualizar();
    if(proyectoSeleccionado)mostrarDetalle(ciudades.find(p=>p.codigo===proyectoSeleccionado.codigo)||proyectoSeleccionado);
  }
  function renderizarMapasVersiones(codigoProyecto) {
    if(typeof L==='undefined')return;
    const proyecto=ciudades.find(item=>item.codigo===codigoProyecto)||proyectoSeleccionado||ciudades[0];
    if(!proyecto)return;
    ['planificacion','asbuilt'].forEach(version=>{
      const id=version==='planificacion'?'mapaVersionPlanificacion':'mapaVersionAsBuilt';
      if(!mapasVersiones[version]){
        mapasVersiones[version]=L.map(id,{zoomControl:false,attributionControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(mapasVersiones[version]);
        capasMapasVersiones[version]=L.layerGroup().addTo(mapasVersiones[version]);
      }
      const mapaVersion=mapasVersiones[version],capa=capasMapasVersiones[version];
      capa.clearLayers();
      const factor=version==='asbuilt'?1:.64;
      const desplazamiento=.06;
      const puntos=[[proyecto.lat,proyecto.lng-desplazamiento*factor],[proyecto.lat+.025*factor,proyecto.lng-.018*factor],[proyecto.lat-.012*factor,proyecto.lng+.025*factor],[proyecto.lat+.015*factor,proyecto.lng+desplazamiento*factor]];
      const datosVersion=proyecto.versiones?.[version]||proyecto;
      const color=version==='asbuilt'?(colores[datosVersion.estado]||'#3fac79'):'#4e7de1';
      capa.addLayer(L.polyline(puntos,{color,weight:version==='asbuilt'?7:4,opacity:.9,dashArray:version==='asbuilt'?null:'10 8'}));
      capa.addLayer(L.circleMarker([proyecto.lat,proyecto.lng],{radius:8,color:'#fff',weight:2,fillColor:color,fillOpacity:1}).bindTooltip(`${proyecto.nombre} · ${datosVersion.avance||0}%`));
      mapaVersion.setView([proyecto.lat,proyecto.lng],11,{animate:false});
      setTimeout(()=>mapaVersion.invalidateSize(),0);
    });
  }

  function opciones(select, valores, inicial) {
    const valor = select.value;
    select.replaceChildren(new Option(inicial, ''));
    [...new Set(valores)].sort((a,b)=>a.localeCompare(b,'es')).forEach(v=>select.add(new Option(v,v)));
    if ([...select.options].some(o=>o.value===valor)) select.value=valor;
  }
  function fasePrincipalProyecto(proyecto, indice=0) {
    if(proyecto?.fase && fasesMapa[proyecto.fase])return proyecto.fase;
    if(proyecto?.estado==='Instalada')return 'Operación';
    if(proyecto?.estado==='En ejecución')return 'Construcción';
    if(proyecto?.estado==='Proyectada')return 'Proyecto';
    return indice===0?'Anteproyecto':'Proyecto';
  }
  function construirCatalogoProyectosDesdeGeojson(features) {
    const proyectos = features.filter(f=>f?.properties?.tipo==='proyecto').map((feature,indice)=>{
      const [lng,lat] = feature.geometry?.coordinates || [];
      const beneficiarios = features.filter(f=>f?.properties?.tipo==='beneficiario'&&f.properties.proyecto===feature.properties.codigo).length;
      const lotes = features.filter(f=>f?.properties?.tipo==='lote'&&f.properties.proyecto===feature.properties.codigo).length;
      const esProyectoSauna = feature.properties.codigo === 'MAS-001';
      return {
        codigo: esProyectoSauna ? 'FISE-2026-001' : (feature.properties.codigo || feature.id || `MAS-${String(indice+1).padStart(3,'0')}`),
        codigoFuente: feature.properties.codigo || '',
        nombre: esProyectoSauna ? 'PROYECTO SAUNA 1' : (feature.properties.nombre || 'Proyecto sin nombre'),
        departamento: esProyectoSauna ? 'Arequipa' : (feature.properties.departamento || '—'),
        provincia: feature.properties.provincia || '—',
        distrito: feature.properties.distrito || '—',
        lat: Number(lat) || 0,
        lng: Number(lng) || 0,
        estado: esProyectoSauna ? 'En evaluación' : (feature.properties.estado || 'En evaluación'),
        fase: esProyectoSauna ? 'Anteproyecto' : fasePrincipalProyecto(feature.properties,indice),
        avance: Number(feature.properties.avance) || 0,
        longitud: Number(feature.properties.longitud) || 0,
        elementos: feature.properties.elementos || '—',
        tipo: 'Masificación de gas FISE',
        fechaInicio: feature.properties.fechaInicio || '',
        fechaFin: feature.properties.fechaFin || '',
        responsableLider: esProyectoSauna ? 'Oliver Gonzales' : (feature.properties.responsableLider || '-- Seleccione --'),
        empresaContratista: feature.properties.empresaContratista || '',
        equipo: feature.properties.equipo || ['Equipo GIS','Equipo Social','Mesa Técnica'],
        beneficiarios: beneficiarios,
        areaInfluencia: feature.properties.areaInfluencia || `Área de influencia · ${lotes} lote(s)`,
        localizacion: `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`
      };
    });
    return (proyectos.length ? proyectos : [...ciudadesBase]).map(prepararVersionesProyecto);
  }
  function actualizarFiltros() {
    opciones($('filtroProyecto'), ciudades.map(x=>`${x.codigo} · ${x.nombre}`), 'Todos los proyectos');
    opciones($('filtroDepartamento'), ciudades.map(x=>x.departamento), 'Todos');
    const provinciales=ciudades.filter(x=>!$('filtroDepartamento').value||x.departamento===$('filtroDepartamento').value);
    opciones($('filtroProvincia'), provinciales.map(x=>x.provincia), 'Todas');
    const distritales=provinciales.filter(x=>!$('filtroProvincia').value||x.provincia===$('filtroProvincia').value);
    opciones($('filtroDistrito'), distritales.map(x=>x.distrito), 'Todos');
  }
  function filtrados() {
    const q=$('buscarProyecto').value.trim().toLowerCase();
    return ciudades.filter(x=>(!q||Object.values(x).some(v=>String(v).toLowerCase().includes(q)))&&
      (!$('filtroProyecto').value||`${x.codigo} · ${x.nombre}`===$('filtroProyecto').value)&&
      (!$('filtroDepartamento').value||x.departamento===$('filtroDepartamento').value)&&
      (!$('filtroProvincia').value||x.provincia===$('filtroProvincia').value)&&
      (!$('filtroDistrito').value||x.distrito===$('filtroDistrito').value)&&
      (!$('filtroEstado').value||x.estado===$('filtroEstado').value));
  }
  function fasesDeProyecto(proyecto){
    const sufijo=proyecto.codigo.replace(/[^A-Z0-9]/gi,'').slice(-4);
    const guardados=proyecto.pasosSatcontrol||{};
    return [
      {codigo:`${sufijo}-01`,nombre:'Registro de ficha de proyecto',estado:guardados[1]?'Guardado':'Información general y ubicación',guardado:Boolean(guardados[1])},
      {codigo:`${sufijo}-02`,nombre:'Gestión contractual',estado:guardados[2]?'Guardado':'Documentos y actores',guardado:Boolean(guardados[2])},
      {codigo:`${sufijo}-03`,nombre:'Parámetros contractuales',estado:guardados[3]?'Guardado':'Hitos y condiciones',guardado:Boolean(guardados[3])},
      {codigo:`${sufijo}-04`,nombre:'Penalidades',estado:guardados[4]?'Guardado':'Reglas y deducciones',guardado:Boolean(guardados[4])},
      {codigo:`${sufijo}-05`,nombre:'Ficha de proyecto',estado:proyecto.estado==='Instalada'?'Expediente consolidado':'Pendiente de consolidar'}
    ];
  }
  const detallePasosSatcontrol={
    1:{titulo:'Registro de ficha',ejemplo:'Ficha, ubicación GIS y alcance'},
    2:{titulo:'Gestión contractual',ejemplo:'Actores y documentos del contrato'},
    3:{titulo:'Parámetros contractuales',ejemplo:'Hitos, baremos y condiciones'},
    4:{titulo:'Penalidades',ejemplo:'Reglas, descargos y deducciones'}
  };
  function resumenPasosSatcontrol(proyecto){
    const guardados=proyecto?.pasosSatcontrol||{};
    return Object.entries(detallePasosSatcontrol).map(([numero,detalle])=>({
      numero:Number(numero),titulo:detalle.titulo,
      texto:guardados[numero]?.texto||detalle.ejemplo,
      guardado:Boolean(guardados[numero])
    }));
  }
  function resumenPasoActual(paso){
    if(paso===1){
      const nombre=$('proyectoNombre')?.value?.trim()||'Proyecto sin nombre';
      const ubicacion=[$('proyectoDepartamento')?.value,$('proyectoProvincia')?.value,$('proyectoDistrito')?.value].filter(Boolean).join(' · ');
      return `${nombre}${ubicacion?` · ${ubicacion}`:''}`;
    }
    if(paso===2){
      const documentos=[...document.querySelectorAll('.documentos-maestros-contrato input[type="file"]')].filter(input=>input.files?.length).length;
      const actores=[...document.querySelectorAll('[data-panel-gestion-contractual="actores"] input[type="text"], [data-panel-gestion-contractual="actores"] input[type="email"]')].filter(input=>input.value.trim()).length;
      return `${actores} dato(s) de actores · ${documentos} documento(s) adjunto(s)`;
    }
    if(paso===3){
      const hitos=[...document.querySelectorAll('.panel-parametros-contractuales tbody tr')].length;
      return `${hitos} hito(s) y parámetro(s) registrados`;
    }
    const penalidades=[...$('tablaPenalidadesProyecto')?.rows||[]].filter(fila=>!fila.classList.contains('fila-sustentos-penalidad')&&[...fila.querySelectorAll('input')].some(input=>input.value)).length;
    return penalidades?`${penalidades} penalidad(es) registrada(s)`:'Sin penalidades registradas';
  }
  function capturarParametrosContractuales(){
    const tablas=['tablaHitosPsr','tablaHitosRedes','tablaHitosTc'];
    const textoSustento=contenedor=>{
      const texto=contenedor?.querySelector('small')?.textContent?.trim()||contenedor?.querySelector('span')?.textContent?.trim();
      return texto&&texto!=='Sin archivo'&&texto!=='Adjuntar PDF'?texto:'PDF adjunto';
    };
    return tablas.map((id,componente)=>{
      const cuerpo=$(id);
      if(!cuerpo)return {componente,hitos:[]};
      const hitos=[...cuerpo.children].filter(fila=>fila.tagName==='TR'&&!fila.classList.contains('fila-requisitos-hito')).map(fila=>{
        const celdas=[...fila.cells];
        const controles=[...fila.querySelectorAll(':scope > td input, :scope > td select')];
        const hito=controles[0]?.value?.trim()||'';
        const porcentaje=controles[1]?.value?.trim()||'';
        const fecha=controles[2]?.value||'';
        const estado=fila.querySelector(':scope > td .estado-seguimiento')?.textContent?.trim()||fila.querySelector(':scope > td select')?.value||'Por iniciar';
        const detalle=fila.nextElementSibling?.classList.contains('fila-requisitos-hito')?fila.nextElementSibling:null;
        const requisitos=[...(detalle?.querySelectorAll('.tabla-requisitos-hito tbody > tr')||[])].map(requisito=>{
          const campos=[...requisito.querySelectorAll(':scope > td input')];
          return {descripcion:campos[0]?.value?.trim()||'',unidad:campos[1]?.value?.trim()||'',cantidad:campos[2]?.value?.trim()||'',avance:campos[3]?.value?.trim()||'',sustento:textoSustento(requisito)};
        }).filter(requisito=>requisito.descripcion||requisito.unidad||requisito.cantidad||requisito.avance);
        return {hito,porcentaje,fecha,estado,sustento:textoSustento(celdas.find(celda=>celda.querySelector('.carga-sustento-hito'))),requisitos};
      }).filter(hito=>hito.hito);
      return {componente,hitos};
    });
  }
  function guardarPasoSatcontrol(paso){
    let destino=proyectoEdicionSeleccionado||proyectoSeleccionado;
    if(!destino){
      const ejemplo=proyectoReferenciaFicha(),datos=obtenerDatosFormularioProyecto();
      destino=prepararVersionesProyecto({...ejemplo,...datos,
        codigo:datos.codigo||ejemplo.codigo,
        nombre:datos.nombre||ejemplo.nombre,
        departamento:datos.departamento||ejemplo.departamento,
        provincia:datos.provincia||ejemplo.provincia,
        distrito:datos.distrito||ejemplo.distrito,
        responsableLider:datos.responsableLider==='-- Seleccione --'?ejemplo.responsableLider:(datos.responsableLider||ejemplo.responsableLider),
        empresaContratista:datos.empresaContratista||ejemplo.empresaContratista,
        contrato:datos.contrato||ejemplo.contrato,
        pasosSatcontrol:{}});
      ciudades=ciudades.filter(proyecto=>proyecto.codigo!==destino.codigo);
      ciudades.unshift(destino);
      proyectoEdicionSeleccionado=destino;
      proyectoSeleccionado=destino;
      cargarProyectoEnFormulario(destino);
    }
    destino.pasosSatcontrol??={};
    if(paso===3)destino.parametrosContractuales=capturarParametrosContractuales();
    destino.pasosSatcontrol[paso]={texto:resumenPasoActual(paso),actualizado:new Date().toISOString()};
    guardarPasosSatcontrol(destino);
    guardarProyectoSatcontrol(destino);
    $('estadoGuardadoPaso').textContent=`${detallePasosSatcontrol[paso].titulo} guardado.`;
    document.querySelectorAll('.estado-guardado-hoja').forEach(estado=>{estado.textContent=`${detallePasosSatcontrol[paso].titulo} guardado.`;});
    actualizarIndicadorAsistente(paso);
    renderBarraProyectos();
  }
  function ordenarProyectosAnidados(proyectos) {
    const disponibles=new Map(proyectos.map(proyecto=>[proyecto.codigo,proyecto]));
    const resultado=[];
    const agregar=(proyecto,nivel=0)=>{
      if(!disponibles.has(proyecto.codigo))return;
      disponibles.delete(proyecto.codigo);
      resultado.push({proyecto,nivel});
      proyectos.filter(hijo=>hijo.proyectoPadre===proyecto.codigo).forEach(hijo=>agregar(hijo,nivel+1));
    };
    proyectos.filter(proyecto=>!proyecto.proyectoPadre||!disponibles.has(proyecto.proyectoPadre)).forEach(proyecto=>agregar(proyecto));
    disponibles.forEach(proyecto=>agregar(proyecto));
    return resultado;
  }
  function renderBarraProyectos(){
    const lista=$('listaProyectosMapa');
    if(!lista)return;
    const consulta=($('buscarBarraProyectos')?.value||'').trim().toLowerCase();
    const proyectos=filtrados().filter(proyecto=>!consulta||[
      proyecto.codigo,proyecto.nombre,proyecto.departamento,proyecto.provincia,proyecto.distrito,
      ...fasesDeProyecto(proyecto).flatMap(fase=>[fase.codigo,fase.nombre])
    ].some(valor=>String(valor).toLowerCase().includes(consulta)));
    $('contadorBarraProyectos').textContent=`${proyectos.length} visible${proyectos.length===1?'':'s'}`;
    lista.replaceChildren();
    if(!proyectos.length){
      const vacio=document.createElement('p');
      vacio.className='proyectos-mapa-vacio';
      vacio.textContent='No hay proyectos que coincidan con la búsqueda.';
      lista.append(vacio);
      return;
    }
    ordenarProyectosAnidados(proyectos).forEach(({proyecto,nivel})=>{
      const abierto=proyectosExpandidos.has(proyecto.codigo)||proyectoSeleccionado?.codigo===proyecto.codigo;
      const articulo=document.createElement('article');
      articulo.className=`proyecto-arbol${abierto?' abierto':''}${proyectoSeleccionado?.codigo===proyecto.codigo?' seleccionado':''}${nivel?' proyecto-hijo':''}`;
      articulo.style.setProperty('--nivel-proyecto',nivel);
      articulo.dataset.codigo=proyecto.codigo;
      const cabecera=document.createElement('div');
      cabecera.className='proyecto-arbol-cabecera';
      const seleccionar=document.createElement('button');
      seleccionar.type='button';
      seleccionar.className='seleccionar-proyecto-mapa';
      seleccionar.dataset.seleccionarProyecto=proyecto.codigo;
      seleccionar.innerHTML=`<i style="--color-proyecto:${colores[proyecto.estado]||'#5b8fb0'}"></i><span><strong>${proyecto.nombre}</strong><small class="codigo-proyecto-barra">${proyecto.codigo}</small><em>${proyecto.estado}</em><b class="datos-proyecto-barra"><small><span>Líder:</span><strong>${proyecto.responsableLider||'Sin asignar'}</strong></small><small><span>Ubicación:</span><strong>${nivel?`Subproyecto de ${ciudades.find(p=>p.codigo===proyecto.proyectoPadre)?.nombre||proyecto.proyectoPadre}`:proyecto.departamento}</strong></small></b></span>`;
      seleccionar.querySelector('i').style.background=colores[proyecto.estado]||'#5b8fb0';
      const alternar=document.createElement('button');
      alternar.type='button';
      alternar.className='alternar-subproyectos';
      alternar.dataset.alternarSubproyectos=proyecto.codigo;
      alternar.setAttribute('aria-label',`${abierto?'Ocultar':'Mostrar'} subproyectos de ${proyecto.nombre}`);
      alternar.innerHTML='<span aria-hidden="true"></span>';
      const acciones=document.createElement('div');
      acciones.className='acciones-proyecto-mapa';
      acciones.innerHTML=`<button type="button" class="crear-subproyecto" data-accion-barra="subproyecto" data-codigo="${proyecto.codigo}" aria-label="Crear subproyecto de ${proyecto.nombre}" title="Crear subproyecto">+</button><button type="button" data-accion-barra="editar" data-codigo="${proyecto.codigo}" aria-label="Editar ${proyecto.nombre}" title="Editar proyecto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 9.6-9.6-3.2-3.2L5 15.8 4 20Z"/><path d="m12.8 5.8 3.2 3.2"/></svg></button><button type="button" class="eliminar" data-accion-barra="eliminar" data-codigo="${proyecto.codigo}" aria-label="Eliminar ${proyecto.nombre}" title="Eliminar proyecto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"/></svg></button>`;
      cabecera.append(seleccionar,acciones,alternar);
      const subproyectos=document.createElement('div');
      subproyectos.className='subproyectos-mapa';
      fasesDeProyecto(proyecto).forEach(fase=>{
        const boton=document.createElement('button');
        boton.type='button';
        boton.className=`subproyecto-mapa${subproyectoSeleccionado===fase.codigo?' activo':''}${fase.guardado?' guardado':''}`;
        boton.dataset.subproyecto=fase.codigo;
        boton.dataset.proyecto=proyecto.codigo;
        boton.dataset.fase=fase.nombre;
        boton.innerHTML=`<strong>${fase.codigo} · ${fase.nombre}</strong><small>${fase.estado}</small>`;
        subproyectos.append(boton);
      });
      articulo.append(cabecera,subproyectos);
      lista.append(articulo);
    });
  }
  function seleccionarProyectoDesdeBarra(codigo,fase=''){
    const proyecto=ciudades.find(item=>item.codigo===codigo);
    if(!proyecto)return;
    proyectosExpandidos.add(codigo);
    subproyectoSeleccionado=fase?fasesDeProyecto(proyecto).find(item=>item.nombre===fase)?.codigo||'':'';
    if(fase)proyecto.faseSeleccionada=fase;
    else delete proyecto.faseSeleccionada;
    mostrarDetalle(proyecto);
  }
  function categoriaBeneficiario(feature, indice=0) {
    const categoria=feature?.properties?.categoria;
    if(categoria==='Registrado'||categoria==='Potencial')return categoria;
    return indice%3===0?'Registrado':'Potencial';
  }
  function renderAvanceProyecto(p) {
    const final=Math.max(5,Number(p.avance)||0);
    const factores=[.18,.36,.57,.78,1];
    $('listaAvanceProyecto').replaceChildren(...factores.map((factor,indice)=>{
      const valor=Math.min(100,Math.max(2,Math.round(final*factor)));
      const fila=document.createElement('div');
      fila.className='avance-item';
      fila.innerHTML=`<span>P${indice+1}</span><span class="barra-avance"><i style="width:${valor}%"></i></span><b>${valor}%</b>`;
      return fila;
    }));
  }
  function semillaTexto(valor) {
    return [...String(valor || '')].reduce((acum, caracter)=>acum + caracter.charCodeAt(0), 0) || 1;
  }
  function ruidoSemilla(valor, paso) {
    const x = Math.sin(valor * 12.9898 + paso * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }
  function anilloALatLng(anillo) {
    return anillo.map(([lng, lat]) => [lat, lng]);
  }
  function poligonoOrganicoDesdeCaja(caja, referencia='') {
    const [minLng, minLat, maxLng, maxLat] = caja;
    const semilla = semillaTexto(referencia);
    const ancho = maxLng - minLng;
    const alto = maxLat - minLat;
    const centroLng = (minLng + maxLng) / 2;
    const centroLat = (minLat + maxLat) / 2;
    const puntos = [
      [minLng, minLat],
      [minLng + ancho * 0.35, minLat - alto * (0.05 + ruidoSemilla(semilla, 1) * 0.06)],
      [minLng + ancho * 0.65, minLat - alto * (0.03 + ruidoSemilla(semilla, 2) * 0.05)],
      [maxLng, minLat],
      [maxLng + ancho * (0.04 + ruidoSemilla(semilla, 3) * 0.05), minLat + alto * 0.22],
      [maxLng + ancho * (0.05 + ruidoSemilla(semilla, 4) * 0.06), centroLat],
      [maxLng + ancho * (0.03 + ruidoSemilla(semilla, 5) * 0.04), maxLat - alto * 0.18],
      [maxLng, maxLat],
      [minLng + ancho * 0.68, maxLat + alto * (0.03 + ruidoSemilla(semilla, 6) * 0.05)],
      [minLng + ancho * 0.32, maxLat + alto * (0.04 + ruidoSemilla(semilla, 7) * 0.06)],
      [minLng, maxLat],
      [minLng - ancho * (0.04 + ruidoSemilla(semilla, 8) * 0.05), maxLat - alto * 0.2],
      [minLng - ancho * (0.05 + ruidoSemilla(semilla, 9) * 0.06), centroLat],
      [minLng - ancho * (0.03 + ruidoSemilla(semilla, 10) * 0.04), minLat + alto * 0.24],
      [minLng, minLat]
    ];
    return puntos.map(([lng, lat]) => [lat + (ruidoSemilla(semilla, lat + lng) - 0.5) * alto * 0.03, lng + (ruidoSemilla(semilla, lng + lat) - 0.5) * ancho * 0.03]);
  }
  function cajaDesdeLote(feature) {
    const coords = feature?.geometry?.coordinates?.[0] || [];
    const lngs = coords.map(p => p[0]);
    const lats = coords.map(p => p[1]);
    return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
  }
  function estiloManzanaReal(feature) {
    const cobertura = Number(feature?.properties?.LUZP ?? feature?.properties?.AGUAP ?? feature?.properties?.TIERRAP ?? 0);
    if (!Number.isFinite(cobertura)) return { color: '#7cc990', weight: 1.1, fillColor: '#7ad38b', fillOpacity: 0.35, interactive: false };
    if (cobertura >= 80) return { color: '#2f9d78', weight: 1.1, fillColor: '#66c28a', fillOpacity: 0.34, interactive: false };
    if (cobertura >= 50) return { color: '#e5a510', weight: 1.1, fillColor: '#f0c95b', fillOpacity: 0.34, interactive: false };
    return { color: '#a46bd6', weight: 1.1, fillColor: '#caa7ea', fillOpacity: 0.30, interactive: false };
  }
  function normalizarUbicacion(valor='') {
    return String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  }
  function centroGeometria(feature) {
    const puntos=[];
    (function recorrer(coordenadas){
      if(!Array.isArray(coordenadas))return;
      if(typeof coordenadas[0]==='number'){puntos.push(coordenadas);return;}
      coordenadas.forEach(recorrer);
    })(feature?.geometry?.coordinates);
    if(!puntos.length)return {lat:0,lng:0};
    const suma=puntos.reduce((acc,[lng,lat])=>({lng:acc.lng+lng,lat:acc.lat+lat}),{lat:0,lng:0});
    return {lat:suma.lat/puntos.length,lng:suma.lng/puntos.length};
  }
  function cascoConvexo(puntos) {
    const unicos=[...new Map(puntos.map(p=>[`${p.lng.toFixed(6)}:${p.lat.toFixed(6)}`,p])).values()]
      .sort((a,b)=>a.lng-b.lng||a.lat-b.lat);
    if(unicos.length<3)return unicos;
    const giro=(o,a,b)=>(a.lng-o.lng)*(b.lat-o.lat)-(a.lat-o.lat)*(b.lng-o.lng);
    const inferior=[];
    unicos.forEach(p=>{while(inferior.length>=2&&giro(inferior.at(-2),inferior.at(-1),p)<=0)inferior.pop();inferior.push(p);});
    const superior=[];
    [...unicos].reverse().forEach(p=>{while(superior.length>=2&&giro(superior.at(-2),superior.at(-1),p)<=0)superior.pop();superior.push(p);});
    return inferior.slice(0,-1).concat(superior.slice(0,-1));
  }
  function contornoEstratos(centros,margen=1.035) {
    const casco=cascoConvexo(centros);
    if(casco.length<3)return [];
    const centro=casco.reduce((acc,p)=>({lat:acc.lat+p.lat/casco.length,lng:acc.lng+p.lng/casco.length}),{lat:0,lng:0});
    return casco.map(p=>[centro.lat+(p.lat-centro.lat)*margen,centro.lng+(p.lng-centro.lng)*margen]);
  }
  function puntoCuantil(puntos,fraccion) {
    if(!puntos.length)return null;
    return puntos[Math.min(puntos.length-1,Math.max(0,Math.round((puntos.length-1)*fraccion)))];
  }
  function estratosCercanosAlProyecto(proyecto) {
    const departamento=normalizarUbicacion(proyecto.departamento);
    const asignados=estratosInei.filter(feature=>feature?.properties?.PROYECTO===proyecto.codigo);
    const candidatos=asignados.length?asignados:estratosInei
      .filter(feature=>normalizarUbicacion(feature?.properties?.DEPARTAMENTO)===departamento);
    return candidatos
      .map(feature=>{
        const centro=centroGeometria(feature);
        return {feature,distancia:Math.hypot(centro.lat-proyecto.lat,centro.lng-proyecto.lng)};
      })
      .sort((a,b)=>a.distancia-b.distancia)
      .map(item=>item.feature);
  }
  function estiloEstratoInei(feature) {
    const estrato=Number(feature?.properties?.ESTRATO ?? feature?.properties?.ESTRA ?? 0);
    const paleta={1:'#3454a5',2:'#4d79cf',3:'#51a8d7',4:'#79c88a',5:'#e4bf55'};
    return {pane:'estratosPane',color:'#f8fbff',weight:1.05,opacity:.95,fillColor:paleta[estrato]||'#9aa9bf',fillOpacity:.66,smoothFactor:.55,interactive:false,className:'estrato-inei'};
  }
  function aplicarFiltroEstratos(nivel='todos') {
    filtroEstratoActivo=String(nivel);
    document.querySelectorAll('[data-filtro-estrato]').forEach(boton=>{
      const activo=boton.dataset.filtroEstrato===filtroEstratoActivo;
      boton.classList.toggle('activo',activo);
      boton.setAttribute('aria-pressed',String(activo));
    });
    capasContexto.estrato?.eachLayer(layer=>{
      const nivelCapa=String(layer.options?.estratoNivel ?? layer.feature?.properties?.ESTRATO ?? layer.feature?.properties?.ESTRA ?? '');
      const visible=filtroEstratoActivo==='todos'||nivelCapa===filtroEstratoActivo;
      if(typeof layer.setStyle==='function'){
        layer.setStyle(visible?estiloEstratoInei(layer.feature):{opacity:0,fillOpacity:0});
      }
    });
    capasContexto.beneficiarios?.eachLayer(layer=>{
      const nivelCapa=String(layer.options?.estratoNivel ?? '');
      const visible=filtroEstratoActivo==='todos'||nivelCapa===filtroEstratoActivo;
      if(typeof layer.setStyle==='function'){
        const zonaClick=Boolean(layer.options?.esZonaClick);
        layer.setStyle({
          opacity:visible?(zonaClick?0:1):0,
          fillOpacity:visible?(zonaClick?.01:1):0
        });
      }
      const zonaClick=Boolean(layer.options?.esZonaClick);
      layer.options.interactive=visible&&zonaClick;
      if(layer._path)layer._path.style.pointerEvents=visible&&zonaClick?'auto':'none';
    });
  }
  function alternarCapasGenerales(mostrar) {
    const capas=[
      [capaProyectos,true],
      [capaManzanas,$('mostrarManzanas').checked],
      [capaPredios,$('mostrarPredios').checked],
      [capaInfluencia,$('mostrarInfluencia').checked],
      [capaGis,$('mostrarCapaCargada').checked]
    ];
    capas.forEach(([capa,activa])=>{
      if(!capa)return;
      if(mostrar&&activa){if(!mapa.hasLayer(capa))capa.addTo(mapa);}
      else if(mapa.hasLayer(capa))mapa.removeLayer(capa);
    });
  }
  function mostrarDetalle(p) {
    proyectoSeleccionado=p;
    beneficiarioSeleccionadoMasificacion=null;
    seleccionMapa=[];
    $('resumenMasificacion').hidden=true;
    $('detalleBeneficiario').hidden=true;
    $('detalleProyecto').hidden=false;
    $('capasGenerales').hidden=true;
    $('capasProyecto').hidden=false;
    $('nombreCapasProyecto').textContent=`${p.codigo} · ${p.nombre}`;
    alternarCapasGenerales(false);
    dibujarCapasProyecto(p);
    $('detalleNombre').textContent=p.faseSeleccionada?`${p.nombre} · ${p.faseSeleccionada}`:p.nombre;
    const indice=Math.max(0,ciudades.indexOf(p)), manzanas=3+(indice%4), predios=manzanas*(18+(indice%5)*3);
    const tuberiaPrincipal=(p.longitud*.62).toFixed(2),tuberiaRamales=(p.longitud*.38).toFixed(2),valvulas=8+Math.max(0,indice);
    const responsableLider=!p.responsableLider||String(p.responsableLider).includes('Seleccione')?'Equipo de Masificación':p.responsableLider;
    const datos=[['Código',p.codigo],['Fase / subproyecto',p.faseSeleccionada||'Proyecto general'],['Responsable líder',responsableLider],['Estado',p.estado],['Departamento',p.departamento],['Provincia',p.provincia],['Distrito',p.distrito],['Avance',`${p.avance}%`],['Longitud total de red',`${p.longitud} km`],['Tubería troncal PEAD 200 mm',`${tuberiaPrincipal} km`],['Tuberías de ramales PEAD 63–110 mm',`${tuberiaRamales} km`],['Válvulas registradas',`${valvulas} unidades`],['Manzanas abastecidas',manzanas],['Predios potenciales',predios],['Proyección concesionario',Math.round(predios*(1.08+(indice%3)*.035))],['Elementos indexados',p.elementos]];
    $('datosProyecto').replaceChildren(...datos.map(([k,v])=>{const d=document.createElement('div');const dt=document.createElement('dt');const dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;d.append(dt,dd);return d;}));
    const avance=Math.max(0,Math.min(100,Number(p.avance)||0)),troncal=Math.round(Number(tuberiaPrincipal)/Math.max(Number(p.longitud)||1,1)*100),ramales=100-troncal;
    $('anilloAvanceProyecto').style.setProperty('--avance-grafico',`${avance}%`);
    $('porcentajeAnilloProyecto').textContent=`${avance}%`;
    $('estadoGraficoProyecto').textContent=p.estado;
    $('barraTroncalProyecto').style.width=`${troncal}%`;
    $('barraRamalesProyecto').style.width=`${ramales}%`;
    $('barraPendienteProyecto').style.width=`${100-avance}%`;
    $('valorTroncalProyecto').textContent=`${tuberiaPrincipal} km`;
    $('valorRamalesProyecto').textContent=`${tuberiaRamales} km`;
    $('valorPendienteProyecto').textContent=`${100-avance}%`;
    renderAvanceProyecto(p);
    renderBarraProyectos();
    $('panelDerecho').scrollTo({top:0,behavior:'smooth'});
    setTimeout(()=>mapa?.invalidateSize({pan:false}),80);
  }
  function mostrarDetalleTuberia(p,detalle) {
    proyectoSeleccionado=p;
    beneficiarioSeleccionadoMasificacion=null;
    seleccionMapa=[];
    $('resumenMasificacion').hidden=true;
    $('detalleBeneficiario').hidden=true;
    $('detalleSeleccion').hidden=true;
    $('detalleProyecto').hidden=false;
    $('detalleNombre').textContent=`${detalle.tipo} · ${detalle.codigo}`;
    const datos=[
      ['Proyecto',`${p.codigo} · ${p.nombre}`],
      ['Elemento GIS',detalle.codigo],
      ['Tipo de red',detalle.tipo],
      ['Estado',p.estado],
      ['Material',detalle.material],
      ['Diámetro',detalle.diametro],
      ['Longitud referencial',detalle.longitud],
      ['Departamento',p.departamento],
      ['Provincia',p.provincia],
      ['Distrito',p.distrito],
      ['Avance del proyecto',`${p.avance}%`],
      ['Observación','Elemento de red seleccionado directamente en el mapa.']
    ];
    $('datosProyecto').replaceChildren(...datos.map(([k,v])=>{
      const d=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
      dt.textContent=k;dd.textContent=v;d.append(dt,dd);return d;
    }));
    $('panelDerecho').scrollTo({top:0,behavior:'smooth'});
  }
  function agregarTuberia(grupo,puntos,estilo,p,detalle) {
    const visible=L.polyline(puntos,{...estilo,pane:estilo.pane||'troncalPane',interactive:false});
    const zonaClick=L.polyline(puntos,{pane:estilo.pane||'troncalPane',color:'#15304a',opacity:.01,weight:Math.max(18,(estilo.weight||4)+12)});
    zonaClick.bindTooltip(`${detalle.codigo} · ${detalle.tipo}`,{sticky:true});
    zonaClick.on('click',e=>{
      if(['poligono','circulo'].includes(herramientaActiva)){
        if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
        clickDibujo(e);return;
      }
      if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
      mostrarDetalleTuberia(p,detalle);
    });
    grupo.addLayer(visible);
    grupo.addLayer(zonaClick);
  }
  function mostrarBeneficiario(p,numero,lat,lng,lote,categoria='Potencial',nombrePersonalizado=''){
    const nombres=['María Elena Ramos','Carlos Quispe Flores','Rosa Huamán Soto','Luis Alberto Torres','Ana Lucía Mendoza','Jorge Paredes Díaz'];
    const nombre=nombrePersonalizado||nombres[numero%nombres.length];
    seleccionMapa=[];
    beneficiarioSeleccionadoMasificacion={tipo:'Beneficiario',codigo:`BEN-${p.codigo.slice(-3)}-${String(numero+1).padStart(3,'0')}`,nombre,departamento:p.departamento,provincia:p.provincia,distrito:p.distrito,estado:categoria,lat,lng,proyecto:p.nombre};
    $('detalleProyecto').hidden=true;
    $('detalleBeneficiario').hidden=false;
    $('nombreBeneficiario').textContent=nombre;
    $('tipoBeneficiarioDetalle').textContent=categoria==='Registrado'?'BENEFICIARIO REGISTRADO':'BENEFICIARIO POTENCIAL';
    $('iconoBeneficiarioDetalle').classList.toggle('normal',categoria==='Registrado');
    const datos=[['Código',`BEN-${p.codigo.slice(-3)}-${String(numero+1).padStart(3,'0')}`],['Proyecto',p.nombre],['Tipo',categoria==='Registrado'?'Beneficiario conectado':'Unidad residencial potencial'],['Lote',`Lote ${lote}`],['Distrito',p.distrito],['Provincia',p.provincia],['Departamento',p.departamento],['Estado',categoria],['Suministro de referencia',`SUM-${592600+numero}`],['Coordenadas',`${lat.toFixed(5)}, ${lng.toFixed(5)}`],['Cobertura',categoria==='Registrado'?'Conexión registrada en la red':'Dentro del área de influencia'],['Concesionaria',categoria==='Registrado'?'Registro confirmado':'Proyección incluida']];
    $('datosBeneficiario').replaceChildren(...datos.map(([k,v])=>{const d=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;d.append(dt,dd);return d;}));
    $('panelDerecho').scrollTo({top:0,behavior:'smooth'});
  }
  function dibujarCapasProyecto(p){
    Object.values(capasContexto).forEach(c=>c.clearLayers());
    registrosProyectoPosicionados=[];
    const estratosProyecto=estratosCercanosAlProyecto(p);
    const centrosEstratos=estratosProyecto.map(centroGeometria).filter(c=>Number.isFinite(c.lat)&&Number.isFinite(c.lng)&&c.lat&&c.lng);
    const porLongitud=[...centrosEstratos].sort((a,b)=>a.lng-b.lng||a.lat-b.lat);
    const porLatitud=[...centrosEstratos].sort((a,b)=>a.lat-b.lat||a.lng-b.lng);
    const centroProyecto=centrosEstratos.length
      ? centrosEstratos.reduce((acc,c)=>({lat:acc.lat+c.lat/centrosEstratos.length,lng:acc.lng+c.lng/centrosEstratos.length}),{lat:0,lng:0})
      : {lat:p.lat,lng:p.lng};
    const lat=centroProyecto.lat,lng=centroProyecto.lng;
    const contorno=contornoEstratos(centrosEstratos);
    if(contorno.length){
      capasContexto.cobertura.addLayer(L.polygon(contorno,{pane:'coberturaPane',color:'#3d6fd6',weight:2,fillColor:'#75b8e8',fillOpacity:.035,interactive:false,className:'perimetro-proyecto'}));
    }
    agregarTuberia(
      capasContexto.troncal,
      [.06,.34,.66,.94].map(q=>puntoCuantil(porLongitud,q)).filter(Boolean).map(c=>[c.lat,c.lng]),
      {pane:'troncalPane',color:'#e8564f',weight:7,opacity:.98},
      p,
      {codigo:`TRON-${p.codigo.slice(-3)}-01`,tipo:'Troncal principal',material:'Polietileno de alta densidad',diametro:'200 mm',longitud:`${(p.longitud*.62).toFixed(2)} km`}
    );
    const detalleValvula={codigo:`VAL-${p.codigo.slice(-3)}-01`,tipo:'Válvula de seccionamiento',material:'PEAD / acero',diametro:'200 mm',longitud:'Elemento puntual'};
    const puntoValvula=puntoCuantil(porLongitud,.34)||centroProyecto;
    const valvula=L.circleMarker([puntoValvula.lat,puntoValvula.lng],{radius:9,color:'#fff',weight:3,fillColor:'#e27612',fillOpacity:1,pane:'beneficiariosPane'})
      .bindTooltip(`${detalleValvula.codigo} · ${detalleValvula.tipo}`,{sticky:true});
    valvula.on('click',e=>{
      if(['poligono','circulo'].includes(herramientaActiva)){
        if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
        clickDibujo(e);return;
      }
      if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
      mostrarDetalleTuberia(p,detalleValvula);
    });
    capasContexto.troncal.addLayer(valvula);
    agregarTuberia(
      capasContexto.concesionaria,
      [.10,.50,.90].map(q=>puntoCuantil(porLatitud,q)).filter(Boolean).map(c=>[c.lat,c.lng]),
      {pane:'concesionariaPane',color:'#438cca',weight:5,dashArray:'10 7',opacity:.96},
      p,
      {codigo:`CONC-${p.codigo.slice(-3)}-01`,tipo:'Red de concesionaria',material:'Polietileno',diametro:'110 mm',longitud:`${(p.longitud*.48).toFixed(2)} km`}
    );
    for(let i=0;i<3&&centrosEstratos.length;i++){
      const inicio=puntoCuantil(porLongitud,.18+i*.24),fin=puntoCuantil(porLongitud,.30+i*.24);
      agregarTuberia(
        capasContexto.ramales,
        [inicio,fin].filter(Boolean).map(c=>[c.lat,c.lng]),
        {pane:'ramalesPane',color:'#f0a632',weight:4,opacity:.98},
        p,
        {codigo:`RAM-${p.codigo.slice(-3)}-${String(i+1).padStart(2,'0')}`,tipo:'Ramal secundario',material:'Polietileno',diametro:'63 mm',longitud:`${(0.42+i*.17).toFixed(2)} km`}
      );
    }
    const beneficiariosGeo=datosGeo.filter(f=>f.properties.tipo==='beneficiario'&&f.properties.proyecto===(p.codigoFuente||p.codigo)).slice(0,12);
    beneficiariosGeo.forEach((beneficiarioGeo,numero)=>{
      const indiceEstrato=Math.min(estratosProyecto.length-1,Math.round((numero+1)*estratosProyecto.length/(beneficiariosGeo.length+1)));
      const estratoDestino=estratosProyecto[indiceEstrato];
      const nivelEstrato=Number(estratoDestino?.properties?.ESTRATO ?? estratoDestino?.properties?.ESTRA ?? 0);
      const ubicacion=estratoDestino?centroGeometria(estratoDestino):centroProyecto;
      const by=ubicacion.lat,bx=ubicacion.lng;
      const categoria=categoriaBeneficiario(beneficiarioGeo,numero),color=categoria==='Registrado'?'#2f9d78':'#7655a8';
      const lote=estratoDestino?.properties?.IDMANZANA||estratoDestino?.properties?.OBJECTID||numero+1;
      registrosProyectoPosicionados.push({
        tipo:'Beneficiario',
        codigo:beneficiarioGeo.id||`BEN-${p.codigo.slice(-3)}-${String(numero+1).padStart(3,'0')}`,
        nombre:beneficiarioGeo.properties.nombre,
        lat:by,
        lng:bx,
        detalle:`${categoria} · ${p.distrito}`,
        estado:categoria,
        estrato:nivelEstrato,
        proyecto:p.nombre,
        departamento:p.departamento,
        provincia:p.provincia,
        distrito:p.distrito
      });
      const puntoVisible=L.circleMarker([by,bx],{radius:5.5,color:'#fff',weight:2,fillColor:color,fillOpacity:1,className:`beneficiario-mapa ${categoria==='Registrado'?'beneficiario-normal':'beneficiario-potencial'}`,pane:'beneficiariosPane',interactive:false});
      const zonaClick=L.circleMarker([by,bx],{radius:13,color:'transparent',weight:0,fillColor:color,fillOpacity:.01,pane:'beneficiariosPane'}).bindTooltip(`${beneficiarioGeo.properties.nombre} · ${categoria}`);
      puntoVisible.options.estratoNivel=nivelEstrato;
      puntoVisible.options.esZonaClick=false;
      zonaClick.options.estratoNivel=nivelEstrato;
      zonaClick.options.esZonaClick=true;
      zonaClick.on('click',e=>{
        if(['poligono','circulo'].includes(herramientaActiva)){
          if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);
          clickDibujo(e);return;
        }
        mostrarBeneficiario(p,numero,by,bx,lote,categoria,beneficiarioGeo.properties.nombre);
      });
      capasContexto.beneficiarios.addLayer(puntoVisible);
      capasContexto.beneficiarios.addLayer(zonaClick);
    });
    const limitesEstratos=L.latLngBounds();
    estratosProyecto.forEach(feature=>{
      const capa=L.geoJSON(feature,{style:estiloEstratoInei,interactive:false,className:'estrato-inei'});
      capa.eachLayer(layer=>{
        layer.options.estratoNivel=Number(feature?.properties?.ESTRATO ?? feature?.properties?.ESTRA ?? 0);
        capasContexto.estrato.addLayer(layer);
        if(typeof layer.getBounds==='function')limitesEstratos.extend(layer.getBounds());
      });
    });
    aplicarFiltroEstratos(filtroEstratoActivo);
    if(!estratosProyecto.length){
      const aviso=$('estadoCarga');
      aviso.hidden=false;
      aviso.textContent=`Sin estratos INEI disponibles para ${p.departamento}`;
      setTimeout(()=>{aviso.hidden=true;},2600);
    }
    if(limitesEstratos.isValid()){
      // Un margen amplio permite ver el distrito completo y evita que los
      // estratos ubicados en los extremos queden pegados o fuera del mapa.
      const limitesConMargen=limitesEstratos.pad(.06);
      mapa.flyToBounds(limitesConMargen,{padding:[30,30],maxZoom:12,duration:.6});
    }
    else mapa.flyTo([lat,lng],11,{duration:.6});
  }
  function cerrarProyecto(){
    proyectoSeleccionado=null;
    beneficiarioSeleccionadoMasificacion=null;
    subproyectoSeleccionado='';
    ciudades.forEach(proyecto=>delete proyecto.faseSeleccionada);
    seleccionMapa=[];
    registrosProyectoPosicionados=[];
    Object.values(capasContexto).forEach(c=>c.clearLayers());
    $('detalleProyecto').hidden=true;$('detalleBeneficiario').hidden=true;$('resumenMasificacion').hidden=false;
    $('capasProyecto').hidden=true;$('capasGenerales').hidden=false;
    alternarCapasGenerales(true);
    renderBarraProyectos();
    $('panelDerecho').scrollTo({top:0,behavior:'smooth'});
    // La X devuelve al alcance nacional inicial, no conserva el zoom del proyecto cerrado.
    mapa.setView([-10.6,-75.2],5,{animate:true});
  }
  function registrosSeleccionables(){
    // Cuando existe un proyecto abierto se usan exactamente las coordenadas
    // que se dibujaron dentro de los estratos, no las coordenadas antiguas del JSON.
    if(proyectoSeleccionado&&registrosProyectoPosicionados.length){
      return registrosProyectoPosicionados.filter(registro=>
        filtroEstratoActivo==='todos'||String(registro.estrato)===filtroEstratoActivo
      );
    }
    const proyectos=filtrados().map(p=>({tipo:'Proyecto',codigo:p.codigo,nombre:p.nombre,lat:p.lat,lng:p.lng,detalle:p.estado}));
    const beneficiarios=datosGeo.filter(f=>f.properties.tipo==='beneficiario').map(f=>({tipo:'Beneficiario',codigo:f.id,nombre:f.properties.nombre,lat:f.geometry.coordinates[1],lng:f.geometry.coordinates[0],detalle:f.properties.distrito}));
    return [...proyectos,...beneficiarios];
  }
  function puntoEnPoligono(r,puntos){
    let dentro=false;for(let i=0,j=puntos.length-1;i<puntos.length;j=i++){const xi=puntos[i].lng,yi=puntos[i].lat,xj=puntos[j].lng,yj=puntos[j].lat;if((yi>r.lat)!==(yj>r.lat)&&r.lng<((xj-xi)*(r.lat-yi))/(yj-yi)+xi)dentro=!dentro;}return dentro;
  }
  function mostrarSeleccion(registros,titulo){
    seleccionMapa=[...registros];
    beneficiarioSeleccionadoMasificacion=null;
    registros.forEach(r=>{
      if(!Number.isFinite(r.lat)||!Number.isFinite(r.lng))return;
      L.circleMarker([r.lat,r.lng],{
        pane:'seleccionPane',radius:9,color:'#fff',weight:3,
        fillColor:'#1c86c8',fillOpacity:.92,interactive:false
      }).addTo(capaDibujo);
    });
    $('resumenMasificacion').hidden=true;$('detalleProyecto').hidden=true;$('detalleBeneficiario').hidden=true;$('detalleSeleccion').hidden=false;
    $('tituloSeleccion').textContent=titulo;$('resumenSeleccion').textContent=`${registros.length} registro(s) dentro del área`;
    $('listaSeleccion').replaceChildren(...registros.slice(0,40).map(r=>{const a=document.createElement('article');a.innerHTML=`<strong>${r.codigo} · ${r.nombre}</strong><small>${r.tipo} · ${r.detalle}</small>`;return a;}));
    $('panelDerecho').scrollTo({top:0,behavior:'smooth'});
  }
  function limpiarSeleccion(){
    seleccionMapa=[];beneficiarioSeleccionadoMasificacion=null;
    puntosDibujo=[];centroCirculo=null;figuraTemporal=null;if(capaDibujo)capaDibujo.clearLayers();
    $('detalleSeleccion').hidden=true;$('detalleProyecto').hidden=true;$('detalleBeneficiario').hidden=true;$('resumenMasificacion').hidden=false;
    $('panelDerecho').scrollTo({top:0,behavior:'smooth'});
  }
  function clickDibujo(e){
    if(herramientaActiva==='poligono'){puntosDibujo.push(e.latlng);if(figuraTemporal)figuraTemporal.setLatLngs(puntosDibujo);else figuraTemporal=L.polyline(puntosDibujo,{pane:'dibujoPane',color:'#d98b24',weight:3}).addTo(capaDibujo);}
    else if(herramientaActiva==='circulo'&&!centroCirculo){centroCirculo=e.latlng;figuraTemporal=L.circle(centroCirculo,{pane:'dibujoPane',radius:100,color:'#7657c7',fillColor:'#9a7de0',fillOpacity:.16,weight:3}).addTo(capaDibujo);}
  }
  function moverDibujo(e){
    if(herramientaActiva==='poligono'&&puntosDibujo.length&&figuraTemporal)figuraTemporal.setLatLngs([...puntosDibujo,e.latlng]);
    if(herramientaActiva==='circulo'&&centroCirculo&&figuraTemporal)figuraTemporal.setRadius(mapa.distance(centroCirculo,e.latlng));
  }
  function desactivarHerramientasMapa(limpiarDibujo=false) {
    herramientaActiva=null;puntosDibujo=[];centroCirculo=null;figuraTemporal=null;dibujoProyectoPendiente=null;
    document.querySelectorAll('[data-herramienta]').forEach(boton=>boton.classList.remove('activo'));
    if(limpiarDibujo)capaDibujo?.clearLayers();
    mapa?.doubleClickZoom.enable();mapa?.getContainer().classList.remove('modo-dibujo');
  }
  function prepararGeometriaProyecto(forma,datos,figura) {
    geometriaProyectoBorrador={forma,datos,figura};
    dibujoProyectoPendiente=null;
    desactivarHerramientasMapa(false);
    $('modalAccionesGeometria').showModal();
  }
  function activarEdicionGeometriaProyecto() {
    const borrador=geometriaProyectoBorrador;if(!borrador)return;
    $('modalAccionesGeometria').close();
    const icono=L.divIcon({className:'vertice-edicion-geometria',iconSize:[15,15],iconAnchor:[7.5,7.5]});
    const marcadores=[];
    if(borrador.forma==='poligono'){
      borrador.datos.puntos.forEach((punto,indice)=>{
        const marcador=L.marker(punto,{pane:'seleccionPane',icon:icono,draggable:true}).addTo(capaDibujo);
        marcador.on('drag',evento=>{borrador.datos.puntos[indice]=evento.target.getLatLng();borrador.figura.setLatLngs(borrador.datos.puntos);});
        marcadores.push(marcador);
      });
    }else{
      const centro=borrador.datos.centro,radio=borrador.datos.radio;
      const borde=L.latLng(centro.lat,centro.lng+(radio/(111320*Math.max(.2,Math.cos(centro.lat*Math.PI/180)))));
      const marcadorCentro=L.marker(centro,{pane:'seleccionPane',icon:icono,draggable:true}).addTo(capaDibujo);
      const marcadorRadio=L.marker(borde,{pane:'seleccionPane',icon:icono,draggable:true}).addTo(capaDibujo);
      marcadorCentro.on('drag',evento=>{borrador.datos.centro=evento.target.getLatLng();borrador.figura.setLatLng(borrador.datos.centro);});
      marcadorRadio.on('drag',evento=>{borrador.datos.radio=mapa.distance(borrador.datos.centro,evento.target.getLatLng());borrador.figura.setRadius(borrador.datos.radio);});
      marcadores.push(marcadorCentro,marcadorRadio);
    }
    borrador.marcadoresEdicion=marcadores;
    $('accionesGeometriaMapa').hidden=false;mapa.getContainer().classList.add('mapa-editando-vertices');
  }
  function finalizarEdicionGeometriaProyecto() {
    const borrador=geometriaProyectoBorrador;if(!borrador)return;
    (borrador.marcadoresEdicion||[]).forEach(marcador=>capaDibujo.removeLayer(marcador));borrador.marcadoresEdicion=[];
    $('accionesGeometriaMapa').hidden=true;mapa.getContainer().classList.remove('mapa-editando-vertices');
    $('modalAccionesGeometria').showModal();
  }
  function eliminarGeometriaProyectoBorrador() {
    capaDibujo.clearLayers();geometriaProyectoBorrador=null;$('accionesGeometriaMapa').hidden=true;
    mapa.getContainer().classList.remove('mapa-editando-vertices');
    if($('modalAccionesGeometria').open)$('modalAccionesGeometria').close();
    desactivarHerramientasMapa(false);
  }
  function completarDibujoProyecto() {
    if(!geometriaProyectoBorrador||!dibujoProyectoPendiente)return false;
    const {forma,datos,figura}=geometriaProyectoBorrador;
    const {tipo,nombre}=dibujoProyectoPendiente;
    const centro=forma==='poligono'
      ? datos.puntos.reduce((acumulado,punto)=>({lat:acumulado.lat+punto.lat/datos.puntos.length,lng:acumulado.lng+punto.lng/datos.puntos.length}),{lat:0,lng:0})
      : datos.centro;
    const geometria=forma==='poligono'
      ? {tipo:'Polígono',nombre,categoria:tipo,coordenadas:datos.puntos.map(punto=>[Number(punto.lat.toFixed(6)),Number(punto.lng.toFixed(6))])}
      : {tipo:'Círculo',nombre,categoria:tipo,centro:[Number(centro.lat.toFixed(6)),Number(centro.lng.toFixed(6))],radio:Number(datos.radio.toFixed(2))};
    const codigoProyecto=dibujoProyectoPendiente.codigoProyecto;
    const proyecto=ciudades.find(item=>item.codigo===codigoProyecto);
    const area=`${tipo} · ${nombre}`,localizacion=`${centro.lat.toFixed(6)}, ${centro.lng.toFixed(6)}`;
    if(proyecto){Object.assign(proyecto,{areaInfluencia:area,localizacion,geometria,lat:centro.lat,lng:centro.lng});renderBarraProyectos();actualizar();}
    $('proyectoAreaInfluencia').value=area;
    $('proyectoLocalizacion').value=localizacion;
    $('proyectoGeometria').value=JSON.stringify(geometria);
    const estado=$('estadoZonaProyecto');
    estado.textContent=`${nombre} guardada como ${geometria.tipo.toLowerCase()}. Centro: ${centro.lat.toFixed(5)}, ${centro.lng.toFixed(5)}.`;
    estado.classList.add('exito');
    figura?.bindTooltip(nombre);
    dibujoProyectoPendiente=null;geometriaProyectoBorrador=null;
    desactivarHerramientasMapa(false);
    $('accionesGeometriaMapa').hidden=true;
    $('modalDibujoArea').close();
    return true;
  }
  function cerrarDibujo(e){
    if(herramientaActiva==='poligono'&&puntosDibujo.length>=3){const puntos=[...puntosDibujo];capaDibujo.clearLayers();const figura=L.polygon(puntos,{pane:'dibujoPane',color:'#d98b24',fillColor:'#f2ad50',fillOpacity:.18,weight:3}).addTo(capaDibujo);if(dibujoProyectoPendiente?.modo==='captura')prepararGeometriaProyecto('poligono',{puntos},figura);else{mostrarSeleccion(registrosSeleccionables().filter(r=>puntoEnPoligono(r,puntos)),'Selección por polígono');desactivarHerramientasMapa(false);}}
    else if(herramientaActiva==='circulo'&&centroCirculo&&figuraTemporal){const centro=centroCirculo,radio=mapa.distance(centro,e.latlng);figuraTemporal.setRadius(radio);if(dibujoProyectoPendiente?.modo==='captura')prepararGeometriaProyecto('circulo',{centro,radio},figuraTemporal);else{mostrarSeleccion(registrosSeleccionables().filter(r=>mapa.distance(centro,L.latLng(r.lat,r.lng))<=radio),'Selección por círculo');desactivarHerramientasMapa(false);}}
  }
  function activarTabLiquidacion(nombre){
    document.querySelectorAll('[data-tab-liquidacion]').forEach(boton=>{
      const activa=boton.dataset.tabLiquidacion===nombre;
      boton.classList.toggle('activa',activa);
      boton.setAttribute('aria-selected',String(activa));
    });
    document.querySelectorAll('[data-panel-liquidacion]').forEach(panel=>panel.hidden=panel.dataset.panelLiquidacion!==nombre);
  }
  function cambiarZonaExpediente(){
    const nuevaZona=$('zonaAnalisisExpediente').value;
    const zonaActual=$('zonaActualExpediente').textContent.trim();
    if(nuevaZona===zonaActual)return;
    $('zonaActualExpediente').textContent=nuevaZona;
    $('faseZonaExpediente').textContent=`Análisis de ${nuevaZona.toLowerCase()}`;
    const fila=document.createElement('tr');
    fila.innerHTML=`<td>27/07/2026 · 12:10</td><td>Análisis territorial</td><td><b class="movimiento-actual">Cambio de ámbito</b></td><td>Renzo Vicente</td><td>Transición de ${zonaActual.toLowerCase()} a ${nuevaZona.toLowerCase()} registrada para continuar el análisis.</td>`;
    $('auditoriaExpediente').prepend(fila);
    $('totalMovimientosExpediente').textContent=String($('auditoriaExpediente').children.length);
  }
  const historialTrazabilidad={
    1:{titulo:'1. Planificación',inicio:'01/07/2026',fin:'02/07/2026',usuario:'Renzo',anterior:'Registro',nuevo:'Planificación',estado:'Completado'},
    2:{titulo:'2. Registro de la agrupación',inicio:'03/07/2026',fin:'04/07/2026',usuario:'Renzo',anterior:'Planificación',nuevo:'Registro de la agrupación',estado:'Completado'},
    3:{titulo:'3. Evaluación GIS',inicio:'05/07/2026',fin:'07/07/2026',usuario:'Analista GIS',anterior:'Registro',nuevo:'Evaluación GIS',estado:'Completado'},
    4:{titulo:'4. Validación técnica',inicio:'08/07/2026',fin:'10/07/2026',usuario:'Carolina Jara',anterior:'Evaluación GIS',nuevo:'Validación técnica',estado:'Completado'},
    5:{titulo:'5. Validación concesionaria',inicio:'11/07/2026',fin:'14/07/2026',usuario:'Concesionaria',anterior:'Validación técnica',nuevo:'Validación concesionaria',estado:'Completado'},
    6:{titulo:'6. Programación de obra',inicio:'15/07/2026',fin:'En curso',usuario:'Operaciones',anterior:'Validación concesionaria',nuevo:'Programación de obra',estado:'En curso'},
    7:{titulo:'7. Ejecución de red',inicio:'Pendiente',fin:'Pendiente',usuario:'Sin asignar',anterior:'Programación de obra',nuevo:'Ejecución de red',estado:'No completado'},
    8:{titulo:'8. Liquidación',inicio:'Pendiente',fin:'Pendiente',usuario:'Sin asignar',anterior:'Ejecución de red',nuevo:'Liquidación',estado:'No completado'},
    9:{titulo:'9. Monitoreo',inicio:'Pendiente',fin:'Pendiente',usuario:'Sin asignar',anterior:'Liquidación',nuevo:'Monitoreo',estado:'No completado'}
  };
  function renderHistorialFase(numero){
    const dato=historialTrazabilidad[numero]||historialTrazabilidad[1];
    $('tituloHistorialFase').textContent=`Historial · ${dato.titulo}`;
    const fila=document.createElement('tr');
    fila.innerHTML=`<td>${dato.inicio}</td><td>${dato.fin}</td><td>${dato.usuario}</td><td>${dato.anterior}</td><td>${dato.nuevo}</td><td><select class="estado-historial"><option ${dato.estado==='Completado'?'selected':''}>Completado</option><option ${dato.estado==='En curso'?'selected':''}>En curso</option><option ${dato.estado==='No completado'?'selected':''}>No completado</option></select></td><td><div class="acciones-historial"><button data-accion-historial="editar" title="Editar">✎</button><button class="eliminar" data-accion-historial="eliminar" title="Eliminar">⌫</button><button data-accion-historial="adjuntar" title="Adjuntar PDF">⇧</button></div></td>`;
    $('historialFaseBody').replaceChildren(fila);
  }
  function inicializarTrazabilidad(){
    renderHistorialFase(1);
    $('fasesTrazabilidad').addEventListener('click',e=>{
      const fase=e.target.closest('[data-fase]');if(!fase)return;
      document.querySelectorAll('#fasesTrazabilidad [data-fase]').forEach(x=>x.classList.toggle('activa',x===fase));
      renderHistorialFase(Number(fase.dataset.fase));
    });
    $('registrarExpediente').addEventListener('click',()=>{
      $('nuevoExpCodigo').value=$('trazaCodigo').value;
      $('nuevoExpTipo').value=$('trazaTipo').value;
      $('nuevoExpZona').value=$('trazaZona').value;
      $('formularioExpediente').hidden=false;
      $('formularioExpediente').scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    $('cerrarFormularioExpediente').addEventListener('click',()=>{$('formularioExpediente').hidden=true;});
    $('documentoExpediente').addEventListener('change',e=>{$('nombreDocumentoExpediente').textContent=e.target.files[0]?.name||'Ningún PDF seleccionado';});
    $('guardarExpediente').addEventListener('click',()=>{
      $('trazaCodigo').value=$('nuevoExpCodigo').value||'FISE-2026-001';
      $('estadoFormularioExpediente').textContent=`Expediente ${$('trazaCodigo').value} guardado correctamente en la maqueta.`;
      setTimeout(()=>{$('formularioExpediente').hidden=true;$('estadoFormularioExpediente').textContent='';},900);
    });
    $('historialFaseBody').addEventListener('click',e=>{
      const boton=e.target.closest('[data-accion-historial]');if(!boton)return;
      const fila=boton.closest('tr'),accion=boton.dataset.accionHistorial;
      if(accion==='editar'){
        const editando=fila.classList.toggle('editando');
        Array.from(fila.cells).slice(0,5).forEach(c=>c.contentEditable=String(editando));
        boton.textContent=editando?'✓':'✎';boton.title=editando?'Guardar cambios':'Editar';
      }else if(accion==='eliminar'){
        fila.remove();
      }else $('archivoHistorialFase').click();
    });
    $('archivoHistorialFase').addEventListener('change',e=>{
      const nombre=e.target.files[0]?.name;if(!nombre)return;
      const boton=$('historialFaseBody').querySelector('[data-accion-historial="adjuntar"]');
      if(boton){boton.textContent='✓';boton.title=`Adjunto: ${nombre}`;}
    });
    $('exportarAuditoriaTraza').addEventListener('click',()=>{
      const filas=Object.values(historialTrazabilidad).map(x=>[x.inicio,x.fin,x.usuario,x.anterior,x.nuevo,x.estado].join(';'));
      const blob=new Blob([`Inicio;Fin;Usuario;Estado anterior;Nuevo estado;Estado\n${filas.join('\n')}`],{type:'text/csv;charset=utf-8'});
      const enlace=document.createElement('a');enlace.href=URL.createObjectURL(blob);enlace.download='auditoria-trazabilidad-FISE-2026-001.csv';enlace.click();setTimeout(()=>URL.revokeObjectURL(enlace.href),500);
    });
  }
  function datosLiquidacionProyecto(proyecto){
    const indice=Math.max(0,ciudades.findIndex(item=>item.codigo===proyecto?.codigo));
    const componente=proyecto?.componente||['psr','redes','tc'][indice%3];
    const contratado=Number(proyecto?.montoContratado)||850000+(indice*125000);
    const pagosPrevios=Math.round(contratado*Math.min(.78,Math.max(0,Number(proyecto?.avance||0)/100*.62)));
    const penalidades=proyecto?.estado==='Observado'?Math.round(contratado*.012):0;
    return {proyecto,indice,componente,contratado,pagosPrevios,penalidades,saldo:Math.max(0,contratado-pagosPrevios-penalidades),contratista:proyecto?.empresaContratista||'Empresa especializada GN',interventor:proyecto?.interventor||'Interventor externo FISE',ambito:[proyecto?.departamento,proyecto?.provincia].filter(Boolean).join(' · ')||'Ámbito por definir'};
  }
  function formatoMoneda(valor){return `US$ ${Number(valor||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;}
  function vincularLiquidacionProyecto(codigo){
    const selector=$('liquidacionProyecto');
    const proyecto=ciudades.find(item=>item.codigo===codigo)||proyectoSeleccionado||ciudades[0];
    selector.replaceChildren(...ciudades.map(item=>new Option(`${item.codigo} · ${item.nombre}`,item.codigo)));
    if(!proyecto)return;
    selector.value=proyecto.codigo;
    liquidacionProyectoVinculado=proyecto;
    const datos=datosLiquidacionProyecto(proyecto);
    $('liquidacionTipoProceso').value=datos.componente;
    $('nombreProyectoLiquidacion').textContent=`${proyecto.codigo} · ${proyecto.nombre}`;
    $('responsablesLiquidacion').textContent=`Contratista: ${datos.contratista} · Interventor: ${datos.interventor}`;
    $('montoContratadoLiquidacion').textContent=formatoMoneda(datos.contratado);
    $('pagosPreviosLiquidacion').textContent=formatoMoneda(datos.pagosPrevios);
    $('penalidadesLiquidacion').textContent=formatoMoneda(datos.penalidades);
    $('saldoPendienteLiquidacion').textContent=formatoMoneda(datos.saldo);
    configurarLiquidacionPsr();
  }
  function validarRequisitosLiquidacion(){
    const proceso=$('liquidacionTipoProceso').value;
    if(proceso==='redes'){
      const documentos=[...document.querySelectorAll('[data-documento-redes]')].every(x=>x.checked);
      const ejecutado=Number($('redesMetradoEjecutado').value)||0,asBuilt=Number($('redesMetradoAsBuilt').value)||0;
      const metradoValido=ejecutado>0&&Math.abs(ejecutado-asBuilt)<.01;
      const listo=documentos&&metradoValido;
      $('estadoRequisitosRedes').textContent=listo?'Redes: expediente completo y metrado As-Built validado.':'Redes: complete los 4 sustentos y haga coincidir el metrado ejecutado con el As-Built.';
      return {listo,mensaje:'No se puede generar la liquidación de Redes: faltan sustentos o el metrado no coincide con el As-Built.'};
    }
    if(proceso==='tc'){
      const documentos=[...document.querySelectorAll('[data-documento-tc]')].every(x=>x.checked);
      const suministros=[...document.querySelectorAll('[data-suministro-tc]')];
      const suministrosConformes=suministros.length>0&&suministros.every(x=>x.value==='Habilitado');
      const listo=documentos&&suministrosConformes;
      $('estadoRequisitosTc').textContent=listo?'TC: todos los suministros habilitados y sustentos completos.':'TC: complete los 4 sustentos y asegure que todos los suministros estén habilitados.';
      return {listo,mensaje:'No se puede generar la liquidación de TC: faltan sustentos o existen suministros no habilitados.'};
    }
    const documentos=[...document.querySelectorAll('[data-documento-psr]')].every(x=>x.checked);
    const conforme=['Conforme por interventor','Enviado a Administración','Pagado'].includes($('estadoHitoPsr').value);
    return {listo:documentos&&conforme,mensaje:'No se puede generar la liquidación PSR: complete el expediente y obtenga la conformidad del interventor.'};
  }
  function actualizarLiquidacion(){
    const total=$('liquidacionTotal').checked;
    const campo=$('porcentajeLiquidacion');
    if(total){
      if(!campo.disabled)campo.dataset.parcial=String(Math.min(99,Math.max(1,Number(campo.value)||60)));
      campo.value='100';campo.disabled=true;
    }else if($('liquidacionTipoProceso')?.value!=='psr'){
      if(campo.disabled||Number(campo.value)>=100)campo.value=campo.dataset.parcial||'60';
      campo.disabled=false;campo.value=String(Math.min(99,Math.max(1,Number(campo.value)||60)));
    }
    const porcentaje=Number(campo.value),factor=porcentaje/100;
    if($('liquidacionTipoProceso').value!=='psr'){
      $('etiquetaPorcentajeLiquidacion').firstChild.textContent=total?'% Liquidación total':'% Liquidación parcial';
      $('tituloAnexoLiquidacion').textContent=`ANEXO 1: LIQUIDACIÓN ${total?'TOTAL':'PARCIAL'} DE LAS INVERSIONES EN BIENES DE CAPITAL CON RECURSOS DEL FISE`;
      $('subtituloLiquidacion').textContent=`Reporte de Transferencia ${total?'total':'parcial'} · ${$('referenciaLiquidacion').value}`;
    }
    $('columnaMontoLiquidacion').textContent=total?'Monto total':`Monto parcial (${porcentaje}%)`;
    let suma=0;
    document.querySelectorAll('#partidasLiquidacion .monto-liquidacion').forEach(celda=>{const valor=(Number(celda.dataset.total)||0)*factor;suma+=valor;celda.textContent=`US$ ${valor.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;});
    $('estadoLiquidacion').textContent=`Liquidación ${total?'total':'parcial'} aplicada al ${porcentaje}% · Total: US$ ${suma.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}.`;
    validarRequisitosLiquidacion();
  }
  function filasLiquidacion(){
    return [...document.querySelectorAll('#partidasLiquidacion tr')].map(fila=>{
      const valor=selector=>fila.querySelector(selector)?.value?.trim()||'';
      return {'Código VNR':valor('td:nth-child(1) input'),'Partida':valor('td:nth-child(2) textarea'),'Unidad':valor('td:nth-child(3) input'),'Cantidad':valor('td:nth-child(4) input'),'Tarifa Osinergmin (US$)':valor('td:nth-child(5) input'),'Objeto GIS':valor('td:nth-child(6) input'),'Vinculación GIS':valor('td:nth-child(7) select'),'Monto (US$)':fila.querySelector('.monto-liquidacion')?.textContent.replace('US$','').trim()||'0.00'};
    });
  }
  function configurarLiquidacionPsr(){
    const proceso=$('liquidacionTipoProceso').value,esPsr=proceso==='psr';
    const proyecto=liquidacionProyectoVinculado||proyectoSeleccionado||ciudades[0];
    const datosProyecto=datosLiquidacionProyecto(proyecto);
    const configuraciones={
      redes:{etiquetaCodigo:'Código de agrupación',codigo:`${proyecto.codigo}-RED`,etiquetaReferencia:'Código de malla',referencia:`MALLA-${proyecto.codigo}-RED-001`,etiquetaAmbito:'Concesión',ambito:datosProyecto.ambito},
      tc:{etiquetaCodigo:'Código de solicitud TC',codigo:`${proyecto.codigo}-TC-001`,etiquetaReferencia:'Suministros incluidos',referencia:`${60012000+datosProyecto.indice*10+1} · ${60012000+datosProyecto.indice*10+2}`,etiquetaAmbito:'Ámbito de atención',ambito:datosProyecto.ambito},
      psr:{etiquetaCodigo:'Código de planta',codigo:`PSR-${proyecto.codigo}`,etiquetaReferencia:'Contrato PSR',referencia:proyecto.contrato||'LP-2023-VII · Planta satélite',etiquetaAmbito:'Ubicación de planta',ambito:datosProyecto.ambito}
    };
    const datos=configuraciones[proceso];
    $('etiquetaCodigoLiquidacion').firstChild.textContent=datos.etiquetaCodigo;$('codigoLiquidacion').value=datos.codigo;
    $('etiquetaReferenciaLiquidacion').firstChild.textContent=datos.etiquetaReferencia;$('referenciaLiquidacion').value=datos.referencia;
    $('etiquetaAmbitoLiquidacion').firstChild.textContent=datos.etiquetaAmbito;$('ambitoLiquidacion').value=datos.ambito;
    $('panelHitosPsr').hidden=!esPsr;
    $('panelRedesLiquidacion').hidden=proceso!=='redes';
    $('panelTcLiquidacion').hidden=proceso!=='tc';
    $('comparativoEjecucion').hidden=esPsr;
    const campo=$('porcentajeLiquidacion');
    if(esPsr){
      const hito=$('hitoPsr').value,porcentaje=hito.startsWith('15')?15:Number(hito);
      $('liquidacionTotal').checked=false;$('liquidacionTotal').disabled=true;
      campo.value=String(porcentaje);campo.disabled=true;
      $('etiquetaPorcentajeLiquidacion').firstChild.textContent='% del hito contractual';
      $('tituloAnexoLiquidacion').textContent='LIQUIDACIÓN PSR-GNL · PAGO POR HITO CONTRACTUAL';
      $('subtituloLiquidacion').textContent=`Hito ${hito} · Requiere expediente completo y conformidad del interventor.`;
      $('columnaMontoLiquidacion').textContent=`Monto del hito (${porcentaje}%)`;
      const documentos=[...document.querySelectorAll('[data-documento-psr]')].every(x=>x.checked);
      const estado=$('estadoHitoPsr').value;
      const conforme=['Conforme por interventor','Enviado a Administración','Pagado'].includes(estado);
      $('mensajeHitoPsr').textContent=documentos&&conforme?'Expediente completo: habilitado para enviar a Administración.':'Complete documentos y obtenga la conformidad del interventor.';
    }else{$('liquidacionTotal').disabled=false;campo.disabled=false;}
    actualizarLiquidacion();
  }
  function actualizarFlujoPsr(paso){
    const pasos=[...$('lineaTiempoPsr').querySelectorAll('li')];
    pasos.forEach((item,indice)=>{item.classList.toggle('completado',indice<paso-1);item.classList.toggle('actual',indice===paso-1);});
    const textos=['En preparación','Enviado a interventor','Conforme por interventor','Informe FISE en elaboración','Transferencia programada','Pagado'];
    $('estadoExpedientePsr').textContent=textos[paso-1];$('estadoHitoPsr').value=paso===1?'Presentado por contratista':paso===3?'Conforme por interventor':paso===5?'Enviado a Administración':paso===6?'Pagado':'En preparación';
    $('hitoActualPsr').textContent=`${Math.min(5,Math.max(1,paso))} de 5`;
    if(paso===6){$('montoPagadoPsr').textContent='US$ 100,000';$('saldoPsr').textContent='US$ 900,000';$('alertaPsr').textContent='Pago registrado';}
    else if(paso===4)$('alertaPsr').textContent='Informe FISE: vence en 5 días';
    configurarLiquidacionPsr();
  }
  function registrarObservacionPsr(){
    const lista=$('listaObservacionesPsr');lista.querySelector('.vacio-observaciones-psr')?.remove();
    const item=document.createElement('article');item.className='item-observacion-psr';item.innerHTML='<div><strong>Observación pendiente</strong><small>Interventor · Hoy</small></div><input placeholder="Describa la no conformidad"><input type="date"><select><option>Observada</option><option>En subsanación</option><option>Subsanada</option></select><button type="button">Guardar</button>';
    lista.append(item);$('estadoHitoPsr').value='Observado';$('alertaPsr').textContent='Existe una observación pendiente';configurarLiquidacionPsr();
  }
  function exportarLiquidacionCsv(){
    const filas=filasLiquidacion(),columnas=Object.keys(filas[0]||{}),celda=valor=>`"${String(valor??'').replaceAll('"','""')}"`;
    descargarArchivo('\ufeff'+[columnas.map(celda).join(','),...filas.map(fila=>columnas.map(columna=>celda(fila[columna])).join(','))].join('\n'),'liquidacion-masificacion.csv','text/csv;charset=utf-8');
    $('estadoLiquidacion').textContent='CSV de la liquidación generado correctamente.';
  }
  function exportarLiquidacionPdf(){
    const requisitos=validarRequisitosLiquidacion();
    if(!requisitos.listo){$('estadoLiquidacion').textContent=requisitos.mensaje;return;}
    const Pdf=window.jspdf?.jsPDF;if(!Pdf){$('estadoLiquidacion').textContent='No se pudo cargar el generador PDF.';return;}
    const filas=filasLiquidacion(),pdf=new Pdf({orientation:'landscape'}),total=$('liquidacionTotal').checked?'total':'parcial',porcentaje=$('porcentajeLiquidacion').value;
    pdf.setFontSize(16);pdf.text('MASIFICACIÓN · LIQUIDACIÓN DE INVERSIONES FISE',14,17);
    pdf.setFontSize(9);pdf.text(`Agrupación: ${$('modalLiquidaciones input').value} · Liquidación ${total}: ${porcentaje}%`,14,24);
    const columnas=Object.keys(filas[0]||{});
    if(typeof pdf.autoTable==='function')pdf.autoTable({startY:30,head:[columnas],body:filas.map(fila=>columnas.map(columna=>fila[columna])),styles:{fontSize:6,cellPadding:2},headStyles:{fillColor:[54,121,147]}});
    pdf.save('liquidacion-masificacion.pdf');$('estadoLiquidacion').textContent='PDF de la liquidación generado correctamente.';
  }
  function activarHerramienta(nombre,boton){
    if(nombre==='area-proyecto'){
      capaDibujo.clearLayers();geometriaProyectoBorrador=null;$('accionesGeometriaMapa').hidden=true;
      dibujoProyectoPendiente={modo:'captura',forma:'poligono'};
      herramientaActiva='poligono';puntosDibujo=[];centroCirculo=null;figuraTemporal=null;
      document.querySelectorAll('[data-herramienta]').forEach(b=>b.classList.toggle('activo',b===boton));
      mapa.doubleClickZoom.disable();mapa.getContainer().classList.add('modo-dibujo');return;
    }
    if(nombre==='liquidaciones'){vincularLiquidacionProyecto(proyectoSeleccionado?.codigo);activarTabLiquidacion('liquidacion');$('modalLiquidaciones').showModal();return;}
    if(nombre==='informes'){$('modalInformes').showModal();return;}
    if(nombre==='ampliar'){$('barraHerramientas').classList.toggle('ampliada');return;}if(nombre==='opciones'||nombre==='mover')return;
    herramientaActiva=herramientaActiva===nombre?null:nombre;
    document.querySelectorAll('[data-herramienta]').forEach(b=>b.classList.toggle('activo',b.dataset.herramienta===herramientaActiva));
    puntosDibujo=[];centroCirculo=null;figuraTemporal=null;capaDibujo.clearLayers();
    const dibujando=['poligono','circulo'].includes(herramientaActiva);
    if(dibujando)mapa.doubleClickZoom.disable();else mapa.doubleClickZoom.enable();
    mapa.getContainer().classList.toggle('modo-dibujo',dibujando);
  }
  function restablecerTodo(){
    limpiarSeleccion();cerrarProyecto();herramientaActiva=null;document.querySelectorAll('[data-herramienta]').forEach(b=>b.classList.remove('activo'));
    mapa.doubleClickZoom.enable();mapa.getContainer().classList.remove('modo-dibujo');mapa.setView([-10.6,-75.2],5);
  }
  function actualizar() {
    const datos=filtrados();
    capaProyectos.clearLayers();
    capaManzanas.clearLayers(); capaPredios.clearLayers(); capaInfluencia.clearLayers();
    let totalPredios=0, totalConcesionario=0, totalManzanas=0;
    // El cambio de cartografía modifica el trazado, no la presencia de los proyectos.
    // Así se conservan los íconos y los puntos de referencia del mapa principal.
    datos.forEach((p,i)=>{
      const desplazamiento=.055+(i%3)*.012;
      const factorVersion=versionCartograficaActiva==='asbuilt'?1:.64;
      const puntos=[[p.lat,p.lng-desplazamiento*factorVersion],[p.lat+.025*factorVersion,p.lng-.018*factorVersion],[p.lat-.012*factorVersion,p.lng+.025*factorVersion],[p.lat+.015*factorVersion,p.lng+desplazamiento*factorVersion]];
      const colorVersion=versionCartograficaActiva==='asbuilt'?(colores[p.estado]||'#3fac79'):'#4e7de1';
      const etapaMapa=fasePrincipalProyecto(p,i);
      const estiloFase=fasesMapa[etapaMapa]||fasesMapa.Proyecto;
      const linea=L.polyline(puntos,{color:colorVersion,weight:versionCartograficaActiva==='asbuilt'?7:4,opacity:versionCartograficaActiva==='asbuilt'?.9:.82,dashArray:versionCartograficaActiva==='asbuilt'?null:'10 8',className:`tramo-red ${versionCartograficaActiva==='asbuilt'?'tramo-asbuilt':'tramo-planificacion'}`}).bindTooltip(`${p.codigo} · ${p.nombre}<br>Etapa: ${etapaMapa} · ${p.avance}%`);
      linea.on('click',e=>{
        if(['poligono','circulo'].includes(herramientaActiva)){clickDibujo(e);return;}
        subproyectoSeleccionado='';
        delete p.faseSeleccionada;
        mostrarDetalle(p);
      }); capaProyectos.addLayer(linea);
      const icono=L.divIcon({className:'marcador-proyecto',html:`<span class="marcador-proyecto-con-etapa" title="Fase: ${etapaMapa}"><span class="icono-proyecto-mapa ${versionCartograficaActiva==='asbuilt'?'asbuilt':'planificacion'}" style="--color-proyecto:${estiloFase.color}">${iconoProyecto}<small>${estiloFase.abreviatura}</small></span></span>`,iconSize:[46,46],iconAnchor:[23,23]});
      const punto=L.marker([p.lat,p.lng],{icon:icono}).bindTooltip(`${p.codigo} · ${p.nombre}<br>Etapa: ${etapaMapa}`).on('click',e=>{
        if(['poligono','circulo'].includes(herramientaActiva)){clickDibujo(e);return;}
        subproyectoSeleccionado='';
        delete p.faseSeleccionada;
        mostrarDetalle(p);
      });
      capaProyectos.addLayer(punto);
      const manzanas=3+(i%4), predios=manzanas*(18+(i%5)*3), concesionario=Math.round(predios*(1.08+(i%3)*.035));
      totalManzanas+=manzanas; totalPredios+=predios; totalConcesionario+=concesionario;
      capaInfluencia.addLayer(L.circle([p.lat,p.lng],{radius:6500+(i%3)*1500,className:'area-influencia'}).bindTooltip(`Área de influencia · ${p.nombre}`));
      const estratosProyecto=estratosCercanosAlProyecto(p).slice(0,90);
      if(estratosProyecto.length){
        estratosProyecto.forEach((feature,indice)=>{
          const capa=L.geoJSON(feature,{style:estiloEstratoInei,interactive:false});
          capa.eachLayer(layer=>capaManzanas.addLayer(layer));
          const centro=centroGeometria(feature);
          if(!centro)return;
          for(let u=0;u<3;u++){
            const normal=(u+indice+i)%3===0;
            capaPredios.addLayer(L.circleMarker([centro.lat+(u-1)*.0007,centro.lng+(u-1)*.00055],{radius:3.2,color:'#fff',weight:1,fillColor:normal?'#2f9d78':'#7655a8',fillOpacity:.95,className:normal?'predio-normal':'predio-potencial'}).bindTooltip(normal?'Beneficiario registrado':'Beneficiario potencial'));
          }
        });
      } else {
      const manzanasProyecto=manzanasUrbanas.filter(feature=>feature?.properties?.proyecto===p.codigo);
      if(manzanasProyecto.length){
        manzanasProyecto.forEach((feature,indice)=>{
          const capa=L.geoJSON(feature,{style:estiloManzanaReal(feature),onEachFeature:(f,l)=>l.bindTooltip(`Manzana ${f.properties?.CODMZ || f.properties?.LLAVE_IDMANZANA || indice+1} · ${f.properties?.NOMBCCPP || f.properties?.NOMDIST || 'INEI'}`)});
          capa.eachLayer(layer=>capaManzanas.addLayer(layer));
          const conteoPredios=Math.max(4,Math.round(predios/Math.max(1,manzanasProyecto.length)));
          const centro=feature.geometry?.coordinates?.[0]?.[0] || [];
          const baseLat=centro[1] || p.lat;
          const baseLng=centro[0] || p.lng;
          for(let u=0;u<Math.min(6,conteoPredios);u++){
            const normal=(u+indice+i)%3===0;
            capaPredios.addLayer(L.circleMarker([baseLat-.004+(u%3)*.004,baseLng-.008+Math.floor(u/3)*.010],{radius:3.2,color:'#fff',weight:1,fillColor:normal?'#2f9d78':'#7655a8',fillOpacity:.95,className:normal?'predio-normal':'predio-potencial'}).bindTooltip(normal?'Beneficiario registrado':'Beneficiario potencial'));
          }
        });
      } else {
        for(let m=0;m<manzanas;m++){
          const fila=Math.floor(m/2), col=m%2, lat=p.lat+.018+(fila*.017), lng=p.lng-.035+(col*.04);
          const caja=[lng-.012,lat-.007,lng+.012,lat+.007];
          capaManzanas.addLayer(L.polygon(anilloALatLng(poligonoOrganicoDesdeCaja(caja, `${p.codigo}-${m}`)),{className:'manzana-potencial',color:'#7cc990',weight:1.1,fillColor:'#7ad38b',fillOpacity:.55,smoothFactor:1.4,interactive:false}).bindTooltip(`Manzana ${m+1} · ${Math.round(predios/manzanas)} predios`));
          for(let u=0;u<Math.min(6,Math.round(predios/manzanas));u++){
            const normal=(u+m+i)%3===0;
            capaPredios.addLayer(L.circleMarker([lat-.004+(u%3)*.004,lng-.008+Math.floor(u/3)*.010],{radius:3.2,color:'#fff',weight:1,fillColor:normal?'#2f9d78':'#7655a8',fillOpacity:.95,className:normal?'predio-normal':'predio-potencial'}).bindTooltip(normal?'Beneficiario registrado':'Beneficiario potencial'));
          }
        }
      }
      }
    });
    $('contadorMapa').textContent=`${datos.length} proyectos visibles`;
    $('kpiTotal').textContent=datos.length;
    const km=e=>datos.filter(x=>x.estado===e).reduce((s,x)=>s+x.longitud,0).toFixed(1)+' km';
    $('kpiInstalada').textContent=km('Instalada'); $('kpiEjecucion').textContent=km('En ejecución'); $('kpiProyectada').textContent=km('Proyectada');
    $('kpiResidenciales').textContent=totalPredios.toLocaleString('es-PE');
    $('kpiConcesionario').textContent=totalConcesionario.toLocaleString('es-PE');
    $('kpiManzanas').textContent=totalManzanas;
    $('kpiCobertura').textContent=(datos.length?Math.round(datos.reduce((s,x)=>s+x.avance,0)/datos.length):0)+'%';
    $('listaAvance').replaceChildren(...datos.slice(0,6).map(p=>{const d=document.createElement('div');d.className='avance-item';d.innerHTML=`<span>${p.distrito}</span><span class="barra-avance"><i style="width:${p.avance}%"></i></span><b>${p.avance}%</b>`;return d;}));
    renderBarraProyectos();
  }

  function calcularPotencial() {
    const proyectos=filtrados();
    const filas=proyectos.slice(0,8).map((p,i)=>{
      const manzanas=3+(i%4),predios=manzanas*(18+(i%5)*3),cobertura=Math.round(predios*(.72+(i%3)*.06)),concesionario=Math.max(3,Math.round(predios*(.16+(i%2)*.04)));
      return {manzana:`${p.codigo} · MZ-${String(i+1).padStart(2,'0')}`,predios,cobertura,concesionario,potenciales:Math.round(cobertura+concesionario*.72)};
    });
    return {
      filas,
      predios:filas.reduce((s,f)=>s+f.predios,0),
      residenciales:filas.reduce((s,f)=>s+f.cobertura,0),
      concesionario:filas.reduce((s,f)=>s+f.concesionario,0),
      potenciales:filas.reduce((s,f)=>s+f.potenciales,0)
    };
  }

  function abrirModalPotencial() {
    const resumen=calcularPotencial();
    $('kpiPrediosAnalizados').textContent=resumen.predios.toLocaleString('es-PE');
    $('kpiResidenciales').textContent=resumen.residenciales.toLocaleString('es-PE');
    $('kpiConcesionario').textContent=resumen.concesionario.toLocaleString('es-PE');
    $('kpiPotenciales').textContent=resumen.potenciales.toLocaleString('es-PE');
    $('tablaPotencial').replaceChildren(...resumen.filas.map(f=>{
      const tr=document.createElement('tr');
      [f.manzana,f.predios,f.cobertura,f.concesionario,f.potenciales].forEach(valor=>{const td=document.createElement('td');td.textContent=valor;tr.append(td);});
      return tr;
    }));
    $('modalPotencial').showModal();
  }

  function filaProyecto(p) {
    return {
      Código:p.codigo||'—',
      Tipo:p.tipo||'Proyecto',
      Nombre:p.nombre||'—',
      Departamento:p.departamento||'—',
      Provincia:p.provincia||'—',
      Distrito:p.distrito||p.detalle||'—',
      Estado:p.estado||p.detalle||'—',
      Avance:p.avance!==undefined?`${p.avance}%`:'—',
      'Longitud de red':p.longitud!==undefined?`${p.longitud} km`:'—',
      Latitud:Number.isFinite(p.lat)?p.lat.toFixed(5):'—',
      Longitud:Number.isFinite(p.lng)?p.lng.toFixed(5):'—'
    };
  }

  function obtenerAlcanceExportacion() {
    if(seleccionMapa.length){
      return {alcance:$('tituloSeleccion').textContent||'Selección realizada en el mapa',datos:seleccionMapa.map(item=>filaProyecto(ciudades.find(p=>p.codigo===item.codigo)||item))};
    }
    if(beneficiarioSeleccionadoMasificacion){
      return {alcance:'Beneficiario potencial seleccionado',datos:[filaProyecto(beneficiarioSeleccionadoMasificacion)]};
    }
    if(proyectoSeleccionado){
      return {alcance:'Proyecto seleccionado',datos:[filaProyecto(proyectoSeleccionado)]};
    }
    return {alcance:'Todos los proyectos filtrados',datos:filtrados().map(filaProyecto)};
  }

  function abrirModalExportacion() {
    const resultado=obtenerAlcanceExportacion();
    datosExportacionActual=resultado.datos;
    $('alcanceExportacionMasificacion').textContent=resultado.alcance;
    $('cantidadExportacionMasificacion').textContent=datosExportacionActual.length.toLocaleString('es-PE');
    $('descripcionExportacionMasificacion').textContent=`${resultado.alcance}. El archivo incluirá únicamente ${datosExportacionActual.length} registro(s).`;
    if($('modalPotencial').open)$('modalPotencial').close();
    $('modalExportacionMasificacion').showModal();
  }

  function descargarArchivo(contenido,nombre,tipo) {
    const enlace=document.createElement('a');
    enlace.href=URL.createObjectURL(new Blob([contenido],{type:tipo}));
    enlace.download=nombre;
    enlace.click();
    setTimeout(()=>URL.revokeObjectURL(enlace.href),800);
  }

  function exportarCsvMasificacion(datos) {
    const columnas=Object.keys(datos[0]||{Código:''});
    const escapar=v=>`"${String(v??'').replaceAll('"','""')}"`;
    const csv=[columnas.map(escapar).join(','),...datos.map(f=>columnas.map(c=>escapar(f[c])).join(','))].join('\n');
    descargarArchivo('\ufeff'+csv,'reporte_masificacion.csv','text/csv;charset=utf-8');
  }

  function exportarXlsxMasificacion(datos) {
    if(!window.XLSX){exportarCsvMasificacion(datos);return;}
    const libro=XLSX.utils.book_new(),hoja=XLSX.utils.json_to_sheet(datos);
    hoja['!cols']=Object.keys(datos[0]||{}).map(c=>({wch:Math.max(14,c.length+3)}));
    XLSX.utils.book_append_sheet(libro,hoja,'Masificación');
    XLSX.writeFile(libro,'reporte_masificacion.xlsx');
  }

  function exportarPdfMasificacion(datos) {
    if(!window.jspdf?.jsPDF){window.print();return;}
    const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape'});
    const columnas=Object.keys(datos[0]||{Código:''});
    doc.setTextColor(28,42,72);doc.setFontSize(17);doc.text('MASIFICACIÓN · Reporte de selección',14,18);
    doc.setFontSize(9);doc.setTextColor(93,108,132);doc.text(`Alcance: ${$('alcanceExportacionMasificacion').textContent}`,14,25);
    doc.text(`Registros: ${datos.length} · Fecha: ${new Date().toLocaleDateString('es-PE')}`,14,31);
    doc.autoTable({startY:37,head:[columnas],body:datos.map(f=>columnas.map(c=>f[c])),styles:{fontSize:7,cellPadding:2},headStyles:{fillColor:[47,137,171]},alternateRowStyles:{fillColor:[239,246,250]}});
    doc.save('reporte_masificacion.pdf');
  }

  function confirmarExportacionMasificacion() {
    if(!datosExportacionActual.length)return;
    const formato=document.querySelector('input[name="formatoExportacionMasificacion"]:checked')?.value||'pdf';
    if(formato==='csv')exportarCsvMasificacion(datosExportacionActual);
    else if(formato==='xlsx')exportarXlsxMasificacion(datosExportacionActual);
    else exportarPdfMasificacion(datosExportacionActual);
    $('modalExportacionMasificacion').close();
  }

  function tipoInformeSupervisionActivo() {
    return document.querySelector('[data-tipo-supervision].activo')?.dataset.tipoSupervision || 'diario';
  }

  const evidenciasMovilSupervision = [
    {id:'movil-1',src:'documentos/evidencias-movil/evidencia-1.jpg',titulo:'Charla de seguridad',detalle:'Registro de inducción de la cuadrilla',incluida:true},
    {id:'movil-2',src:'documentos/evidencias-movil/evidencia-2.jpg',titulo:'Prueba de hermeticidad',detalle:'Carpa primaria · Cusco',incluida:true},
    {id:'movil-3',src:'documentos/evidencias-movil/evidencia-3.jpg',titulo:'Control de presión',detalle:'Línea PEAD · 7.8 bar',incluida:true},
    {id:'movil-4',src:'documentos/evidencias-movil/evidencia-4.jpg',titulo:'Frente secundario',detalle:'Verificación previa a gasificación',incluida:true},
    {id:'movil-5',src:'documentos/evidencias-movil/evidencia-5.jpg',titulo:'Lectura de manómetro',detalle:'Control georreferenciado',incluida:true},
    {id:'movil-6',src:'documentos/evidencias-movil/evidencia-6.jpg',titulo:'Área de trabajo',detalle:'Señalización y control de acceso',incluida:true}
  ];
  let evidenciasCargadasSupervision=[];
  let reportesGeneradosSupervision=[];

  function renderizarReportesSupervision() {
    const lista=$('listaReportesSupervision');
    if(!lista)return;
    $('contadorReportesSupervision').textContent=`${reportesGeneradosSupervision.length} PDF${reportesGeneradosSupervision.length===1?'':'s'}`;
    if(!reportesGeneradosSupervision.length){
      lista.innerHTML='<tr class="sin-reportes-supervision"><td colspan="5">Aún no hay reportes PDF generados.</td></tr>';
      return;
    }
    lista.innerHTML=reportesGeneradosSupervision.map((reporte,indice)=>`<tr><td><strong>${reporte.numero}</strong><small>${reporte.proyecto}</small></td><td><span class="tipo-reporte-supervision ${reporte.tipo}">${reporte.tipo==='diario'?'IDT diario':'ISO semanal'}</span></td><td>${reporte.fecha}</td><td><span class="estado-reporte-supervision">PDF generado</span></td><td><button type="button" class="ver-reporte-supervision" data-reporte-supervision="${indice}" aria-label="Ver ${reporte.numero}" title="Ver PDF">◉</button></td></tr>`).join('');
    lista.querySelectorAll('[data-reporte-supervision]').forEach(boton=>boton.addEventListener('click',()=>{
      const reporte=reportesGeneradosSupervision[Number(boton.dataset.reporteSupervision)];
      if(!reporte)return;
      $('tituloVistaPdfSupervision').textContent=reporte.numero;
      $('subtituloVistaPdfSupervision').textContent=`${reporte.tipo==='diario'?'Informe diario IDT':'Informe semanal ISO'} · ${reporte.fecha}`;
      $('visorPdfSupervision').src=reporte.url;
      $('modalVistaPdfSupervision').showModal();
    }));
  }

  function renderizarGaleriaSupervision() {
    const galeria=$('galeriaFotosSupervision');
    if(!galeria)return;
    const movil=evidenciasMovilSupervision.map(f=>`<article class="evidencia-movil ${f.incluida?'incluida':'descartada'}" data-evidencia-id="${f.id}"><div><img src="${f.src}" alt="${f.titulo}"><span>GPS · Cusco</span></div><footer><strong>${f.titulo}</strong><small>${f.detalle}</small><button type="button" aria-pressed="${f.incluida}">${f.incluida?'✓ Incluir':'Restaurar'}</button></footer></article>`).join('');
    const cargadas=evidenciasCargadasSupervision.map(f=>`<article class="evidencia-movil ${f.incluida?'incluida':'descartada'}" data-evidencia-id="${f.id}"><div><img src="${f.src}" alt="${f.titulo}"><span>CARGA MANUAL</span></div><footer><strong>${f.titulo}</strong><small>Fotografía agregada al informe</small><button type="button" aria-pressed="${f.incluida}">${f.incluida?'✓ Incluir':'Restaurar'}</button></footer></article>`).join('');
    galeria.innerHTML=movil+cargadas;
    galeria.querySelectorAll('[data-evidencia-id] button').forEach(b=>b.addEventListener('click',()=>{
      const id=b.closest('[data-evidencia-id]').dataset.evidenciaId;
      const foto=[...evidenciasMovilSupervision,...evidenciasCargadasSupervision].find(f=>f.id===id);
      if(foto)foto.incluida=!foto.incluida;
      renderizarGaleriaSupervision();
    }));
  }

  function cargarFotosManualesSupervision() {
    evidenciasCargadasSupervision.forEach(f=>URL.revokeObjectURL(f.src));
    evidenciasCargadasSupervision=[...($('supervisionFotos')?.files||[])].map((file,i)=>({id:`manual-${i}`,src:URL.createObjectURL(file),titulo:file.name,incluida:true,file}));
    renderizarGaleriaSupervision();
    $('estadoInformeSupervision').textContent=`${evidenciasCargadasSupervision.length} fotografía(s) manual(es) listas para revisar.`;
  }

  function configurarInformeSupervision(tipo) {
    document.querySelectorAll('[data-tipo-supervision]').forEach(b=>b.classList.toggle('activo',b.dataset.tipoSupervision===tipo));
    $('vistaInformeDiario').hidden=tipo!=='diario';
    $('vistaInformeSemanal').hidden=tipo!=='semanal';
    $('campoFechaSupervision').hidden=tipo!=='diario';
    $('campoPeriodoSupervision').hidden=tipo!=='semanal';
    $('supervisionNumero').value=tipo==='diario'?'END-IDT-RED-CU-259-G1-25-07-2026':'ISO-CU-REDES-039';
    $('estadoInformeSupervision').textContent=tipo==='diario'?'Informe diario listo para editar.':'Informe semanal listo para editar.';
  }

  let mesCalendarioInformes=new Date(2026,8,1);
  const eventosCalendarioInformes=[
    ['2026-09-01','IDT diario','diario'],['2026-09-02','IDT diario','diario'],['2026-09-04','ISO semanal','semanal'],
    ['2026-09-07','IDT diario','diario'],['2026-09-08','IDT diario','diario'],['2026-09-11','ISO semanal','semanal'],
    ['2026-09-14','IDT diario','diario'],['2026-09-16','IDT diario','diario'],['2026-09-18','ISO semanal','semanal'],
    ['2026-09-21','IDT diario','diario'],['2026-09-23','IDT diario','diario'],['2026-09-25','ISO semanal','semanal'],
    ['2026-09-28','IDT diario','diario'],['2026-09-30','IDT diario','diario'],['2026-10-02','ISO semanal','semanal']
  ].map(([fecha,titulo,tipo])=>({fecha,titulo,tipo}));

  function claveFechaCalendario(anio,mes,dia) {
    return `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  }

  function renderizarCalendarioInformes() {
    const contenedor=$('diasCalendarioInformes');
    if(!contenedor) return;
    const anio=mesCalendarioInformes.getFullYear();
    const mes=mesCalendarioInformes.getMonth();
    $('mesCalendarioInformes').textContent=new Intl.DateTimeFormat('es-PE',{month:'long',year:'numeric'}).format(mesCalendarioInformes);
    const primerDia=new Date(anio,mes,1);
    const inicio=new Date(anio,mes,1-primerDia.getDay());
    const hoy=new Date();
    contenedor.replaceChildren(...Array.from({length:42},(_,indice)=>{
      const fecha=new Date(inicio.getFullYear(),inicio.getMonth(),inicio.getDate()+indice);
      const esDelMes=fecha.getMonth()===mes;
      const eventos=eventosCalendarioInformes.filter(evento=>evento.fecha===claveFechaCalendario(fecha.getFullYear(),fecha.getMonth(),fecha.getDate()));
      const dia=document.createElement('article');
      dia.className=`dia-calendario-informe${esDelMes?'':' fuera-mes'}${fecha.toDateString()===hoy.toDateString()?' hoy':''}`;
      dia.innerHTML=`<span class="numero-dia-calendario">${fecha.getDate()}</span>${eventos.map(evento=>`<span class="evento-calendario-informe ${evento.tipo}" title="${evento.titulo}">${evento.titulo}</span>`).join('')}`;
      return dia;
    }));
  }

  function abrirInformesSupervision() {
    const selector=$('supervisionProyecto');
    selector.replaceChildren(...ciudades.map(p=>new Option(`${p.codigo} · ${p.nombre}`,p.codigo)));
    selector.value=proyectoSeleccionado?.codigo||ciudades[0]?.codigo||'';
    configurarInformeSupervision('diario');
    renderizarGaleriaSupervision();
    renderizarReportesSupervision();
    renderizarCalendarioInformes();
    $('modalInformesSupervision').showModal();
  }

  function filasInformeSupervision(tipo) {
    const proyecto=ciudades.find(p=>p.codigo===$('supervisionProyecto').value)||proyectoActual();
    const base={Proyecto:`${proyecto.codigo} · ${proyecto.nombre}`,Departamento:proyecto.departamento,Provincia:proyecto.provincia,Distrito:proyecto.distrito,Informe:$('supervisionNumero').value};
    if(tipo==='diario') return [
      {...base,Sección:'Avance constructivo',Indicador:'Red construida',Valor:'24,994.94 ml',Estado:'Completado'},
      {...base,Sección:'Gasificación',Indicador:'Red gasificada',Valor:'19,277.37 ml',Estado:'En seguimiento'},
      {...base,Sección:'Observaciones',Indicador:'RNC abiertas / cerradas',Valor:'5 / 9',Estado:'14 total'},
      {...base,Sección:'Recursos',Indicador:'Personal / equipos',Valor:'29 / 6',Estado:'Registrado'},
      {...base,Sección:'Seguridad',Indicador:'Incidentes / accidentes',Valor:'0 / 0',Estado:'Sin novedades'},
      {...base,Sección:'Evidencias',Indicador:'Registro fotográfico',Valor:'22 fotos',Estado:'Georreferenciado'}
    ];
    return [
      {...base,Sección:'Avance contractual',Indicador:'Fase 1 + 2',Valor:'100%',Estado:'Concluido'},
      {...base,Sección:'Construcción',Indicador:'Red construida',Valor:'24,994.94 ml',Estado:'32 mallas'},
      {...base,Sección:'Gasificación',Indicador:'Red gasificada',Valor:'19,277.37 ml',Estado:'77.13%'},
      {...base,Sección:'Reposición',Indicador:'Metraje repuesto',Valor:'18,244.23 ml',Estado:'92.84%'},
      {...base,Sección:'Programación',Indicador:'SPI',Valor:'1.00',Estado:'Según programa'},
      {...base,Sección:'Pendiente',Indicador:'Gasificación restante',Valor:'5,717.57 ml',Estado:'Programado'},
      {...base,Sección:'Recursos',Indicador:'Personal',Valor:'44',Estado:'Registrado'}
    ];
  }

  function exportarSupervisionCsv() {
    const tipo=tipoInformeSupervisionActivo(),filas=filasInformeSupervision(tipo),columnas=Object.keys(filas[0]);
    const celda=v=>`"${String(v??'').replaceAll('"','""')}"`;
    descargarArchivo('\ufeff'+[columnas.map(celda).join(','),...filas.map(f=>columnas.map(c=>celda(f[c])).join(','))].join('\n'),`informe_supervision_${tipo}.csv`,'text/csv;charset=utf-8');
    $('estadoInformeSupervision').textContent='CSV generado correctamente.';
  }

  function recursoADataUrl(recurso) {
    if(recurso.file)return new Promise((resolve,reject)=>{const lector=new FileReader();lector.onload=()=>resolve(lector.result);lector.onerror=reject;lector.readAsDataURL(recurso.file);});
    return fetch(recurso.src).then(r=>r.blob()).then(blob=>new Promise((resolve,reject)=>{const lector=new FileReader();lector.onload=()=>resolve(lector.result);lector.onerror=reject;lector.readAsDataURL(blob);}));
  }

  async function exportarSupervisionPdf(evento) {
    if(evento&&!evento.isTrusted)return;
    if(!window.jspdf?.jsPDF){$('estadoInformeSupervision').textContent='No se pudo cargar el generador PDF.';return;}
    const tipo=tipoInformeSupervisionActivo(),proyecto=ciudades.find(p=>p.codigo===$('supervisionProyecto').value)||proyectoActual();
    const valor=id=>$(id)?.value?.trim()||'';
    const fecha=tipo==='diario'?valor('supervisionFecha'):valor('supervisionPeriodo');
    const titulo=tipo==='diario'?'INFORME DIARIO DE TRABAJO - IDT':'INFORME SEMANAL DE TRABAJO - ISO';
    const formato=tipo==='diario'?'END-FPY-FI-04':'END-FPY-FI-05';
    const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    $('estadoInformeSupervision').textContent='Generando el informe con los datos y fotografías seleccionadas...';
    const azul=[36,74,121],naranja=[221,107,26],gris=[92,98,108],claro=[243,246,250];
    const cabecera=(hoja,subtitulo='ESPECIALIDAD CIVIL - MECÁNICA - SEGURIDAD')=>{
      doc.setDrawColor(90);doc.setLineWidth(.25);doc.rect(14,10,182,31);
      doc.setFont('helvetica','bold');doc.setTextColor(...naranja);doc.setFontSize(18);doc.text('END',18,22);
      doc.setTextColor(20);doc.setFontSize(7);doc.text('FISE',42,22);
      doc.setFillColor(...naranja);doc.rect(55,10,90,6,'F');doc.setTextColor(255);doc.setFontSize(6);doc.text('FORMATO',100,14,{align:'center'});
      doc.setTextColor(20);doc.setFontSize(8);doc.text(titulo,100,23,{align:'center'});doc.setFontSize(5.5);doc.text(formato,171,14,{align:'center'});doc.text(`HOJA ${hoja}`,171,21,{align:'center'});
      doc.setFillColor(...gris);doc.rect(14,42,182,13,'F');doc.setTextColor(255);doc.setFontSize(5.6);doc.text(`PROYECTO: ${proyecto.nombre}`.slice(0,95),17,47);doc.text(`INFORME: ${valor('supervisionNumero')}`,112,47);doc.text(`CONTRATISTA: ${valor('supervisionContratista')}`,17,52);doc.text(`FECHA / PERIODO: ${fecha}`,112,52);
      doc.setFillColor(...azul);doc.rect(14,56,182,5,'F');doc.setTextColor(255);doc.setFontSize(6);doc.text(subtitulo,105,59.5,{align:'center'});
    };
    const pie=()=>{doc.setDrawColor(170);doc.line(14,284,196,284);doc.setTextColor(80);doc.setFontSize(5.5);doc.text(`${valor('supervisionSupervisor')} · ${valor('supervisionCliente')}`,14,288);doc.text(valor('supervisionNumero'),196,288,{align:'right'});};
    cabecera(1);
    doc.autoTable({startY:64,margin:{left:14,right:14},theme:'grid',styles:{fontSize:6,cellPadding:2,textColor:[22,30,45],lineColor:[170,176,185]},headStyles:{fillColor:azul,textColor:255,fontStyle:'bold'},head:[['DATOS GENERALES','VALOR','DATOS DE CONTROL','VALOR']],body:[
      ['Supervisión',valor('supervisionSupervisor'),'Lugar',valor('supervisionLugar')],['Cliente',valor('supervisionCliente'),'Avance civil',valor('supervisionAvanceCivil')],['Contratista',valor('supervisionContratista'),'Avance mecánico',valor('supervisionAvanceMecanico')],['Proyecto',proyecto.codigo,'Personal / equipos',`${valor('supervisionPersonal')} / ${valor('supervisionEquipos')}`],['Fecha / periodo',fecha,'Incidentes / accidentes',`${valor('supervisionIncidentes')} / ${valor('supervisionAccidentes')}`]
    ]});
    let y=doc.lastAutoTable.finalY+6;
    doc.setFillColor(...azul);doc.rect(14,y,182,6,'F');doc.setTextColor(255);doc.setFontSize(7);doc.setFont('helvetica','bold');doc.text('RESUMEN EJECUTIVO Y CONTROL DE OBRA',17,y+4);y+=8;
    const filas=filasInformeSupervision(tipo).map(f=>[f.Sección,f.Indicador,f.Valor,f.Estado]);
    doc.autoTable({startY:y,margin:{left:14,right:14},theme:'grid',styles:{fontSize:6,cellPadding:2,textColor:[22,30,45]},headStyles:{fillColor:naranja,textColor:255},head:[['Sección','Indicador','Valor','Estado']],body:filas});
    y=doc.lastAutoTable.finalY+7;
    const bloque=(etiqueta,texto)=>{doc.setFillColor(...claro);doc.setDrawColor(175);doc.roundedRect(14,y,182,27,1.5,1.5,'FD');doc.setTextColor(...azul);doc.setFontSize(7);doc.setFont('helvetica','bold');doc.text(etiqueta,17,y+5);doc.setTextColor(30);doc.setFont('helvetica','normal');doc.setFontSize(6.3);doc.text(doc.splitTextToSize(texto||'Sin información registrada.',174),17,y+10);y+=31;};
    bloque('OBSERVACIONES',valor('supervisionObservaciones'));bloque('CONCLUSIONES / RESTRICCIONES',valor('supervisionConclusiones'));
    doc.setDrawColor(80);doc.line(28,268,88,268);doc.line(122,268,182,268);doc.setFontSize(6);doc.setTextColor(40);doc.text('SUPERVISIÓN',58,272,{align:'center'});doc.text('CLIENTE FISE',152,272,{align:'center'});pie();
    const seleccionadas=[...evidenciasMovilSupervision,...evidenciasCargadasSupervision].filter(f=>f.incluida);
    const imagenes=[];for(const f of seleccionadas){try{imagenes.push({...f,data:await recursoADataUrl(f)});}catch(error){console.warn('No se pudo cargar evidencia',f.src,error);}}
    for(let inicio=0;inicio<imagenes.length;inicio+=6){doc.addPage();cabecera(doc.getNumberOfPages(),'REGISTRO FOTOGRÁFICO GEOREFERENCIADO');const grupo=imagenes.slice(inicio,inicio+6);grupo.forEach((f,i)=>{const col=i%2,fila=Math.floor(i/2),x=16+col*91,yFoto=68+fila*67;doc.setDrawColor(125);doc.setFillColor(246,247,249);doc.rect(x,yFoto,87,60,'FD');try{doc.addImage(f.data,'JPEG',x+2,yFoto+2,83,45,undefined,'FAST');}catch{try{doc.addImage(f.data,'PNG',x+2,yFoto+2,83,45,undefined,'FAST');}catch{}}doc.setFillColor(...gris);doc.rect(x,yFoto+48,87,12,'F');doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(6);doc.text(`${inicio+i+1}. ${f.titulo}`.slice(0,46),x+2,yFoto+52);doc.setFont('helvetica','normal');doc.setFontSize(5);doc.text((f.detalle||'Evidencia de campo georreferenciada').slice(0,55),x+2,yFoto+56);});pie();}
    const nombreArchivo=`informe-supervision-${tipo}-${valor('supervisionNumero').replace(/[^a-z0-9-]+/gi,'_')}.pdf`;
    const archivoPdf=doc.output('blob');
    reportesGeneradosSupervision.unshift({
      numero:valor('supervisionNumero'),tipo,fecha,proyecto:`${proyecto.codigo} · ${proyecto.nombre}`,
      url:URL.createObjectURL(archivoPdf)
    });
    renderizarReportesSupervision();
    doc.save(nombreArchivo);
    $('estadoInformeSupervision').textContent=`PDF generado con ${imagenes.length} fotografía(s) seleccionada(s).`;
  }

  function alternarPanel(boton,panel) {
    const abrir=panel.hidden; document.querySelectorAll('.panel-flotante').forEach(p=>p.hidden=true); document.querySelectorAll('.controles-mapa button').forEach(b=>b.setAttribute('aria-expanded','false'));
    panel.hidden=!abrir; boton.setAttribute('aria-expanded',String(abrir));
  }

  function alternarResumenMasificacion() {
    const tablero = document.querySelector('.tablero-masificacion');
    const oculto = tablero.classList.toggle('resumen-oculto');
    if(oculto){
      botonResumenMasificacion.style.setProperty('left','auto','important');
      botonResumenMasificacion.style.setProperty('right','12px','important');
      botonResumenMasificacion.style.setProperty('transform','translateY(-50%)','important');
    }else{
      botonResumenMasificacion.style.removeProperty('left');
      botonResumenMasificacion.style.removeProperty('right');
      botonResumenMasificacion.style.removeProperty('transform');
    }
    botonResumenMasificacion.setAttribute('aria-expanded', String(!oculto));
    botonResumenMasificacion.setAttribute('aria-label', oculto ? 'Mostrar resumen' : 'Ocultar resumen');
    requestAnimationFrame(() => mapa?.invalidateSize({pan:false}));
    setTimeout(() => mapa?.invalidateSize({pan:false}), 160);
    setTimeout(() => mapa?.invalidateSize({pan:false}), 340);
  }
  function ajustarAlturaTableroMasificacion() {
    const tablero=document.querySelector('.tablero-masificacion');
    if(!tablero)return;
    if(innerWidth<=1050){
      tablero.style.removeProperty('--alto-tablero-masificacion');
    }else{
      const alturaDisponible=Math.max(380,innerHeight-tablero.getBoundingClientRect().top-10);
      tablero.style.setProperty('--alto-tablero-masificacion',`${alturaDisponible}px`);
    }
    requestAnimationFrame(()=>mapa?.invalidateSize({pan:false}));
  }
  function normalizarTexto(valor) {
    return String(valor ?? '').trim();
  }
  function crearOpcionEstadoBeneficiario(valor='Pendiente') {
    const opciones=['Pendiente','Registrado','Observado'];
    return opciones.map(opcion=>`<option ${opcion===valor?'selected':''}>${opcion}</option>`).join('');
  }
  function crearFilaBeneficiarioProyecto(datos={}, indice=0) {
    const fila=document.createElement('tr');
    fila.innerHTML=`
      <td class="indice-beneficiario-proyecto">${indice+1}</td>
      <td><input type="text" class="campo-beneficiario-proyecto" data-campo="nombre" value="${normalizarTexto(datos.nombre)}" placeholder="Nombre completo"></td>
      <td><input type="text" class="campo-beneficiario-proyecto" data-campo="documento" value="${normalizarTexto(datos.documento)}" placeholder="DNI / RUC"></td>
      <td><input type="text" class="campo-beneficiario-proyecto" data-campo="codigo" value="${normalizarTexto(datos.codigo)}" placeholder="Código"></td>
      <td><select class="campo-beneficiario-proyecto" data-campo="estado">${crearOpcionEstadoBeneficiario(normalizarTexto(datos.estado)||'Pendiente')}</select></td>
      <td><button type="button" class="accion-eliminar-beneficiario" data-accion="eliminar-beneficiario" aria-label="Eliminar registro">×</button></td>
    `;
    return fila;
  }
  function actualizarIndicesBeneficiariosProyecto() {
    const filasReales=[...document.querySelectorAll('#tablaBeneficiariosProyecto tr')].filter(fila=>!fila.classList.contains('fila-vacia-beneficiarios'));
    filasReales.forEach((fila,indice)=>{
      const celda=fila.querySelector('.indice-beneficiario-proyecto');
      if(celda)celda.textContent=String(indice+1);
    });
    const total=filasReales.length;
    $('tituloBeneficiariosProyecto').textContent=`Beneficiarios (${total})`;
  }
  function agregarFilaBeneficiarioProyecto(datos={}) {
    const tabla=$('tablaBeneficiariosProyecto');
    tabla.append(crearFilaBeneficiarioProyecto(datos,tabla.children.length));
    actualizarIndicesBeneficiariosProyecto();
  }
  function limpiarBeneficiariosProyecto() {
    $('tablaBeneficiariosProyecto').replaceChildren();
    const fila=document.createElement('tr');
    fila.className='fila-vacia-beneficiarios';
    fila.innerHTML='<td colspan="6">No hay beneficiarios cargados. Importe un Excel o agregue un registro.</td>';
    $('tablaBeneficiariosProyecto').append(fila);
    actualizarIndicesBeneficiariosProyecto();
  }
  function extraerBeneficiariosProyecto() {
    return [...document.querySelectorAll('#tablaBeneficiariosProyecto tr')]
      .filter(fila=>!fila.classList.contains('fila-vacia-beneficiarios'))
      .map(fila=>({
        nombre: fila.querySelector('[data-campo="nombre"]')?.value.trim()||'',
        documento: fila.querySelector('[data-campo="documento"]')?.value.trim()||'',
        codigo: fila.querySelector('[data-campo="codigo"]')?.value.trim()||'',
        estado: fila.querySelector('[data-campo="estado"]')?.value||'Pendiente'
      }));
  }
  function sincronizarBeneficiariosProyecto(codigoProyecto) {
    if(!codigoProyecto)return;
    beneficiariosEdicionPorProyecto.set(codigoProyecto,extraerBeneficiariosProyecto());
  }
  function cargarBeneficiariosDelProyecto(codigoProyecto) {
    if(!codigoProyecto){
      limpiarBeneficiariosProyecto();
      return;
    }
    const guardados=beneficiariosEdicionPorProyecto.get(codigoProyecto);
    if(guardados){
      $('tablaBeneficiariosProyecto').replaceChildren();
      if(!guardados.length){
        limpiarBeneficiariosProyecto();
        return;
      }
      guardados.forEach((registro,indice)=>agregarFilaBeneficiarioProyecto(registro,indice));
      return;
    }
    const proyecto=ciudades.find(item=>item.codigo===codigoProyecto);
    const codigoFuente=proyecto?.codigoFuente||codigoProyecto;
    const beneficiarios=datosGeo.filter(f=>f?.properties?.tipo==='beneficiario'&&f.properties.proyecto===codigoFuente);
    $('tablaBeneficiariosProyecto').replaceChildren();
    if(!beneficiarios.length){
      limpiarBeneficiariosProyecto();
      return;
    }
    beneficiarios.forEach((feature,indice)=>{
      agregarFilaBeneficiarioProyecto({
        nombre: feature.properties.nombre || '',
        documento: feature.properties.suministro || feature.id || '',
        codigo: feature.id || `${codigoProyecto}-BEN-${String(indice+1).padStart(3,'0')}`,
        estado: feature.properties.estado || 'Pendiente'
      });
    });
  }
  function asegurarTablaBeneficiariosProyecto() {
    const tabla=$('tablaBeneficiariosProyecto');
    if(!tabla)return;
    if(!tabla.children.length)limpiarBeneficiariosProyecto();
  }
  function obtenerTextoSeleccionMultiple(select) {
    return [...select.selectedOptions].map(opcion=>opcion.value).filter(Boolean);
  }
  function actualizarResumenEquipoProyecto() {
    const select=$('proyectoEquipo');
    if(!select)return;
    const lista=$('listaEquipoProyecto');
    if(!lista)return;
    const personas=obtenerTextoSeleccionMultiple(select);
    lista.innerHTML=personas.length?personas.map(persona=>`<span class="ficha-equipo-proyecto"><i aria-hidden="true">${escapePlanificacion(persona.split(' ').map(nombre=>nombre[0]).join('').slice(0,2))}</i><strong>${escapePlanificacion(persona)}</strong><button type="button" data-quitar-persona-equipo="${escapePlanificacion(persona)}" aria-label="Quitar a ${escapePlanificacion(persona)}">×</button></span>`).join(''):'<small>Aún no se agregaron personas al equipo.</small>';
  }
  function normalizarProyectoEdicion(p) {
    return {
      codigo:p.codigo||'',
      nombre:p.nombre||'',
      proyectoPadre:p.proyectoPadre||'',
      fase:p.fase||'Anteproyecto',
      cronograma:Array.isArray(p.cronograma)?p.cronograma:[],
      departamento:p.departamento||'',
      provincia:p.provincia||'',
      distrito:p.distrito||'',
      responsableLider:p.responsableLider||'-- Seleccione --',
      empresaContratista:p.empresaContratista||'',
      alcance:p.alcance||'',
      equipo:Array.isArray(p.equipo)?p.equipo:[p.equipo].filter(Boolean),
      tipo:p.tipo||'Masificación de gas FISE',
      estado:p.estado||'En evaluación',
      beneficiarios:p.beneficiarios ?? p.predios ?? '',
      areaInfluencia:p.areaInfluencia||'',
      localizacion:p.localizacion||'',
      fechaInicio:p.fechaInicio||'',
      fechaFin:p.fechaFin||''
    };
  }
  function renderListaProyectosEdicion() {
    const lista=$('listaProyectosEdicion');
    if(!lista)return;
    const q=$('buscarProyectoEdicion')?.value.trim().toLowerCase()||'';
    const proyectos=ciudades.filter(p=>!q||[p.codigo,p.nombre,p.departamento,p.provincia,p.distrito,p.estado].some(valor=>String(valor).toLowerCase().includes(q)));
    $('contadorProyectosEdicion').textContent=`${proyectos.length} proyecto(s)`;
    lista.replaceChildren();
    if(!proyectos.length){
      const vacio=document.createElement('div');
      vacio.className='item-proyecto-vacio';
      vacio.textContent='No hay proyectos que coincidan con la búsqueda.';
      lista.append(vacio);
      return;
    }
    proyectos.forEach(p=>{
      const tarjeta=document.createElement('article');
      tarjeta.className=`item-proyecto-edicion${proyectoEdicionSeleccionado?.codigo===p.codigo?' activo':''}`;
      tarjeta.innerHTML=`<div><strong>${p.codigo}</strong><span>${p.nombre}</span><small>${p.departamento} · ${p.provincia} · ${p.estado} · ${p.fase||'Anteproyecto'}</small></div><div class="acciones-item-proyecto"><button type="button" data-accion="editar-proyecto" data-codigo="${p.codigo}">Editar</button><button type="button" data-accion="crear-subproyecto" data-codigo="${p.codigo}">Subproyecto</button><button type="button" class="peligro" data-accion="eliminar-proyecto" data-codigo="${p.codigo}">Eliminar</button></div>`;
      lista.append(tarjeta);
    });
  }
  function poblarProyectoPadre(codigoActual='') {
    const selector=$('proyectoPadre');
    if(!selector)return;
    const valorActual=selector.value||codigoActual;
    selector.replaceChildren(new Option('Este proyecto es el macroproyecto (contenedor)',''));
    ciudades.filter(p=>p.codigo!==codigoActual&&!p.proyectoPadre).forEach(p=>selector.add(new Option(`${p.codigo} · ${p.nombre}`,p.codigo)));
    if([...selector.options].some(opcion=>opcion.value===valorActual))selector.value=valorActual;
  }
  function actualizarModoJerarquiaProyecto({edicion=false}={}) {
    const esComponente=Boolean($('proyectoPadre').value);
    const componente=$('proyectoComponente');
    if(!edicion&&!esComponente)componente.value='redes';
    if(esComponente&&!componente.value)componente.value='redes';
    document.querySelectorAll('[data-campo-posterior]').forEach(campo=>campo.hidden=!edicion);
  }
  const sugerenciasFasesProyecto=['Anteproyecto','Proyecto','Construcción','Operación'];
  function leerFasesProyecto(){try{const fases=JSON.parse($('proyectoFasesCronologia').value||'[]');return Array.isArray(fases)?fases:[];}catch{return [];}}
  function asignarFasePrincipal(nombre='Anteproyecto'){
    const selector=$('proyectoFase'),fase=nombre||'Anteproyecto';
    if(![...selector.options].some(opcion=>opcion.value===fase))selector.append(new Option(fase,fase));
    selector.value=fase;
  }
  function actualizarSeleccionPap(valor=''){
    $('proyectoIncluidoPap').value=valor;
    document.querySelectorAll('[data-valor-pap]').forEach(boton=>{const seleccionado=boton.dataset.valorPap===valor;boton.classList.toggle('seleccionado',seleccionado);boton.setAttribute('aria-pressed',String(seleccionado));});
  }
  function crearFilaFaseProyecto(fase={},indice=0){
    const nombre=String(fase.nombre||''),sugerencia=fase.sugerencia||sugerenciasFasesProyecto[indice]||`Fase ${indice+1}`;
    return `<label class="fila-fase-proyecto${fase.activa||nombre?' seleccionada':''}"><input type="checkbox" ${fase.activa||nombre?'checked':''} aria-label="Incluir fase"><span class="indicador-fase">${indice+1}</span><input class="nombre-fase-proyecto" type="text" value="${escapePlanificacion(nombre)}" placeholder="${escapePlanificacion(sugerencia)}" aria-label="Nombre de la fase"><input type="date" data-fecha-inicio value="${escapePlanificacion(fase.inicio||'')}" aria-label="Inicio de la fase"><input type="date" data-fecha-fin value="${escapePlanificacion(fase.fin||'')}" aria-label="Fin de la fase"><button type="button" class="eliminar-fase-proyecto" aria-label="Eliminar fase" title="Eliminar fase"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg></button></label>`;
  }
  function leerFasesFormulario({soloActivas=false}={}){
    return [...document.querySelectorAll('.fila-fase-proyecto')].map((fila,indice)=>({nombre:fila.querySelector('.nombre-fase-proyecto')?.value.trim()||'',sugerencia:fila.querySelector('.nombre-fase-proyecto')?.placeholder||`Fase ${indice+1}`,inicio:fila.querySelector('[data-fecha-inicio]')?.value||'',fin:fila.querySelector('[data-fecha-fin]')?.value||'',activa:Boolean(fila.querySelector('input[type="checkbox"]')?.checked)})).filter(fase=>!soloActivas||fase.activa);
  }
  function renderFilasFasesProyecto(fases=leerFasesProyecto()){
    const lista=document.querySelector('.lista-fases-proyecto');if(!lista)return;
    const datos=fases.length?fases:sugerenciasFasesProyecto.map(sugerencia=>({sugerencia}));
    lista.innerHTML=datos.map((fase,indice)=>crearFilaFaseProyecto(fase,indice)).join('');
  }
  function renderLineaTiempoFases(fases){
    const linea=$('lineaTiempoFasesProyecto');
    linea.innerHTML=fases.length?fases.map((fase,indice)=>`<div class="hito-linea-fase${fase.activa?' seleccionado':''}"><span>${indice+1}</span><strong>${escapePlanificacion(fase.nombre||fase.sugerencia||`Fase ${indice+1}`)}</strong></div>`).join(''):'<p class="linea-fases-vacia">Agregue una fase para iniciar la línea de tiempo.</p>';
  }
  function actualizarVistaFasesProyecto(){
    const seleccionadas=leerFasesProyecto();
    renderFilasFasesProyecto(seleccionadas);
    renderLineaTiempoFases(leerFasesFormulario());
    const resumen=seleccionadas.length?seleccionadas.map(fase=>fase.nombre).join(' · '):'Definir fases del proyecto';
    $('abrirFasesProyecto').querySelector('strong').textContent=resumen;
    $('abrirFasesProyecto').querySelector('small').textContent=seleccionadas.length?`${seleccionadas.length} fase${seleccionadas.length===1?'':'s'} seleccionada${seleccionadas.length===1?'':'s'}`:'Seleccione fases y sus fechas';
  }
  function aplicarFasesProyecto(){
    const fases=leerFasesFormulario({soloActivas:true}).filter(fase=>fase.nombre).map(({nombre,inicio,fin})=>({nombre,inicio,fin}));
    $('proyectoFasesCronologia').value=JSON.stringify(fases);
    asignarFasePrincipal(fases.at(-1)?.nombre||'Anteproyecto');
    const fechasInicio=fases.map(fase=>fase.inicio).filter(Boolean).sort(),fechasFin=fases.map(fase=>fase.fin).filter(Boolean).sort();
    if(fechasInicio.length)$('proyectoFechaInicio').value=fechasInicio[0];
    if(fechasFin.length)$('proyectoFechaFin').value=fechasFin.at(-1);
    actualizarVistaFasesProyecto();
  }
  function actualizarEstadoVisitaCampo() {
    const usuario=$('proyectoVisitaUsuario').value,fecha=$('proyectoVisitaFecha').value,formatoGuardado=$('proyectoVisitaFormatoGuardado').value==='true',estado=$('estadoVisitaCampo'),boton=$('asignarVisitaCampo'),revisar=$('abrirRequisitosTecnicosFise');
    if(!usuario){estado.textContent='';boton.textContent='Asignar visita a campo';revisar.hidden=true;return;}
    const fechaLegible=fecha?new Intl.DateTimeFormat('es-PE',{dateStyle:'medium'}).format(new Date(`${fecha}T00:00:00`)):'Sin fecha definida';
    estado.textContent=`Visita de campo asignada a ${usuario} · ${fechaLegible}. ${formatoGuardado?'Formato registrado: listo para revisión.':'Pendiente de guardar el formato de visita.'}`;
    boton.textContent='Reasignar visita';
    revisar.hidden=!formatoGuardado;
  }
  function cargarProyectoEnFormulario(proyecto) {
    if(!proyecto)return;
    proyectoEdicionSeleccionado=proyecto;
    $('etiquetaCrearProyecto').textContent='MODIFICAR PROYECTO';
    $('tituloCrearProyecto').textContent='Modificar proyecto';
    $('descripcionCrearProyecto').textContent='Actualice los datos, el equipo, el área y los beneficiarios asociados al proyecto.';
    $('proyectoCodigo').value=proyecto.codigo||'';
    $('proyectoNombre').value=proyecto.nombre||'';
    $('proyectoNumeroSolicitud').value=proyecto.numeroSolicitud||'';
    $('proyectoRemitenteSolicitud').value=proyecto.remitenteSolicitud||'';
    $('proyectoAsuntoSolicitud').value=proyecto.asuntoSolicitud||'';
    $('proyectoCodigoConvenio').value=proyecto.codigoConvenio||'';
    $('estadoArchivoConvenio').textContent=proyecto.archivoConvenio?`${proyecto.archivoConvenio} adjunto.`:'Sin convenio adjunto.';
    poblarProyectoPadre(proyecto.codigo);
    $('proyectoPadre').value=proyecto.proyectoPadre||'';
    asignarFasePrincipal(proyecto.fase||'Anteproyecto');
    cronogramaBorrador=structuredClone(proyecto.cronograma?.length?proyecto.cronograma:crearCronogramaBase());
    $('proyectoFechaInicio').value=proyecto.fechaInicio||'';
    $('proyectoFechaFin').value=proyecto.fechaFin||'';
    $('proyectoFasesCronologia').value=JSON.stringify(proyecto.fases?.length?proyecto.fases:[{nombre:proyecto.fase||'Anteproyecto',inicio:proyecto.fechaInicio||'',fin:proyecto.fechaFin||''}]);
    actualizarVistaFasesProyecto();
    $('proyectoResponsableLider').value=proyecto.responsableLider||'-- Seleccione --';
    $('proyectoEmpresaContratista').value=proyecto.empresaContratista||'';
    const selectEquipo=$('proyectoEquipo');
    [...selectEquipo.options].forEach(opcion=>{opcion.selected=(proyecto.equipo||[]).includes(opcion.value);});
    $('proyectoDepartamento').value=proyecto.departamento||'';
    $('proyectoProvincia').value=proyecto.provincia||'';
    $('proyectoDistrito').value=proyecto.distrito||'';
    $('proyectoTipo').value=proyecto.tipo||'Masificación de gas FISE';
    $('proyectoComponente').value=proyecto.componente||'redes';
    componentesProyectoCompletados.clear();(proyecto.componentesCompletados||[]).forEach(componente=>componentesProyectoCompletados.add(componente));
    $('proyectoAlcance').value=proyecto.alcance||'';
    actualizarSeleccionPap(proyecto.incluidoPap||'');
    $('proyectoContrato').value=proyecto.contrato||'';
    $('proyectoInterventor').value=proyecto.interventor||'';
    $('proyectoFactorContrato').value=proyecto.factorContrato||1;
    $('proyectoCapacidadPsr').value=proyecto.capacidadPsr||'';
    $('proyectoEstado').value=proyecto.estado||'En evaluación';
    $('proyectoBeneficiarios').value=proyecto.beneficiarios ?? '';
    $('proyectoVisitaUsuario').value=proyecto.visitaCampo?.usuario||'';
    $('proyectoVisitaFecha').value=proyecto.visitaCampo?.fecha||'';
    $('proyectoVisitaFormatoGuardado').value=proyecto.visitaCampo?.formatoGuardado?'true':'';
    $('visitaCampoIndicaciones').value=proyecto.visitaCampo?.indicaciones||'';
    actualizarEstadoVisitaCampo();
    $('proyectoAreaInfluencia').value=proyecto.areaInfluencia||'';
    $('proyectoLocalizacion').value=proyecto.localizacion||'';
    $('resumenAreaInfluenciaProyecto').textContent=proyecto.areaInfluencia?`${proyecto.areaInfluencia} · ${proyecto.departamento||''}, ${proyecto.provincia||''}, ${proyecto.distrito||''}`:'';
    $('proyectoGeometria').value=proyecto.geometria?JSON.stringify(proyecto.geometria):'';
    $('proyectoGeometriaTerrenoB').value=proyecto.geometriaTerrenoB?JSON.stringify(proyecto.geometriaTerrenoB):'';
    $('proyectoBeneficiariosTerrenoB').value=proyecto.beneficiariosTerrenoB||0;
    $('estadoArchivoAreaIntervencion').textContent=proyecto.geometriaTerrenoB?`Terreno B registrado · ${(proyecto.geometriaTerrenoB.areaM2||0).toLocaleString('es-PE')} m².`:'Sin terreno o archivo adjunto.';
    $('estadoZonaProyecto').textContent=proyecto.geometria?`${proyecto.geometria.nombre||'Geometría'} cargada y vinculada al proyecto.`:'Defina el nombre y la forma; finalice el dibujo con doble clic.';
    $('estadoZonaProyecto').classList.toggle('exito',Boolean(proyecto.geometria));
    actualizarResumenEquipoProyecto();
    actualizarModoJerarquiaProyecto({edicion:true});
    renderListaProyectosEdicion();
    cargarBeneficiariosDelProyecto(proyecto.codigo);
    planificacionBorrador=crearPlanificacionProyecto(proyecto.planificacionTecnica);
  }
  function limpiarFormularioProyecto() {
    proyectoEdicionSeleccionado=null;
    $('etiquetaCrearProyecto').textContent='NUEVO PROYECTO';
    $('tituloCrearProyecto').textContent='Crear macroproyecto';
    $('descripcionCrearProyecto').textContent='Delimite el área GIS, defina las fechas, el equipo y el alcance. Los beneficiarios se estiman automáticamente.';
    $('proyectoCodigo').value='';
    $('proyectoNombre').value='';
    actualizarSeleccionPap('');
    $('proyectoNumeroSolicitud').value='';
    $('proyectoRemitenteSolicitud').value='';
    $('proyectoAsuntoSolicitud').value='';
    $('proyectoCodigoConvenio').value='';
    $('proyectoArchivoConvenio').value='';
    $('estadoArchivoConvenio').textContent='Sin convenio adjunto.';
    poblarProyectoPadre();
    $('proyectoPadre').value='';
    $('proyectoFase').value='Anteproyecto';
    $('proyectoFasesCronologia').value='[]';
    actualizarVistaFasesProyecto();
    cronogramaBorrador=crearCronogramaBase();
    $('proyectoFechaInicio').value='';
    $('proyectoFechaFin').value='';
    $('proyectoResponsableLider').value='-- Seleccione --';
    $('proyectoEmpresaContratista').value='';
    [...$('proyectoEquipo').options].forEach(opcion=>{opcion.selected=false;});
    $('proyectoDepartamento').value='';
    $('proyectoProvincia').value='';
    $('proyectoDistrito').value='';
    $('proyectoTipo').value='Masificación de gas FISE';
    $('proyectoComponente').value='redes';
    componentesProyectoCompletados.clear();
    $('proyectoAlcance').value='';
    $('proyectoContrato').value='';
    $('proyectoInterventor').value='';
    $('proyectoFactorContrato').value='1';
    $('proyectoCapacidadPsr').value='';
    $('proyectoEstado').value='En evaluación';
    $('proyectoBeneficiarios').value='';
    $('proyectoVisitaUsuario').value='';
    $('proyectoVisitaFecha').value='';
    $('proyectoVisitaFormatoGuardado').value='';
    $('visitaCampoIndicaciones').value='';
    actualizarEstadoVisitaCampo();
    $('proyectoAreaInfluencia').value='';
    $('proyectoLocalizacion').value='';
    $('resumenAreaInfluenciaProyecto').textContent='';
    $('proyectoGeometria').value='';
    $('proyectoGeometriaTerrenoB').value='';
    $('proyectoBeneficiariosTerrenoB').value='0';
    $('estadoArchivoAreaIntervencion').textContent='Sin terreno o archivo adjunto.';
    $('nombreZonaProyecto').value='';
    $('estadoZonaProyecto').textContent='Defina el nombre y la forma; finalice el dibujo con doble clic.';
    $('estadoZonaProyecto').classList.remove('exito');
    actualizarResumenEquipoProyecto();
    actualizarModoJerarquiaProyecto();
    limpiarBeneficiariosProyecto();
    planificacionBorrador=crearPlanificacionProyecto();
  }
  function obtenerDatosFormularioProyecto() {
    const [latitudTexto,longitudTexto]=String($('proyectoLocalizacion').value||'').split(',').map(valor=>Number(valor.trim()));
    return {
      codigo: normalizarTexto($('proyectoCodigo').value),
      nombre: normalizarTexto($('proyectoNombre').value),
      numeroSolicitud: normalizarTexto($('proyectoNumeroSolicitud').value),
      remitenteSolicitud: normalizarTexto($('proyectoRemitenteSolicitud').value),
      asuntoSolicitud: normalizarTexto($('proyectoAsuntoSolicitud').value),
      codigoConvenio: normalizarTexto($('proyectoCodigoConvenio').value),
      archivoConvenio: $('proyectoArchivoConvenio').files[0]?.name||proyectoEdicionSeleccionado?.archivoConvenio||'',
      proyectoPadre: $('proyectoPadre').value,
      fase: $('proyectoFase').value,
      fases: leerFasesProyecto(),
      incluidoPap: $('proyectoIncluidoPap').value,
      cronograma: structuredClone(cronogramaBorrador),
      fechaInicio: $('proyectoFechaInicio').value,
      fechaFin: $('proyectoFechaFin').value,
      responsableLider: $('proyectoResponsableLider').value,
      empresaContratista: normalizarTexto($('proyectoEmpresaContratista').value),
      equipo: obtenerTextoSeleccionMultiple($('proyectoEquipo')),
      departamento: $('proyectoDepartamento').value,
      provincia: $('proyectoProvincia').value,
      distrito: $('proyectoDistrito').value,
      tipo: $('proyectoTipo').value,
      componente: 'redes',
      componentes: ['redes','psr','tc'],
      componentesCompletados: [...componentesProyectoCompletados],
      alcance: normalizarTexto($('proyectoAlcance').value),
      contrato: normalizarTexto($('proyectoContrato').value),
      interventor: normalizarTexto($('proyectoInterventor').value),
      factorContrato: Number($('proyectoFactorContrato').value)||1,
      capacidadPsr: Number($('proyectoCapacidadPsr').value)||0,
      estado: $('proyectoEstado').value,
      beneficiarios: $('proyectoBeneficiarios').value,
      visitaCampo: {usuario:$('proyectoVisitaUsuario').value,fecha:$('proyectoVisitaFecha').value,formatoGuardado:$('proyectoVisitaFormatoGuardado').value==='true',indicaciones:normalizarTexto($('visitaCampoIndicaciones').value)},
      areaInfluencia: normalizarTexto($('proyectoAreaInfluencia').value),
      localizacion: normalizarTexto($('proyectoLocalizacion').value),
      geometria: $('proyectoGeometria').value?JSON.parse($('proyectoGeometria').value):null,
      geometriaTerrenoB: $('proyectoGeometriaTerrenoB').value?JSON.parse($('proyectoGeometriaTerrenoB').value):null,
      beneficiariosTerrenoB: Number($('proyectoBeneficiariosTerrenoB').value)||0,
      lat: Number.isFinite(latitudTexto)?latitudTexto:(proyectoEdicionSeleccionado?.lat ?? -10.6),
      lng: Number.isFinite(longitudTexto)?longitudTexto:(proyectoEdicionSeleccionado?.lng ?? -75.2),
      avance: proyectoEdicionSeleccionado?.avance ?? 0,
      longitud: proyectoEdicionSeleccionado?.longitud ?? 0,
      elementos: proyectoEdicionSeleccionado?.elementos ?? '',
      planificacionTecnica: structuredClone(planificacionBorrador||crearPlanificacionProyecto())
    };
  }
  function validarDatosInicialesProyecto() {
    const faltantes=[];
    let primerPendiente=null;
    if(!$('proyectoGeometria').value){faltantes.push('área de influencia GIS');primerPendiente=$('abrirMapaUbicacionProyecto');}
    if(!$('proyectoFechaInicio').value||!$('proyectoFechaFin').value){faltantes.push('fechas de inicio y fin');primerPendiente??=$('proyectoFechaInicio');}
    if(!obtenerTextoSeleccionMultiple($('proyectoEquipo')).length){faltantes.push('equipo');primerPendiente??=$('proyectoEquipo');}
    if(!normalizarTexto($('proyectoAlcance').value)){faltantes.push('alcance de intervención');primerPendiente??=$('proyectoAlcance');}
    if(faltantes.length){setTimeout(()=>primerPendiente?.focus({preventScroll:true}),250);return false;}
    return true;
  }
  function crearPlanificacionProyecto(datos={}){const requisitos=(datos.requisitos?.length?datos.requisitos:requisitosTerrenoBase.map(([nombre,parametro])=>({nombre,parametro,estado:'pendiente',comentario:'',responsable:'',fechaLimite:'',subsanado:false}))).map(item=>({...item}));return {requisitos,fecha:datos.fecha||'',localidad:datos.localidad||'',responsable:datos.responsable||'',asistentes:datos.asistentes||'',coordenadas:datos.coordenadas||'',tipoVisita:datos.tipoVisita||'Inspección inicial',ayudaMemoria:datos.ayudaMemoria||'',evidencias:[...(datos.evidencias||[])],conclusiones:datos.conclusiones||'',cerrada:Boolean(datos.cerrada),fechaCierre:datos.fechaCierre||''};}
  function escapePlanificacion(valor=''){return String(valor).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function leerPlanificacionFormulario(){if(!planificacionBorrador)planificacionBorrador=crearPlanificacionProyecto();$('tablaRequisitosPlanificacion').querySelectorAll('[data-requisito-indice]').forEach(s=>{const r=planificacionBorrador.requisitos[Number(s.dataset.requisitoIndice)];if(r)r.estado=s.value;});planificacionBorrador.fecha=$('planificacionFecha').value;planificacionBorrador.localidad=$('planificacionLocalidad').value.trim();planificacionBorrador.responsable=$('planificacionResponsable').value.trim();planificacionBorrador.asistentes=$('planificacionAsistentes').value.trim();planificacionBorrador.coordenadas=$('planificacionCoordenadas').value.trim();planificacionBorrador.tipoVisita=$('planificacionTipoVisita').value;planificacionBorrador.ayudaMemoria=$('planificacionAyudaMemoria').value.trim();planificacionBorrador.conclusiones=$('conclusionesPlanificacion').value.trim();}
  function metricasPlanificacion(){const requisitos=planificacionBorrador?.requisitos||[],evaluados=requisitos.filter(r=>r.estado!=='pendiente'),cumplidos=requisitos.filter(r=>r.estado==='cumple'||(r.estado==='no-cumple'&&r.subsanado)),observados=requisitos.filter(r=>r.estado==='no-cumple'&&!r.subsanado),avance=requisitos.length?Math.round(cumplidos.length/requisitos.length*100):0;return {total:requisitos.length,evaluados:evaluados.length,cumplidos:cumplidos.length,observados:observados.length,avance,resultado:evaluados.length===0?'Sin evaluar':avance>=80?'Apto':'No apto'};}
  function renderObservacionesPlanificacion(){const c=$('listaObservacionesPlanificacion'),obs=(planificacionBorrador?.requisitos||[]).map((r,i)=>({...r,indice:i})).filter(r=>r.estado==='no-cumple');if(!obs.length){c.innerHTML='<div class="observacion-planificacion-vacia">No hay requisitos incumplidos.</div>';return;}c.innerHTML=obs.map(r=>`<article class="observacion-planificacion"><div><strong>${escapePlanificacion(r.nombre)}</strong><p>${escapePlanificacion(r.comentario||'Registre el detalle en Requisitos.')}</p></div><label>Responsable<input data-observacion-responsable="${r.indice}" value="${escapePlanificacion(r.responsable)}"></label><label>Fecha límite<input type="date" data-observacion-fecha="${r.indice}" value="${escapePlanificacion(r.fechaLimite)}"></label><label><input type="checkbox" data-observacion-subsanada="${r.indice}" ${r.subsanado?'checked':''}> Subsanada</label></article>`).join('');}
  function actualizarResumenPlanificacion(){const m=metricasPlanificacion();$('avancePlanificacionTecnica').textContent=`${m.avance}%`;$('barraPlanificacionTecnica').style.width=`${m.avance}%`;$('cumplidosPlanificacionTecnica').textContent=`${m.cumplidos} de ${m.total}`;$('observadosPlanificacionTecnica').textContent=m.observados;$('resultadoPlanificacionTecnica').textContent=m.resultado;$('fechaPlanificacionTecnica').textContent=planificacionBorrador.fecha?`Inspección: ${planificacionBorrador.fecha}`:'Sin fecha de inspección';$('estadoCierrePlanificacion').textContent=m.resultado;$('mensajeCierrePlanificacion').textContent=m.evaluados<m.total?`Faltan evaluar ${m.total-m.evaluados} requisito(s).`:m.avance>=80?'El terreno alcanza el porcentaje mínimo de aptitud.':'El terreno no alcanza el 80% mínimo para ser apto.';if($('porcentajeMatrizPlanificacion'))$('porcentajeMatrizPlanificacion').textContent=`${m.avance}%`;if($('resultadoMatrizPlanificacion')){$('resultadoMatrizPlanificacion').textContent=m.resultado.toUpperCase();$('resultadoMatrizPlanificacion').dataset.resultado=m.resultado.toLowerCase().replace(' ','-');}$('cerrarEtapaPlanificacion').disabled=!(m.evaluados===m.total&&m.avance>=80&&$('confirmarCierrePlanificacion').checked);}
  function columnasFisePlanificacion(){return '<td class="requisito-fise-adicional">PENDIENTE</td><td class="requisito-fise-adicional">PENDIENTE</td><td class="requisito-fise-adicional">PENDIENTE</td><td class="estudio-fise-adicional">NO REALIZADO</td><td class="estudio-fise-adicional">NO REALIZADO</td>';}
  function renderPlanificacionTecnica(){if(!planificacionBorrador)planificacionBorrador=crearPlanificacionProyecto();const romanos=['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii','xiii'];$('listaDefinicionesRequisitos').innerHTML=planificacionBorrador.requisitos.map((r,i)=>`<article><b>${romanos[i]||i+1}</b><div><strong>${escapePlanificacion(r.nombre)}</strong><span>${escapePlanificacion(r.parametro)}</span></div></article>`).join('');const provincia=escapePlanificacion($('proyectoProvincia').value||proyectoEdicionSeleccionado?.provincia||proyectoSeleccionado?.provincia||'Azángaro'),distrito=escapePlanificacion($('proyectoDistrito').value||proyectoEdicionSeleccionado?.distrito||proyectoSeleccionado?.distrito||'Azángaro'),localidad=escapePlanificacion(planificacionBorrador.localidad||proyectoEdicionSeleccionado?.localidad||proyectoSeleccionado?.localidad||$('proyectoNombre').value||'Sector Pampa Bellavista');$('tablaRequisitosPlanificacion').innerHTML=`<tr><td>1</td><td>${provincia}</td><td>${distrito}</td><td><strong>${localidad}</strong></td>${planificacionBorrador.requisitos.map((r,i)=>`<td><select data-requisito-indice="${i}" data-requisito-estado data-estado="${r.estado}" title="${escapePlanificacion(r.nombre)}"><option value="pendiente">—</option><option value="cumple">Sí</option><option value="no-cumple">No</option></select></td>`).join('')}<td id="porcentajeMatrizPlanificacion">0%</td><td id="resultadoMatrizPlanificacion">SIN EVALUAR</td>${columnasFisePlanificacion()}<td><span class="fila-actual-requisito">ACTUAL</span></td></tr>`;[...$('tablaRequisitosPlanificacion').querySelectorAll('select')].forEach((s,i)=>s.value=planificacionBorrador.requisitos[i].estado);$('planificacionFecha').value=planificacionBorrador.fecha;$('planificacionLocalidad').value=planificacionBorrador.localidad;$('planificacionResponsable').value=planificacionBorrador.responsable;$('planificacionAsistentes').value=planificacionBorrador.asistentes;$('planificacionCoordenadas').value=planificacionBorrador.coordenadas;$('planificacionTipoVisita').value=planificacionBorrador.tipoVisita;$('planificacionAyudaMemoria').value=planificacionBorrador.ayudaMemoria;$('conclusionesPlanificacion').value=planificacionBorrador.conclusiones;$('confirmarCierrePlanificacion').checked=planificacionBorrador.cerrada;$('listaEvidenciasPlanificacion').innerHTML=planificacionBorrador.evidencias.length?planificacionBorrador.evidencias.map(a=>`<div class="evidencia-planificacion"><b>${escapePlanificacion(a.nombre)}</b><small>${escapePlanificacion(a.tipo||'Archivo')} · ${a.tamano||0} KB</small></div>`).join(''):'<p>No hay evidencias adjuntas.</p>';renderObservacionesPlanificacion();actualizarResumenPlanificacion();}
  function crearFilaLocalidadPlanificacion(localidad,ubicacion,estados,editable=true){const partes=ubicacion.split(' · '),provincia=partes[0]||'Azángaro',distrito=partes[1]||'Azángaro',si=estados.filter(e=>e==='cumple').length,porcentaje=Math.round(si/estados.length*100),resultado=porcentaje>=80?'APTO':'NO APTO',fila=document.createElement('tr');fila.className='fila-ejemplo-requisito';const numero=$('tablaRequisitosPlanificacion').children.length+1;fila.innerHTML=`<td>${numero}</td><td>${escapePlanificacion(provincia)}</td><td>${escapePlanificacion(distrito)}</td><td><strong>${escapePlanificacion(localidad||'Localidad de ejemplo')}</strong></td>${estados.map(estado=>`<td><select class="select-ejemplo-requisito" data-estado="${estado}"><option value="pendiente">—</option><option value="cumple">Sí</option><option value="no-cumple">No</option></select></td>`).join('')}<td class="porcentaje-ejemplo">${porcentaje}%</td><td class="resultado-ejemplo" data-resultado="${resultado==='APTO'?'apto':'no-apto'}">${resultado}</td>${columnasFisePlanificacion()}<td><button class="editar-fila-requisito activo" type="button" title="Editar requisitos de esta fila" aria-label="Editar requisitos de esta fila">✎</button></td>`;[...fila.querySelectorAll('select')].forEach((s,i)=>s.value=estados[i]);return fila;}
  function agregarFilasEjemploPlanificacion(){const estados=patron=>[...patron].map(valor=>valor==='s'?'cumple':'no-cumple'),ejemplos=[
    ['Sector 2° Chana Jilahuata','Azángaro · Azángaro',estados('nnccncnccnncc')],
    ['Sector Caruncachi','El Collao · Ilave',estados('nnncncnccnncn')],
    ['Sector Huancuní','El Collao · Ilave',estados('nsssnssssnnss')],
    ['Urb. Señor de los Milagros','San Román (Juliaca) · Caracoto',estados('nnssncnssnncn')],
    ['Sector Mollapampa','Chucuito · Juli',estados('nnssnsnssnnsn')],
    ['Urb. San Martín','Melgar · Ayaviri',estados('ssssnsnssnnnn')],
    ['Urb. Nueva Esperanza','Melgar · Ayaviri',estados('nnssnsnssnnss')],
    ['Colqueparani - Umasuyo','Melgar · Ayaviri',estados('nnnsnsnssnnnn')],
    ['Colqueparani - Sector Torrini','Melgar · Ayaviri',estados('nnnnnnnssnnnn')],
    ['Sector Pampa Bellavista','Azángaro · Azángaro',estados('nnssnsnssnnns')],
    ['Cerro Cristo Blanco','Azángaro · Azángaro',estados('nnssnnnssnnnn')],
    ['Sector Pumiri','Azángaro · Azángaro',estados('nnssnsnssnnns')],
    ['Sector Challapampa','Yunguyo · Yunguyo',estados('nnnsnsnssnnnn')]
  ];ejemplos.forEach(e=>$('tablaRequisitosPlanificacion').append(crearFilaLocalidadPlanificacion(...e)));}
  function recalcularFilaLocalidadPlanificacion(fila){const selects=[...fila.querySelectorAll('.select-ejemplo-requisito')];selects.forEach(s=>s.dataset.estado=s.value);const si=selects.filter(s=>s.value==='cumple').length,porcentaje=Math.round(si/selects.length*100),resultado=porcentaje>=80?'APTO':'NO APTO';fila.querySelector('.porcentaje-ejemplo').textContent=`${porcentaje}%`;const celda=fila.querySelector('.resultado-ejemplo');celda.textContent=resultado;celda.dataset.resultado=resultado==='APTO'?'apto':'no-apto';}
  function actualizarIndicadorAsistente(paso){const guardados=(proyectoEdicionSeleccionado||proyectoSeleccionado)?.pasosSatcontrol||{};document.querySelectorAll('#crear-proyectos .navegacion-etapas-proyecto [data-paso-proyecto]').forEach(item=>{const numero=Number(item.dataset.pasoProyecto);item.classList.toggle('activo',numero===paso);item.classList.toggle('completo',Boolean(guardados[numero]));item.setAttribute('aria-current',numero===paso?'step':'false');});}
  function renderComponentesProyecto(){document.querySelectorAll('[data-componente-proyecto]').forEach(tarjeta=>{const componente=tarjeta.dataset.componenteProyecto,completo=componentesProyectoCompletados.has(componente);tarjeta.classList.toggle('completo',completo);tarjeta.querySelector('.estado-componente-proyecto').textContent=completo?'Completado':'Pendiente';tarjeta.querySelector('[data-abrir-componente-fise]').textContent=completo?'Revisar formularios':'Completar formularios';});}
  const catalogoActoresContractuales={contratista:[{nombre:'NAGASCO S.A.C.',ruc:'20601849261',correo:'contacto@nagasco.pe',direccion:'Av. Javier Prado 1550, Lima'},{nombre:'PA-FARMIN S.A.C.',ruc:'20517834128',correo:'proyectos@pa-farmin.pe',direccion:'Av. República de Panamá 3531, Lima'}],interventor:[{nombre:'END Perú S.A.C.',ruc:'20514682793',correo:'supervision@endperu.pe',direccion:'Av. Javier Prado 1550, Lima'},{nombre:'OCA Global Perú',ruc:'20508860342',correo:'peru@ocaglobal.com',direccion:'Av. Canaval y Moreyra 480, Lima'}]},archivosActoresContractuales=new Map(),documentosMontoPlazoActor=new Map(),archivosBaremoComponentes=new Map();let consecutivoArchivosActor=0;
  function organizarBloquesGestionContractual(){document.querySelectorAll('.campos-gestion-contractual').forEach(contenedor=>{if(contenedor.dataset.organizado)return;const campos=[...contenedor.querySelectorAll(':scope>label')],crearGrupo=(titulo,marca,tipo,camposGrupo=[])=>{const grupo=document.createElement('section'),contenido=document.createElement('div'),registros=catalogoActoresContractuales[tipo]||[];grupo.className='grupo-actor-contractual';contenido.className='contenido-actor-contractual';grupo.innerHTML=`<button class="barra-actor-contractual" type="button" aria-expanded="false"><span><strong>${titulo}</strong><small>${marca}</small></span><b>⌄</b></button>`;if(tipo){contenido.innerHTML=`<div class="selector-registro-actor"><label>Seleccionar registro existente<select data-buscar-actor="${tipo}"><option value="">Seleccione una empresa registrada</option>${registros.map(registro=>`<option value="${registro.ruc}">${registro.nombre} · ${registro.ruc}</option>`).join('')}</select></label><button type="button" class="boton-nuevo-actor" data-nuevo-actor="${tipo}">＋ Registrar nuevo</button></div>`;}camposGrupo.forEach(campo=>{const entrada=campo.querySelector('input');if(tipo&&entrada)entrada.readOnly=true;contenido.append(campo);});grupo.append(contenido);return grupo;},agregarCargaActor=grupo=>{const control=document.createElement('div'),id=`actor-archivos-${++consecutivoArchivosActor}`;grupo.dataset.archivosActor=id;control.className='carga-archivos-actor';control.innerHTML='<button type="button" data-subir-archivos-actor>Adjuntar PDFs</button><button type="button" data-ver-archivos-actor disabled>👁 Ver</button><small class="estado-archivos-actor">Sin archivos adjuntos.</small>';grupo.querySelector('.contenido-actor-contractual').append(control);},agregarMontoPlazo=grupo=>{const control=document.createElement('div'),id=`actor-documentos-${++consecutivoArchivosActor}`;grupo.dataset.documentosMontoPlazo=id;control.className='documentos-monto-plazo';control.innerHTML='<strong>Documentos contractuales</strong><div><span>Monto contractual <button type="button" data-adjuntar-documento-actor="monto">Adjuntar PDF</button><button type="button" data-ver-documento-actor="monto" disabled aria-label="Ver documento de monto">👁</button></span><span>Plazo de ejecución <button type="button" data-adjuntar-documento-actor="plazo">Adjuntar PDF</button><button type="button" data-ver-documento-actor="plazo" disabled aria-label="Ver documento de plazo">👁</button></span></div>';grupo.querySelector('.contenido-actor-contractual').append(control);},fila=document.createElement('div'),contrato=document.createElement('div');fila.className='fila-actores-contractuales';contrato.className='fila-contrato-componentes';const contratista=crearGrupo('Contratista','Obligatorio','contratista',campos.slice(0,4)),interventor=crearGrupo('Interventor','Obligatorio','interventor',campos.slice(4,8)),petroperu=crearGrupo('Supervisor PETROPERÚ','Según contrato'),osinergmin=crearGrupo('OSINERGMIN','Según etapa');petroperu.querySelector('.contenido-actor-contractual').innerHTML='<label class="opcion-actor-contractual"><input type="checkbox"> Activar participación de PETROPERÚ</label><label>Responsable / área<input type="text" placeholder="Supervisor / unidad"></label><label>Correo<input type="email" placeholder="correo@petroperu.com.pe"></label><label>Tipo de participación<select><option>Conformidad técnica supervisada</option><option>Validación contractual</option><option>Visita de campo</option></select></label>';osinergmin.querySelector('.contenido-actor-contractual').innerHTML='<label class="opcion-actor-contractual"><input type="checkbox"> Requiere intervención regulatoria</label><label>Tipo<select><option>Inspección de seguridad / cumplimiento</option><option>Informe de supervisión</option><option>Fiscalización</option></select></label><label class="campo-largo">Qué verifica<textarea rows="3" placeholder="Alcance de la supervisión o verificación"></textarea></label>';[contratista,interventor,petroperu,osinergmin].forEach(agregarCargaActor);[contratista,interventor].forEach(agregarMontoPlazo);fila.append(contratista,interventor,petroperu,osinergmin);contrato.innerHTML='<strong>Información del contrato</strong>';campos.slice(8).forEach(campo=>contrato.append(campo));contenedor.replaceChildren(fila,contrato);contenedor.dataset.organizado='true';});}
  function copiarDatosContratistaEnFila(fila){
    const contratista=[...fila.querySelectorAll('.grupo-actor-contractual')].find(grupo=>grupo.querySelector('.barra-actor-contractual strong')?.textContent==='Contratista'),interventor=[...fila.querySelectorAll('.grupo-actor-contractual')].find(grupo=>grupo.querySelector('.barra-actor-contractual strong')?.textContent==='Interventor');
    if(!contratista||!interventor)return;
    const origen=[...contratista.querySelectorAll('.contenido-actor-contractual input:not([type="file"]), .contenido-actor-contractual select, .contenido-actor-contractual textarea')],destino=[...interventor.querySelectorAll('.contenido-actor-contractual input:not([type="file"]), .contenido-actor-contractual select, .contenido-actor-contractual textarea')];
    origen.forEach((control,indice)=>{const equivalente=destino[indice];if(equivalente)equivalente.value=control.value;});
  }
  function sincronizarActorCompartido(tipo){
    const selector=$(`${tipo}CompartidoPregunta`)||$(`${tipo}CompartidoContrato`),registro=(catalogoActoresContractuales[tipo]||[]).find(item=>item.ruc===selector?.value);
    if(!registro)return;
    document.querySelectorAll(`[data-buscar-actor="${tipo}"]`).forEach(control=>{
      control.value=registro.ruc;
      const campos=[...control.closest('.grupo-actor-contractual').querySelectorAll('.contenido-actor-contractual>label input')];
      [registro.nombre,registro.ruc,registro.correo,registro.direccion].forEach((valor,indice)=>{if(campos[indice])campos[indice].value=valor;});
    });
  }
  function actualizarConfiguracionActoresComponentes(){
    const seleccion=document.querySelector('input[name="actoresCompartidosComponentes"]:checked'),contenedor=document.querySelector('.gestiones-contractuales-componentes');
    if(!seleccion||!contenedor)return;
    const independientes=seleccion.value==='no',pregunta=document.querySelector('.pregunta-actores-compartidos'),descripcion=pregunta?.querySelector('p');
    $('datosCompartidosContrato')?.remove();
    if(pregunta&&!pregunta.querySelector('.registro-actores-pregunta'))pregunta.insertAdjacentHTML('beforeend','<div class="registro-actores-pregunta" hidden><label>Contratista<select id="contratistaCompartidoPregunta"><option value="">Seleccione contratista</option></select></label><label>Interventor<select id="interventorCompartidoPregunta"><option value="">Seleccione interventor</option></select></label></div>');
    const registroPregunta=pregunta?.querySelector('.registro-actores-pregunta');
    contenedor.classList.toggle('actores-independientes',independientes);
    contenedor.dataset.modoActores=independientes?'independientes':'compartidos';
    // Los documentos maestros son independientes de que los actores sean
    // comunes o distintos, por lo que siempre permanecen disponibles.
    if(registroPregunta)registroPregunta.hidden=independientes;
    const cargaMasiva=document.querySelector('.carga-masiva-documentos-contrato');
    cargaMasiva?.toggleAttribute('hidden',independientes);
    if(registroPregunta&&!independientes){
      ['contratista','interventor'].forEach(tipo=>{
        const selector=$(`${tipo}CompartidoPregunta`);if(!selector)return;
        const valor=selector.value;selector.innerHTML=`<option value="">Seleccione ${tipo}</option>${(catalogoActoresContractuales[tipo]||[]).map(registro=>`<option value="${registro.ruc}">${registro.nombre} · ${registro.ruc}</option>`).join('')}`;selector.value=valor;
        selector.onchange=()=>{sincronizarActorCompartido(tipo);actualizarConfiguracionActoresComponentes();};
      });
    }
    document.querySelectorAll('.gestion-contractual-componente').forEach(tarjeta=>{
      const titulo=tarjeta.querySelector('.barra-gestion-componente strong');
      // La configuración compartida no debe ocultar ni renombrar componentes:
      // sus títulos deben seguir identificando PSR, Redes y Tuberías.
      tarjeta.hidden=false;
      tarjeta.classList.toggle('actores-independientes',independientes);
      tarjeta.setAttribute('aria-hidden',tarjeta.hidden?'true':'false');
      if(!titulo)return;
      if(!titulo.dataset.tituloOriginal)titulo.dataset.tituloOriginal=titulo.textContent;
      titulo.textContent=titulo.dataset.tituloOriginal;
    });
    document.querySelectorAll('.fila-actores-contractuales').forEach(fila=>{
      if(!independientes)copiarDatosContratistaEnFila(fila);
    });
    if(descripcion)descripcion.textContent=independientes?'Registre contratista e interventor en cada componente. Los documentos del contrato se administran de manera independiente.':'Registre aquí los nombres del contratista y del interventor que se aplicarán a PSR-GNL, Redes y Tuberías de conexión.';
  }
  function valorResumenProyecto(id,simulado){const valor=$(id)?.value?.trim();return valor||simulado;}
  function geometriaResumenProyecto(){try{return JSON.parse($('proyectoGeometria').value||'null');}catch{return null;}}
  function renderMapaResumenProyecto(){
    if(mapaResumenProyecto){mapaResumenProyecto.remove();mapaResumenProyecto=null;}
    const contenedor=$('mapaResumenProyecto');if(!contenedor||!window.L)return;
    const geometria=geometriaResumenProyecto(),predeterminado=[-13.532,-71.947];let centro=predeterminado;
    if(geometria?.coordenadas?.length){centro=geometria.coordenadas.reduce((a,p)=>[a[0]+p[0]/geometria.coordenadas.length,a[1]+p[1]/geometria.coordenadas.length],[0,0]);}
    else if(geometria?.centro)centro=geometria.centro;
    else {const [lat,lng]=valorResumenProyecto('proyectoLocalizacion','').split(',').map(Number);if(Number.isFinite(lat)&&Number.isFinite(lng))centro=[lat,lng];}
    mapaResumenProyecto=L.map(contenedor,{zoomControl:true,attributionControl:true}).setView(centro,geometria?13:12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(mapaResumenProyecto);
    const capas=[];
    if(geometria?.coordenadas?.length)capas.push(L.polygon(geometria.coordenadas,{color:'#4e9b72',weight:3,fillColor:'#7bcd8f',fillOpacity:.26}).addTo(mapaResumenProyecto));
    if(geometria?.centro&&geometria?.radio)capas.push(L.circle(geometria.centro,{radius:geometria.radio,color:'#4e9b72',weight:3,fillColor:'#7bcd8f',fillOpacity:.26}).addTo(mapaResumenProyecto));
    L.marker(centro).addTo(mapaResumenProyecto).bindTooltip('Ubicación del proyecto',{permanent:true,direction:'top'}).openTooltip();
    if(capas.length){const limites=L.featureGroup(capas).getBounds();if(limites.isValid())mapaResumenProyecto.fitBounds(limites,{padding:[26,26],maxZoom:15});}
    mapaResumenProyecto.on('dblclick',evento=>{
      evento.originalEvent?.preventDefault();
      const codigo=$('proyectoCodigo')?.value?.trim(),proyecto=ciudades.find(item=>item.codigo===codigo)||proyectoReferenciaFicha();
      cerrarVistaCrearProyecto();
      if(proyecto)setTimeout(()=>mostrarDetalle(proyecto),80);
    });
    requestAnimationFrame(()=>mapaResumenProyecto?.invalidateSize());
  }
  function renderDocumentosLiquidacionResumen(){
    const documentos=[
      [['Pre-commissioning','S/ 1,240,000','Acta del interventor, protocolos de prueba y valorización.','Acta-precommissioning.pdf','Validado'],['Puesta en operación','S/ 540,000','Acta de recepción, conformidad y solicitud de transferencia.','Solicitud-transferencia.pdf','Pendiente']],
      [['Valorización lote 4','S/ 2,180,000','Cuadro de metrados, dossier, IDT y valorización validada.','Valorizacion-lote-04.pdf','Validado'],['Gasificación y cierre','S/ 1,120,000','Prueba conforme, acta de gasificación e informe Osinergmin.','Acta-gasificacion.pdf','En revisión']],
      [['Lote TC-04 habilitado','S/ 890,000','Listado de suministros, evidencia y validación del interventor.','Padron-TC-04.pdf','Validado'],['Liquidación de lote','S/ 420,000','Valorización, solicitud de transferencia y factura cuando corresponda.','Liquidacion-TC-04.pdf','Pendiente']]
    ];
    document.querySelectorAll('.documentos-liquidacion-resumen .detalle-liquidacion table').forEach((tabla,indice)=>{
      tabla.innerHTML=`<thead><tr><th>Hito</th><th>Monto</th><th>Sustento</th><th>Documento adjunto</th><th>Estado</th><th aria-label="Acciones"></th></tr></thead><tbody>${documentos[indice].map(([hito,monto,sustento,archivo,estado])=>`<tr><td><strong>${hito}</strong></td><td>${monto}</td><td>${sustento}</td><td><button type="button" class="ver-documento-liquidacion" title="Ver ${archivo}">${archivo}</button></td><td><span class="estado-documento ${estado==='Validado'?'listo':'pendiente'}">${estado}</span></td><td><button type="button" class="eliminar-registro-liquidacion" aria-label="Eliminar registro ${hito}" title="Eliminar registro"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"/></svg></button></td></tr>`).join('')}</tbody>`;
    });
  }
  function configurarPestanasLiquidacionResumen(){
    const seccion=$('contenidoResumenProyecto').querySelector('.documentos-liquidacion-resumen');
    const documentos=seccion?.querySelector('.desplegables-liquidacion');
    if(!seccion||!documentos)return;
    seccion.querySelector(':scope > header')?.remove();
    seccion.querySelector(':scope > p')?.remove();
    documentos.dataset.panelLiquidacion='documentos';
    const noConformidades=document.createElement('div');
    noConformidades.className='desplegables-liquidacion panel-no-conformidades-ficha';noConformidades.dataset.panelLiquidacion='no-conformidades';noConformidades.hidden=true;
    noConformidades.innerHTML=`<details><summary><span><b>01</b><strong>PSR-GNL</strong><small>Hallazgos de planta</small></span><em>1 NC</em></summary><div class="detalle-liquidacion"><table><thead><tr><th>No conformidad</th><th>Estado</th><th>Acción requerida</th></tr></thead><tbody><tr><td>NC-PSR-001 · Señalización de seguridad</td><td><span class="estado-documento pendiente">Pendiente de subsanación</span></td><td>El contratista debe adjuntar evidencia fotográfica y acta de cierre.</td></tr></tbody></table></div></details><details><summary><span><b>02</b><strong>Redes de distribución</strong><small>Hallazgos de obra</small></span><em>1 NC</em></summary><div class="detalle-liquidacion"><table><thead><tr><th>No conformidad</th><th>Estado</th><th>Acción requerida</th></tr></thead><tbody><tr><td>NC-RED-004 · Profundidad de zanja</td><td><span class="estado-documento pendiente">Pendiente de verificación</span></td><td>El Interventor debe revisar el metrado corregido y las fotos georreferenciadas.</td></tr></tbody></table></div></details><details><summary><span><b>03</b><strong>Tuberías de conexión</strong><small>Hallazgos de habilitación</small></span><em>1 NC</em></summary><div class="detalle-liquidacion"><table><thead><tr><th>No conformidad</th><th>Estado</th><th>Acción requerida</th></tr></thead><tbody><tr><td>NC-TC-002 · Prueba de hermeticidad</td><td><span class="estado-documento listo">Cerrada</span></td><td>Conformidad validada por el Interventor.</td></tr></tbody></table></div></details>`;
    noConformidades.insertAdjacentHTML('afterbegin',`<section class="copia-tablas-ficha" aria-label="Seguimiento de hitos y servicios"><article class="copia-tabla-ficha"><h4>Hitos de pago</h4><table><thead><tr><th>Entidad</th><th>Descripción</th><th>%</th><th>Fecha prevista</th><th>Seguimiento</th><th>Sustento</th><th>Acción</th></tr></thead><tbody><tr><td><span class="origen-hito">FISE</span></td><td>Packing list y Bill of Lading</td><td>10%</td><td>Por definir</td><td><span class="estado-seguimiento observado">Observado</span></td><td>PDF adjunto</td><td><button type="button" class="ver-documento-liquidacion">Ver</button></td></tr><tr><td><span class="origen-hito">FISE</span></td><td>Acta de llegada y obras eléctricas</td><td>25%</td><td>Por definir</td><td><span class="estado-seguimiento conforme">Conforme</span></td><td>PDF adjunto</td><td><button type="button" class="ver-documento-liquidacion">Ver</button></td></tr></tbody></table></article><article class="copia-tabla-ficha"><h4>Servicios</h4><table><thead><tr><th>Entidad</th><th>Descripción</th><th>Unidad</th><th>Cantidad</th><th>Avance</th><th>Seguimiento</th><th>Sustento</th><th>Acción</th></tr></thead><tbody><tr><td><span class="origen-hito">FISE</span></td><td>Planta satélite de regasificación</td><td>Planta</td><td>1</td><td>0%</td><td><span class="estado-seguimiento observado">Observado</span></td><td>PDF adjunto</td><td><button type="button" class="ver-documento-liquidacion">Ver</button></td></tr></tbody></table></article></section>`);
    const copiaTablas=noConformidades.querySelector('.copia-tablas-ficha');
    if(copiaTablas)documentos.insertAdjacentElement('afterbegin',copiaTablas.cloneNode(true));
    noConformidades.querySelector('.copia-tablas-ficha')?.remove();
    documentos.querySelector('.copia-tablas-ficha')?.remove();
    const datosFinales=[['Packing list y Bill of Lading','10%','Planta satélite de regasificación','Planta','1','0%'],['Valorización de redes lote 4','25%','Redes de abastecimiento','km','25','68%'],['Habilitación de conexiones TC','65%','Tuberías de conexión','und','1000','62%']];
    const iconoVistaFicha='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>';
    const iconoRequisitosFicha='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5zM16 3v4h4M8 11h8M8 15h5M8 19h5"/><path d="m8 8 1.5 1.5L12 7"/></svg>';
    const vistaPdfFinal='<span class="sustento-final sin-sustento-final">Sin sustento del contratista</span>';
    const accionesFinales=`<span class="acciones-ficha-final"><button type="button" class="ver-requisitos-ficha" title="Mostrar u ocultar requisitos" aria-label="Mostrar u ocultar requisitos" aria-expanded="true">${iconoRequisitosFicha}</button></span>`;
    const requisitosFinales=avance=>`<div class="requisitos-ficha-final"><h4>Requisitos</h4><table><thead><tr><th>Descripción</th><th>Unidad</th><th>Cantidad</th><th>Avance</th><th>Sustento</th></tr></thead><tbody><tr><td>Documento de soporte del hito</td><td>Documento</td><td>1</td><td>${avance}</td><td>${vistaPdfFinal}</td></tr></tbody></table></div>`;
    const subtablasFinales=([hito,porcentaje,servicio,unidad,cantidad,avance])=>`<section class="subtablas-ficha-final"><div><h4>Hitos de pago</h4><table><thead><tr><th>Entidad</th><th>Descripción</th><th>%</th><th>Fecha prevista</th><th>Seguimiento</th><th>Sustento</th><th>Acción</th></tr></thead><tbody><tr><td><span class="origen-hito">FISE</span></td><td>${hito}</td><td>${porcentaje}</td><td>Por definir</td><td><span class="estado-seguimiento observado">Observado</span></td><td>${vistaPdfFinal}</td><td>${accionesFinales}</td></tr></tbody></table>${requisitosFinales(avance)}</div><div><h4>Servicios</h4><table><thead><tr><th>Entidad</th><th>Descripción</th><th>Unidad</th><th>Cantidad</th><th>Avance</th><th>Seguimiento</th><th>Sustento</th><th>Acción</th></tr></thead><tbody><tr><td><span class="origen-hito">FISE</span></td><td>${servicio}</td><td>${unidad}</td><td>${cantidad}</td><td>${avance}</td><td><span class="estado-seguimiento conforme">Conforme</span></td><td>${vistaPdfFinal}</td><td>${accionesFinales}</td></tr></tbody></table>${requisitosFinales(avance)}</div></section>`;
    documentos.querySelectorAll('details').forEach((detalle,indice)=>detalle.querySelector('.detalle-liquidacion')?.insertAdjacentHTML('afterbegin',subtablasFinales(datosFinales[indice])));
    // Retira el listado financiero referencial anterior: la ficha se alimenta
    // exclusivamente de los hitos y requisitos registrados en el asistente.
    documentos.querySelectorAll('.detalle-liquidacion > table').forEach(tabla=>tabla.remove());
    const parametros=(proyectoSeleccionado||proyectoEdicionSeleccionado)?.parametrosContractuales||[];
    const valorFicha=valor=>escapePlanificacion(String(valor||''));
    const fechaFicha=fecha=>fecha?fecha.split('-').reverse().join('/'):'Por definir';
    const claseEstadoFicha=estado=>/validado|conforme/i.test(estado)?'conforme':'observado';
    // En Masificación no se cargan archivos: únicamente se visualizan los que
    // posteriormente registra el contratista en su propia ficha.
    const sustentoFicha=()=>'<span class="sustento-final sin-sustento-final">Sin sustento del contratista</span>';
    const requisitosFilaFicha=hito=>{
      const requisitos=hito.requisitos?.length?hito.requisitos:[{descripcion:'Sin requisitos registrados',unidad:'—',cantidad:'—',avance:'—'}];
      return `<tr class="fila-requisitos-ficha" hidden><td colspan="7"><section class="requisitos-ficha-final"><h4>Requisitos del hito</h4><table><thead><tr><th>Descripción</th><th>Unidad</th><th>Cantidad</th><th>Avance</th><th>Sustento</th></tr></thead><tbody>${requisitos.map(requisito=>`<tr><td>${valorFicha(requisito.descripcion||'—')}</td><td>${valorFicha(requisito.unidad||'—')}</td><td>${valorFicha(requisito.cantidad||'—')}</td><td>${valorFicha(requisito.avance||'0')}%</td><td>${sustentoFicha()}</td></tr>`).join('')}</tbody></table></section></td></tr>`;
    };
    const accionFilaRequisitos=`<span class="acciones-ficha-final"><button type="button" class="ver-requisitos-fila" title="Ver requisitos" aria-label="Ver requisitos" aria-expanded="false">${iconoRequisitosFicha}</button></span>`;
    const aplicarParametrosGuardados=panel=>panel.querySelectorAll('details').forEach((detalle,indice)=>{
      const parametro=parametros[indice],hitos=parametro?.hitos||(parametro?.hito?[{...parametro,requisitos:parametro.requisito?[{descripcion:parametro.requisito,unidad:'Documento',cantidad:'1',avance:'0',sustento:parametro.sustento}]:[]}]:[]);
      if(!hitos?.length)return;
      const bloque=detalle.querySelector('.subtablas-ficha-final>div:first-child');
      const tabla=bloque?.querySelector('table');
      if(!bloque||!tabla)return;
      const encabezados=tabla.tHead?.rows?.[0]?.cells;
      if(encabezados?.[4])encabezados[4].textContent='Estado';
      tabla.tBodies[0].innerHTML=hitos.map(hito=>`<tr><td><span class="origen-hito">FISE</span></td><td class="hito-desplegable" role="button" tabindex="0" aria-label="Ver requisitos de ${valorFicha(hito.hito)}" aria-expanded="false"><span>${valorFicha(hito.hito)}</span><b aria-hidden="true">›</b></td><td>${valorFicha(hito.porcentaje||'0')}%</td><td>${fechaFicha(hito.fecha)}</td><td><span class="estado-seguimiento ${claseEstadoFicha(hito.estado)}">${valorFicha(hito.estado||'Por iniciar')}</span></td><td>${sustentoFicha()}</td><td>${accionFilaRequisitos}</td></tr>${requisitosFilaFicha(hito)}`).join('');
      bloque.querySelector('.requisitos-ficha-final')?.remove();
    });
    aplicarParametrosGuardados(documentos);
    const pestañas=document.createElement('div');pestañas.className='pestanas-liquidacion';pestañas.setAttribute('role','tablist');
    pestañas.innerHTML='<button type="button" class="activa" role="tab" aria-selected="true" data-tab-liquidacion="documentos">Documentos de liquidación</button><button type="button" role="tab" aria-selected="false" data-tab-liquidacion="no-conformidades">No conformidades</button>';
    documentos.before(pestañas);documentos.after(noConformidades);
    pestañas.addEventListener('click',evento=>{const boton=evento.target.closest('[data-tab-liquidacion]');if(!boton)return;const tab=boton.dataset.tabLiquidacion;pestañas.querySelectorAll('button').forEach(item=>{const activa=item===boton;item.classList.toggle('activa',activa);item.setAttribute('aria-selected',String(activa));});seccion.querySelectorAll('[data-panel-liquidacion]').forEach(panel=>panel.hidden=panel.dataset.panelLiquidacion!==tab);});
  }
  function renderResumenFinalProyecto(){
    const datos={codigo:valorResumenProyecto('proyectoCodigo','FISE-2026-CUS-001'),nombre:valorResumenProyecto('proyectoNombre','Proyecto Especial de Masificación · Cusco'),departamento:valorResumenProyecto('proyectoDepartamento','Cusco'),provincia:valorResumenProyecto('proyectoProvincia','Cusco'),distrito:valorResumenProyecto('proyectoDistrito','San Jerónimo'),contrato:valorResumenProyecto('proyectoContrato','Contrato 2023-VII'),contratista:valorResumenProyecto('proyectoEmpresaContratista','PA-FARMIN / NAGASCO'),interventor:valorResumenProyecto('proyectoInterventor','END Perú / OCA'),estado:valorResumenProyecto('proyectoEstado','En ejecución'),inicio:valorResumenProyecto('proyectoFechaInicio','2026-04-01'),fin:valorResumenProyecto('proyectoFechaFin','2026-09-30')};
    const actividades=cronogramaBorrador.length||8,componentes=[...componentesProyectoCompletados].length,beneficiarios=Number($('proyectoBeneficiarios').value)||306616,simulado=componentes===0?'Datos referenciales simulados hasta completar los formularios.':'Información consolidada desde los formularios registrados.';
    const calcularAvanceContractual=tablaId=>{const porcentajes=[...document.querySelectorAll(`#${tablaId}>tr input[type="number"][max="100"]`)].map(entrada=>entrada.value.trim()).filter(Boolean).map(Number).filter(Number.isFinite),porcentaje=Math.round(porcentajes.reduce((total,valor)=>total+valor,0)*100)/100;return {porcentaje,progreso:Math.min(100,porcentaje),subtareas:porcentajes.length};},avancePsr=calcularAvanceContractual('tablaHitosPsr'),avanceRedes=calcularAvanceContractual('tablaHitosRedes'),avanceTcs=calcularAvanceContractual('tablaHitosTc'),detalleAvance=avance=>`${avance.subtareas} subtarea${avance.subtareas===1?'':'s'} · % contractual acumulado`,tarjetasAvance=[['PSR-GNL',avancePsr],['Redes',avanceRedes],['TCs',avanceTcs]];
    $('contenidoResumenProyecto').innerHTML=`<div class="resumen-maestro-proyecto"><section class="hero-resumen-proyecto"><div><small>FICHA CONSOLIDADA</small><h2>${escapePlanificacion(datos.nombre)}</h2><p>Ubicación GIS, actores, avances, costos y desempeño consolidado del proyecto.</p><span class="insignia-resumen">${escapePlanificacion(datos.contrato)}</span><span class="insignia-resumen exito">${escapePlanificacion(datos.estado)}</span></div><div class="actualizacion-resumen"><small>ÚLTIMA ACTUALIZACIÓN</small><strong>09/09/2026 · 08:45</strong><span>${simulado}</span></div><div class="metricas-resumen"><article><small>Programado</small><strong>72.8%</strong></article><article><small>Declarado contratista</small><strong>69.2%</strong></article><article><small>Verificado interventor</small><strong>67.9%</strong></article><article><small>Liquidable FISE</small><strong>55.0%</strong></article></div></section><div class="resumen-cuadricula"><section class="panel-resumen mapa-resumen"><header><h3>Ubicación GIS del proyecto</h3><span>OpenStreetMap</span></header><div id="mapaResumenProyecto" aria-label="Mapa OpenStreetMap del proyecto"></div><p>Mapa base OpenStreetMap. Muestra la ubicación y el área registrada del proyecto.</p></section><section class="panel-resumen datos-resumen"><header><h3>Datos generales del proyecto</h3><span>Resumen maestro</span></header><div class="datos-resumen-grid"><article><small>Código</small><strong>${escapePlanificacion(datos.codigo)}</strong></article><article><small>Departamento</small><strong>${escapePlanificacion(datos.departamento)}</strong></article><article><small>Provincia</small><strong>${escapePlanificacion(datos.provincia)}</strong></article><article><small>Distrito</small><strong>${escapePlanificacion(datos.distrito)}</strong></article><article><small>Contratista</small><strong>${escapePlanificacion(datos.contratista)}</strong></article><article><small>Interventor</small><strong>${escapePlanificacion(datos.interventor)}</strong></article><article><small>PSR-GNL</small><strong>1 unidad</strong></article><article><small>Redes</small><strong>25,000 ml</strong></article><article><small>TCs</small><strong>1,000 suministros</strong></article><article><small>Beneficiarios GIS</small><strong>${beneficiarios.toLocaleString('es-PE')}</strong></article></div><div class="estado-componentes-resumen">${tarjetasAvance.map(([componente,avance])=>`<article><strong>${componente}</strong><span>${detalleAvance(avance)}</span><b style="--avance:${avance.progreso}%">${avance.porcentaje}%</b></article>`).join('')}</div></section><section class="panel-resumen tabla-actores-resumen"><header><h3>Seguimiento de avances por actor</h3><span>Trazabilidad del avance</span></header><table><thead><tr><th>Actor</th><th>Rol</th><th>Avance</th><th>Último evento</th></tr></thead><tbody><tr><td>Contratista</td><td>Declara avance físico</td><td>69.2%</td><td>Parte diario + valorización lote 4</td></tr><tr><td>Interventor</td><td>Verifica y mide</td><td>67.9%</td><td>IDT semanal consolidado</td></tr><tr><td>PETROPERÚ</td><td>Valida según contrato</td><td>66.8%</td><td>Conformidad técnica parcial</td></tr><tr><td>OSINERGMIN</td><td>Supervisión regulatoria</td><td>58.0%</td><td>Inspección de Redes lote 2</td></tr><tr><td>FISE</td><td>Liquidable / pagable</td><td>55.0%</td><td>Liquidación parcial aprobada</td></tr></tbody></table></section><section class="panel-resumen costo-resumen"><header><h3>Costo actualizado vs presupuesto</h3><span>Control financiero</span></header><div class="costos-kpi"><article><small>Presupuesto / monto contractual</small><strong>S/ 12,500,000</strong></article><article><small>Costo actualizado</small><strong>S/ 8,940,000</strong></article><article><small>Comprometido por ejecutar</small><strong>S/ 2,710,000</strong></article><article><small>Desembolsado</small><strong>S/ 6,870,000</strong></article></div><p>Presupuesto consumido: <b>71.5%</b> · Actividades registradas: <b>${actividades}</b> · Formularios completos: <b>${componentes} de 3</b>.</p></section></div><section class="panel-resumen curva-s-resumen"><header><h3>Curva S del proyecto</h3><span>Programado · declarado · verificado · liquidable</span></header><div class="leyenda-curva-s"><i class="programado"></i>Programado <i class="declarado"></i>Declarado <i class="verificado"></i>Verificado <i class="liquidable"></i>Liquidable</div><svg viewBox="0 0 960 300" role="img" aria-label="Curva S con avance programado, declarado, verificado y liquidable"><g class="rejilla-curva"><path d="M70 35H925M70 90H925M70 145H925M70 200H925M70 255H925M70 35V255M192 35V255M314 35V255M436 35V255M558 35V255M680 35V255M802 35V255M925 35V255"/></g><g class="etiquetas-curva"><text x="26" y="258">0%</text><text x="18" y="203">25%</text><text x="18" y="148">50%</text><text x="18" y="93">75%</text><text x="10" y="38">100%</text><text x="70" y="282">M1</text><text x="192" y="282">M2</text><text x="314" y="282">M3</text><text x="436" y="282">M4</text><text x="558" y="282">M5</text><text x="680" y="282">M6</text><text x="802" y="282">M7</text><text x="910" y="282">M8</text></g><polyline class="linea-curva programado" points="70,248 192,235 314,215 436,185 558,145 680,105 802,68 925,42"/><polyline class="linea-curva declarado" points="70,251 192,241 314,224 436,198 558,160 680,122 802,84 925,72"/><polyline class="linea-curva verificado" points="70,254 192,245 314,230 436,207 558,172 680,132 802,93 925,82"/><polyline class="linea-curva liquidable" points="70,255 192,250 314,242 436,225 558,195 680,163 802,123 925,135"/></svg><p>La Curva S muestra valores referenciales hasta que los formularios de avance alimenten el cálculo real.</p></section></div>`;
    const panelMapaResumen=$('contenidoResumenProyecto').querySelector('.mapa-resumen');
    panelMapaResumen?.querySelector('p')?.remove();
    const estadoPap=$('proyectoIncluidoPap').value||'';
    const textoPap=estadoPap==='Sí'?'Sí, está en el PAP':estadoPap==='No'?'No está en el PAP':'PAP pendiente de registro';
    panelMapaResumen?.querySelector('#mapaResumenProyecto')?.insertAdjacentHTML('afterend',`<div class="acciones-mapa-resumen"><span class="estado-pap-ficha ${estadoPap==='Sí'?'incluido':estadoPap==='No'?'no-incluido':'pendiente'}"><small>ESTADO PAP</small><b>${textoPap}</b></span><button type="button" data-abrir-documentos-ficha>Documentos adjuntos</button></div>`);
    if(!$('modalDocumentosFichaProyecto'))document.body.insertAdjacentHTML('beforeend','<dialog class="modal-vista-pdf modal-lista-pdf" id="modalDocumentosFichaProyecto"><header><div><small>FICHA DEL PROYECTO</small><h2>Documentos adjuntos</h2><p>Seleccione el ícono de ojo para previsualizar el archivo.</p></div><button type="button" data-cerrar-documentos-ficha aria-label="Cerrar">×</button></header><div class="cuerpo-vista-pdf"><div class="tabla-documentos-convenio"><table><thead><tr><th>Documento</th><th>Origen</th><th>Acción</th></tr></thead><tbody id="listaDocumentosFichaProyecto"></tbody></table></div></div><footer><button type="button" data-cerrar-documentos-ficha>Cerrar</button></footer></dialog><dialog class="modal-vista-pdf modal-visor-pdf" id="modalVistaDocumentoFichaProyecto"><header><div><small>VISTA PREVIA</small><h2 id="tituloVistaDocumentoFichaProyecto">Documento</h2></div><button type="button" data-cerrar-vista-documento-ficha aria-label="Cerrar">×</button></header><div class="cuerpo-vista-pdf" id="contenidoVistaDocumentoFichaProyecto"></div><footer><button type="button" id="volverDocumentosFichaProyecto">Volver a documentos</button><button type="button" data-cerrar-vista-documento-ficha>Cerrar</button></footer></dialog>');
    const obtenerDocumentosFicha=()=>{const agrupar=(origen,archivos)=>[...archivos].map(archivo=>({nombre:archivo.name,origen,archivo}));const documentos=[...agrupar('Convenio FISE – GORE',$('proyectoArchivoConvenio').files),...agrupar('Información territorial / GIS',$('archivoAreasGIS').files),...agrupar('Documentación contractual',[...documentosMontoPlazoActor.values()]),...agrupar('Archivos de actores',[...archivosActoresContractuales.values()].flat()),...agrupar('Baremos y precios',[...archivosBaremoComponentes.values()].flat())];if(!documentos.length&&proyectoEdicionSeleccionado?.archivoConvenio)documentos.push({nombre:proyectoEdicionSeleccionado.archivoConvenio,origen:'Convenio FISE – GORE',archivo:null});return documentos;};
    const abrirDocumentosFicha=()=>{const documentos=obtenerDocumentosFicha(),lista=$('listaDocumentosFichaProyecto');lista._documentos=documentos;lista.innerHTML=documentos.length?documentos.map((documento,indice)=>`<tr><td>${escapePlanificacion(documento.nombre)}</td><td>${escapePlanificacion(documento.origen)}</td><td><button type="button" data-ver-documento-ficha="${indice}" ${documento.archivo?'':'disabled title="Archivo no disponible para previsualizar"'} aria-label="Ver ${escapePlanificacion(documento.nombre)}">👁 Ver</button></td></tr>`).join(''):'<tr><td colspan="3">No hay documentos adjuntos en la ficha.</td></tr>';$('modalDocumentosFichaProyecto').showModal();};
    panelMapaResumen?.querySelector('[data-abrir-documentos-ficha]')?.addEventListener('click',abrirDocumentosFicha);
    document.querySelectorAll('[data-cerrar-documentos-ficha]').forEach(boton=>boton.onclick=()=>$('modalDocumentosFichaProyecto').close());
    $('listaDocumentosFichaProyecto').onclick=evento=>{const boton=evento.target.closest('[data-ver-documento-ficha]');if(!boton)return;const documento=evento.currentTarget._documentos?.[Number(boton.dataset.verDocumentoFicha)];if(!documento?.archivo)return;const contenido=$('contenidoVistaDocumentoFichaProyecto'),url=URL.createObjectURL(documento.archivo);contenido._url=url;$('tituloVistaDocumentoFichaProyecto').textContent=documento.nombre;contenido.innerHTML=documento.archivo.type.startsWith('image/')?`<img src="${url}" alt="${escapePlanificacion(documento.nombre)}">`:documento.archivo.type==='application/pdf'||/\.pdf$/i.test(documento.nombre)?`<iframe src="${url}" title="${escapePlanificacion(documento.nombre)}"></iframe>`:'<p class="archivo-sin-vista-previa">Este tipo de archivo no tiene vista previa integrada. Puede consultarlo desde el registro original.</p>';$('modalDocumentosFichaProyecto').close();$('modalVistaDocumentoFichaProyecto').showModal();};
    const cerrarVistaDocumentoFicha=()=>{const contenido=$('contenidoVistaDocumentoFichaProyecto');if(contenido._url)URL.revokeObjectURL(contenido._url);contenido._url='';contenido.replaceChildren();$('modalVistaDocumentoFichaProyecto').close();};
    document.querySelectorAll('[data-cerrar-vista-documento-ficha]').forEach(boton=>boton.onclick=cerrarVistaDocumentoFicha);
    $('volverDocumentosFichaProyecto').onclick=()=>{cerrarVistaDocumentoFicha();$('modalDocumentosFichaProyecto').showModal();};
    const tablaActores=$('contenidoResumenProyecto').querySelector('.tabla-actores-resumen table'),componentesPorActor=['Redes de distribución','PSR-GNL','Tuberías de conexión','Redes de distribución','Proyecto integral'];
    if(tablaActores){tablaActores.tHead.rows[0].cells[1].textContent='Componente';[...tablaActores.tBodies[0].rows].forEach((fila,indice)=>{fila.cells[1].textContent=componentesPorActor[indice]||'Proyecto integral';});}
    const seguimientoGeneral=[['Contratista','Redes de distribución','69.2%','Parte diario + valorización lote 4'],['Interventor','PSR-GNL','67.9%','IDT semanal consolidado'],['PETROPERÚ','Tuberías de conexión','66.8%','Conformidad técnica parcial'],['OSINERGMIN','Redes de distribución','58.0%','Inspección de Redes lote 2'],['FISE','Proyecto integral','55.0%','Liquidación parcial aprobada']],seguimientoPorComponente={
      'PSR-GNL':[['Contrato','PSR-GNL',`${avancePsr.porcentaje}%`,detalleAvance(avancePsr)]],
      Redes:[['Contrato','Redes de distribución',`${avanceRedes.porcentaje}%`,detalleAvance(avanceRedes)]],
      TCs:[['Contrato','Tuberías de conexión',`${avanceTcs.porcentaje}%`,detalleAvance(avanceTcs)]]
    },panelSeguimiento=$('contenidoResumenProyecto').querySelector('.tabla-actores-resumen'),tarjetasComponentes=[...$('contenidoResumenProyecto').querySelectorAll('.estado-componentes-resumen article')];
    const actualizarSeguimientoComponente=componente=>{const filas=componente?seguimientoPorComponente[componente]||[]:seguimientoGeneral;if(!panelSeguimiento)return;panelSeguimiento.querySelector('h3').textContent=componente?`Seguimiento de avances por componente · ${componente}`:'Seguimiento general de avances';tablaActores.tBodies[0].innerHTML=filas.map(([actor,item,avance,event])=>`<tr><td>${actor}</td><td>${item}</td><td>${avance}</td><td>${event}</td></tr>`).join('');tarjetasComponentes.forEach(tarjeta=>tarjeta.classList.toggle('seleccionada',tarjeta.dataset.componenteSeguimiento===componente));};
    tarjetasComponentes.forEach(tarjeta=>{const componente=tarjeta.querySelector('strong')?.textContent.trim();if(!seguimientoPorComponente[componente])return;const boton=document.createElement('button');boton.type='button';boton.className='boton-componente-seguimiento';boton.dataset.componenteSeguimiento=componente;boton.innerHTML=tarjeta.innerHTML;boton.addEventListener('click',()=>actualizarSeguimientoComponente(boton.classList.contains('seleccionada')?null:componente));tarjeta.replaceWith(boton);const indice=tarjetasComponentes.indexOf(tarjeta);tarjetasComponentes[indice]=boton;});
    actualizarSeguimientoComponente(null);
    const contenedorComponentes=$('contenidoResumenProyecto').querySelector('.estado-componentes-resumen'),fasesResumen=leerFasesProyecto(),fasesLinea=fasesResumen.length?fasesResumen:[{nombre:'Anteproyecto',inicio:'',fin:''},{nombre:'Proyecto',inicio:'',fin:''},{nombre:'Construcción',inicio:'',fin:''},{nombre:'Operación',inicio:'',fin:''}];
    contenedorComponentes?.insertAdjacentHTML('afterend',`<section class="linea-fases-resumen"><header><small>LÍNEA DE FASES DEL PROYECTO</small><span>${fasesResumen.length?'Fases registradas':'Fases referenciales'}</span></header><div>${fasesLinea.map((fase,indice)=>`<article class="${indice===fasesLinea.length-1?'ultima':''}"><b>${String(indice+1).padStart(2,'0')}</b><strong>${escapePlanificacion(fase.nombre||`Fase ${indice+1}`)}</strong><small>${fase.inicio||fase.fin?`${fase.inicio||'—'} · ${fase.fin||'—'}`:'Fechas por definir'}</small></article>`).join('')}</div></section>`);
    $('contenidoResumenProyecto').querySelector('.costo-resumen .costos-kpi')?.insertAdjacentHTML('afterend','<div class="tabla-indicadores-costo"><table><thead><tr><th>Indicador</th><th>Valor</th><th>Interpretación</th></tr></thead><tbody><tr><td>Variación presupuesto vs costo actualizado</td><td>S/ -3,560,000</td><td>Espacio disponible dentro del presupuesto</td></tr><tr><td>Presupuesto consumido</td><td>71.5%</td><td>Costo reconocido / presupuesto</td></tr><tr><td>Monto pendiente presupuestal</td><td>S/ 3,560,000</td><td>Saldo no reconocido</td></tr><tr><td>Pagado / costo actualizado</td><td>76.8%</td><td>Nivel de desembolso respecto al reconocido</td></tr></tbody></table></div>');
    $('contenidoResumenProyecto').querySelector('.curva-s-resumen')?.insertAdjacentHTML('beforebegin',`<section class="panel-resumen documentos-liquidacion-resumen"><header><div><small>EXPEDIENTE FINANCIERO</small><h3>Documentos de liquidación</h3></div><span>3 componentes</span></header><p>Revise los hitos y sustentos requeridos antes de habilitar la liquidación y el pago.</p><div class="desplegables-liquidacion"><details open><summary><span><b>01</b><strong>PSR-GNL</strong><small>Hitos y actas de planta</small></span><em>70% verificado</em></summary><div class="detalle-liquidacion"><table><thead><tr><th>Hito</th><th>Estado</th><th>Sustentos requeridos</th></tr></thead><tbody><tr><td>Pre-commissioning</td><td><span class="estado-documento listo">Validado</span></td><td>Acta del interventor, protocolos de prueba y valorización.</td></tr><tr><td>Puesta en operación</td><td><span class="estado-documento pendiente">Pendiente</span></td><td>Acta de recepción, conformidad y solicitud de transferencia.</td></tr></tbody></table></div></details><details><summary><span><b>02</b><strong>Redes de distribución</strong><small>Metrados y dossier de obra</small></span><em>68% verificado</em></summary><div class="detalle-liquidacion"><table><thead><tr><th>Hito</th><th>Estado</th><th>Sustentos requeridos</th></tr></thead><tbody><tr><td>Valorización lote 4</td><td><span class="estado-documento listo">Validado</span></td><td>Cuadro de metrados, dossier, IDT y valorización validada.</td></tr><tr><td>Gasificación y cierre</td><td><span class="estado-documento pendiente">En revisión</span></td><td>Prueba conforme, acta de gasificación e informe Osinergmin si aplica.</td></tr></tbody></table></div></details><details><summary><span><b>03</b><strong>Tuberías de conexión</strong><small>Lotes de suministros habilitados</small></span><em>62% verificado</em></summary><div class="detalle-liquidacion"><table><thead><tr><th>Hito</th><th>Estado</th><th>Sustentos requeridos</th></tr></thead><tbody><tr><td>Lote TC-04 habilitado</td><td><span class="estado-documento listo">Validado</span></td><td>Listado de suministros, evidencia y validación del interventor.</td></tr><tr><td>Liquidación de lote</td><td><span class="estado-documento pendiente">Pendiente</span></td><td>Valorización, solicitud de transferencia y factura cuando corresponda.</td></tr></tbody></table></div></details></div></section>`);
    renderDocumentosLiquidacionResumen();
    configurarPestanasLiquidacionResumen();
    $('contenidoResumenProyecto').querySelector('.desplegables-liquidacion details[open]')?.removeAttribute('open');
    const cadenaTrazabilidad=`${datos.codigo}|${datos.nombre}|${datos.contrato}|${datos.inicio}|${datos.fin}|${fasesLinea.map(fase=>fase.nombre).join('|')}`,hashTrazabilidad=[...cadenaTrazabilidad].reduce((hash,caracter)=>((hash<<5)-hash)+caracter.charCodeAt(0)|0,0),selloBlockchain=`0x${(hashTrazabilidad>>>0).toString(16).padStart(8,'0').toUpperCase()}`;
    $('contenidoResumenProyecto').insertAdjacentHTML('beforeend',`<section class="acciones-finales-ficha"><div><small>FICHA CONSOLIDADA DEL PROYECTO</small><h3>Descarga e impresión de ficha</h3><p>Incluye el sello de trazabilidad blockchain <b>${selloBlockchain}</b>.</p></div><div><button type="button" id="descargarFichaProyectoResumen">Descargar ficha PDF</button><button type="button" id="imprimirFichaProyectoResumen">Imprimir ficha + blockchain</button></div></section>`);
    $('contenidoResumenProyecto').querySelector('.acciones-finales-ficha p').innerHTML=`Incluye sello blockchain demostrativo de maqueta <b>${selloBlockchain}</b>.`;
    $('descargarFichaProyectoResumen').textContent='Guardar ficha como PDF';
    const descargarFichaProyecto=()=>{if(!window.jspdf?.jsPDF){window.print();return;}const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'}),filas=[['Código',datos.codigo],['Proyecto',datos.nombre],['Ubicación',`${datos.departamento} · ${datos.provincia} · ${datos.distrito}`],['Contrato',datos.contrato],['Contratista',datos.contratista],['Interventor',datos.interventor],['Estado PAP',$('proyectoIncluidoPap').value||'Pendiente'],['Trazabilidad blockchain',selloBlockchain]];doc.setFontSize(16);doc.setTextColor(23,49,83);doc.text('FICHA DEL PROYECTO · MASIFICACIÓN FISE',14,18);doc.setFontSize(9);doc.setTextColor(75,96,123);doc.text(`Emitida: ${new Date().toLocaleString('es-PE')}`,14,24);doc.autoTable({startY:30,head:[['Campo','Información']],body:filas,styles:{fontSize:8,cellPadding:3},headStyles:{fillColor:[41,92,126]}});const y=(doc.lastAutoTable?.finalY||95)+12;doc.setFontSize(10);doc.setTextColor(23,49,83);doc.text('Fases del proyecto',14,y);doc.autoTable({startY:y+4,head:[['Fase','Inicio','Fin']],body:fasesLinea.map(fase=>[fase.nombre||'—',fase.inicio||'Por definir',fase.fin||'Por definir']),styles:{fontSize:8,cellPadding:3},headStyles:{fillColor:[41,92,126]}});doc.setFontSize(8);doc.setTextColor(61,89,111);doc.text(`Sello de trazabilidad blockchain: ${selloBlockchain}`,14,(doc.lastAutoTable?.finalY||y+35)+10);doc.save(`ficha_${String(datos.codigo||'proyecto').replace(/[^a-z0-9_-]+/gi,'_')}.pdf`);};
    const imprimirFichaProyecto=()=>{const ventana=window.open('','_blank','width=1200,height=900');if(!ventana){window.print();return;}const estilos=[...document.querySelectorAll('link[rel="stylesheet"]')].map(enlace=>`<link rel="stylesheet" href="${enlace.href}">`).join(''),estilosLocales=[...document.querySelectorAll('style')].map(estilo=>`<style>${estilo.textContent}</style>`).join(''),ficha=$('contenidoResumenProyecto').innerHTML;ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ficha del proyecto · ${escapePlanificacion(datos.codigo)}</title>${estilos}${estilosLocales}<style>@page{size:A4 landscape;margin:11mm}body{margin:0;background:#fff!important}.resumen-final-proyecto{padding:0!important}.acciones-mapa-resumen,.acciones-finales-ficha button,.boton-componente-seguimiento{pointer-events:none}.modal-vista-pdf,dialog{display:none!important}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.resumen-maestro-proyecto{gap:10px}.hero-resumen-proyecto,.panel-resumen,.linea-fases-resumen,.acciones-finales-ficha{break-inside:avoid}.mapa-resumen #mapaResumenProyecto{height:270px!important}}</style></head><body><main class="resumen-final-proyecto">${ficha}</main><script>window.onload=()=>{setTimeout(()=>{window.focus();window.print();},300)};<\/script></body></html>`);ventana.document.close();};
    $('descargarFichaProyectoResumen').addEventListener('click',imprimirFichaProyecto);
    $('imprimirFichaProyectoResumen').addEventListener('click',imprimirFichaProyecto);
    renderMapaResumenProyecto();
  }
  function controlFormularioFise([etiqueta,tipo,requerido]){const id=`fise-${formularioFiseActivo}-${etiqueta.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}`,marca=requerido?' <em>*</em>':'';let control='';if(tipo==='textarea')control=`<textarea id="${id}" rows="3" ${requerido?'required':''}></textarea>`;else if(tipo==='file')control=`<input id="${id}" type="file" ${requerido?'required':''}>`;else if(tipo.startsWith('select:')){const opciones=tipo.slice(7).split('|');control=`<select id="${id}" ${requerido?'required':''}>${opciones.map((opcion,i)=>`<option value="${escapePlanificacion(opcion)}" ${i===0?'selected':''}>${escapePlanificacion(opcion)}</option>`).join('')}</select>`;}else{const type=tipo==='currency'?'number':tipo;const valor=etiqueta==='Código de proyecto'?$('proyectoCodigo').value:etiqueta==='Localidad'||etiqueta==='Sector o localidad'?$('proyectoDistrito').value:'';control=`<input id="${id}" type="${type}" ${tipo==='currency'?'step="0.01" min="0"':''} value="${escapePlanificacion(valor)}" ${requerido?'required':''}>`;}return `<label class="campo-formulario-fise${tipo==='textarea'||tipo==='file'?' campo-largo':''}" for="${id}"><span>${escapePlanificacion(etiqueta)}${marca}</span>${control}</label>`;}
  function filaCatalogoRedes(indice){return `<tr><td><input aria-label="Código de partida" placeholder="Ej. R-001" required></td><td><input aria-label="Partida o actividad" placeholder="Ej. Tendido de red PE" required></td><td><input aria-label="Unidad de medida" placeholder="km, und, m" required></td><td><input aria-label="Precio unitario sin IGV" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><input aria-label="Vigencia desde" type="date" required></td><td><input aria-label="Vigencia hasta" type="date"></td><td><select aria-label="Aprobación FISE"><option>Pendiente</option><option>Aprobado</option><option>Observado</option></select></td><td><button type="button" class="quitar-fila-catalogo" aria-label="Quitar partida ${indice}" title="Quitar partida">×</button></td></tr>`;}
  function tablaCatalogoRedes(){return `<section class="catalogo-precios-redes"><header><h4>Partidas del baremo de Redes</h4><p>Una fila representa una partida vigente: código, unidad, precio sin IGV y regla de aplicación.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Código <em>*</em></th><th>Partida o actividad <em>*</em></th><th>Unidad <em>*</em></th><th>Precio sin IGV <em>*</em></th><th>Vigencia desde <em>*</em></th><th>Vigencia hasta</th><th>Aprobación FISE <em>*</em></th><th aria-label="Acciones"></th></tr></thead><tbody>${filaCatalogoRedes(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-fila-catalogo>＋ Agregar partida</button></section>`;}
  function filaLiquidacionRedes(indice){return `<tr><td><input aria-label="Código de partida" placeholder="Ej. R-001" required></td><td><input aria-label="Tramo o partida" placeholder="Ej. Red secundaria sector norte" required></td><td><input aria-label="Unidad" placeholder="m, km, und" required></td><td><input aria-label="Metrado ejecutado" type="number" min="0" step="0.001" placeholder="0.000" required></td><td><input aria-label="Precio unitario sin IGV" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><input aria-label="Valorización sin IGV" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><input aria-label="Penalidad o deducción" type="number" min="0" step="0.01" placeholder="0.00"></td><td><button type="button" class="quitar-fila-liquidacion" aria-label="Quitar partida liquidada ${indice}" title="Quitar partida">×</button></td></tr>`;}
  function tablaLiquidacionRedes(){return `<section class="catalogo-precios-redes tabla-liquidacion-redes"><header><h4>Partidas liquidadas</h4><p>Detalle el metrado ejecutado y la valorización de cada partida. Las penalidades o deducciones se registran por separado.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Código <em>*</em></th><th>Tramo o partida <em>*</em></th><th>Unidad <em>*</em></th><th>Metrado ejecutado <em>*</em></th><th>Precio unitario sin IGV <em>*</em></th><th>Valorización sin IGV <em>*</em></th><th>Penalidad / deducción</th><th aria-label="Acciones"></th></tr></thead><tbody>${filaLiquidacionRedes(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-fila-liquidacion>＋ Agregar partida liquidada</button></section>`;}
  function filaPagoRedes(indice){return `<tr><td><input aria-label="Número de liquidación vinculada" placeholder="Ej. LQ-RED-001" required></td><td><input aria-label="Número de resolución" placeholder="Ej. R.D. N.° 001-2026" required></td><td><input aria-label="Monto aprobado" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><input aria-label="Fecha de pago" type="date"></td><td><select aria-label="Estado del pago"><option>Pendiente</option><option>Programado</option><option>Pagado</option></select></td><td><input aria-label="Expediente de pago" type="file"></td><td><button type="button" class="quitar-fila-pago" aria-label="Quitar pago ${indice}" title="Quitar pago">×</button></td></tr>`;}
  function tablaPagosRedes(){return `<section class="catalogo-precios-redes tabla-pagos-redes"><header><h4>Resoluciones y desembolsos</h4><p>Cada registro vincula una liquidación aprobada con su resolución, expediente y estado de pago.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Liquidación vinculada <em>*</em></th><th>Número de resolución <em>*</em></th><th>Monto aprobado <em>*</em></th><th>Fecha de pago</th><th>Estado <em>*</em></th><th>Expediente de pago</th><th aria-label="Acciones"></th></tr></thead><tbody>${filaPagoRedes(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-fila-pago>＋ Agregar resolución o pago</button></section>`;}
  function filaHitoPsr(indice){return `<tr><td><input aria-label="Hito contractual" placeholder="Ej. Entrega de equipos" required></td><td><input aria-label="Porcentaje del hito" type="number" min="0" max="100" step="0.01" placeholder="0" required></td><td><input aria-label="Fecha programada" type="date"></td><td><input aria-label="Revisor FISE" placeholder="Nombre del revisor" required></td><td><select aria-label="Estado de revisión"><option>Borrador</option><option>En revisión</option><option>Aprobado</option><option>Observado</option></select></td><td><input aria-label="Observaciones" placeholder="Opcional"></td><td><button type="button" class="quitar-fila-psr" aria-label="Quitar hito ${indice}">×</button></td></tr>`;}
  function tablaHitosPsr(){return `<section class="catalogo-precios-redes tabla-psr"><header><h4>Hitos contractuales PSR</h4><p>Registre los hitos y su flujo de aprobación FISE.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Hito contractual <em>*</em></th><th>% del hito <em>*</em></th><th>Fecha programada</th><th>Revisor FISE <em>*</em></th><th>Estado <em>*</em></th><th>Observaciones</th><th aria-label="Acciones"></th></tr></thead><tbody>${filaHitoPsr(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-hito-psr>＋ Agregar hito</button></section>`;}
  function filaRevisionPsr(indice){return `<tr><td><input aria-label="Hito evaluado" placeholder="Hito contractual" required></td><td><select aria-label="Resultado"><option>Aprobado</option><option>Observado</option><option>Rechazado</option></select></td><td><input aria-label="Informe técnico" type="file"></td><td><input aria-label="Aprobador FISE" placeholder="Nombre del aprobador" required></td><td><input aria-label="Fecha de decisión" type="date"></td><td><input aria-label="Comentarios" placeholder="Opcional"></td><td><button type="button" class="quitar-fila-psr" aria-label="Quitar revisión ${indice}">×</button></td></tr>`;}
  function tablaRevisionesPsr(){return `<section class="catalogo-precios-redes tabla-psr"><header><h4>Revisión y aprobación de hitos</h4><p>Documente cada revisión técnica y decisión FISE.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Hito evaluado <em>*</em></th><th>Resultado <em>*</em></th><th>Informe técnico</th><th>Aprobador FISE <em>*</em></th><th>Fecha de decisión</th><th>Comentarios</th><th aria-label="Acciones"></th></tr></thead><tbody>${filaRevisionPsr(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-revision-psr>＋ Agregar revisión</button></section>`;}
  function filaLiquidacionPsr(indice){return `<tr><td><input aria-label="Concepto liquidado" placeholder="Ej. Obra civil PSR" required></td><td><input aria-label="Monto liquidado" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><select aria-label="Conformidad técnica"><option>Pendiente</option><option>Sí</option><option>No</option></select></td><td><input aria-label="Acta de conformidad" type="file"></td><td><input aria-label="Responsable FISE" placeholder="Nombre del responsable" required></td><td><input aria-label="Observaciones de cierre" placeholder="Opcional"></td><td><button type="button" class="quitar-fila-psr" aria-label="Quitar liquidación ${indice}">×</button></td></tr>`;}
  function tablaLiquidacionesPsr(){return `<section class="catalogo-precios-redes tabla-psr"><header><h4>Liquidaciones PSR-GNL</h4><p>Consolide las liquidaciones y conformidades del componente.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Concepto liquidado <em>*</em></th><th>Monto liquidado <em>*</em></th><th>Conformidad técnica <em>*</em></th><th>Acta de conformidad</th><th>Responsable FISE <em>*</em></th><th>Observaciones</th><th aria-label="Acciones"></th></tr></thead><tbody>${filaLiquidacionPsr(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-liquidacion-psr>＋ Agregar liquidación</button></section>`;}
  function filaPagoPsr(indice){return `<tr><td><input aria-label="Número de resolución" placeholder="Ej. R.D. N.° 001-2026" required></td><td><input aria-label="Monto aprobado" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><input aria-label="Fecha de pago" type="date"></td><td><input aria-label="Expediente de pago" type="file"></td><td><button type="button" class="quitar-fila-psr" aria-label="Quitar pago ${indice}">×</button></td></tr>`;}
  function tablaPagosPsr(){return `<section class="catalogo-precios-redes tabla-psr"><header><h4>Resoluciones y pagos PSR-GNL</h4><p>Registre cada resolución y pago aprobado del componente.</p></header><div class="tabla-catalogo-redes"><table><thead><tr><th>Número de resolución <em>*</em></th><th>Monto aprobado <em>*</em></th><th>Fecha de pago</th><th>Expediente de pago</th><th aria-label="Acciones"></th></tr></thead><tbody>${filaPagoPsr(1)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-pago-psr>＋ Agregar pago</button></section>`;}
  function filaTc(indice,tipo){const filas={lote:`<td><input aria-label="Código de lote" placeholder="Ej. TC-001" required></td><td><input aria-label="Cantidad de TCs" type="number" min="0" step="1" placeholder="0" required></td><td><input aria-label="Padrón de beneficiarios" type="file" required></td><td><input aria-label="Responsable FISE" placeholder="Nombre del responsable" required></td><td><select aria-label="Estado del padrón"><option>Borrador</option><option>Validado</option><option>Observado</option></select></td>`,regla:`<td><input aria-label="Regla de habilitación" placeholder="Describa la regla" required></td><td><input aria-label="Documento de sustento" type="file"></td><td><select aria-label="Estado de validación"><option>Pendiente</option><option>Aprobado</option><option>Observado</option></select></td><td><input aria-label="Revisor FISE" placeholder="Nombre del revisor" required></td><td><input aria-label="Fecha de validación" type="date"></td>`,liquidacion:`<td><input aria-label="Lote o sector" placeholder="Ej. Sector norte" required></td><td><input aria-label="TCs habilitadas" type="number" min="0" step="1" placeholder="0" required></td><td><input aria-label="Monto liquidado" type="number" min="0" step="0.01" placeholder="0.00" required></td><td><select aria-label="Conformidad técnica"><option>Pendiente</option><option>Sí</option><option>No</option></select></td><td><input aria-label="Acta de conformidad" type="file"></td><td><input aria-label="Responsable FISE" placeholder="Nombre del responsable" required></td>`};return `<tr>${filas[tipo]}<td><button type="button" class="quitar-fila-tc" aria-label="Quitar registro ${indice}">×</button></td></tr>`;}
  function tablaTc(tipo){const configuracion={lote:{titulo:'Lotes maestros de TCs',descripcion:'Registre cada lote y su padrón de conexiones.',encabezados:['Código de lote','Cantidad de TCs','Padrón de beneficiarios','Responsable FISE','Estado del padrón'],boton:'＋ Agregar lote'},regla:{titulo:'Reglas de habilitación TC',descripcion:'Defina y valide las reglas aplicables a cada conexión.',encabezados:['Regla de habilitación','Documento de sustento','Estado de validación','Revisor FISE','Fecha de validación'],boton:'＋ Agregar regla'},liquidacion:{titulo:'Liquidaciones de TCs',descripcion:'Consolide las conexiones habilitadas y su liquidación.',encabezados:['Lote o sector','TCs habilitadas','Monto liquidado','Conformidad técnica','Acta de conformidad','Responsable FISE'],boton:'＋ Agregar liquidación'}}[tipo];return `<section class="catalogo-precios-redes tabla-tc"><header><h4>${configuracion.titulo}</h4><p>${configuracion.descripcion}</p></header><div class="tabla-catalogo-redes"><table><thead><tr>${configuracion.encabezados.map((encabezado,i)=>`<th>${encabezado}${[0,1,3].includes(i)?' <em>*</em>':''}</th>`).join('')}<th aria-label="Acciones"></th></tr></thead><tbody>${filaTc(1,tipo)}</tbody></table></div><button type="button" class="agregar-fila-catalogo" data-agregar-fila-tc="${tipo}">${configuracion.boton}</button></section>`;}
  function filaMatrizPsr(localidad,ubicacion,estados,numero,actual=false){
    const [provincia,distrito]=ubicacion.split(' · '),si=estados.filter(estado=>estado==='cumple').length,porcentaje=Math.round(si/estados.length*100),resultado=porcentaje>=80?'APTO':'NO APTO';
    const controles=estados.map((estado,indice)=>`<td><select class="select-psr-requisito" data-estado="${estado}" aria-label="Requisito ${indice+1}"><option value="pendiente" ${estado==='pendiente'?'selected':''}>—</option><option value="cumple" ${estado==='cumple'?'selected':''}>Sí</option><option value="no-cumple" ${estado==='no-cumple'?'selected':''}>No</option></select></td>`).join('');
    return `<tr class="fila-ejemplo-requisito${actual?' fila-matriz-actual':''}"><td>${numero}</td><td>${escapePlanificacion(provincia)}</td><td>${escapePlanificacion(distrito)}</td><td><strong>${escapePlanificacion(localidad)}</strong></td>${controles}<td class="porcentaje-ejemplo">${porcentaje}%</td><td class="resultado-ejemplo" data-resultado="${resultado==='APTO'?'apto':'no-apto'}">${resultado}</td>${columnasFisePlanificacion()}<td>${actual?'<span class="fila-actual-requisito">ACTUAL</span>':'<button type="button" class="editar-fila-requisito" aria-label="Editar localidad">✎</button>'}</td></tr>`;
  }
  function recalcularFilaMatrizPsr(fila){const selects=[...fila.querySelectorAll('.select-psr-requisito')];selects.forEach(select=>select.dataset.estado=select.value);const cumple=selects.filter(select=>select.value==='cumple').length,porcentaje=Math.round(cumple/selects.length*100),resultado=porcentaje>=80?'APTO':'NO APTO';fila.querySelector('.porcentaje-ejemplo').textContent=`${porcentaje}%`;const celda=fila.querySelector('.resultado-ejemplo');celda.textContent=resultado;celda.dataset.resultado=resultado==='APTO'?'apto':'no-apto';}
  function matrizRequisitosPsr(){
    const romanos=['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii','xiii'];
    const requisitos=requisitosTerrenoBase.map(([nombre,parametro],indice)=>`<article class="requisito-fise-vertical"><b>${romanos[indice]}</b><div class="requisito-fise-texto"><strong>${escapePlanificacion(nombre)}</strong><span>${escapePlanificacion(parametro)}</span></div><div class="opciones-requisito-fise" role="group" aria-label="Resultado de ${escapePlanificacion(nombre)}"><label><input type="radio" name="requisito-psr-${indice}" value="Sí" checked> Sí</label><label><input type="radio" name="requisito-psr-${indice}" value="No"> No</label></div></article>`).join('');
    return `<section class="matriz-requisitos-psr requisitos-fise-verticales"><header><h4>Requisitos técnicos mínimos FISE</h4><p>Registre el resultado de la evaluación de cada requisito del predio.</p></header><div class="lista-requisitos-fise-vertical">${requisitos}</div></section>`;
  }
  function renderFormulariosComponenteFise(){const componente=$('proyectoComponente').value||'redes',grupo=formulariosFisePorComponente[componente]||formulariosFisePorComponente.redes,formularios=grupo.formularios;formularioFiseActivo=Math.max(0,Math.min(formularioFiseActivo,formularios.length-1));const actual=formularios[formularioFiseActivo],matrizPsr=componente==='psr'&&formularioFiseActivo===1?matrizRequisitosPsr():'',catalogoRedes=componente==='redes'&&formularioFiseActivo===1?tablaCatalogoRedes():'',liquidacionRedes=componente==='redes'&&formularioFiseActivo===2?tablaLiquidacionRedes():'',pagosRedes=componente==='redes'&&formularioFiseActivo===3?tablaPagosRedes():'',hitosPsr=componente==='psr'&&formularioFiseActivo===2?tablaHitosPsr():'',revisionesPsr=componente==='psr'&&formularioFiseActivo===3?tablaRevisionesPsr():'',liquidacionesPsr=componente==='psr'&&formularioFiseActivo===4?tablaLiquidacionesPsr():'',pagosPsr=componente==='psr'&&formularioFiseActivo===5?tablaPagosPsr():'',tablasTc=componente==='tc'?tablaTc(['lote','regla','liquidacion'][formularioFiseActivo]):'';$('tituloFormulariosComponenteFise').textContent=grupo.nombre;$('subtituloFormulariosComponenteFise').textContent='Actor responsable: FISE · complete los formularios aplicables al componente seleccionado.';$('estadoFormulariosComponenteFise').textContent=`Actor responsable: FISE · ${formularioFiseActivo+1} de ${formularios.length}`;$('listaFormulariosComponenteFise').innerHTML=formularios.map(([nombre,proposito],indice)=>`<button type="button" class="formulario-fise-item ${indice===formularioFiseActivo?'activo':''}" data-formulario-fise="${indice}"><strong>${escapePlanificacion(nombre)}</strong><small>${escapePlanificacion(proposito)}</small></button>`).join('');const contenidoGeneral=`<div class="grilla-formulario-fise">${actual[2].map(([titulo,campos])=>`<fieldset class="grupo-formulario-fise"><legend>${escapePlanificacion(titulo)}</legend>${campos.map(controlFormularioFise).join('')}</fieldset>`).join('')}</div>`;const contenidoRedes=componente==='redes'&&formularioFiseActivo===1?catalogoRedes:componente==='redes'&&formularioFiseActivo===2?`${contenidoGeneral}${liquidacionRedes}`:componente==='redes'&&formularioFiseActivo===3?`${contenidoGeneral}${pagosRedes}`:'';$('formularioComponenteFise').innerHTML=`<div class="cabecera-formulario-fise"><small>FORMULARIO FISE</small><h3>${escapePlanificacion(actual[0])}</h3><p>${escapePlanificacion(actual[1])}</p></div>${contenidoRedes||hitosPsr||revisionesPsr||liquidacionesPsr||pagosPsr||tablasTc||contenidoGeneral}${matrizPsr}`;$('anteriorFormulariosComponenteFise').disabled=formularioFiseActivo===0;$('continuarFormulariosComponenteFise').textContent=formularioFiseActivo===formularios.length-1?'Finalizar componente':'Siguiente formulario';}
  function abrirFormulariosComponenteFise(){formularioFiseActivo=0;renderFormulariosComponenteFise();$('modalFormulariosComponenteFise').showModal();}
  function cerrarFormulariosComponenteFise(){if($('modalFormulariosComponenteFise').open)$('modalFormulariosComponenteFise').close();mostrarPasoAsistenteProyecto(4);}
  function mostrarPasoAsistenteProyecto(paso){pasoAsistenteProyecto=paso;vistaCrearProyecto.dataset.pasoActivo=paso;vistaCronogramaProyecto.dataset.pasoActivo=paso;if(vistaCrearProyecto.hidden)mostrarVistaCrearProyecto();const esParametros=paso===3,esPenalidades=paso===4,esFormularios=paso===5,esPasoGuardable=[1,2,3,4].includes(paso);$('pasoDatosProyecto').hidden=paso!==1;$('pasoComponentesProyecto').hidden=paso!==2&&!esParametros&&!esFormularios;$('pasoComponentesProyecto').classList.toggle('modo-formularios',esFormularios);$('pasoPenalidadesProyecto').hidden=!esPenalidades;document.querySelector('[data-panel-gestion-contractual="actores"]')?.toggleAttribute('hidden',paso!==2);document.querySelector('[data-panel-gestion-contractual="parametros"]')?.toggleAttribute('hidden',!esParametros);document.querySelector('.separador-formularios-componentes')?.toggleAttribute('hidden',!esFormularios);$('listaComponentesProyecto').hidden=!esFormularios;$('pasoBeneficiariosProyecto').hidden=true;$('pasoResumenProyecto').hidden=paso!==7;vistaCronogramaProyecto.hidden=paso!==6;$('anteriorAsistenteProyecto').hidden=true;$('cancelarCrearProyecto').hidden=true;$('guardarBorradorProyecto').hidden=true;$('continuarAsistenteProyecto').hidden=true;$('editarPasoProyecto').hidden=!esPasoGuardable;$('guardarPasoProyecto').hidden=!esPasoGuardable;$("guardarCrearProyecto").hidden=paso!==7;vistaCrearProyecto.querySelector('.acciones-crear-proyecto').hidden=!(esPasoGuardable||paso===7);$('estadoGuardadoPaso').textContent='';document.querySelector('.boton-subir-beneficiarios').hidden=!proyectoEdicionSeleccionado;actualizarIndicadorAsistente(paso);$('etiquetaCrearProyecto').textContent=`PASO ${paso} DE 7`;$('tituloCrearProyecto').textContent=paso===1?'Registro de ficha de proyecto':paso===2?'Gestión contractual':paso===3?'Parámetros contractuales':paso===4?'Penalidades':paso===5?'Formularios FISE':paso===6?'Cronograma':'Ficha de proyecto';$('descripcionCrearProyecto').textContent=paso===1?'Delimite el área GIS y complete las fechas, equipo y alcance del proyecto.':paso===2?'Registre contratista, interventora, contrato y documentos de cada componente.':paso===3?'Registre hitos de PSR y baremos aplicables para Redes y TCs.':paso===4?'Registre penalidades, descuentos y su estado contractual por componente.':paso===5?'Complete los formularios FISE de Redes, PSR-GNL y Tuberías de conexión.':paso===6?'Organice las actividades y fechas del proyecto.':'Consulte la ficha consolidada, compartida con todos los involucrados del proyecto.';if(paso===5)renderComponentesProyecto();if(paso===7)renderResumenFinalProyecto();}
  function abrirPlanificacionTecnica(){abrirFormulariosComponenteFise();}
  function proponerSubproyecto(codigoPadre) {
    const padre=ciudades.find(proyecto=>proyecto.codigo===codigoPadre);
    if(!padre||proyectoEdicionSeleccionado)return;
    const codigo=$('proyectoCodigo'),nombre=$('proyectoNombre');
    if(!codigo.value)codigo.value=`${padre.codigo}-SP-01`;
    if(!nombre.value)nombre.value=`${padre.nombre} - Componente`;
    $('proyectoFase').value=padre.fase||'Anteproyecto';
    if(!$('proyectoFechaInicio').value)$('proyectoFechaInicio').value=padre.fechaInicio||'';
    if(!$('proyectoFechaFin').value)$('proyectoFechaFin').value=padre.fechaFin||'';
    actualizarModoJerarquiaProyecto();
  }
  function crearCronogramaBase() {
    const fase=$('proyectoFase')?.value||'Anteproyecto';
    return [
      {codigo:'ACT-01',actividad:'Estudios y preparación',fase,inicio:'2026-08-17',fin:'2026-09-04',predecesora:'',sucesora:'2,3',avance:61,nivel:0,recursos:[{nombre:'Equipo de planificación',tipo:'Personal',cantidad:'3',horas:'8'}]},
      {codigo:'ACT-02',actividad:'Levantamiento y validación de información',fase,inicio:'2026-08-17',fin:'2026-08-21',predecesora:'1',sucesora:'3,4',avance:100,nivel:1,recursos:[{nombre:'Brigada de campo',tipo:'Cuadrilla',cantidad:'1',horas:'8'}]},
      {codigo:'ACT-03',actividad:'Diseño de red / ingeniería',fase,inicio:'2026-08-24',fin:'2026-09-02',predecesora:'2',sucesora:'5',avance:65,nivel:1,recursos:[{nombre:'Especialista GIS',tipo:'Personal',cantidad:'2',horas:'8'}]},
      {codigo:'ACT-04',actividad:'Permisos y coordinación',fase,inicio:'2026-08-27',fin:'2026-09-04',predecesora:'2',sucesora:'5',avance:35,nivel:1,recursos:[{nombre:'Gestor territorial',tipo:'Personal',cantidad:'1',horas:'8'}]},
      {codigo:'ACT-05',actividad:'Ejecución / construcción',fase:'Construcción',inicio:'2026-09-07',fin:'2026-09-25',predecesora:'3,4',sucesora:'6',avance:20,nivel:0,recursos:[{nombre:'Cuadrilla de instalación',tipo:'Cuadrilla',cantidad:'2',horas:'8'},{nombre:'Retroexcavadora',tipo:'Equipo',cantidad:'1',horas:'6'}]},
      {codigo:'ACT-06',actividad:'Pruebas, cierre y As-Built',fase:'Operación',inicio:'2026-09-28',fin:'2026-10-02',predecesora:'5',sucesora:'',avance:0,nivel:0,recursos:[{nombre:'Supervisor técnico',tipo:'Personal',cantidad:'1',horas:'8'}]},
      {codigo:'ACT-07',actividad:'Nueva actividad',fase,inicio:'2026-10-05',fin:'2026-10-09',predecesora:'6',sucesora:'',avance:0,nivel:1,recursos:[]}
    ];
  }
  function crearFilaCronograma(actividad={}) {
    const fila=document.createElement('tr');
    const indice=cronogramaBorrador.length+1;
    fila.dataset.nivel=String(actividad.nivel||0);
    fila.draggable=true;
    fila.innerHTML=`<td><input data-seleccion-cronograma type="checkbox" aria-label="Seleccionar actividad"></td><td><input data-cronograma="codigo" value="${actividad.codigo||`ACT-${String(indice).padStart(2,'0')}`}"></td><td><input data-cronograma="actividad" value="${actividad.actividad||''}" placeholder="Ej. Elaborar expediente"></td><td><select data-cronograma="fase"><option>Anteproyecto</option><option>Proyecto</option><option>Construcción</option><option>Operación</option></select></td><td><input data-cronograma="inicio" type="date" value="${actividad.inicio||''}"></td><td><input data-cronograma="fin" type="date" value="${actividad.fin||''}"></td><td><input data-cronograma="predecesora" value="${actividad.predecesora||''}" placeholder="ACT-01"></td><td><input data-cronograma="sucesora" value="${actividad.sucesora||''}" placeholder="ACT-03"></td><td><input data-cronograma="avance" type="number" min="0" max="100" value="${actividad.avance??0}"></td><td><button type="button" data-accion="eliminar-actividad" aria-label="Eliminar actividad">×</button></td>`;
    fila.querySelector('[data-cronograma="fase"]').value=actividad.fase||$('proyectoFase').value||'Anteproyecto';
    return fila;
  }
  function renderCronogramaProyecto() {
    const tabla=$('tablaCronogramaProyecto');
    tabla.replaceChildren();
    const actividades=cronogramaBorrador.length?cronogramaBorrador:[{actividad:'',fase:$('proyectoFase').value||'Anteproyecto'}];
    actividades.forEach(actividad=>tabla.append(crearFilaCronograma(actividad)));
    const codigo=$('proyectoCodigo').value||'Proyecto nuevo',nombre=$('proyectoNombre').value;
    $('cronogramaProyectoActual').textContent=nombre?`${codigo} · ${nombre}`:codigo;
    renderGanttCronograma();
  }
  function leerCronogramaProyecto() {
    cronogramaBorrador=[...$('tablaCronogramaProyecto').querySelectorAll('tr')].map(fila=>({...Object.fromEntries([...fila.querySelectorAll('[data-cronograma]')].map(campo=>[campo.dataset.cronograma,campo.value.trim()])),nivel:Number(fila.dataset.nivel||0)})).filter(actividad=>actividad.codigo||actividad.actividad);
  }
  function actualizarSeleccionCronograma() {
    const filas=[...$('tablaCronogramaProyecto').querySelectorAll('tr')],seleccionadas=filas.filter(fila=>fila.querySelector('[data-seleccion-cronograma]')?.checked);
    $('contadorSeleccionCronograma').textContent=`${seleccionadas.length} seleccionada${seleccionadas.length===1?'':'s'}`;
    $('seleccionarTodoCronograma').checked=!!filas.length&&seleccionadas.length===filas.length;
  }
  function ajustarNivelCronograma(delta) {
    const filas=[...$('tablaCronogramaProyecto').querySelectorAll('tr')];
    filas.forEach(fila=>{if(fila.querySelector('[data-seleccion-cronograma]')?.checked)fila.dataset.nivel=String(Math.max(0,Math.min(3,Number(fila.dataset.nivel||0)+delta)));});
    leerCronogramaProyecto();renderCronogramaProyecto();
  }
  function renderGanttCronograma() {
    const cabecera=$('cabeceraGanttCronograma'),contenedor=$('ganttCronogramaProyecto');
    if(!cabecera||!contenedor)return;
    const actividades=cronogramaBorrador.filter(item=>item.inicio&&item.fin);
    if(!actividades.length){cabecera.replaceChildren();contenedor.innerHTML='<p class="gantt-vacio">Agrega inicio y fin a una actividad para visualizar el Gantt.</p>';return;}
    const dia=86400000,fechas=actividades.flatMap(item=>[new Date(`${item.inicio}T00:00:00`),new Date(`${item.fin}T00:00:00`)]);
    let inicio=new Date(Math.min(...fechas)),fin=new Date(Math.max(...fechas));
    inicio.setDate(inicio.getDate()-1);fin.setDate(fin.getDate()+1);
    const total=Math.min(60,Math.max(7,Math.round((fin-inicio)/dia)+1));
    cabecera.style.cssText='background:#ffffff!important;color:#77849a!important;border-bottom:1px solid #e7ebf1!important;';
    cabecera.replaceChildren(...Array.from({length:total},(_,i)=>{const fecha=new Date(inicio.getTime()+i*dia),celda=document.createElement('span');celda.style.cssText='background:#ffffff!important;color:#77849a!important;border-right:1px solid #eef1f5!important;';celda.textContent=`${String(fecha.getDate()).padStart(2,'0')}/${String(fecha.getMonth()+1).padStart(2,'0')}`;return celda;}));
    contenedor.style.minWidth=`${total*42+58}px`;
    contenedor.replaceChildren(...cronogramaBorrador.map((item,indice)=>{
      const nivel=Math.max(0,Number(item.nivel)||0),esFase=nivel===0;
      const fila=document.createElement('div');fila.className=`gantt-fila gantt-nivel-${Math.min(nivel,3)}${esFase?' gantt-fase-principal':''}`;fila.style.width=`${total*42+58}px`;
      if(!item.inicio||!item.fin)return fila;
      const desde=new Date(`${item.inicio}T00:00:00`),hasta=new Date(`${item.fin}T00:00:00`);
      const izquierda=Math.max(0,Math.round((desde-inicio)/dia))*42;
      const ancho=Math.max(42,(Math.round((hasta-desde)/dia)+1)*42);
      const colores=['#59bdc5','#f79661','#df6db8','#7184df','#55b675'];
      const barra=document.createElement('div');barra.className=`gantt-barra${esFase?' gantt-barra-fase':''}`;barra.style.left=`${izquierda}px`;barra.style.width=`${ancho}px`;barra.style.background=esFase?'#2d4276':colores[indice%colores.length];barra.textContent=`${indice+1}. ${item.actividad||item.codigo}`;
      const avance=document.createElement('div');avance.className='gantt-avance';avance.style.left=`${izquierda}px`;avance.style.width=`${ancho}px`;const progreso=document.createElement('i');progreso.style.width=`${Math.min(100,Math.max(0,Number(item.avance)||0))}%`;avance.append(progreso);
      const porcentaje=document.createElement('b');porcentaje.className='gantt-porcentaje';porcentaje.style.left=`${izquierda+ancho+10}px`;porcentaje.textContent=`${Number(item.avance)||0}%`;
      fila.append(barra,avance,porcentaje);return fila;
    }));
  }
  let indiceRecursoCronograma=-1;
  function crearFilaCronograma(actividad={},indice=0) {
    const fila=document.createElement('tr'),numero=indice+1,recursos=Array.isArray(actividad.recursos)?actividad.recursos:[];
    fila.dataset.nivel=String(actividad.nivel||0);fila.draggable=true;
    fila.innerHTML=`<td><input data-seleccion-cronograma type="checkbox" aria-label="Seleccionar actividad"></td><td class="numero-cronograma"><b>${numero}</b><input type="hidden" data-cronograma="codigo" value="${actividad.codigo||`ACT-${String(numero).padStart(2,'0')}`}"></td><td><input data-cronograma="actividad" value="${actividad.actividad||''}" placeholder="Ej. Elaborar expediente"></td><td><select data-cronograma="fase"><option>Anteproyecto</option><option>Proyecto</option><option>Construcción</option><option>Operación</option></select></td><td><input data-cronograma="inicio" type="date" value="${actividad.inicio||''}"></td><td><input data-cronograma="fin" type="date" value="${actividad.fin||''}"></td><td><input data-cronograma="predecesora" value="${actividad.predecesora||''}" placeholder="N° fila"></td><td><input data-cronograma="sucesora" value="${actividad.sucesora||''}" placeholder="N° fila"></td><td><input data-cronograma="avance" type="number" min="0" max="100" value="${actividad.avance??0}"><span class="porcentaje-cronograma">%</span></td><td><button class="boton-recursos-cronograma" type="button" data-recurso-cronograma="${indice}" aria-label="Gestionar recursos"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3"></circle><path d="M3.5 19c.6-4 2.4-6 5.5-6s4.9 2 5.5 6M18 12v8M14 16h8"></path></svg><b>${recursos.length}</b></button></td><td><button type="button" data-accion="eliminar-actividad" aria-label="Eliminar actividad">×</button></td>`;
    fila.querySelector('[data-cronograma="fase"]').value=actividad.fase||$('proyectoFase').value||'Anteproyecto';
    return fila;
  }
  function renderCronogramaProyecto() {
    if(!cronogramaBorrador.length)cronogramaBorrador=crearCronogramaBase();
    const tabla=$('tablaCronogramaProyecto');tabla.replaceChildren();
    const actividades=cronogramaBorrador;
    actividades.forEach((actividad,indice)=>tabla.append(crearFilaCronograma(actividad,indice)));
    const codigo=$('proyectoCodigo').value||'Proyecto nuevo',nombre=$('proyectoNombre').value;
    $('cronogramaProyectoActual').textContent=nombre?`${codigo} · ${nombre}`:codigo;renderGanttCronograma();actualizarSeleccionCronograma();
  }
  function leerCronogramaProyecto() {
    cronogramaBorrador=[...$('tablaCronogramaProyecto').querySelectorAll('tr')].map((fila,indice)=>({...Object.fromEntries([...fila.querySelectorAll('[data-cronograma]')].map(campo=>[campo.dataset.cronograma,campo.value.trim()])),nivel:Number(fila.dataset.nivel||0),recursos:Array.isArray(cronogramaBorrador[indice]?.recursos)?cronogramaBorrador[indice].recursos:[]})).filter(actividad=>actividad.codigo||actividad.actividad);
  }
  function renderRecursosCronograma() {
    const actividad=cronogramaBorrador[indiceRecursoCronograma];if(!actividad)return;
    const recursos=actividad.recursos||[];
    $('tituloRecursosCronograma').textContent=actividad.actividad||actividad.codigo||'Nueva actividad';
    $('subtituloRecursosCronograma').textContent=`Recursos asignados a la actividad N° ${indiceRecursoCronograma+1}.`;
    $('listaRecursosCronograma').replaceChildren(...(recursos.length?recursos:[{vacio:true}]).map((recurso,indice)=>{
      const item=document.createElement('article');
      if(recurso.vacio){item.className='recurso-cronograma-vacio';item.textContent='Aún no se han asignado recursos a esta actividad.';return item;}
      item.innerHTML=`<span><b>${recurso.nombre}</b><small>${recurso.tipo} · ${recurso.cantidad} unidad(es) · ${recurso.horas} h/día</small></span><button type="button" data-eliminar-recurso-cronograma="${indice}" aria-label="Quitar recurso">×</button>`;return item;
    }));
  }
  const cronogramaColapsados=new Set(),cronogramaSeleccionadas=new Set();let cronogramaArrastre=-1;
  function descendientesCronograma(indice){const nivel=Number(cronogramaBorrador[indice]?.nivel||0),salida=[];for(let i=indice+1;i<cronogramaBorrador.length&&Number(cronogramaBorrador[i].nivel||0)>nivel;i++)salida.push(i);return salida;}
  function esResumenCronograma(indice){return Number(cronogramaBorrador[indice+1]?.nivel||0)>Number(cronogramaBorrador[indice]?.nivel||0);}
  function indicesVisiblesCronograma(){const ocultos=new Set();cronogramaColapsados.forEach(indice=>descendientesCronograma(indice).forEach(hijo=>ocultos.add(hijo)));return cronogramaBorrador.map((_,indice)=>indice).filter(indice=>!ocultos.has(indice));}
  function normalizarResumenesCronograma(){for(let i=cronogramaBorrador.length-1;i>=0;i--){if(!esResumenCronograma(i))continue;const hijos=descendientesCronograma(i).map(indice=>cronogramaBorrador[indice]).filter(item=>item.inicio&&item.fin);if(!hijos.length)continue;cronogramaBorrador[i].inicio=hijos.map(item=>item.inicio).sort()[0];cronogramaBorrador[i].fin=hijos.map(item=>item.fin).sort().at(-1);cronogramaBorrador[i].avance=Math.round(hijos.reduce((s,item)=>s+Number(item.avance||0),0)/hijos.length);}}
  function crearFilaCronograma(actividad={},indice=0){
    const fila=document.createElement('tr'),numero=indice+1,resumen=esResumenCronograma(indice),recursos=actividad.recursos||[],nivel=Math.min(3,Number(actividad.nivel||0));
    fila.dataset.indiceCronograma=indice;fila.dataset.nivel=nivel;fila.draggable=true;fila.className=`fila-cronograma-maqueta${resumen?' resumen-cronograma':''}${cronogramaSeleccionadas.has(indice)?' seleccionada-cronograma':''}`;
    const controlResumen=resumen?`<button class="alternar-cronograma" type="button" data-alternar-cronograma="${indice}" title="${cronogramaColapsados.has(indice)?'Expandir':'Contraer'}">${cronogramaColapsados.has(indice)?'▶':'▼'}</button><b class="subtareas-cronograma">${descendientesCronograma(indice).filter(hijo=>Number(cronogramaBorrador[hijo].nivel||0)===nivel+1).length} sub.</b>`:'<span class="alternar-cronograma marcador-vacio">⋮⋮</span>';
    fila.innerHTML=`<td><input data-seleccion-cronograma="${indice}" type="checkbox" ${cronogramaSeleccionadas.has(indice)?'checked':''} aria-label="Seleccionar actividad ${numero}"></td><td class="numero-cronograma"><b>${numero}</b></td><td class="actividad-cronograma"><span class="arrastre-cronograma" title="Arrastrar para ordenar">⠿</span><span class="sangria-cronograma" style="width:${nivel*18}px"></span>${controlResumen}<span class="nivel-cronograma">N${nivel+1}</span><input data-cronograma-campo="actividad" value="${actividad.actividad||''}" placeholder="Nueva actividad"></td><td><input data-cronograma-campo="inicio" type="date" value="${actividad.inicio||''}" ${resumen?'readonly':''}></td><td><input data-cronograma-campo="fin" type="date" value="${actividad.fin||''}" ${resumen?'readonly':''}></td><td><input class="dependencia-cronograma" data-cronograma-campo="predecesora" value="${actividad.predecesora||''}" placeholder="N° fila"></td><td><input class="dependencia-cronograma" data-cronograma-campo="sucesora" value="${actividad.sucesora||''}" placeholder="N° fila"></td><td class="avance-cronograma"><input data-cronograma-campo="avance" type="number" min="0" max="100" value="${actividad.avance??0}" ${resumen?'readonly':''}><span>%</span></td><td><button class="boton-recursos-cronograma" type="button" data-recurso-cronograma="${indice}" aria-label="Gestionar recursos"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3"></circle><path d="M3.5 19c.6-4 2.4-6 5.5-6s4.9 2 5.5 6M18 12v8M14 16h8"></path></svg>${recursos.length?`<b>${recursos.length}</b>`:''}</button></td><td><button class="boton-eliminar-cronograma" type="button" data-accion="eliminar-actividad" aria-label="Eliminar actividad"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg></button></td>`;
    return fila;
  }
  function actualizarSeleccionCronograma(){const filas=[...$('tablaCronogramaProyecto').querySelectorAll('tr')],activas=filas.filter(fila=>fila.querySelector('[data-seleccion-cronograma]')?.checked);$('contadorSeleccionCronograma').textContent=`${activas.length} seleccionada${activas.length===1?'':'s'}`;$('seleccionarTodoCronograma').checked=!!filas.length&&activas.length===filas.length;}
  function ajustarNivelCronograma(delta){cronogramaSeleccionadas.forEach(indice=>cronogramaBorrador[indice].nivel=Math.max(0,Math.min(3,Number(cronogramaBorrador[indice].nivel||0)+delta)));normalizarResumenesCronograma();renderCronogramaProyecto();}
  function leerCronogramaProyecto(){return cronogramaBorrador;}
  function renderCronogramaProyecto(){
    if(!cronogramaBorrador.length)cronogramaBorrador=crearCronogramaBase();normalizarResumenesCronograma();
    const tabla=$('tablaCronogramaProyecto');tabla.replaceChildren(...indicesVisiblesCronograma().map(indice=>crearFilaCronograma(cronogramaBorrador[indice],indice)));
    const codigo=$('proyectoCodigo').value||'Proyecto nuevo',nombre=$('proyectoNombre').value;$('cronogramaProyectoActual').textContent=nombre?`${codigo} · ${nombre}`:codigo;
    tabla.querySelectorAll('input[data-cronograma-campo]').forEach(campo=>campo.addEventListener('change',evento=>{const indice=Number(evento.target.closest('tr').dataset.indiceCronograma),clave=evento.target.dataset.cronogramaCampo;cronogramaBorrador[indice][clave]=clave==='avance'?Math.max(0,Math.min(100,Number(evento.target.value||0))):evento.target.value;normalizarResumenesCronograma();renderCronogramaProyecto();}));
    tabla.querySelectorAll('[data-seleccion-cronograma]').forEach(casilla=>casilla.addEventListener('change',evento=>{const indice=Number(evento.target.dataset.seleccionCronograma);evento.target.checked?cronogramaSeleccionadas.add(indice):cronogramaSeleccionadas.delete(indice);actualizarSeleccionCronograma();}));
    tabla.querySelectorAll('[data-alternar-cronograma]').forEach(boton=>boton.addEventListener('click',()=>{const indice=Number(boton.dataset.alternarCronograma);cronogramaColapsados.has(indice)?cronogramaColapsados.delete(indice):cronogramaColapsados.add(indice);renderCronogramaProyecto();}));
    tabla.querySelectorAll('tr').forEach(fila=>{fila.addEventListener('click',evento=>{if(evento.target.closest('input,button'))return;const indice=Number(fila.dataset.indiceCronograma);cronogramaSeleccionadas.has(indice)?cronogramaSeleccionadas.delete(indice):cronogramaSeleccionadas.add(indice);renderCronogramaProyecto();});fila.addEventListener('dragstart',evento=>{cronogramaArrastre=Number(fila.dataset.indiceCronograma);evento.dataTransfer.effectAllowed='move';});fila.addEventListener('dragover',evento=>evento.preventDefault());fila.addEventListener('drop',evento=>{evento.preventDefault();const destino=Number(fila.dataset.indiceCronograma);if(cronogramaArrastre<0||cronogramaArrastre===destino)return;const [actividad]=cronogramaBorrador.splice(cronogramaArrastre,1);cronogramaBorrador.splice(destino,0,actividad);cronogramaArrastre=-1;renderCronogramaProyecto();});});
    renderGanttCronograma();actualizarDeslizadorGantt();actualizarSeleccionCronograma();
  }
  function actualizarDeslizadorGantt(){requestAnimationFrame(()=>{const pares=[[document.querySelector('.tabla-cronograma-proyecto'),$('deslizadorTablaCronograma')],[document.querySelector('.gantt-cronograma-proyecto'),$('deslizadorGanttCronograma')]];pares.forEach(([panel,deslizador])=>{if(!panel||!deslizador)return;const maximo=Math.max(0,panel.scrollWidth-panel.clientWidth);deslizador.max=maximo;deslizador.value=Math.min(maximo,panel.scrollLeft);deslizador.disabled=maximo<2;});});}
  function horasEfectivasCronograma(horario) {
    const minutos=valor=>{const [h,m]=valor.split(':').map(Number);return h*60+m;};
    return Math.max(0,((minutos(horario[3])-minutos(horario[0]))-(minutos(horario[2])-minutos(horario[1])))/60);
  }
  function renderCalendarioCronograma() {
    const nombres={1:'Lun',2:'Mar',3:'Mié',4:'Jue',5:'Vie',6:'Sáb',0:'Dom'},orden=[1,2,3,4,5,6,0];
    $('semanaCalendarioCronograma').replaceChildren(...orden.map(dia=>{const etiqueta=document.createElement('label'),casilla=document.createElement('input');casilla.type='checkbox';casilla.dataset.diaCalendario=dia;casilla.checked=calendarioCronograma.dias.has(dia);etiqueta.append(casilla,document.createTextNode(nombres[dia]));return etiqueta;}));
    const diasTexto=orden.filter(dia=>calendarioCronograma.dias.has(dia)).map(dia=>nombres[dia]).join(', ')||'ninguno';
    $('resumenCalendarioCronograma').textContent=`Laborables: ${diasTexto} · ${calendarioCronograma.feriados.length} día(s) no laborable(s) registrado(s).`;
    $('filasHorarioCronograma').replaceChildren(...orden.map(dia=>{const horario=calendarioCronograma.horarios[dia],fila=document.createElement('div');fila.className='fila-horario-cronograma';fila.innerHTML=`<strong>${nombres[dia]}</strong>${horario.map((valor,pos)=>`<input type="time" data-horario-dia="${dia}" data-horario-posicion="${pos}" value="${valor}" ${calendarioCronograma.dias.has(dia)?'':'disabled'}>`).join('')}<b>${horasEfectivasCronograma(horario).toFixed(1)} h</b>`;return fila;}));
    $('listaFeriadosCronograma').replaceChildren(...calendarioCronograma.feriados.map((feriado,indice)=>{const fila=document.createElement('li');fila.innerHTML=`<span><b>${feriado.fecha}</b> · ${feriado.nombre}</span><button type="button" data-eliminar-feriado="${indice}">Quitar</button>`;return fila;}));
  }
  function abrirModalEliminarProyecto(proyecto) {
    proyectoPendienteEliminar=proyecto;
    $('textoConfirmarEliminarProyecto').textContent=`Eliminar ${proyecto.codigo} · ${proyecto.nombre}`;
    $('detalleConfirmarEliminarProyecto').textContent='¿Desea eliminar este proyecto? La acción no se puede deshacer.';
    $('modalConfirmarEliminarProyecto').showModal();
  }
  function eliminarProyectoPendiente() {
    if(!proyectoPendienteEliminar)return;
    const indice=ciudades.findIndex(p=>p.codigo===proyectoPendienteEliminar.codigo);
    if(indice>=0)ciudades.splice(indice,1);
    proyectoPendienteEliminar=null;
    if(proyectoEdicionSeleccionado?.codigo===$('proyectoCodigo').value)limpiarFormularioProyecto();
    actualizarFiltros();
    actualizar();
    renderListaProyectosEdicion();
    $('modalConfirmarEliminarProyecto').close();
  }
  function poblarUbicacionesProyecto() {
    const departamento=$('proyectoDepartamento');
    const provincia=$('proyectoProvincia');
    const distrito=$('proyectoDistrito');
    const departamentoActual=departamento.value;
    const provinciaActual=provincia.value;
    const distritoActual=distrito.value;
    departamento.replaceChildren(new Option('Seleccione departamento',''));
    [...new Set(ciudades.map(p=>p.departamento))].sort((a,b)=>a.localeCompare(b,'es')).forEach(v=>departamento.add(new Option(v,v)));
    if([...departamento.options].some(o=>o.value===departamentoActual))departamento.value=departamentoActual;
    const departamentosFiltrados=ciudades.filter(p=>!departamento.value||p.departamento===departamento.value);
    provincia.replaceChildren(new Option('Seleccione provincia',''));
    [...new Set(departamentosFiltrados.map(p=>p.provincia))].sort((a,b)=>a.localeCompare(b,'es')).forEach(v=>provincia.add(new Option(v,v)));
    if([...provincia.options].some(o=>o.value===provinciaActual))provincia.value=provinciaActual;
    const provinciasFiltradas=departamentosFiltrados.filter(p=>!provincia.value||p.provincia===provincia.value);
    distrito.replaceChildren(new Option('Seleccione distrito',''));
    [...new Set(provinciasFiltradas.map(p=>p.distrito))].sort((a,b)=>a.localeCompare(b,'es')).forEach(v=>distrito.add(new Option(v,v)));
    if([...distrito.options].some(o=>o.value===distritoActual))distrito.value=distritoActual;
  }
  function copiarOpcionesSelect(origen,destino,valor=''){destino.replaceChildren(...[...origen.options].map(o=>new Option(o.text,o.value)));if([...destino.options].some(o=>o.value===valor))destino.value=valor;}
  function actualizarFiltrosMapaProyecto(){const dep=$('mapaDepartamentoProyecto'),prov=$('mapaProvinciaProyecto'),dist=$('mapaDistritoProyecto'),depValor=dep.value,provValor=prov.value,distValor=dist.value;const departamentos=[...new Set(ciudades.map(p=>p.departamento))].sort((a,b)=>a.localeCompare(b,'es'));dep.replaceChildren(new Option('Todos los departamentos',''),...departamentos.map(v=>new Option(v,v)));dep.value=departamentos.includes(depValor)?depValor:'';const porDep=ciudades.filter(p=>!dep.value||p.departamento===dep.value),provincias=[...new Set(porDep.map(p=>p.provincia))].sort((a,b)=>a.localeCompare(b,'es'));prov.replaceChildren(new Option('Todas las provincias',''),...provincias.map(v=>new Option(v,v)));prov.value=provincias.includes(provValor)?provValor:'';const porProv=porDep.filter(p=>!prov.value||p.provincia===prov.value),distritos=[...new Set(porProv.map(p=>p.distrito))].sort((a,b)=>a.localeCompare(b,'es'));dist.replaceChildren(new Option('Todos los distritos',''),...distritos.map(v=>new Option(v,v)));dist.value=distritos.includes(distValor)?distValor:'';const referencia=porProv.find(p=>!dist.value||p.distrito===dist.value);if(referencia&&mapaUbicacionProyecto)mapaUbicacionProyecto.setView([referencia.lat,referencia.lng],dep.value?10:6);}
  function leerGeometriaTerreno(codigo){try{return JSON.parse($(codigo==='A'?'proyectoGeometria':'proyectoGeometriaTerrenoB').value||'null');}catch{return null;}}
  function renderPoligonoUbicacion(){if(!capaPoligonoUbicacion)return;capaPoligonoUbicacion.clearLayers();const paletas={A:{linea:'#36a8d2',relleno:'#58c5e8'},B:{linea:'#e68b3f',relleno:'#f2b65a'}},pintar=(geometria,estilo,etiqueta)=>{if(!geometria)return;const opciones={color:estilo.linea,fillColor:estilo.relleno,fillOpacity:.31,weight:3};if(geometria.tipo==='Círculo'&&geometria.centro)return L.circle(geometria.centro,{...opciones,radius:geometria.radioM||0}).bindTooltip(etiqueta,{permanent:true,direction:'center'}).addTo(capaPoligonoUbicacion);if(!geometria.coordenadas?.length)return;if(['Línea','Polilínea'].includes(geometria.tipo))return L.polyline(geometria.coordenadas,{...opciones,fill:false,dashArray:geometria.tipo==='Línea'?'8 6':null}).bindTooltip(etiqueta,{permanent:true,direction:'center'}).addTo(capaPoligonoUbicacion);return L.polygon(geometria.coordenadas,opciones).bindTooltip(etiqueta,{permanent:true,direction:'center',className:`etiqueta-terreno etiqueta-terreno-${terrenoActivoProyecto.toLowerCase()}`}).addTo(capaPoligonoUbicacion);};['A','B'].forEach(codigo=>{const geometria=leerGeometriaTerreno(codigo);if(codigo===terrenoActivoProyecto&&(puntosPoligonoUbicacion.length||circuloDibujoUbicacion))return;pintar(geometria,paletas[codigo],`Terreno ${codigo}`);});const estiloActivo=paletas[terrenoActivoProyecto];if(circuloDibujoUbicacion?.centro){L.circleMarker(circuloDibujoUbicacion.centro,{radius:5,color:'#fff',weight:2,fillColor:estiloActivo.relleno,fillOpacity:1}).addTo(capaPoligonoUbicacion);if(circuloDibujoUbicacion.radio>0)L.circle(circuloDibujoUbicacion.centro,{color:estiloActivo.linea,fillColor:estiloActivo.relleno,fillOpacity:.32,weight:3,radius:circuloDibujoUbicacion.radio}).bindTooltip(`Terreno ${terrenoActivoProyecto}`,{permanent:true,direction:'center'}).addTo(capaPoligonoUbicacion);$('estadoZonaProyecto').textContent=circuloDibujoUbicacion.radio>0?'Círculo listo para guardar.':'Marque un segundo punto para definir el radio.';return;}puntosPoligonoUbicacion.forEach((p,i)=>L.circleMarker(p,{radius:5,color:'#fff',weight:2,fillColor:estiloActivo.relleno,fillOpacity:1}).bindTooltip(`Vértice ${i+1}`).addTo(capaPoligonoUbicacion));if(puntosPoligonoUbicacion.length>1)L.polyline(puntosPoligonoUbicacion,{color:estiloActivo.linea,weight:3,dashArray:modoDibujoAreaProyecto==='poligono'&&puntosPoligonoUbicacion.length<3?'6 5':null}).addTo(capaPoligonoUbicacion);if(modoDibujoAreaProyecto==='poligono'&&puntosPoligonoUbicacion.length>=3)L.polygon(puntosPoligonoUbicacion,{color:estiloActivo.linea,fillColor:estiloActivo.relleno,fillOpacity:.32,weight:3}).bindTooltip(`Terreno ${terrenoActivoProyecto}`,{permanent:true,direction:'center'}).addTo(capaPoligonoUbicacion);const minimo=modoDibujoAreaProyecto==='poligono'?3:2;$('estadoZonaProyecto').textContent=puntosPoligonoUbicacion.length>=minimo?`${puntosPoligonoUbicacion.length} vértices registrados. La geometría está lista para guardar.`:'';}
  async function cargarGeoUbicacion(clave,ruta){if(!geoUbicacionCache[clave]){const respuesta=await fetch(ruta);if(!respuesta.ok)throw new Error(`No se pudo cargar ${clave}`);geoUbicacionCache[clave]=await respuesta.json();}return geoUbicacionCache[clave];}
  function nombreTerritorioProyecto(feature,nivel){return feature.properties[nivel==='departamento'?'NAME_1':nivel==='provincia'?'NAME_2':'NAME_3'];}
  function estiloTerritorioProyecto(feature,nivel){const paletas={departamento:['#2f91bd','#45a8c8','#397faf','#55aab6'],provincia:['#e58a3a','#d85f68','#dfa92f','#39a681'],distrito:['#7657c7','#378eb7','#de7851','#5aa05c']},nombre=nombreTerritorioProyecto(feature,nivel)||'',indice=[...nombre].reduce((s,c)=>s+c.charCodeAt(0),0)%paletas[nivel].length,color=paletas[nivel][indice];return {color,fillColor:color,fillOpacity:nivel==='departamento'?.22:.3,weight:nivel==='distrito'?2.5:2};}
  function establecerValorUbicacion(id,valor){const select=$(id);if(valor&&![...select.options].some(o=>o.value===valor))select.add(new Option(valor,valor));select.value=valor||'';}
  function actualizarRutaMapaProyecto(){const partes=[departamentoMapaProyecto?.properties.NAME_1,provinciaMapaProyecto?.properties.NAME_2,distritoMapaProyecto?.properties.NAME_3].filter(Boolean);$('rutaMapaProyecto').textContent=partes.length?`Perú / ${partes.join(' / ')}`:'Perú';$('volverNivelMapaProyecto').hidden=nivelMapaProyecto==='pais';$('ayudaMapaProyecto').textContent=nivelMapaProyecto==='pais'?'Seleccione un departamento en el mapa.':nivelMapaProyecto==='departamento'?'Seleccione una provincia.':nivelMapaProyecto==='provincia'?'Seleccione un distrito.':'Distrito seleccionado. Ahora dibuje el polígono haciendo clic en el mapa.';}
  function mostrarTerritoriosMapaProyecto(features,nivel){if(capaTerritorialUbicacion)mapaUbicacionProyecto.removeLayer(capaTerritorialUbicacion);capaTerritorialUbicacion=L.geoJSON({type:'FeatureCollection',features},{style:f=>estiloTerritorioProyecto(f,nivel),interactive:nivel!=='distrito'||nivelMapaProyecto!=='distrito',onEachFeature:(feature,layer)=>{const nombre=nombreTerritorioProyecto(feature,nivel);layer.bindTooltip(nombre,{permanent:nivel!=='departamento',sticky:nivel==='departamento',direction:'center'});if(nivel!=='distrito')layer.on('click',async e=>{L.DomEvent.stopPropagation(e.originalEvent);if(nivel==='departamento')await seleccionarDepartamentoMapaProyecto(feature);else await seleccionarProvinciaMapaProyecto(feature);});}}).addTo(mapaUbicacionProyecto);capaTerritorialUbicacion.bringToBack();const limites=capaTerritorialUbicacion.getBounds();if(limites.isValid())mapaUbicacionProyecto.fitBounds(limites,{padding:[20,20],maxZoom:nivel==='departamento'?6:nivel==='provincia'?9:13});actualizarRutaMapaProyecto();}
  async function mostrarDepartamentosMapaProyecto(){nivelMapaProyecto='pais';departamentoMapaProyecto=provinciaMapaProyecto=distritoMapaProyecto=null;establecerValorUbicacion('mapaDepartamentoProyecto','');establecerValorUbicacion('mapaProvinciaProyecto','');establecerValorUbicacion('mapaDistritoProyecto','');const geo=await cargarGeoUbicacion('departamentos','../../geo/peru_departamentos_gadm41.json');mostrarTerritoriosMapaProyecto(geo.features,'departamento');}
  async function seleccionarDepartamentoMapaProyecto(feature){departamentoMapaProyecto=feature;provinciaMapaProyecto=distritoMapaProyecto=null;nivelMapaProyecto='departamento';establecerValorUbicacion('mapaDepartamentoProyecto',feature.properties.NAME_1);establecerValorUbicacion('proyectoDepartamento',feature.properties.NAME_1);const geo=await cargarGeoUbicacion('provincias','../../geo/gadm41_PER_2.json');mostrarTerritoriosMapaProyecto(geo.features.filter(f=>f.properties.GID_1===feature.properties.GID_1),'provincia');}
  async function seleccionarProvinciaMapaProyecto(feature){provinciaMapaProyecto=feature;distritoMapaProyecto=null;nivelMapaProyecto='provincia';establecerValorUbicacion('mapaProvinciaProyecto',feature.properties.NAME_2);establecerValorUbicacion('proyectoProvincia',feature.properties.NAME_2);const geo=await cargarGeoUbicacion('distritos','../../geo/peru_distritos_gadm41.json');mostrarTerritoriosMapaProyecto(geo.features.filter(f=>f.properties.GID_2===feature.properties.GID_2),'distrito');capaTerritorialUbicacion.eachLayer(layer=>layer.on('click',e=>{L.DomEvent.stopPropagation(e.originalEvent);seleccionarDistritoMapaProyecto(layer.feature);}));}
  function seleccionarDistritoMapaProyecto(feature){distritoMapaProyecto=feature;nivelMapaProyecto='distrito';establecerValorUbicacion('mapaDistritoProyecto',feature.properties.NAME_3);establecerValorUbicacion('proyectoDistrito',feature.properties.NAME_3);mostrarTerritoriosMapaProyecto([feature],'distrito');puntosPoligonoUbicacion=[];circuloDibujoUbicacion=null;renderPoligonoUbicacion();}
  function iniciarMapaUbicacionProyecto(){if(!mapaUbicacionProyecto){mapaUbicacionProyecto=L.map('mapaUbicacionProyecto',{zoomControl:true}).setView([-9.2,-75.1],5);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(mapaUbicacionProyecto);capaPoligonoUbicacion=L.layerGroup().addTo(mapaUbicacionProyecto);mapaUbicacionProyecto.on('click',e=>{if(nivelMapaProyecto!=='distrito'||!herramientaDibujoAreaActiva)return;if(modoDibujoAreaProyecto==='circulo'){if(!circuloDibujoUbicacion?.centro)circuloDibujoUbicacion={centro:e.latlng,radio:0};else circuloDibujoUbicacion.radio=mapaUbicacionProyecto.distance(circuloDibujoUbicacion.centro,e.latlng);renderPoligonoUbicacion();return;}puntosPoligonoUbicacion.push(e.latlng);renderPoligonoUbicacion();});}setTimeout(()=>mapaUbicacionProyecto.invalidateSize(),80);}
  function guardarMapaUbicacionProyecto(){
    const esCirculo=modoDibujoAreaProyecto==='circulo',minimo=modoDibujoAreaProyecto==='poligono'?3:2;if(esCirculo?!circuloDibujoUbicacion?.radio:puntosPoligonoUbicacion.length<minimo)return false;
    const departamentoSeleccionado=$('mapaDepartamentoProyecto').value,departamentoBase=$('proyectoDepartamento').value;
    if(terrenoActivoProyecto==='B'&&departamentoBase&&departamentoSeleccionado!==departamentoBase){$('estadoZonaProyecto').textContent=`El Terreno B debe pertenecer al mismo departamento: ${departamentoBase}.`;return false;}
    const centro=esCirculo?circuloDibujoUbicacion.centro:puntosPoligonoUbicacion.reduce((a,p)=>({lat:a.lat+p.lat/puntosPoligonoUbicacion.length,lng:a.lng+p.lng/puntosPoligonoUbicacion.length}),{lat:0,lng:0}),nombre=$('nombreZonaProyecto').value.trim()||`Terreno ${terrenoActivoProyecto}`,coords=puntosPoligonoUbicacion.map(p=>[Number(p.lat.toFixed(6)),Number(p.lng.toFixed(6))]);let suma=0;for(let i=0;i<coords.length;i++){const a=coords[i],b=coords[(i+1)%coords.length];suma+=a[1]*b[0]-b[1]*a[0];}
    const tipo={poligono:'Polígono',circulo:'Círculo',polilinea:'Polilínea',linea:'Línea'}[modoDibujoAreaProyecto],areaM2=esCirculo?Math.round(Math.PI*circuloDibujoUbicacion.radio**2):modoDibujoAreaProyecto==='poligono'?Math.max(1,Math.round(Math.abs(suma)*.5*111320*111320*Math.cos(centro.lat*Math.PI/180))):0,beneficiariosEstimados=Math.max(1,Math.round((areaM2||100)/120)),geometria={tipo,nombre,categoria:$('tipoZonaProyecto').value,coordenadas:coords,centro:esCirculo?[Number(centro.lat.toFixed(6)),Number(centro.lng.toFixed(6))]:null,radioM:esCirculo?Math.round(circuloDibujoUbicacion.radio):0,areaM2,beneficiariosEstimados};
    if(terrenoActivoProyecto==='A'){
      $('proyectoAreaInfluencia').value=`${nombre} · ${areaM2.toLocaleString('es-PE')} m²`;$('proyectoLocalizacion').value=`${centro.lat.toFixed(6)}, ${centro.lng.toFixed(6)}`;$('proyectoGeometria').value=JSON.stringify(geometria);$('proyectoDepartamento').value=departamentoSeleccionado;poblarUbicacionesProyecto();$('proyectoProvincia').value=$('mapaProvinciaProyecto').value;poblarUbicacionesProyecto();establecerValorUbicacion('proyectoDistrito',$('mapaDistritoProyecto').value);
    }else{$('proyectoGeometriaTerrenoB').value=JSON.stringify(geometria);$('proyectoBeneficiariosTerrenoB').value=beneficiariosEstimados;}
    const terrenoGuardado=terrenoActivoProyecto,beneficiariosA=Number(JSON.parse($('proyectoGeometria').value||'{}').beneficiariosEstimados||0),beneficiariosB=Number($('proyectoBeneficiariosTerrenoB').value||0),areaA=JSON.parse($('proyectoGeometria').value||'{}'),areaB=JSON.parse($('proyectoGeometriaTerrenoB').value||'{}');$('proyectoBeneficiarios').value=beneficiariosA+beneficiariosB;$('resumenAreaInfluenciaProyecto').textContent=[areaA.areaM2&&`Terreno A · ${areaA.areaM2.toLocaleString('es-PE')} m²`,areaB.areaM2&&`Terreno B · ${areaB.areaM2.toLocaleString('es-PE')} m²`].filter(Boolean).join(' · ');actualizarModoJerarquiaProyecto();puntosPoligonoUbicacion=[];circuloDibujoUbicacion=null;if(terrenoGuardado==='A')seleccionarTerrenoEnMapa('B');else renderPoligonoUbicacion();$('estadoZonaProyecto').textContent=`Terreno ${terrenoGuardado} guardado.`;$('estadoZonaProyecto').classList.add('exito');return true;
  }
  function normalizarFilaExcelProyecto(fila) {
    const entrada=Object.entries(fila || {}).reduce((acum,[clave,valor])=>{
      acum[clave.toLowerCase().trim()] = valor;
      return acum;
    },{});
    return {
      nombre: normalizarTexto(entrada.nombre || entrada.nombres || entrada['nombre completo'] || entrada.apellidos || ''),
      documento: normalizarTexto(entrada.documento || entrada.dni || entrada.ruc || entrada['nro documento'] || entrada['n° documento'] || ''),
      codigo: normalizarTexto(entrada.codigo || entrada.código || entrada.cod || entrada.id || ''),
      estado: normalizarTexto(entrada.estado || entrada.situacion || entrada.situcion || 'Pendiente')
    };
  }
  async function cargarBeneficiariosDesdeExcelProyecto(file) {
    if(!file)return;
    const boton=$('excelProyecto');
    const tabla=$('tablaBeneficiariosProyecto');
    const barras=[...document.querySelectorAll('.barra-beneficiarios-proyecto small')];
    try {
      if(!window.XLSX) throw new Error('XLSX no disponible');
      const buffer=await file.arrayBuffer();
      const libro=XLSX.read(buffer,{type:'array'});
      const hoja=libro.Sheets[libro.SheetNames[0]];
      const registros=XLSX.utils.sheet_to_json(hoja,{defval:''}).map(normalizarFilaExcelProyecto).filter(f=>Object.values(f).some(Boolean));
      tabla.replaceChildren();
      if(!registros.length){
        limpiarBeneficiariosProyecto();
        return;
      }
      registros.forEach(registro=>agregarFilaBeneficiarioProyecto(registro));
      barras.forEach(nodo=>nodo.textContent=`${file.name} cargado correctamente.`);
    } catch (error) {
      limpiarBeneficiariosProyecto();
      const fila=document.createElement('tr');
      fila.className='fila-vacia-beneficiarios';
      fila.innerHTML='<td colspan="6">No fue posible leer el Excel. Verifique que el archivo tenga una primera hoja con columnas de nombre, documento, código y estado.</td>';
      tabla.replaceChildren(fila);
      barras.forEach(nodo=>nodo.textContent='No fue posible leer el archivo. Verifique el formato.');
    } finally {
      boton.value='';
      actualizarIndicesBeneficiariosProyecto();
    }
  }

  function puntosXml(doc, etiqueta) {
    return [...doc.querySelectorAll(etiqueta)].map(n=>{
      if(etiqueta==='trkpt'||etiqueta==='wpt') return [Number(n.getAttribute('lat')),Number(n.getAttribute('lon'))];
      const a=n.textContent.trim().split(',').map(Number); return [a[1],a[0]];
    }).filter(p=>p.every(Number.isFinite));
  }
  async function cargarArchivo(file) {
    if(!file)return;
    $('estadoCargaModal').textContent=`Procesando ${file.name}...`;
    $('estadoCarga').textContent=`Procesando ${file.name}…`;
    try {
      const nombre=$('nombreCapa').value.trim()||file.name;
      let capa;
      if(/\.zip$/i.test(file.name)){
        capa=L.featureGroup([
          L.polyline([[-12.05,-77.07],[-12.08,-77.01],[-12.12,-76.96]],{color:'#8a55c5',weight:5}).bindTooltip(nombre),
          L.circleMarker([-12.08,-77.01],{radius:7,color:'#fff',weight:2,fillColor:'#8a55c5',fillOpacity:1}).bindTooltip(`${nombre} · elemento GIS`)
        ]);
      } else {
        const texto=await file.text();
        if(/\.(json|geojson)$/i.test(file.name)) capa=L.geoJSON(JSON.parse(texto),{style:{color:'#8a55c5',weight:5},onEachFeature:(f,l)=>l.bindTooltip(f.properties?.name||f.properties?.nombre||nombre)});
        else {
          const xml=new DOMParser().parseFromString(texto,'application/xml');
          const puntos=/\.gpx$/i.test(file.name)?[...puntosXml(xml,'trkpt'),...puntosXml(xml,'wpt')]:puntosXml(xml,'coordinates');
          if(!puntos.length) throw new Error('Sin coordenadas válidas');
          capa=L.polyline(puntos,{color:'#8a55c5',weight:5}).bindTooltip(nombre);
        }
      }
      if(capaGis) mapa.removeLayer(capaGis); capaGis=capa.addTo(mapa); mapa.fitBounds(capa.getBounds(),{padding:[35,35]});
      $('mostrarCapaCargada').checked=true; $('estadoCarga').textContent=`${file.name} cargado e indexado correctamente`;
      $('estadoCargaModal').textContent=`${file.name} cargado e indexado correctamente`;
      return true;
    } catch(e) { $('estadoCarga').textContent='No fue posible leer el archivo. Verifica su formato GIS.'; $('estadoCargaModal').textContent='No fue posible leer el archivo. Verifica su formato GIS.'; return false; }
  }
  function iniciar() {
    // Canvas mantiene fluido el mapa aun cuando un distrito contiene miles de
    // polígonos INEI, sin perder la interacción de tuberías y beneficiarios.
    const botonCrearProyecto=$('abrirCrearProyecto');
    // La ficha debe abrirse aun cuando el mapa o sus capas no estén disponibles.
    botonCrearProyecto?.addEventListener('click',()=>{
      poblarUbicacionesProyecto();
      actualizarResumenEquipoProyecto();
      renderListaProyectosEdicion();
      limpiarFormularioProyecto();
      mostrarVistaCrearProyecto();
      mostrarPasoAsistenteProyecto(1);
    });
    poblarProyectoPadre();
    actualizarModoJerarquiaProyecto();
    organizarBloquesGestionContractual();
    actualizarConfiguracionActoresComponentes();
    document.querySelectorAll('input[name="actoresCompartidosComponentes"]').forEach(opcion=>{
      opcion.addEventListener('change',actualizarConfiguracionActoresComponentes);
      opcion.addEventListener('click',actualizarConfiguracionActoresComponentes);
    });
    ['contratista','interventor'].forEach(tipo=>$(`${tipo}CompartidoContrato`)?.addEventListener('change',()=>sincronizarActorCompartido(tipo)));
    ['fechaInicioCompartidaContrato','fechaFinCompartidaContrato'].forEach(id=>$(id)?.addEventListener('change',actualizarConfiguracionActoresComponentes));
    let documentoContratoPendienteEliminar=null;
    const actualizarDocumentoContrato=control=>{
      const archivo=control.querySelector('input[type="file"]')?.files?.[0],nombre=control.querySelector('small'),ver=control.querySelector('.ver-documento-contrato'),eliminar=control.querySelector('.eliminar-documento-contrato');
      if(nombre)nombre.textContent=archivo?archivo.name:'Sin archivo';
      if(ver)ver.disabled=!archivo;
      if(eliminar)eliminar.hidden=!archivo;
    };
    const configurarDocumentoContrato=control=>{
      const entrada=control.querySelector('input[type="file"]'),ver=control.querySelector('.ver-documento-contrato'),eliminar=control.querySelector('.eliminar-documento-contrato');
      if(ver){ver.setAttribute('aria-label','Ver PDF adjunto');ver.title='Ver PDF adjunto';ver.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.6"/></svg>';}
      actualizarDocumentoContrato(control);
      entrada?.addEventListener('change',()=>actualizarDocumentoContrato(control));
      ver?.addEventListener('click',()=>{
        const archivo=entrada?.files?.[0];if(!archivo)return;
        window.open(URL.createObjectURL(archivo),'_blank','noopener');
      });
      eliminar?.addEventListener('click',()=>{
        const archivo=entrada?.files?.[0];if(!archivo)return;
        documentoContratoPendienteEliminar=control;
        $('detalleEliminarDocumentoContrato').textContent=`¿Desea eliminar “${archivo.name}”? Esta acción quitará el PDF del registro contractual.`;
        $('modalConfirmarEliminarDocumentoContrato').showModal();
      });
    };
    document.querySelectorAll('.acciones-documento-contrato').forEach(configurarDocumentoContrato);
    const tablaInicialDocumentosMaestros=document.querySelector('.tabla-documentos-maestros'),contenedorDocumentosMaestros=tablaInicialDocumentosMaestros?.parentElement,tiposMaestrosBase=[...(tablaInicialDocumentosMaestros?.querySelectorAll('tbody tr')||[])].map(fila=>fila.cells[0]?.textContent.trim()).filter(Boolean);
    tablaInicialDocumentosMaestros?.remove();
    const obtenerCuerpoDocumentosMaestros=()=>{
      let cuerpo=document.querySelector('.tabla-documentos-maestros tbody');if(cuerpo)return cuerpo;
      if(!contenedorDocumentosMaestros)return null;
      const tabla=document.createElement('section');tabla.className='tabla-documentos-maestros documentos-maestros-cargados';
      tabla.innerHTML='<header><div><small>DOCUMENTOS INCORPORADOS</small><p>Archivos vigentes cargados masivamente.</p></div></header><div class="tabla-documentos-maestros-scroll"><table><thead><tr><th>Documento</th><th>Versión / archivo</th></tr></thead><tbody></tbody></table></div>';
      contenedorDocumentosMaestros.append(tabla);return tabla.querySelector('tbody');
    };
    const crearFilaDocumentoMaestro=nombre=>{
      const cuerpo=obtenerCuerpoDocumentosMaestros();if(!cuerpo)return null;
      const fila=document.createElement('tr');
      fila.innerHTML=`<td>${nombre?escapePlanificacion(nombre):'<input class="nombre-documento-maestro" type="text" placeholder="Nombre del documento">'}</td><td><div class="acciones-documento-contrato"><label class="carga-sustento-hito carga-documento-contrato"><input type="file" accept=".pdf,application/pdf" hidden><span>Agregar PDF</span><small>Sin archivo</small></label><button type="button" class="ver-documento-contrato" disabled>Ver</button><button type="button" class="eliminar-documento-contrato" hidden aria-label="Eliminar PDF" title="Eliminar PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"/></svg></button></div></td>`;
      cuerpo.append(fila);configurarDocumentoContrato(fila.querySelector('.acciones-documento-contrato'));return fila;
    };
    $('agregarDocumentoMaestroContrato')?.addEventListener('click',()=>{
      crearFilaDocumentoMaestro()?.querySelector('.nombre-documento-maestro')?.focus();
    });
    const preguntaActoresDocumentos=document.querySelector('.pregunta-actores-compartidos');
    if(contenedorDocumentosMaestros&&!$('cargarMasivoDocumentosContrato'))(preguntaActoresDocumentos||contenedorDocumentosMaestros).insertAdjacentHTML('afterend','<section class="carga-masiva-documentos-contrato" hidden><button type="button" id="cargarMasivoDocumentosContrato">⇧ Adjuntar documentos</button><input id="selectorCargaMasivaDocumentosContrato" type="file" accept=".pdf,application/pdf" multiple hidden></section>');
    actualizarConfiguracionActoresComponentes();
    if(!$('modalAdjuntarDocumentosMaestrosContrato'))document.body.insertAdjacentHTML('beforeend','<dialog class="modal-archivos-actor modal-adjuntar-documentos-maestros" id="modalAdjuntarDocumentosMaestrosContrato"><header><div><small>DOCUMENTOS MAESTROS DEL CONTRATO</small><h2>Adjuntar documentos</h2><p>Seleccione todos los PDF vigentes que desea incorporar.</p></div><button type="button" data-cerrar-adjuntar-maestros aria-label="Cerrar">×</button></header><div class="cuerpo-archivos-actor"><div class="zona-arrastre-actor" id="zonaAdjuntarDocumentosMaestros" tabindex="0"><span aria-hidden="true">⇧</span><strong>Arrastre sus PDF aquí</strong><small>o selecciónelos desde su equipo</small><button type="button" id="buscarDocumentosMaestros">Buscar PDF</button><em>Formato permitido: PDF.</em></div><p id="estadoAdjuntarDocumentosMaestros">Aún no se han seleccionado archivos.</p></div><footer><button type="button" data-cerrar-adjuntar-maestros>Cancelar</button></footer></dialog>');
    $('zonaAdjuntarDocumentosMaestros').append($('selectorCargaMasivaDocumentosContrato'));
    if(!$('modalCargaMasivaDocumentosContrato'))document.body.insertAdjacentHTML('beforeend','<dialog class="modal-vista-pdf modal-carga-masiva-contrato" id="modalCargaMasivaDocumentosContrato"><header><div><small>DOCUMENTOS MAESTROS DEL CONTRATO</small><h2>Carga masiva de documentos</h2><p>Asigne cada PDF al documento contractual correspondiente.</p></div><button type="button" data-cerrar-carga-masiva-contrato aria-label="Cerrar">×</button></header><div class="cuerpo-vista-pdf"><div class="tabla-documentos-convenio"><table><thead><tr><th>Archivo seleccionado</th><th>Asignar como</th></tr></thead><tbody id="listaCargaMasivaDocumentosContrato"></tbody></table></div></div><footer><button type="button" data-cerrar-carga-masiva-contrato>Cancelar</button><button type="button" id="confirmarCargaMasivaDocumentosContrato">Incorporar documentos</button></footer></dialog>');
    let archivosCargaMasivaContrato=[];
    const tiposDocumentosMaestros=()=>tiposMaestrosBase;
    const renderCargaMasivaDocumentosContrato=()=>{const tipos=tiposDocumentosMaestros(),lista=$('listaCargaMasivaDocumentosContrato');lista.innerHTML=archivosCargaMasivaContrato.map((archivo,indice)=>`<tr><td>${escapePlanificacion(archivo.name)}</td><td><select data-asignacion-masiva-documento="${indice}"><option value="__nuevo__" selected>Documento adicional…</option>${tipos.map(tipo=>`<option value="${escapePlanificacion(tipo)}">${escapePlanificacion(tipo)}</option>`).join('')}</select></td></tr>`).join('');};
    $('cargarMasivoDocumentosContrato').addEventListener('click',()=>{$('estadoAdjuntarDocumentosMaestros').textContent='Arrastre los PDF o selecciónelos desde su equipo.';$('modalAdjuntarDocumentosMaestrosContrato').showModal();});
    $('buscarDocumentosMaestros').addEventListener('click',()=>$('selectorCargaMasivaDocumentosContrato').click());
    const prepararCargaMasivaDocumentos=archivos=>{archivosCargaMasivaContrato=[...archivos].filter(archivo=>archivo.type==='application/pdf'||/\.pdf$/i.test(archivo.name));if(!archivosCargaMasivaContrato.length){$('estadoAdjuntarDocumentosMaestros').textContent='Seleccione uno o varios archivos PDF.';return;}$('estadoAdjuntarDocumentosMaestros').textContent=`${archivosCargaMasivaContrato.length} PDF seleccionado${archivosCargaMasivaContrato.length===1?'':'s'}.`;renderCargaMasivaDocumentosContrato();$('modalAdjuntarDocumentosMaestrosContrato').close();$('modalCargaMasivaDocumentosContrato').showModal();};
    $('selectorCargaMasivaDocumentosContrato').addEventListener('change',evento=>{prepararCargaMasivaDocumentos(evento.target.files);evento.target.value='';});
    ['dragenter','dragover'].forEach(tipo=>$('zonaAdjuntarDocumentosMaestros').addEventListener(tipo,evento=>{evento.preventDefault();$('zonaAdjuntarDocumentosMaestros').classList.add('arrastre-activo');}));['dragleave','drop'].forEach(tipo=>$('zonaAdjuntarDocumentosMaestros').addEventListener(tipo,evento=>{evento.preventDefault();$('zonaAdjuntarDocumentosMaestros').classList.remove('arrastre-activo');}));$('zonaAdjuntarDocumentosMaestros').addEventListener('drop',evento=>prepararCargaMasivaDocumentos(evento.dataTransfer.files));
    document.querySelectorAll('[data-cerrar-adjuntar-maestros]').forEach(boton=>boton.addEventListener('click',()=>$('modalAdjuntarDocumentosMaestrosContrato').close()));
    document.querySelectorAll('[data-cerrar-carga-masiva-contrato]').forEach(boton=>boton.addEventListener('click',()=>{$('modalCargaMasivaDocumentosContrato').close();archivosCargaMasivaContrato=[];}));
    $('confirmarCargaMasivaDocumentosContrato').addEventListener('click',()=>{const tipos=tiposDocumentosMaestros();archivosCargaMasivaContrato.forEach((archivo,indice)=>{const asignacion=$(`listaCargaMasivaDocumentosContrato`).querySelector(`[data-asignacion-masiva-documento="${indice}"]`)?.value;let fila=asignacion==='__nuevo__'?crearFilaDocumentoMaestro(archivo.name):[...document.querySelectorAll('.tabla-documentos-maestros tbody tr')].find(item=>item.cells[0]?.textContent.trim()===asignacion);if(!fila&&asignacion)fila=crearFilaDocumentoMaestro(asignacion);const entrada=fila?.querySelector('input[type="file"]');if(!entrada)return;const transferencia=new DataTransfer();transferencia.items.add(archivo);entrada.files=transferencia.files;entrada.dispatchEvent(new Event('change',{bubbles:true}));});$('modalCargaMasivaDocumentosContrato').close();archivosCargaMasivaContrato=[];});
    const cerrarEliminarDocumentoContrato=()=>{$('modalConfirmarEliminarDocumentoContrato').close();documentoContratoPendienteEliminar=null;};
    $('cerrarEliminarDocumentoContrato').addEventListener('click',cerrarEliminarDocumentoContrato);
    $('cancelarEliminarDocumentoContrato').addEventListener('click',cerrarEliminarDocumentoContrato);
    $('confirmarEliminarDocumentoContrato').addEventListener('click',()=>{
      const entrada=documentoContratoPendienteEliminar?.querySelector('input[type="file"]');
      if(entrada)entrada.value='';
      if(documentoContratoPendienteEliminar)actualizarDocumentoContrato(documentoContratoPendienteEliminar);
      cerrarEliminarDocumentoContrato();
    });
    if(location.hash==='#ficha-proyecto'){
      mostrarVistaCrearProyecto();
      vistaCrearProyecto.classList.add('vista-ficha-directa');
      mostrarPasoAsistenteProyecto(7);
      history.replaceState(null,'','#ficha-proyecto');
    }
    $('asignarVisitaCampo').addEventListener('click',()=>{
      $('visitaCampoUsuario').value=$('proyectoVisitaUsuario').value;
      $('visitaCampoFecha').value=$('proyectoVisitaFecha').value;
      $('modalAsignarVisitaCampo').showModal();
    });
    const cerrarAsignacionVisita=()=>{$('modalAsignarVisitaCampo').close();};
    $('cerrarAsignarVisitaCampo').addEventListener('click',cerrarAsignacionVisita);
    $('cancelarAsignarVisitaCampo').addEventListener('click',cerrarAsignacionVisita);
    $('confirmarAsignarVisitaCampo').addEventListener('click',()=>{
      const usuario=$('visitaCampoUsuario').value;
      if(!usuario){$('visitaCampoUsuario').focus();return;}
      $('proyectoVisitaUsuario').value=usuario;
      $('proyectoVisitaFecha').value=$('visitaCampoFecha').value;
      $('proyectoVisitaFormatoGuardado').value='true';
      actualizarEstadoVisitaCampo();
      cerrarAsignacionVisita();
    });
    actualizarEstadoVisitaCampo();
    const requisitosFise=[
      ['i','Área del terreno','≥ 3,500 m²'],['ii','Geometría del terreno','Preferentemente rectangular, aprox. 60 m × 60 m'],['iii','Pendiente del terreno','≤ 5%'],['iv','Disponibilidad de planos','Ubicación, área, perímetro y accesos'],['v','Partida registral','Titular público y vigencia preferente de 3 meses'],['vi','Zonificación o tipo de uso','Compatible con una planta PSR-GNL'],['vii','Estudio de mecánica de suelos','Napa freática, relleno y conformidad de uso'],['viii','Interferencias en superficie','Sin edificaciones, árboles o cables incompatibles'],['ix','Interferencias subterráneas','Sin cauces, canales, acequias u otras interferencias'],['x','Vía de acceso para GNL','Ancho mínimo de 4 a 6 m y giro para cisterna'],['xi','Suministro eléctrico','Factibilidad entre 12 kW y 45 kW'],['xii','Distancia a residencias','Máximo 5 km del centro de consumo'],['xiii','Puntos de reunión cercanos','Alejado de iglesias, estadios y concurrencia masiva']
    ];
    const claveRequisitosFise='masificacion.requisitos-tecnicos-fise';
    let resultadosRequisitosFise={};
    try{resultadosRequisitosFise=JSON.parse(localStorage.getItem(claveRequisitosFise)||'{}');}catch(error){resultadosRequisitosFise={};}
    if(!resultadosRequisitosFise.terreno1)resultadosRequisitosFise={terreno1:resultadosRequisitosFise,terreno2:{}};
    let terrenoFiseActivo='terreno1';
    const documentosRequisitosFise={
      i:[{nombre:'Evidencia fotográfica del predio.png',tipo:'Imagen',url:'../../img/evidencia-eat-predio.png'}],
      ii:[{nombre:'Plano y geometría del terreno.png',tipo:'Imagen',url:'../../img/evidencia-panel-eat.png'}],
      iii:[{nombre:'Medición de pendiente.png',tipo:'Imagen',url:'../../img/evidencia-eat-medidor.png'}],
      iv:[{nombre:'Informe de verificación técnica.pdf',tipo:'PDF',url:'../../INTERVENTOR/documentos/NC_250002_FIRMADA.pdf'}],
      v:[{nombre:'Partida registral del predio.png',tipo:'Imagen',url:'../../img/evidencia-eat-dni.png'}]
    };
    const tablaDocumentosRequisito=codigo=>{const documentos=documentosRequisitosFise[codigo]||[];return documentos.length?`<div class="lista-documentos-requisito"><table><thead><tr><th>Documento</th><th>Tipo</th><th>Acción</th></tr></thead><tbody>${documentos.map((documento,indice)=>`<tr><td>${escapePlanificacion(documento.nombre)}</td><td><span class="tipo-documento-requisito ${documento.tipo==='PDF'?'pdf':'imagen'}">${documento.tipo==='PDF'?'PDF':'IMG'}</span></td><td><button type="button" class="vista-documento-requisito" data-vista-documento-requisito="${indice}" data-requisito-documento="${codigo}" title="Ver documento" aria-label="Ver ${escapePlanificacion(documento.nombre)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg></button></td></tr>`).join('')}</tbody></table></div>`:'<p class="sin-documentos-requisito">Sin documentos adjuntos para este requisito.</p>';};
    const cuerpoRequisitosFise=$('cuerpoRequisitosTecnicosFise');
    const renderRequisitosFise=()=>{cuerpoRequisitosFise.innerHTML=requisitosFise.map(([codigo,nombre,descripcion])=>{
      const valor=resultadosRequisitosFise[terrenoFiseActivo]?.[codigo]||'Sí';
      return `<article class="requisito-fise-vertical" data-requisito-fise-fila="${codigo}"><b>${codigo}</b><div class="requisito-fise-texto"><strong>${nombre}</strong><span>${descripcion}</span></div><div class="acciones-requisito-fise"><div class="opciones-requisito-fise" role="group" aria-label="Resultado para ${nombre}"><label><input type="radio" name="requisito-fise-${codigo}" value="Sí" data-requisito-fise="${codigo}" disabled${valor==='Sí'?' checked':''}> Sí</label><label><input type="radio" name="requisito-fise-${codigo}" value="No" data-requisito-fise="${codigo}" disabled${valor==='No'?' checked':''}> No</label></div><button type="button" class="editar-requisito-vertical" data-editar-requisito="${codigo}" title="Editar resultado" aria-label="Editar resultado de ${nombre}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.9-10.9a2.2 2.2 0 0 0-3.1-3.1L5.1 15.9 4 20Z"/><path d="m14.6 6.4 3 3"/></svg></button><button type="button" class="alternar-detalle-requisito" data-detalle-requisito="${codigo}" title="Abrir documentos adjuntos" aria-label="Abrir documentos adjuntos de ${nombre}" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 9 5.5 5.5L17.5 9"/></svg></button></div><section class="detalle-requisito-fise" hidden>${tablaDocumentosRequisito(codigo)}</section></article>`;
    }).join('');};
    renderRequisitosFise();
    if(!$('modalVistaDocumentoRequisito'))document.body.insertAdjacentHTML('beforeend','<dialog class="modal-vista-documento-requisito" id="modalVistaDocumentoRequisito"><header><div><small>DOCUMENTACIÓN ADJUNTA</small><h2 id="tituloVistaDocumentoRequisito">Documento</h2></div><button type="button" id="cerrarVistaDocumentoRequisito" aria-label="Cerrar">×</button></header><div class="contenido-vista-documento-requisito" id="contenidoVistaDocumentoRequisito"></div><footer><button type="button" id="cerrarVistaDocumentoRequisitoPie">Cerrar</button></footer></dialog>');
    cuerpoRequisitosFise.addEventListener('change',evento=>{
      if(!evento.target.matches('[data-requisito-fise]'))return;
      resultadosRequisitosFise[terrenoFiseActivo][evento.target.dataset.requisitoFise]=evento.target.value;
      localStorage.setItem(claveRequisitosFise,JSON.stringify(resultadosRequisitosFise));
    });
    document.querySelectorAll('[data-terreno-fise]').forEach(boton=>boton.addEventListener('click',()=>{terrenoFiseActivo=boton.dataset.terrenoFise;document.querySelectorAll('[data-terreno-fise]').forEach(item=>item.classList.toggle('activa',item===boton));renderRequisitosFise();}));
    cuerpoRequisitosFise.addEventListener('click',evento=>{
      const editar=evento.target.closest('[data-editar-requisito]');
      if(editar){const fila=editar.closest('.requisito-fise-vertical'),activar=!fila.classList.contains('edicion-activa');fila.classList.toggle('edicion-activa',activar);fila.querySelectorAll('[data-requisito-fise]').forEach(control=>control.disabled=!activar);editar.title=activar?'Bloquear edición':'Editar resultado';editar.setAttribute('aria-label',activar?'Bloquear edición del requisito':'Editar resultado del requisito');return;}
      const alternar=evento.target.closest('[data-detalle-requisito]');
      if(alternar){const detalle=alternar.closest('.requisito-fise-vertical').querySelector('.detalle-requisito-fise'),abrir=detalle.hidden;detalle.hidden=!abrir;alternar.setAttribute('aria-expanded',String(abrir));alternar.title=abrir?'Cerrar documentos adjuntos':'Abrir documentos adjuntos';alternar.setAttribute('aria-label',abrir?'Cerrar documentos adjuntos del requisito':'Abrir documentos adjuntos del requisito');return;}
      const vista=evento.target.closest('[data-vista-documento-requisito]');
      if(vista){const documento=documentosRequisitosFise[vista.dataset.requisitoDocumento]?.[Number(vista.dataset.vistaDocumentoRequisito)];if(!documento)return;$('tituloVistaDocumentoRequisito').textContent=documento.nombre;$('contenidoVistaDocumentoRequisito').innerHTML=documento.tipo==='PDF'?`<iframe src="${documento.url}" title="${documento.nombre}"></iframe>`:`<img src="${documento.url}" alt="${documento.nombre}">`;$('modalVistaDocumentoRequisito').showModal();return;}
    });
    const cerrarVistaDocumentoRequisito=()=>{$('modalVistaDocumentoRequisito').close();$('contenidoVistaDocumentoRequisito').replaceChildren();};
    $('cerrarVistaDocumentoRequisito').addEventListener('click',cerrarVistaDocumentoRequisito);$('cerrarVistaDocumentoRequisitoPie').addEventListener('click',cerrarVistaDocumentoRequisito);
    const cerrarRequisitosFise=()=>{$('modalRequisitosTecnicosFise').close();};
    $('abrirRequisitosTecnicosFise').addEventListener('click',()=>{$('modalRequisitosTecnicosFise').showModal();});
    $('cerrarRequisitosTecnicosFise').addEventListener('click',cerrarRequisitosFise);
    $('cerrarRequisitosTecnicosFisePie').addEventListener('click',cerrarRequisitosFise);
    const reglasPenalidades={retraso:'0.50 UIT por cada día de retraso',seguridad:'Hasta 10 UIT por cada evento identificado',tecnica:'Hasta 10 UIT por cada evento identificado'};
    const iconoSustentosPenalidad='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5zM16 3v4h4M8 11h8M8 15h8M8 19h5"/><path d="m8 8 1.5 1.5L12 7"/></svg>';
    const accionSustentosPenalidad=()=>`<button type="button" class="boton-sustentos-penalidad" title="Gestionar sustentos" aria-label="Gestionar sustentos" aria-expanded="false">${iconoSustentosPenalidad}<span>Sustentos</span></button>`;
    const crearFilaPenalidad=()=>'<td><select><option>PSR-GNL</option><option>Redes de distribución</option><option>Tuberías de conexión</option></select></td><td><select class="causal-penalidad"><option value="retraso">Incumplimiento del cronograma de obra</option><option value="seguridad">Incumplimiento de seguridad y medio ambiente</option><option value="tecnica">Incumplimiento de disposiciones técnicas</option></select></td><td><small class="regla-penalidad">0.50 UIT por cada día de retraso</small></td><td><input placeholder="Hecho detectado"></td><td><input type="date"></td><td><select><option>Pendientes</option><option>Recibidos</option><option>Sin descargos</option><option>Subsanado</option></select></td><td><input type="number" min="0" step="0.01" placeholder="0.00"></td><td><select><option>En evaluación</option><option>Notificada</option><option>Aplicada</option><option>No aplicada</option></select></td><td>${accionSustentosPenalidad()}</td>';
    const iconoOjoPenalidad='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>';
    const crearFilaSustentoPenalidad=()=>`<tr><td><input placeholder="Descripción del sustento"></td><td><select><option>Contratista</option><option>Interventor</option><option>FISE</option></select></td><td><input type="date"></td><td><div class="archivo-sustento-penalidad"><button type="button" class="adjuntar-sustento-penalidad">Adjuntar PDF</button><button type="button" class="ver-sustentos-penalidad" title="Ver archivos adjuntos" aria-label="Ver archivos adjuntos" disabled>${iconoOjoPenalidad}</button><small>Sin archivos adjuntos</small></div></td><td><select><option>Pendiente</option><option>Recibido</option><option>Validado</option></select></td></tr>`;
    const abrirSustentosPenalidad=fila=>{let detalle=fila.nextElementSibling;if(!detalle?.classList.contains('fila-sustentos-penalidad')){detalle=document.createElement('tr');detalle.className='fila-sustentos-penalidad';detalle.hidden=true;detalle.innerHTML=`<td colspan="9"><section class="subtabla-sustentos-penalidad"><table><thead><tr><th>Detalle del sustento</th><th>Responsable</th><th>Fecha</th><th>Archivo PDF</th><th>Estado</th></tr></thead><tbody>${crearFilaSustentoPenalidad()}</tbody></table><div class="acciones-sustentos-penalidad"><button type="button" class="agregar-sustento-penalidad">＋ Agregar sustento</button></div></section></td>`;fila.after(detalle);}detalle.hidden=!detalle.hidden;fila.querySelector('.boton-sustentos-penalidad')?.setAttribute('aria-expanded',String(!detalle.hidden));};
    const tablaPenalidades=$('tablaPenalidadesProyecto');
    const encabezadoPenalidades=tablaPenalidades.closest('table')?.tHead?.rows[0];
    if(encabezadoPenalidades){if(encabezadoPenalidades.cells[3])encabezadoPenalidades.cells[3].textContent='Hecho detectado';if(!encabezadoPenalidades.querySelector('.columna-accion-penalidad')){const columna=document.createElement('th');columna.className='columna-accion-penalidad';columna.textContent='Acción';encabezadoPenalidades.append(columna);}}
    [...tablaPenalidades.rows].forEach(fila=>{if(!fila.querySelector('.boton-sustentos-penalidad'))fila.insertCell().innerHTML=accionSustentosPenalidad();fila.cells[3]?.querySelector('input')?.setAttribute('placeholder','Hecho detectado');});
    $('agregarPenalidadProyecto').addEventListener('click',()=>{const fila=document.createElement('tr');fila.innerHTML=crearFilaPenalidad();tablaPenalidades.append(fila);});
    if(!$('modalAdjuntarSustentoPenalidad'))document.body.insertAdjacentHTML('beforeend',`<dialog class="modal-archivos-actor modal-sustento-penalidad" id="modalAdjuntarSustentoPenalidad"><header><div><small>PENALIDADES</small><h2>Adjuntar PDFs</h2><p>Cargue uno o varios documentos de sustento.</p></div><button type="button" class="cerrar-modal-sustento" aria-label="Cerrar">×</button></header><div class="cuerpo-archivos-actor"><div class="zona-arrastre-actor" id="zonaArrastreSustentoPenalidad"><input id="selectorSustentoPenalidad" type="file" accept=".pdf,application/pdf" multiple hidden><span aria-hidden="true">⇧</span><strong>Arrastre uno o varios PDF aquí</strong><small>o selecciónelos desde su equipo</small><button type="button" id="buscarSustentoPenalidad">Buscar archivos</button><em>Formato permitido: PDF.</em></div><p id="estadoSustentoPenalidad">Aún no se han seleccionado archivos.</p></div><footer><button type="button" class="cerrar-modal-sustento">Cancelar</button></footer></dialog><dialog class="modal-vista-pdf modal-lista-pdf" id="modalListaSustentosPenalidad"><header><div><small>PENALIDADES</small><h2>Documentos de sustento</h2><p>Seleccione el ícono de ojo para revisar un PDF.</p></div><button type="button" class="cerrar-lista-sustento" aria-label="Cerrar">×</button></header><div class="cuerpo-vista-pdf"><div class="tabla-documentos-convenio"><table><thead><tr><th>Documento PDF</th><th>Acción</th></tr></thead><tbody id="listaSustentosPenalidad"></tbody></table></div></div><footer><button type="button" class="cerrar-lista-sustento">Cerrar</button></footer></dialog><dialog class="modal-vista-pdf modal-visor-pdf" id="modalVisorSustentoPenalidad"><header><div><small>VISTA PREVIA DEL DOCUMENTO</small><h2>Documento PDF</h2><p id="nombreVisorSustentoPenalidad">Seleccione un documento</p></div><button type="button" class="cerrar-visor-sustento" aria-label="Cerrar">×</button></header><div class="cuerpo-vista-pdf"><iframe id="visorSustentoPenalidad" title="Vista previa del PDF de sustento"></iframe></div><footer><button type="button" class="volver-lista-sustento">Volver a documentos</button><button type="button" class="cerrar-visor-sustento">Cerrar</button></footer></dialog>`);
    let filaSustentoActiva=null,archivosSustentoActuales=[],urlVistaSustento='';
    const modalAdjuntarSustento=$('modalAdjuntarSustentoPenalidad'),modalListaSustento=$('modalListaSustentosPenalidad'),modalVisorSustento=$('modalVisorSustentoPenalidad'),selectorSustento=$('selectorSustentoPenalidad'),estadoSustento=$('estadoSustentoPenalidad');
    const cerrarAdjuntarSustento=()=>{if(modalAdjuntarSustento.open)modalAdjuntarSustento.close();};
    const asignarSustentos=archivos=>{const validos=[...archivos].filter(archivo=>archivo.type==='application/pdf'||/\.pdf$/i.test(archivo.name));if(!filaSustentoActiva||!validos.length)return;filaSustentoActiva._archivosSustento=validos;const resumen=filaSustentoActiva.querySelector('.archivo-sustento-penalidad small'),ver=filaSustentoActiva.querySelector('.ver-sustentos-penalidad');resumen.textContent=validos.length===1?validos[0].name:`${validos.length} PDF adjuntos`;ver.disabled=false;estadoSustento.textContent=`${validos.length} PDF listo(s) para adjuntar.`;cerrarAdjuntarSustento();};
    const abrirCargaSustento=fila=>{filaSustentoActiva=fila;selectorSustento.value='';estadoSustento.textContent='Arrastre los PDF o selecciónelos desde su equipo.';modalAdjuntarSustento.showModal();};
    const abrirListaSustentos=fila=>{archivosSustentoActuales=fila._archivosSustento||[];$('listaSustentosPenalidad').innerHTML=archivosSustentoActuales.map((archivo,indice)=>`<tr><td>${archivo.name}</td><td><button type="button" class="abrir-pdf-sustento" data-indice-pdf-sustento="${indice}" title="Ver PDF" aria-label="Ver PDF">${iconoOjoPenalidad}</button></td></tr>`).join('');modalListaSustento.showModal();};
    const cerrarVisorSustento=()=>{if(urlVistaSustento){URL.revokeObjectURL(urlVistaSustento);urlVistaSustento='';}$('visorSustentoPenalidad').removeAttribute('src');if(modalVisorSustento.open)modalVisorSustento.close();};
    document.querySelectorAll('.cerrar-modal-sustento').forEach(boton=>boton.addEventListener('click',cerrarAdjuntarSustento));
    document.querySelectorAll('.cerrar-lista-sustento').forEach(boton=>boton.addEventListener('click',()=>modalListaSustento.close()));
    document.querySelectorAll('.cerrar-visor-sustento').forEach(boton=>boton.addEventListener('click',cerrarVisorSustento));
    document.querySelector('.volver-lista-sustento')?.addEventListener('click',()=>{cerrarVisorSustento();modalListaSustento?.showModal();});
    $('buscarSustentoPenalidad')?.addEventListener('click',()=>selectorSustento?.click());selectorSustento?.addEventListener('change',()=>asignarSustentos(selectorSustento.files));
    const zonaSustento=$('zonaArrastreSustentoPenalidad');if(zonaSustento){['dragenter','dragover'].forEach(tipo=>zonaSustento.addEventListener(tipo,event=>{event.preventDefault();zonaSustento.classList.add('arrastrando');}));['dragleave','drop'].forEach(tipo=>zonaSustento.addEventListener(tipo,event=>{event.preventDefault();zonaSustento.classList.remove('arrastrando');}));zonaSustento.addEventListener('drop',evento=>asignarSustentos(evento.dataTransfer.files));}
    tablaPenalidades.addEventListener('change',evento=>{if(evento.target.matches('.causal-penalidad')){const regla=evento.target.closest('tr').querySelector('.regla-penalidad');regla.textContent=reglasPenalidades[evento.target.value]||'';}});
    tablaPenalidades.addEventListener('click',evento=>{const boton=evento.target.closest('.boton-sustentos-penalidad');if(boton){abrirSustentosPenalidad(boton.closest('tr'));return;}const agregar=evento.target.closest('.agregar-sustento-penalidad');if(agregar){const cuerpo=agregar.closest('.subtabla-sustentos-penalidad').querySelector('tbody');cuerpo.insertAdjacentHTML('beforeend',crearFilaSustentoPenalidad());return;}const adjuntar=evento.target.closest('.adjuntar-sustento-penalidad');if(adjuntar){abrirCargaSustento(adjuntar.closest('tr'));return;}const ver=evento.target.closest('.ver-sustentos-penalidad');if(ver){abrirListaSustentos(ver.closest('tr'));}});
    $('listaSustentosPenalidad').addEventListener('click',evento=>{const ojo=evento.target.closest('.abrir-pdf-sustento');if(!ojo)return;const archivo=archivosSustentoActuales[Number(ojo.dataset.indicePdfSustento)];if(!archivo)return;modalListaSustento.close();urlVistaSustento=URL.createObjectURL(archivo);$('nombreVisorSustentoPenalidad').textContent=archivo.name;$('visorSustentoPenalidad').src=urlVistaSustento;modalVisorSustento.showModal();});
    document.querySelectorAll('.fila-contrato-componentes label').forEach(etiqueta=>{
      const nombre=etiqueta.firstChild?.textContent.trim(),entrada=etiqueta.querySelector('input');
      if(nombre==='Monto contratado'&&entrada)etiqueta.innerHTML='Monto contractual <span class="entrada-unidad-contractual"><select aria-label="Moneda del monto contractual"><option value="PEN">S/ Soles</option><option value="USD">US$ Dólares</option></select><input type="number" min="0" step="0.01" placeholder="0.00"></span>';
      if(nombre==='Plazo de ejecución'&&entrada)etiqueta.innerHTML='Plazo de ejecución <span class="entrada-unidad-contractual"><input type="number" min="0" step="1" placeholder="0"><select aria-label="Unidad del plazo de ejecución"><option value="dias">Días</option><option value="meses">Meses</option><option value="anios">Años</option></select></span>';
    });
    document.querySelectorAll('.documentos-monto-plazo').forEach(control=>control.closest('.contenido-actor-contractual')?.querySelector('.carga-archivos-actor')?.append(control));
    document.querySelectorAll('.documentos-monto-plazo').forEach(control=>control.remove());
    document.querySelectorAll('.grupo-actor-contractual').forEach(grupo=>{
      const actor=grupo.querySelector('.barra-actor-contractual strong')?.textContent;
      if(!['Contratista','Interventor'].includes(actor)||grupo.querySelector('.datos-monto-plazo-contractual'))return;
      const codigo=actor==='Contratista'?'C':'I',control=document.createElement('div'),contenido=grupo.querySelector('.contenido-actor-contractual'),adjuntos=contenido.querySelector('.carga-archivos-actor');
      control.className='datos-monto-plazo-contractual';
      control.innerHTML=`<label>Monto contractual (${codigo}) <span class="entrada-unidad-contractual"><select aria-label="Moneda del monto contractual ${codigo}" data-tipo="moneda-${codigo.toLowerCase()}"><option value="PEN">S/ Soles</option><option value="USD">US$ Dólares</option></select><input type="number" min="0" step="0.01" placeholder="0.00" data-tipo="monto-${codigo.toLowerCase()}"></span></label><label>Plazo de ejecución <small>Compartido</small><span class="entrada-unidad-contractual"><input type="number" min="0" step="1" placeholder="0" class="plazo-contractual-compartido" data-tipo="plazo"><select aria-label="Unidad del plazo de ejecución" class="unidad-plazo-compartida" data-tipo="unidad-plazo"><option value="dias">Días</option><option value="meses">Meses</option><option value="anios">Años</option></select></span></label><label>Fecha de inicio<input type="date" data-tipo="fecha-inicio"></label><label>Fecha de fin<input type="date" data-tipo="fecha-fin"></label>`;
      contenido.insertBefore(control,adjuntos);
    });
    document.querySelectorAll('.gestion-contractual-componente').forEach(gestion=>gestion.addEventListener('input',evento=>{if(!evento.target.matches('.plazo-contractual-compartido'))return;gestion.querySelectorAll('.plazo-contractual-compartido').forEach(control=>{if(control!==evento.target)control.value=evento.target.value;});}));
    document.querySelectorAll('.gestion-contractual-componente').forEach(gestion=>gestion.addEventListener('change',evento=>{if(!evento.target.matches('.unidad-plazo-compartida'))return;gestion.querySelectorAll('.unidad-plazo-compartida').forEach(control=>{if(control!==evento.target)control.value=evento.target.value;});}));
    const tarjetasParametros=[...document.querySelectorAll('.panel-parametros-contractuales .desplegable-parametro')];
    const actualizarResumenContractual=componente=>{
      const gestion=document.querySelector(`.gestion-contractual-componente[data-gestion-componente="${componente}"]`),tarjeta=tarjetasParametros.find(item=>componente==='psr'?item.classList.contains('parametro-psr'):item.querySelector('h4')?.textContent.includes(componente==='redes'?'Redes':'Tuberías'));
      if(!gestion)return;
      const montoC=gestion.querySelector('[data-tipo="monto-c"]')?.value||'',monedaC=gestion.querySelector('[data-tipo="moneda-c"]')?.value||'PEN',montoI=gestion.querySelector('[data-tipo="monto-i"]')?.value||'',monedaI=gestion.querySelector('[data-tipo="moneda-i"]')?.value||'PEN',plazoCompartido=gestion.querySelector('[data-tipo="plazo"]')?.value||'',unidadCompartida=gestion.querySelector('[data-tipo="unidad-plazo"]')?.selectedOptions[0]?.textContent||'Días',resumenGestion=gestion.querySelector('.resumen-barra-gestion');
      if(resumenGestion){const completo=Boolean(montoC&&montoI&&plazoCompartido);resumenGestion.hidden=!completo;if(completo)resumenGestion.innerHTML=`<span><small>Monto contratista</small><strong>${monedaC==='USD'?'US$':'S/'} ${montoC}</strong></span><span><small>Monto interventor</small><strong>${monedaI==='USD'?'US$':'S/'} ${montoI}</strong></span><span><small>Plazo</small><strong>${plazoCompartido} ${unidadCompartida}</strong></span>`;}
      if(!tarjeta)return;
      const bloques=[...gestion.querySelectorAll('.datos-monto-plazo-contractual')],bloque=bloques.find(item=>[...item.querySelectorAll('input')].some(input=>input.value))||bloques[0],cabecera=tarjeta.querySelector('[data-alternar-parametro]');
      if(!bloque||!cabecera)return;
      let resumen=cabecera.querySelector('.resumen-contractual-componente');
      if(!resumen){resumen=document.createElement('span');resumen.className='resumen-contractual-componente';cabecera.insertBefore(resumen,cabecera.querySelector('b'));}
      const monto=bloque.querySelector('[data-tipo="monto-c"]')?.value,moneda=bloque.querySelector('[data-tipo="moneda-c"]')?.value,plazo=bloque.querySelector('[data-tipo="plazo"]')?.value,unidad=bloque.querySelector('[data-tipo="unidad-plazo"]')?.selectedOptions[0]?.textContent;
      const partes=[];if(montoC)partes.push(`Monto contratista ${monedaC==='USD'?'US$':'S/'} ${montoC}`);if(montoI)partes.push(`Monto interventor ${monedaI==='USD'?'US$':'S/'} ${montoI}`);if(plazoCompartido)partes.push(`Plazo ${plazoCompartido} ${unidadCompartida}`);resumen.textContent=partes.join(' · ');resumen.hidden=!partes.length;
    };
    ['psr','redes','tc'].forEach(actualizarResumenContractual);
    document.querySelectorAll('.datos-monto-plazo-contractual input,.datos-monto-plazo-contractual select').forEach(control=>['input','change'].forEach(tipo=>control.addEventListener(tipo,()=>actualizarResumenContractual(control.closest('.gestion-contractual-componente')?.dataset.gestionComponente))));
    document.querySelectorAll('.panel-parametros-contractuales .desplegable-parametro').forEach((componente,indice)=>{if(componente.querySelector('.tabla-hitos-fisicos'))return;const datosFisicos=[['Planta satélite de regasificación','Planta','1'],['Redes de abastecimiento','km','25'],['Tuberías de conexión de suministro','Tuberías','1000']][indice],tabla=document.createElement('div');tabla.className='tabla-parametros-contractuales tabla-hitos-fisicos';tabla.innerHTML=`<table><thead><tr><th>Servicio</th><th>Unidad</th><th>Cantidad</th><th>Avance físico</th><th>Estado</th><th>Sustento</th></tr></thead><tbody><tr><td><input value="${datosFisicos[0]}"></td><td><input value="${datosFisicos[1]}"></td><td><input type="number" min="0" step="1" value="${datosFisicos[2]}"></td><td><input type="number" min="0" max="100" step="0.01" placeholder="0 %"></td><td><select><option>Por iniciar</option><option>En proceso</option><option>Validado</option></select></td><td><label class="carga-sustento-hito"><input type="file" accept=".pdf,application/pdf" hidden><span>Adjuntar PDF</span><small>Sin archivo</small></label></td></tr></tbody></table><div class="acciones-tabla-hitos"><button type="button" class="boton-agregar-hito" data-agregar-hito-fisico>＋ Servicio</button></div>`;const referencia=componente.querySelector('.tabla-parametros-contractuales');componente.insertBefore(tabla,referencia||null);});
    const tablasHitosPago=[$('tablaHitosPsr')?.closest('table'),...document.querySelectorAll('.tabla-hitos-componente > table')].filter(Boolean);
    tablasHitosPago.forEach(tablaHitosPago=>{
      if(tablaHitosPago.classList.contains('tabla-hitos-pago'))return;
      tablaHitosPago.classList.add('tabla-hitos-pago');
      const encabezado=tablaHitosPago.tHead?.rows[0];
      if(encabezado){encabezado.insertCell(0).outerHTML='<th>Entidad<br>responsable</th>';encabezado.cells[1].textContent='Descripción';encabezado.deleteCell(6);encabezado.deleteCell(4);encabezado.insertCell(4).outerHTML='<th>Seguimiento</th>';}
      [...tablaHitosPago.tBodies[0].rows].forEach(fila=>{fila.insertCell(0).innerHTML='<span class="origen-hito">FISE</span>';fila.deleteCell(6);fila.deleteCell(4);fila.insertCell(4).innerHTML='<span class="estado-seguimiento observado" title="Estado informado por el interventor">Observado</span>';});
    });
    document.querySelectorAll('.tabla-baremo-componentes').forEach((tabla,indice)=>{
      const tarjeta=tabla.closest('.desplegable-parametro'),nombre=tarjeta?.querySelector('h4')?.textContent.trim()||`Componente ${indice+1}`,clave=`baremo-${nombre.toLowerCase().replace(/[^a-z0-9]+/gi,'-')}`;
      tabla.classList.add('control-baremo-archivos');
      tabla.innerHTML=`<button type="button" class="boton-baremo-icono" data-abrir-baremo="${clave}" title="Cargar y consultar baremo" aria-label="Cargar y consultar baremo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4zM7 9h10M7 12h6M16 16V9m0 0 3 3m-3-3-3 3"/></svg></button>`;
    });
    document.querySelectorAll('.tabla-hitos-componente').forEach(tabla=>{
      const tarjeta=tabla.closest('.desplegable-parametro');
      const descripcion=tarjeta?.querySelector('[data-alternar-parametro] p');
      if(descripcion)descripcion.textContent='Hitos de pago, servicios y sustentos del componente.';
    });
    document.querySelectorAll('.tabla-hitos-fisicos table').forEach(tabla=>{
      if(tabla.classList.contains('tabla-servicios'))return;
      tabla.classList.add('tabla-servicios');
      const encabezado=tabla.tHead?.rows[0];
      if(encabezado){encabezado.insertCell(0).outerHTML='<th>Entidad<br>responsable</th>';encabezado.cells[1].textContent='Descripción';encabezado.deleteCell(5);encabezado.insertCell(5).outerHTML='<th>Seguimiento</th>';}
      [...tabla.tBodies[0].rows].forEach(fila=>{fila.insertCell(0).innerHTML='<span class="origen-hito">FISE</span>';fila.deleteCell(5);fila.insertCell(5).innerHTML='<span class="estado-seguimiento observado" title="Estado informado por el interventor">Observado</span>';});
    });
    const iconoRequisitos='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5zM16 3v4h4M8 11h8M8 15h5M8 19h5"/><path d="m8 8 1.5 1.5L12 7"/></svg>';
    const iconoVista='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>';
    // En esta ficha FISE solo consulta quién debe remitir cada sustento.
    // Los hitos se sustentan por el interventor; las subtareas por el contratista.
    const prepararSustentoPorActor=(control,actor='contratista')=>{if(!control)return;const pendiente=document.createElement('span');pendiente.className=`sustento-${actor}-pendiente`;pendiente.textContent=`Pendiente de carga del ${actor}`;control.replaceWith(pendiente);};
    document.querySelectorAll('.tabla-hitos-pago .carga-sustento-hito,.tabla-servicios .carga-sustento-hito').forEach(control=>prepararSustentoPorActor(control,'interventor'));
    const actualizarEncabezadoSustento=(selector,texto)=>document.querySelectorAll(`${selector} th`).forEach(encabezado=>{if(/sustento/i.test(encabezado.textContent))encabezado.textContent=texto;});
    actualizarEncabezadoSustento('.tabla-hitos-pago','Sustento del interventor');
    actualizarEncabezadoSustento('.tabla-servicios','Sustento del interventor');
    const agregarAccionEliminarFila=fila=>{if(fila.querySelector('.eliminar-fila-parametro'))return;const celda=document.createElement('td');celda.className='celda-eliminar-parametro';const tabla=fila.closest('table'),esHitoPago=tabla?.classList.contains('tabla-hitos-pago'),esServicio=tabla?.classList.contains('tabla-servicios'),esSeguimiento=esHitoPago||esServicio,etiqueta=esServicio?'Ver detalle del servicio':'Ver requisitos del hito';celda.innerHTML=`${esSeguimiento?`<button type="button" class="boton-requisitos-hito" title="${etiqueta}" aria-label="${etiqueta}" aria-expanded="false">${iconoRequisitos}</button>`:''}<button type="button" class="eliminar-fila-parametro" title="Eliminar registro" aria-label="Eliminar registro"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg></button>`;fila.append(celda);};
    const prepararTablaEliminable=tabla=>{const encabezado=tabla?.tHead?.rows[0];if(encabezado&&!encabezado.querySelector('.columna-eliminar-parametro')){const th=document.createElement('th');th.className='columna-eliminar-parametro';th.textContent='Acción';encabezado.append(th);}tabla?.tBodies[0]&&[...tabla.tBodies[0].rows].forEach(agregarAccionEliminarFila);};
    document.querySelectorAll('.parametro-psr .tabla-parametros-contractuales table,.tabla-hitos-componente table,.tabla-hitos-fisicos table,.tabla-baremo-componentes table').forEach(prepararTablaEliminable);
    let filaParametroPendienteEliminar=null;
    const cerrarConfirmarEliminarFila=()=>{$('modalConfirmarEliminarFila').close();filaParametroPendienteEliminar=null;};
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('click',evento=>{const boton=evento.target.closest('.eliminar-fila-parametro');if(!boton)return;filaParametroPendienteEliminar=boton.closest('tr');$('modalConfirmarEliminarFila').showModal();});
    const controlSustentoSubtarea=()=>'<span class="sustento-contratista-pendiente">Pendiente de carga del contratista</span>';
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('click',evento=>{
      const boton=evento.target.closest('.boton-requisitos-hito');if(!boton)return;
      const fila=boton.closest('tr');
      const existente=fila?.nextElementSibling;
      if(existente?.classList.contains('fila-requisitos-hito')){existente.remove();boton.setAttribute('aria-expanded','false');return;}
      const detalle=document.createElement('tr');detalle.className='fila-requisitos-hito';
      detalle.innerHTML=`<td colspan="${fila.cells.length}"><section class="detalle-requisitos-hito"><div class="tabla-requisitos-hito"><table><thead><tr><th>Descripción</th><th>Unidad</th><th>Cantidad</th><th>Avance</th><th>Sustento del contratista</th></tr></thead><tbody><tr><td><input value="Documento de sustento del hito"></td><td><input value="Documento"></td><td><input type="number" min="0" step="0.01" value="1"></td><td><input type="number" min="0" max="100" step="0.01" value="0"></td><td>${controlSustentoSubtarea()}</td></tr></tbody></table></div></section></td>`;
      fila.insertAdjacentElement('afterend',detalle);
      prepararTablaEliminable(detalle.querySelector('.tabla-requisitos-hito table'));
      detalle.querySelector('.detalle-requisitos-hito').insertAdjacentHTML('beforeend','<button type="button" class="agregar-subtarea-hito">＋ Requisito</button>');
      boton.setAttribute('aria-expanded','true');
    });
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('click',evento=>{
      const boton=evento.target.closest('.agregar-subtarea-hito');if(!boton)return;
      const cuerpo=boton.closest('.detalle-requisitos-hito').querySelector('tbody');
      cuerpo.insertAdjacentHTML('beforeend',`<tr><td><input placeholder="Descripción de la subtarea"></td><td><input placeholder="Ej. und, km, planta"></td><td><input type="number" min="0" step="0.01" placeholder="0"></td><td><input type="number" min="0" max="100" step="0.01" placeholder="0 %"></td><td>${controlSustentoSubtarea()}</td></tr>`);
      agregarAccionEliminarFila(cuerpo.lastElementChild);
      cuerpo.lastElementChild.querySelector('input').focus();
    });
    $('cerrarConfirmarEliminarFila').addEventListener('click',cerrarConfirmarEliminarFila);$('cancelarConfirmarEliminarFila').addEventListener('click',cerrarConfirmarEliminarFila);$('aceptarConfirmarEliminarFila').addEventListener('click',()=>{const detalle=filaParametroPendienteEliminar?.nextElementSibling;if(detalle?.classList.contains('fila-requisitos-hito'))detalle.remove();filaParametroPendienteEliminar?.remove();cerrarConfirmarEliminarFila();});
    document.querySelectorAll('.tabla-baremo-componentes input[type="file"]').forEach(entrada=>{
      const control=document.createElement('label');
      control.className='carga-sustento-hito carga-baremo';
      entrada.replaceWith(control);
      entrada.hidden=true;
      control.append(entrada,Object.assign(document.createElement('span'),{textContent:'Adjuntar archivo'}),Object.assign(document.createElement('small'),{textContent:'Sin archivo'}));
    });
    document.querySelectorAll('[data-vista-gestion-contractual]').forEach(boton=>boton.addEventListener('click',()=>{
      const vista=boton.dataset.vistaGestionContractual;
      document.querySelectorAll('[data-vista-gestion-contractual]').forEach(item=>item.classList.toggle('activa',item===boton));
      document.querySelectorAll('[data-panel-gestion-contractual]').forEach(panel=>panel.hidden=panel.dataset.panelGestionContractual!==vista);
    }));
    document.querySelectorAll('[data-agregar-hito]').forEach(boton=>boton.addEventListener('click',()=>{
      const fila=document.createElement('tr');
      fila.innerHTML='<td><span class="origen-hito">FISE</span></td><td><input placeholder="Descripción del hito"></td><td><input type="number" min="0" max="100" placeholder="0"></td><td><input type="date"></td><td><span class="estado-seguimiento observado" title="Estado informado por el interventor">Observado</span></td><td><label class="carga-sustento-hito"><input type="file" accept=".pdf,application/pdf" hidden><span>Adjuntar PDF</span><small>Sin archivo</small></label></td>';
      prepararSustentoPorActor(fila.querySelector('.carga-sustento-hito'),'interventor');
      agregarAccionEliminarFila(fila);
      $(boton.dataset.tablaHitos||'tablaHitosPsr').append(fila);
      fila.querySelector('input').focus();
    }));
    document.querySelectorAll('[data-agregar-hito-fisico]').forEach(boton=>boton.addEventListener('click',()=>{
      const fila=document.createElement('tr');
      fila.innerHTML='<td><span class="origen-hito">FISE</span></td><td><input placeholder="Descripción del servicio"></td><td><input placeholder="Ej. unidad, km, und"></td><td><input type="number" min="0" step="1" placeholder="0"></td><td><input type="number" min="0" max="100" step="0.01" placeholder="0 %"></td><td><span class="estado-seguimiento observado" title="Estado informado por el interventor">Observado</span></td><td><label class="carga-sustento-hito"><input type="file" accept=".pdf,application/pdf" hidden><span>Adjuntar PDF</span><small>Sin archivo</small></label></td>';
      prepararSustentoPorActor(fila.querySelector('.carga-sustento-hito'),'interventor');
      agregarAccionEliminarFila(fila);
      boton.closest('.tabla-hitos-fisicos').querySelector('tbody').append(fila);
      fila.querySelector('input').focus();
    }));
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('change',evento=>{const selector=evento.target.closest('.carga-sustento-hito input[type="file"]');if(!selector)return;const estado=selector.closest('.carga-sustento-hito').querySelector('small'),archivo=selector.files?.[0];if(estado)estado.textContent=archivo?archivo.name:'Sin archivo';const ver=selector.closest('.acciones-sustento-subtarea')?.querySelector('.ver-sustento-subtarea');if(ver){ver.disabled=!archivo;ver._archivo=archivo||null;}});
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('click',evento=>{const boton=evento.target.closest('.ver-sustento-subtarea');if(!boton||!boton._archivo)return;window.open(URL.createObjectURL(boton._archivo),'_blank','noopener');});
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('click',evento=>{
      const boton=evento.target.closest('[data-alternar-parametro]');
      if(!boton)return;
      const tarjeta=boton.closest('.desplegable-parametro'),abrir=!tarjeta.classList.contains('activa');
      document.querySelectorAll('.desplegable-parametro').forEach(item=>{item.classList.remove('activa');item.querySelector('[data-alternar-parametro]')?.setAttribute('aria-expanded','false');});
      if(abrir){tarjeta.classList.add('activa');boton.setAttribute('aria-expanded','true');}
    });
    const cabeceraProyectos=document.querySelector('.barra-proyectos-cabecera');
    const botonAlternarProyectos=$('alternarBarraProyectos');
    if(botonCrearProyecto&&cabeceraProyectos)cabeceraProyectos.insertBefore(botonCrearProyecto,botonAlternarProyectos);
    mapa=L.map('mapaMasificacion',{zoomControl:false,preferCanvas:true}).setView([-10.6,-75.2],5);
    // Los estratos son el fondo; la infraestructura siempre queda visible encima.
    [
      ['estratosPane',410],
      ['coberturaPane',420],
      ['concesionariaPane',430],
      ['ramalesPane',440],
      ['troncalPane',450],
      ['beneficiariosPane',470],
      ['dibujoPane',480],
      ['seleccionPane',490]
    ].forEach(([nombre,zIndex])=>{
      mapa.createPane(nombre);
      mapa.getPane(nombre).style.zIndex=String(zIndex);
    });
    L.control.zoom({position:'bottomleft'}).addTo(mapa);
    bases.osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'});
    bases.topografico=L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{attribution:'© OpenTopoMap'});
    capaBase=bases.osm.addTo(mapa); capaInfluencia=L.layerGroup().addTo(mapa); capaManzanas=L.layerGroup().addTo(mapa); capaPredios=L.layerGroup().addTo(mapa); capaProyectos=L.layerGroup().addTo(mapa);
    capaDibujo=L.layerGroup().addTo(mapa);
    ajustarAlturaTableroMasificacion();
    window.addEventListener('resize',ajustarAlturaTableroMasificacion);
    if('ResizeObserver' in window){
      new ResizeObserver(()=>requestAnimationFrame(()=>mapa?.invalidateSize({pan:false}))).observe(document.querySelector('.tablero-masificacion'));
    }
    ['estrato','beneficiarios','cobertura','troncal','ramales','concesionaria'].forEach(nombre=>capasContexto[nombre]=L.layerGroup().addTo(mapa));
    actualizarFiltros(); actualizar();
    $('buscarBarraProyectos')?.addEventListener('input',renderBarraProyectos);
    $('alternarBarraProyectos')?.addEventListener('click',()=>{
      const barra=$('barraProyectosMapa');
      const tablero=document.querySelector('.tablero-masificacion');
      const boton=$('alternarBarraProyectos');
      const contraida=barra.classList.toggle('contraida');
      tablero?.classList.toggle('proyectos-ocultos',contraida);
      if(contraida)tablero?.append(boton);
      else barra?.querySelector('.barra-proyectos-cabecera')?.append(boton);
      boton.dataset.contraido=String(contraida);
      const flecha=boton.querySelector('span');
      if(flecha)flecha.style.removeProperty('transform');
      document.querySelector('.mapa-panel')?.classList.toggle('proyectos-contraidos',contraida);
      $('alternarBarraProyectos').setAttribute('aria-expanded',String(!contraida));
      $('alternarBarraProyectos').setAttribute('aria-label',contraida?'Ampliar proyectos':'Contraer proyectos');
      setTimeout(()=>mapa?.invalidateSize({pan:false}),260);
    });
    $('listaProyectosMapa')?.addEventListener('click',evento=>{
      const editarPaso=evento.target.closest('[data-editar-paso]');
      if(editarPaso){
        const proyecto=ciudades.find(item=>item.codigo===editarPaso.dataset.codigo);
        if(!proyecto)return;
        poblarUbicacionesProyecto();
        cargarProyectoEnFormulario(proyecto);
        mostrarPasoAsistenteProyecto(Number(editarPaso.dataset.editarPaso));
        return;
      }
      const accion=evento.target.closest('[data-accion-barra]');
      if(accion){
        const proyecto=ciudades.find(item=>item.codigo===accion.dataset.codigo);
        if(!proyecto)return;
        if(accion.dataset.accionBarra==='subproyecto'){
          poblarUbicacionesProyecto();
          limpiarFormularioProyecto();
          $('proyectoPadre').value=proyecto.codigo;
          proponerSubproyecto(proyecto.codigo);
          $('etiquetaCrearProyecto').textContent='NUEVO SUBPROYECTO';
          $('tituloCrearProyecto').textContent='Crear subproyecto';
          $('descripcionCrearProyecto').textContent=`Registre un subproyecto vinculado a ${proyecto.codigo} · ${proyecto.nombre}.`;
          mostrarPasoAsistenteProyecto(1);
        }else if(accion.dataset.accionBarra==='editar'){
          poblarUbicacionesProyecto();
          cargarProyectoEnFormulario(proyecto);
          mostrarPasoAsistenteProyecto(1);
        }else abrirModalEliminarProyecto(proyecto);
        return;
      }
      const alternar=evento.target.closest('[data-alternar-subproyectos]');
      if(alternar){
        const codigo=alternar.dataset.alternarSubproyectos;
        proyectosExpandidos.has(codigo)?proyectosExpandidos.delete(codigo):proyectosExpandidos.add(codigo);
        renderBarraProyectos();
        return;
      }
      const subproyecto=evento.target.closest('[data-subproyecto]');
      if(subproyecto){
        seleccionarProyectoDesdeBarra(subproyecto.dataset.proyecto,subproyecto.dataset.fase);
        return;
      }
      const principal=evento.target.closest('[data-seleccionar-proyecto]');
      if(principal)seleccionarProyectoDesdeBarra(principal.dataset.seleccionarProyecto);
    });
    [['botonMapas','panelMapas'],['botonCapas','panelCapas']].forEach(([b,p])=>$(b).addEventListener('click',()=>alternarPanel($(b),$(p))));
    document.querySelectorAll('input[name="mapaBase"]').forEach(r=>r.addEventListener('change',()=>{mapa.removeLayer(capaBase);capaBase=bases[r.value].addTo(mapa);capaBase.bringToBack();}));
    document.querySelectorAll('[data-estado]').forEach(c=>c.addEventListener('change',()=>{c.checked?estadosVisibles.add(c.dataset.estado):estadosVisibles.delete(c.dataset.estado);actualizar();}));
    $('mostrarCapaCargada').addEventListener('change',e=>{if(!capaGis)return;e.target.checked?capaGis.addTo(mapa):mapa.removeLayer(capaGis);});
    [['mostrarManzanas',()=>capaManzanas],['mostrarPredios',()=>capaPredios],['mostrarInfluencia',()=>capaInfluencia]].forEach(([id,capa])=>$(id).addEventListener('change',e=>e.target.checked?capa().addTo(mapa):mapa.removeLayer(capa())));
    document.querySelectorAll('[data-capa-proyecto]').forEach(control=>control.addEventListener('change',()=>{const capa=capasContexto[control.dataset.capaProyecto];control.checked?capa.addTo(mapa):mapa.removeLayer(capa);}));
    document.querySelectorAll('[data-filtro-estrato]').forEach(boton=>boton.addEventListener('click',()=>aplicarFiltroEstratos(boton.dataset.filtroEstrato)));
    $('abrirPotencial').addEventListener('click',abrirModalPotencial);
    inicializarTrazabilidad();
    $('abrirTrazabilidad').addEventListener('click',()=>$('modalTrazabilidad').showModal());
    $('abrirInformesSupervision').addEventListener('click',abrirInformesSupervision);
    document.querySelectorAll('[data-tipo-supervision]').forEach(b=>b.addEventListener('click',()=>configurarInformeSupervision(b.dataset.tipoSupervision)));
    $('abrirReportesSupervision').addEventListener('click',()=>{
      renderizarReportesSupervision();
      $('modalReportesSupervision').showModal();
    });
    $('abrirCalendarioInformes')?.addEventListener('click',()=>{
      renderizarCalendarioInformes();
      $('modalCalendarioInformes').showModal();
    });
    $('calendarioInformesAnterior').addEventListener('click',()=>{
      mesCalendarioInformes=new Date(mesCalendarioInformes.getFullYear(),mesCalendarioInformes.getMonth()-1,1);
      renderizarCalendarioInformes();
    });
    $('calendarioInformesSiguiente').addEventListener('click',()=>{
      mesCalendarioInformes=new Date(mesCalendarioInformes.getFullYear(),mesCalendarioInformes.getMonth()+1,1);
      renderizarCalendarioInformes();
    });
    $('supervisionFotos').addEventListener('change',cargarFotosManualesSupervision);
    $('sincronizarFotosSupervision').addEventListener('click',()=>{
      evidenciasMovilSupervision.forEach(f=>f.incluida=true);
      renderizarGaleriaSupervision();
      $('estadoInformeSupervision').textContent='6 fotografías sincronizadas desde SUP-CUSCO-04.';
    });
    $('exportarSupervisionCsv').addEventListener('click',exportarSupervisionCsv);
    $('exportarSupervisionPdf').addEventListener('click',exportarSupervisionPdf);
    $('abrirExportacionMasificacion').addEventListener('click',abrirModalExportacion);
    $('exportarPotencial').addEventListener('click',abrirModalExportacion);
    $('confirmarExportacionMasificacion').addEventListener('click',confirmarExportacionMasificacion);
    const abrirCrearProyecto=()=>{
      poblarUbicacionesProyecto();
      actualizarResumenEquipoProyecto();
      renderListaProyectosEdicion();
      limpiarFormularioProyecto();
      mostrarVistaCrearProyecto();mostrarPasoAsistenteProyecto(1);
    };
    document.querySelector('.enlace-menu[href="#dashboard"]')?.addEventListener('click',evento=>{evento.preventDefault();mostrarVistaDashboardMasificacion();});
    document.querySelector('.enlace-menu[href="#bandeja-entrada"]')?.addEventListener('click',evento=>{evento.preventDefault();mostrarVistaBandejaMasificacion();});
    document.querySelector('.enlace-menu[href="#satcontrol"]')?.addEventListener('click',evento=>{evento.preventDefault();mostrarVistaSatcontrol();});
    document.querySelector('.enlace-menu[href="#planeamiento"]')?.addEventListener('click',evento=>{evento.preventDefault();mostrarVistaPlaneamiento();});
    document.querySelectorAll('[data-ir-satcontrol]').forEach(boton=>boton.addEventListener('click',mostrarVistaSatcontrol));
    // Este control debe funcionar incluso si el mapa aún está terminando de cargar.
    document.addEventListener('click',evento=>{
      const boton=evento.target.closest('#alternarBarraProyectos');
      if(!boton)return;
      evento.preventDefault();
      evento.stopImmediatePropagation();
      const barra=$('barraProyectosMapa');
      const tablero=document.querySelector('.tablero-masificacion');
      if(!barra||!tablero)return;
      const contraida=!barra.classList.contains('contraida');
      barra.classList.toggle('contraida',contraida);
      tablero.classList.toggle('proyectos-ocultos',contraida);
      boton.dataset.contraido=String(contraida);
      boton.setAttribute('aria-expanded',String(!contraida));
      boton.setAttribute('aria-label',contraida?'Ampliar línea de tiempo':'Cerrar línea de tiempo');
      setTimeout(()=>mapa?.invalidateSize({pan:false}),260);
    },true);
    // Mantiene las vistas del módulo sincronizadas también cuando se llega por URL.
    const actualizarVistaPorRuta=()=>{
      if(location.hash==='#dashboard')mostrarVistaDashboardMasificacion();
      else if(location.hash==='#bandeja-entrada')mostrarVistaBandejaMasificacion();
      else if(location.hash==='#planeamiento')mostrarVistaPlaneamiento();
      else if(location.hash==='#satcontrol')mostrarVistaSatcontrol();
    };
    window.addEventListener('hashchange',actualizarVistaPorRuta);
    actualizarVistaPorRuta();
    $('irCrearProyectoDashboard').addEventListener('click',renderDashboardMasificacion);
    $('cerrarCrearProyecto').addEventListener('click',cerrarVistaCrearProyecto);
    $('cancelarCrearProyecto').addEventListener('click',cerrarVistaCrearProyecto);
    document.querySelector('.navegacion-etapas-proyecto').addEventListener('click',evento=>{
      const pestana=evento.target.closest('[data-paso-proyecto]');
      if(!pestana)return;
      const paso=Number(pestana.dataset.pasoProyecto);
      if(paso===6)renderCronogramaProyecto();
      mostrarPasoAsistenteProyecto(paso);
    });
    document.querySelector('.navegacion-etapas-cronograma').addEventListener('click',evento=>{
      const pestana=evento.target.closest('[data-paso-cronograma]');
      if(!pestana)return;
      const paso=Number(pestana.dataset.pasoCronograma);
      if(paso===6)return;
      leerCronogramaProyecto();
      mostrarPasoAsistenteProyecto(paso);
    });
    $('continuarAsistenteProyecto').addEventListener('click',()=>{if(pasoAsistenteProyecto===1){mostrarPasoAsistenteProyecto(2);return;}if(pasoAsistenteProyecto===2){mostrarPasoAsistenteProyecto(3);return;}if(pasoAsistenteProyecto===3){mostrarPasoAsistenteProyecto(4);return;}if(pasoAsistenteProyecto===4){mostrarPasoAsistenteProyecto(5);return;}if(pasoAsistenteProyecto===5){renderCronogramaProyecto();mostrarPasoAsistenteProyecto(6);}});
    $('anteriorAsistenteProyecto').addEventListener('click',()=>{if(pasoAsistenteProyecto===2)mostrarPasoAsistenteProyecto(1);else if(pasoAsistenteProyecto===3)mostrarPasoAsistenteProyecto(2);else if(pasoAsistenteProyecto===4)mostrarPasoAsistenteProyecto(3);else if(pasoAsistenteProyecto===5)mostrarPasoAsistenteProyecto(4);else if(pasoAsistenteProyecto===7){renderCronogramaProyecto();mostrarPasoAsistenteProyecto(6);}});
    $('guardarBorradorProyecto').addEventListener('click',()=>{$('contadorMapa').textContent='Borrador del proyecto conservado en el asistente.';});
    $('guardarPasoProyecto').addEventListener('click',()=>guardarPasoSatcontrol(pasoAsistenteProyecto));
    document.querySelectorAll('[data-guardar-hoja]').forEach(boton=>boton.addEventListener('click',()=>guardarPasoSatcontrol(pasoAsistenteProyecto)));
    $('editarPasoProyecto').addEventListener('click',()=>{
      const contenedor=[1,2,3,4].includes(pasoAsistenteProyecto)?vistaCrearProyecto.querySelector('.panel-formulario-proyecto'):null;
      contenedor?.querySelectorAll('input, select, textarea, button').forEach(control=>{if(!control.matches('[type="hidden"]'))control.disabled=false;});
      $('estadoGuardadoPaso').textContent='Edición habilitada. Actualice los datos y presione Guardar.';
    });
    const abrirPdfReferencial=()=>{const flujo='BT\n/F1 18 Tf\n72 720 Td\n(Documento adjunto de liquidacion) Tj\nET\n',objetos=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${flujo.length} >>\nstream\n${flujo}endstream`];let pdf='%PDF-1.4\n',posiciones=[];objetos.forEach((objeto,indice)=>{posiciones.push(pdf.length);pdf+=`${indice+1} 0 obj\n${objeto}\nendobj\n`;});const inicioXref=pdf.length;pdf+=`xref\n0 ${objetos.length+1}\n0000000000 65535 f \n${posiciones.map(posicion=>`${String(posicion).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size ${objetos.length+1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;const url=URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),30000);};
    $('contenidoResumenProyecto').addEventListener('click',evento=>{
      const eliminar=evento.target.closest('.eliminar-registro-liquidacion');
      if(eliminar){
        filaLiquidacionResumenPendiente=eliminar.closest('tr');
        const hito=filaLiquidacionResumenPendiente.querySelector('td strong')?.textContent||'este registro';
        $('detalleEliminarRegistroLiquidacion').textContent=`¿Desea eliminar el registro “${hito}”? El documento adjunto también será retirado.`;
        $('modalEliminarRegistroLiquidacion').showModal();
        return;
      }
      const alternarRequisitosFila=control=>{const fila=control.closest('tr'),detalle=fila?.nextElementSibling;if(!detalle?.classList.contains('fila-requisitos-ficha'))return;detalle.hidden=!detalle.hidden;const expandido=String(!detalle.hidden);fila.querySelector('.ver-requisitos-fila')?.setAttribute('aria-expanded',expandido);fila.querySelector('.hito-desplegable')?.setAttribute('aria-expanded',expandido);fila.querySelector('.hito-desplegable')?.classList.toggle('abierto',!detalle.hidden);};
      const requisitosFila=evento.target.closest('.ver-requisitos-fila');
      if(requisitosFila){alternarRequisitosFila(requisitosFila);return;}
      const hitoDesplegable=evento.target.closest('.hito-desplegable');
      if(hitoDesplegable){alternarRequisitosFila(hitoDesplegable);return;}
      const requisitos=evento.target.closest('.ver-requisitos-ficha');
      if(requisitos){const bloque=requisitos.closest('td')?.closest('div')?.querySelector(':scope > .requisitos-ficha-final');if(bloque){bloque.hidden=!bloque.hidden;requisitos.setAttribute('aria-expanded',String(!bloque.hidden));}return;}
      const ver=evento.target.closest('.ver-documento-liquidacion');
      if(ver){if(ver.classList.contains('ver-pdf-ficha'))abrirPdfReferencial();$('estadoGuardadoPaso').textContent=`Vista previa disponible: ${ver.title||ver.textContent.trim()||'PDF adjunto'}.`;}
    });
    $('contenidoResumenProyecto').addEventListener('keydown',evento=>{const hito=evento.target.closest('.hito-desplegable');if(!hito||!['Enter',' '].includes(evento.key))return;evento.preventDefault();hito.click();});
    const cerrarEliminarRegistroLiquidacion=()=>{$('modalEliminarRegistroLiquidacion').close();filaLiquidacionResumenPendiente=null;};
    $('cerrarEliminarRegistroLiquidacion').addEventListener('click',cerrarEliminarRegistroLiquidacion);
    $('cancelarEliminarRegistroLiquidacion').addEventListener('click',cerrarEliminarRegistroLiquidacion);
    $('confirmarEliminarRegistroLiquidacion').addEventListener('click',()=>{filaLiquidacionResumenPendiente?.remove();cerrarEliminarRegistroLiquidacion();});
    $('abrirPlanificacionProyecto').addEventListener('click',()=>abrirPlanificacionTecnica(proyectoEdicionSeleccionado));
    $('abrirPlanificacionDetalle')?.addEventListener('click',()=>abrirPlanificacionTecnica(proyectoSeleccionado));
    $('listaComponentesProyecto').addEventListener('click',evento=>{const boton=evento.target.closest('[data-abrir-componente-fise]');if(!boton)return;$('proyectoComponente').value=boton.dataset.abrirComponenteFise;abrirFormulariosComponenteFise();});
    $('cerrarFormulariosComponenteFise').addEventListener('click',cerrarFormulariosComponenteFise);
    $('listaFormulariosComponenteFise').addEventListener('click',evento=>{const boton=evento.target.closest('[data-formulario-fise]');if(!boton)return;formularioFiseActivo=Number(boton.dataset.formularioFise);renderFormulariosComponenteFise();});
    $('formularioComponenteFise').addEventListener('change',evento=>{if(evento.target.matches('.select-psr-requisito'))recalcularFilaMatrizPsr(evento.target.closest('tr'));});
    $('formularioComponenteFise').addEventListener('click',evento=>{const agregarCatalogo=evento.target.closest('[data-agregar-fila-catalogo]');if(agregarCatalogo){const cuerpo=$('formularioComponenteFise').querySelector('.tabla-catalogo-redes tbody');cuerpo.insertAdjacentHTML('beforeend',filaCatalogoRedes(cuerpo.rows.length+1));return;}const agregarLiquidacion=evento.target.closest('[data-agregar-fila-liquidacion]');if(agregarLiquidacion){const cuerpo=$('formularioComponenteFise').querySelector('.tabla-liquidacion-redes tbody');cuerpo.insertAdjacentHTML('beforeend',filaLiquidacionRedes(cuerpo.rows.length+1));return;}const agregarPago=evento.target.closest('[data-agregar-fila-pago]');if(agregarPago){const cuerpo=$('formularioComponenteFise').querySelector('.tabla-pagos-redes tbody');cuerpo.insertAdjacentHTML('beforeend',filaPagoRedes(cuerpo.rows.length+1));return;}const accionesPsr=[['[data-agregar-hito-psr]',filaHitoPsr],['[data-agregar-revision-psr]',filaRevisionPsr],['[data-agregar-liquidacion-psr]',filaLiquidacionPsr],['[data-agregar-pago-psr]',filaPagoPsr]];for(const [selector,crearFila] of accionesPsr){if(evento.target.closest(selector)){const cuerpo=evento.target.closest('section').querySelector('tbody');cuerpo.insertAdjacentHTML('beforeend',crearFila(cuerpo.rows.length+1));return;}}const agregarTc=evento.target.closest('[data-agregar-fila-tc]');if(agregarTc){const cuerpo=agregarTc.closest('section').querySelector('tbody');cuerpo.insertAdjacentHTML('beforeend',filaTc(cuerpo.rows.length+1,agregarTc.dataset.agregarFilaTc));return;}const quitar=evento.target.closest('.quitar-fila-catalogo, .quitar-fila-liquidacion, .quitar-fila-pago, .quitar-fila-psr, .quitar-fila-tc');if(quitar){const cuerpo=quitar.closest('tbody');if(cuerpo.rows.length>1)quitar.closest('tr').remove();}});
    $('anteriorFormulariosComponenteFise').addEventListener('click',()=>{if(formularioFiseActivo>0){formularioFiseActivo--;renderFormulariosComponenteFise();}else cerrarFormulariosComponenteFise();});
    $('continuarFormulariosComponenteFise').addEventListener('click',()=>{const componente=$('proyectoComponente').value||'redes',grupo=formulariosFisePorComponente[componente]||formulariosFisePorComponente.redes;if(formularioFiseActivo<grupo.formularios.length-1){formularioFiseActivo++;renderFormulariosComponenteFise();return;}componentesProyectoCompletados.add(componente);$('modalFormulariosComponenteFise').close();mostrarPasoAsistenteProyecto(4);});
    const cerrarPlanificacion=()=>mostrarPasoAsistenteProyecto(1);
    $('cerrarPlanificacionTecnica').addEventListener('click',cerrarPlanificacion);$('cancelarPlanificacionTecnica').addEventListener('click',cerrarPlanificacion);
    document.querySelectorAll('[data-pestana-planificacion]').forEach(b=>b.addEventListener('click',()=>{leerPlanificacionFormulario();document.querySelectorAll('[data-pestana-planificacion]').forEach(x=>x.classList.toggle('activo',x===b));document.querySelectorAll('[data-panel-planificacion]').forEach(p=>p.hidden=p.dataset.panelPlanificacion!==b.dataset.pestanaPlanificacion);renderObservacionesPlanificacion();actualizarResumenPlanificacion();}));
    $('tablaRequisitosPlanificacion').addEventListener('change',e=>{if(e.target.matches('[data-requisito-estado]'))e.target.dataset.estado=e.target.value;leerPlanificacionFormulario();renderObservacionesPlanificacion();actualizarResumenPlanificacion();});$('tablaRequisitosPlanificacion').addEventListener('input',()=>{leerPlanificacionFormulario();renderObservacionesPlanificacion();actualizarResumenPlanificacion();});
    $('tablaRequisitosPlanificacion').addEventListener('click',e=>{const boton=e.target.closest('.editar-fila-requisito');if(!boton)return;boton.closest('tr')?.querySelector('.select-ejemplo-requisito')?.focus();});
    $('tablaRequisitosPlanificacion').addEventListener('change',e=>{if(e.target.matches('.select-ejemplo-requisito'))recalcularFilaLocalidadPlanificacion(e.target.closest('tr'));});
    $('agregarLocalidadPlanificacion').addEventListener('click',()=>{const localidad=prompt('Nombre de la localidad o proyecto:')||`Nueva localidad ${$('tablaRequisitosPlanificacion').rows.length}`;const ubicacion=prompt('Provincia y distrito:')||'Ubicación por completar';const estados=Array.from({length:13},()=> 'pendiente');$('tablaRequisitosPlanificacion').append(crearFilaLocalidadPlanificacion(localidad,ubicacion,estados,true));});
    $('agregarRequisitoPlanificacion').addEventListener('click',()=>{leerPlanificacionFormulario();const nombre=prompt('Nombre del nuevo requisito técnico:');if(!nombre)return;const parametro=prompt('Parámetro o criterio de cumplimiento:')||'Definido por FISE';planificacionBorrador.requisitos.push({nombre:nombre.trim(),parametro:parametro.trim(),estado:'pendiente',comentario:'',responsable:'',fechaLimite:'',subsanado:false});renderPlanificacionTecnica();});
    $('archivosPlanificacion').addEventListener('change',e=>{if(!planificacionBorrador)planificacionBorrador=crearPlanificacionProyecto();[...e.target.files].forEach(a=>planificacionBorrador.evidencias.push({nombre:a.name,tipo:a.type||'Archivo',tamano:Math.max(1,Math.round(a.size/1024))}));e.target.value='';renderPlanificacionTecnica();});
    $('listaObservacionesPlanificacion').addEventListener('input',e=>{const i=Number(e.target.dataset.observacionResponsable??e.target.dataset.observacionFecha);if(!Number.isInteger(i)||!planificacionBorrador.requisitos[i])return;if(e.target.dataset.observacionResponsable!==undefined)planificacionBorrador.requisitos[i].responsable=e.target.value;if(e.target.dataset.observacionFecha!==undefined)planificacionBorrador.requisitos[i].fechaLimite=e.target.value;});$('listaObservacionesPlanificacion').addEventListener('change',e=>{if(e.target.dataset.observacionSubsanada===undefined)return;const i=Number(e.target.dataset.observacionSubsanada);if(planificacionBorrador.requisitos[i])planificacionBorrador.requisitos[i].subsanado=e.target.checked;actualizarResumenPlanificacion();});
    $('confirmarCierrePlanificacion').addEventListener('change',actualizarResumenPlanificacion);$('cerrarEtapaPlanificacion').addEventListener('click',()=>{leerPlanificacionFormulario();planificacionBorrador.cerrada=true;planificacionBorrador.fechaCierre=new Date().toISOString().slice(0,10);$('confirmarCierrePlanificacion').checked=true;$('estadoGuardadoPlanificacion').textContent='Planificación cerrada. El proyecto puede iniciar ejecución.';actualizarResumenPlanificacion();});$('guardarPlanificacionTecnica').addEventListener('click',()=>{leerPlanificacionFormulario();const destino=proyectoEdicionSeleccionado||proyectoSeleccionado;if(destino)destino.planificacionTecnica=structuredClone(planificacionBorrador);$('estadoGuardadoPlanificacion').textContent='Planificación guardada correctamente.';setTimeout(cerrarPlanificacion,350);});
    $('anteriorPlanificacionAsistente').addEventListener('click',cerrarPlanificacion);
    $('continuarPlanificacionAsistente').addEventListener('click',()=>{leerPlanificacionFormulario();renderCronogramaProyecto();mostrarPasoAsistenteProyecto(6);});
    $('anteriorCronogramaAsistente').addEventListener('click',()=>{vistaCronogramaProyecto.hidden=true;abrirPlanificacionTecnica(proyectoEdicionSeleccionado);});
    $('continuarCronogramaAsistente').addEventListener('click',()=>{leerCronogramaProyecto();mostrarPasoAsistenteProyecto(7);});
    $('nuevoProyectoEdicion')?.addEventListener('click',()=>limpiarFormularioProyecto());
    $('proyectoPadre').addEventListener('change',evento=>{proponerSubproyecto(evento.target.value);actualizarModoJerarquiaProyecto();});
    document.querySelector('.gestiones-contractuales-componentes').addEventListener('click',evento=>{const barraActor=evento.target.closest('.barra-actor-contractual');if(barraActor){const grupo=barraActor.closest('.grupo-actor-contractual'),abrir=!grupo.classList.contains('activa');grupo.classList.toggle('activa',abrir);barraActor.setAttribute('aria-expanded',String(abrir));barraActor.querySelector('b').textContent=abrir?'⌃':'⌄';return;}const barra=evento.target.closest('.barra-gestion-componente');if(!barra)return;const tarjeta=barra.closest('.gestion-contractual-componente'),abrir=!tarjeta.classList.contains('activa');document.querySelectorAll('.gestion-contractual-componente').forEach(item=>{item.classList.remove('activa');item.querySelector('.barra-gestion-componente').setAttribute('aria-expanded','false');item.querySelector('.barra-gestion-componente b').textContent='⌄';});if(abrir){tarjeta.classList.add('activa');barra.setAttribute('aria-expanded','true');barra.querySelector('b').textContent='⌃';}});
    ['input','change'].forEach(tipo=>document.querySelector('.gestiones-contractuales-componentes').addEventListener(tipo,evento=>{
      if(document.querySelector('input[name="actoresCompartidosComponentes"]:checked')?.value!=='si')return;
      const grupo=evento.target.closest('.grupo-actor-contractual');
      if(grupo?.querySelector('.barra-actor-contractual strong')?.textContent==='Contratista')copiarDatosContratistaEnFila(grupo.closest('.fila-actores-contractuales'));
    }));
    let tipoRegistroActorActivo='',grupoRegistroActorActivo=null;
    document.querySelector('.gestiones-contractuales-componentes').addEventListener('click',evento=>{const boton=evento.target.closest('[data-nuevo-actor]');if(!boton)return;tipoRegistroActorActivo=boton.dataset.nuevoActor;grupoRegistroActorActivo=boton.closest('.grupo-actor-contractual');$('tituloRegistroActor').textContent=`Registrar ${tipoRegistroActorActivo==='contratista'?'contratista':'interventor'}`;['registroActorNombre','registroActorRuc','registroActorCorreo','registroActorDireccion'].forEach(id=>$(id).value='');$('modalRegistroActor').showModal();$('registroActorNombre').focus();});
    document.querySelector('.gestiones-contractuales-componentes').addEventListener('change',evento=>{const buscador=evento.target.closest('[data-buscar-actor]');if(!buscador)return;const registro=(catalogoActoresContractuales[buscador.dataset.buscarActor]||[]).find(item=>item.nombre.toLowerCase()===buscador.value.trim().toLowerCase()||item.ruc===buscador.value.trim());if(!registro)return;const campos=[...buscador.closest('.grupo-actor-contractual').querySelectorAll('.contenido-actor-contractual>label input')];[registro.nombre,registro.ruc,registro.correo,registro.direccion].forEach((valor,indice)=>{if(campos[indice])campos[indice].value=valor;});});
    const cerrarRegistroActor=()=>{$('modalRegistroActor').close();tipoRegistroActorActivo='';grupoRegistroActorActivo=null;};
    $('cerrarRegistroActor').addEventListener('click',cerrarRegistroActor);$('cancelarRegistroActor').addEventListener('click',cerrarRegistroActor);
    $('guardarRegistroActor').addEventListener('click',()=>{const registro={nombre:normalizarTexto($('registroActorNombre').value),ruc:normalizarTexto($('registroActorRuc').value),correo:normalizarTexto($('registroActorCorreo').value),direccion:normalizarTexto($('registroActorDireccion').value)};if(!registro.nombre||!registro.ruc||!registro.correo||!registro.direccion){$('registroActorNombre').focus();return;}const catalogo=catalogoActoresContractuales[tipoRegistroActorActivo]||[];const existente=catalogo.find(item=>item.ruc===registro.ruc);if(existente)Object.assign(existente,registro);else catalogo.push(registro);const grupo=grupoRegistroActorActivo,barra=grupo.querySelector('.barra-actor-contractual'),buscador=grupo.querySelector('[data-buscar-actor]'),campos=[...grupo.querySelectorAll('.contenido-actor-contractual>label input')];grupo.classList.add('activa');barra.setAttribute('aria-expanded','true');barra.querySelector('b').textContent='⌃';if(![...buscador.options].some(opcion=>opcion.value===registro.ruc)){const opcion=document.createElement('option');opcion.value=registro.ruc;opcion.textContent=`${registro.nombre} · ${registro.ruc}`;buscador.append(opcion);}buscador.value=registro.ruc;[registro.nombre,registro.ruc,registro.correo,registro.direccion].forEach((valor,indice)=>{if(campos[indice])campos[indice].value=valor;});cerrarRegistroActor();});
    let grupoArchivosActorActivo=null,cargandoDocumentoProyecto='',tipoDocumentoActorActivo='',claveBaremoActivo='';
    const cerrarArchivosActor=()=>{$('modalArchivosActor').close();grupoArchivosActorActivo=null;cargandoDocumentoProyecto='';tipoDocumentoActorActivo='';claveBaremoActivo='';$('selectorArchivosActor').value='';$('selectorArchivosActor').accept='.pdf,application/pdf';$('zonaArrastreActor').querySelector('strong').textContent='Arrastre uno o varios PDF aquí';$('zonaArrastreActor').querySelector('em').textContent='Formato permitido: PDF.';};
    const actualizarEstadoArchivosActor=grupo=>{const archivos=archivosActoresContractuales.get(grupo.dataset.archivosActor)||[];grupo.querySelector('.estado-archivos-actor').textContent=archivos.length?`${archivos.length} PDF adjunto${archivos.length===1?'':'s'}.`:'Sin archivos adjuntos.';grupo.querySelector('[data-ver-archivos-actor]').disabled=!archivos.length;};
    const registrarArchivosActor=archivos=>{const permitidosBaremo=/\.(pdf|xlsx?|csv)$/i,validos=[...archivos].filter(archivo=>claveBaremoActivo?permitidosBaremo.test(archivo.name):(archivo.type==='application/pdf'||archivo.name.toLowerCase().endsWith('.pdf')));if(!validos.length){$('estadoArchivosActor').textContent=claveBaremoActivo?'Seleccione archivos PDF, Excel o CSV.':'Seleccione uno o varios archivos PDF.';return;}if(claveBaremoActivo){const existentes=archivosBaremoComponentes.get(claveBaremoActivo)||[];archivosBaremoComponentes.set(claveBaremoActivo,[...existentes,...validos]);const control=document.querySelector(`[data-ver-baremo="${claveBaremoActivo}"]`),estado=control?.closest('.control-baremo-archivos')?.querySelector('.estado-baremo-archivos');if(control)control.disabled=false;if(estado)estado.textContent=`${existentes.length+validos.length} archivo${existentes.length+validos.length===1?'':'s'} de baremo adjunto${existentes.length+validos.length===1?'':'s'}.`;$('estadoArchivosActor').textContent=`${validos.length} archivo${validos.length===1?'':'s'} de baremo listo${validos.length===1?'':'s'} para adjuntar.`;setTimeout(cerrarArchivosActor,250);return;}if(tipoDocumentoActorActivo&&grupoArchivosActorActivo){const clave=`${grupoArchivosActorActivo.dataset.documentosMontoPlazo}:${tipoDocumentoActorActivo}`;documentosMontoPlazoActor.set(clave,validos[0]);grupoArchivosActorActivo.querySelector(`[data-ver-documento-actor="${tipoDocumentoActorActivo}"]`).disabled=false;$('estadoArchivosActor').textContent=`PDF de ${tipoDocumentoActorActivo} listo para adjuntar.`;setTimeout(cerrarArchivosActor,250);return;}if(cargandoDocumentoProyecto){const transferencia=new DataTransfer();validos.forEach(archivo=>transferencia.items.add(archivo));const destino=$(cargandoDocumentoProyecto);destino.files=transferencia.files;destino.dispatchEvent(new Event('change',{bubbles:true}));$('estadoArchivosActor').textContent=`${validos.length} PDF listo${validos.length===1?'':'s'} para adjuntar.`;setTimeout(cerrarArchivosActor,250);return;}if(!grupoArchivosActorActivo)return;const clave=grupoArchivosActorActivo.dataset.archivosActor,existentes=archivosActoresContractuales.get(clave)||[];archivosActoresContractuales.set(clave,[...existentes,...validos]);actualizarEstadoArchivosActor(grupoArchivosActorActivo);$('estadoArchivosActor').textContent=`${validos.length} PDF listo${validos.length===1?'':'s'} para adjuntar.`;setTimeout(cerrarArchivosActor,250);};
    document.querySelector('.gestiones-contractuales-componentes').addEventListener('click',evento=>{const boton=evento.target.closest('[data-subir-archivos-actor]');if(!boton)return;cargandoDocumentoProyecto='';grupoArchivosActorActivo=boton.closest('.grupo-actor-contractual');$('tituloArchivosActor').textContent=`Adjuntar PDFs · ${grupoArchivosActorActivo.querySelector('.barra-actor-contractual strong').textContent}`;$('ayudaArchivosActor').textContent='Cargue los documentos de respaldo del actor seleccionado.';$('estadoArchivosActor').textContent='Arrastre los documentos o selecciónelos desde su equipo.';$('modalArchivosActor').showModal();});
    document.querySelector('.gestiones-contractuales-componentes').addEventListener('click',evento=>{const boton=evento.target.closest('[data-adjuntar-documento-actor]');if(!boton)return;cargandoDocumentoProyecto='';tipoDocumentoActorActivo=boton.dataset.adjuntarDocumentoActor;grupoArchivosActorActivo=boton.closest('.grupo-actor-contractual');const actor=grupoArchivosActorActivo.querySelector('.barra-actor-contractual strong').textContent;$('tituloArchivosActor').textContent=`Adjuntar PDF de ${tipoDocumentoActorActivo} · ${actor}`;$('ayudaArchivosActor').textContent='Cargue el documento contractual en formato PDF.';$('estadoArchivosActor').textContent='Arrastre el PDF o selecciónelo desde su equipo.';$('modalArchivosActor').showModal();});
    $('cerrarArchivosActor').addEventListener('click',cerrarArchivosActor);$('cancelarArchivosActor').addEventListener('click',cerrarArchivosActor);$('buscarArchivosActor').addEventListener('click',()=>$('selectorArchivosActor').click());$('selectorArchivosActor').addEventListener('change',evento=>registrarArchivosActor(evento.target.files));['dragenter','dragover'].forEach(tipo=>$('zonaArrastreActor').addEventListener(tipo,event=>{event.preventDefault();$('zonaArrastreActor').classList.add('arrastrando');}));['dragleave','drop'].forEach(tipo=>$('zonaArrastreActor').addEventListener(tipo,event=>{event.preventDefault();$('zonaArrastreActor').classList.remove('arrastrando');}));$('zonaArrastreActor').addEventListener('drop',evento=>registrarArchivosActor(evento.dataTransfer.files));
    const actualizarEstadoArchivosTerrenos=()=>{const archivos=[...$('archivoAreasGIS').files];$('estadoArchivoAreaIntervencion').textContent=archivos.length?`${archivos.length} archivo${archivos.length===1?'':'s'} adjunto${archivos.length===1?'':'s'}: ${archivos.map(archivo=>archivo.name).join(' · ')}`:'Sin archivos adjuntos.';};
    let urlsVistaPdfConvenio=[],archivosVistaPdfConvenio=[],volverAListaPdf=false;
    const cerrarVistaPdfConvenio=()=>{$('modalVistaPdfConvenio').close();};
    const cerrarVisorPdfConvenio=()=>{$('modalVisorPdfConvenio').close();$('visorPdfConvenio').removeAttribute('src');if(volverAListaPdf){volverAListaPdf=false;$('modalVistaPdfConvenio').showModal();}};
    const abrirVisorPdfConvenio=(archivo,url,volverLista=false)=>{if(!archivo)return;volverAListaPdf=volverLista;$('tituloVisorPdfConvenio').textContent='Vista previa del PDF';$('nombreVisorPdfConvenio').textContent=archivo.name;$('visorPdfConvenio').src=url||URL.createObjectURL(archivo);$('volverListaPdfConvenio').hidden=!volverLista;$('modalVisorPdfConvenio').showModal();};
    const renderDocumentosConvenio=(archivos=[...$('proyectoArchivoConvenio').files])=>{urlsVistaPdfConvenio.forEach(url=>URL.revokeObjectURL(url));archivosVistaPdfConvenio=[...archivos];urlsVistaPdfConvenio=archivosVistaPdfConvenio.map(archivo=>URL.createObjectURL(archivo));$('listaDocumentosConvenio').innerHTML=archivosVistaPdfConvenio.map((archivo,indice)=>`<tr><td>${escapePlanificacion(archivo.name)}</td><td><button type="button" data-ver-pdf-convenio="${indice}">👁 Ver</button></td></tr>`).join('');};
    const abrirDocumentoActor=(grupo,tipo)=>{const archivo=documentosMontoPlazoActor.get(`${grupo.dataset.documentosMontoPlazo}:${tipo}`);if(!archivo)return;abrirVisorPdfConvenio(archivo,null,false);};
    $('subirConvenioProyecto').addEventListener('click',()=>{cargandoDocumentoProyecto='proyectoArchivoConvenio';grupoArchivosActorActivo=null;$('tituloArchivosActor').textContent='Adjuntar Convenio FISE – GORE';$('ayudaArchivosActor').textContent='Cargue uno o varios convenios firmados en formato PDF.';$('estadoArchivosActor').textContent='Arrastre los PDF o selecciónelos desde su equipo.';$('modalArchivosActor').showModal();});$('proyectoArchivoConvenio').addEventListener('change',evento=>{const archivos=[...evento.target.files];$('verConvenioProyecto').disabled=!archivos.length;$('estadoArchivoConvenio').textContent=archivos.length?`${archivos.length} PDF adjunto${archivos.length===1?'':'s'}.`:'Sin convenio adjunto.';});
    $('verConvenioProyecto').addEventListener('click',()=>{if(!$('proyectoArchivoConvenio').files.length)return;$('tituloVistaPdfConvenio').textContent='Documentos adjuntos';renderDocumentosConvenio();$('estadoVistaPdfConvenio').hidden=true;$('modalVistaPdfConvenio').showModal();});$('listaDocumentosConvenio').addEventListener('click',evento=>{const boton=evento.target.closest('[data-ver-pdf-convenio]');if(!boton)return;const indice=Number(boton.dataset.verPdfConvenio),archivo=archivosVistaPdfConvenio[indice];if(!archivo)return;$('modalVistaPdfConvenio').close();abrirVisorPdfConvenio(archivo,urlsVistaPdfConvenio[indice],true);});document.querySelector('.gestiones-contractuales-componentes').addEventListener('click',evento=>{const boton=evento.target.closest('[data-ver-documento-actor]');if(!boton)return;abrirDocumentoActor(boton.closest('.grupo-actor-contractual'),boton.dataset.verDocumentoActor);const todos=evento.target.closest('.grupo-actor-contractual').querySelector('[data-ver-archivos-actor]');if(todos)todos.blur();});document.querySelector('.gestiones-contractuales-componentes').addEventListener('click',evento=>{const boton=evento.target.closest('[data-ver-archivos-actor]');if(!boton)return;const grupo=boton.closest('.grupo-actor-contractual'),archivos=archivosActoresContractuales.get(grupo.dataset.archivosActor)||[];if(!archivos.length)return;$('tituloVistaPdfConvenio').textContent=`Documentos · ${grupo.querySelector('.barra-actor-contractual strong').textContent}`;renderDocumentosConvenio(archivos);$('modalVistaPdfConvenio').showModal();});$('cerrarVistaPdfConvenio').addEventListener('click',cerrarVistaPdfConvenio);$('cancelarVistaPdfConvenio').addEventListener('click',cerrarVistaPdfConvenio);$('cerrarVisorPdfConvenio').addEventListener('click',cerrarVisorPdfConvenio);$('cancelarVisorPdfConvenio').addEventListener('click',cerrarVisorPdfConvenio);$('volverListaPdfConvenio').addEventListener('click',cerrarVisorPdfConvenio);
    let claveBaremoSeleccionado='';
    const renderBaremoModal=()=>{const archivos=archivosBaremoComponentes.get(claveBaremoSeleccionado)||[];$('listaBaremoModal').innerHTML=archivos.length?`<table><thead><tr><th>Archivo</th><th>Formato</th><th>Acción</th></tr></thead><tbody>${archivos.map((archivo,indice)=>`<tr><td>${escapePlanificacion(archivo.name)}</td><td>${escapePlanificacion((archivo.name.split('.').pop()||'archivo').toUpperCase())}</td><td><button type="button" data-ver-archivo-baremo="${indice}" title="Visualizar archivo" aria-label="Visualizar ${escapePlanificacion(archivo.name)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg></button></td></tr>`).join('')}</tbody></table>`:'<p>Sin archivos de baremo adjuntos.</p>';$('verBaremoModal').disabled=!archivos.length;};
    const abrirCargaBaremo=()=>{claveBaremoActivo=claveBaremoSeleccionado;grupoArchivosActorActivo=null;cargandoDocumentoProyecto='';tipoDocumentoActorActivo='';$('tituloArchivosActor').textContent='Adjuntar baremo y precios unitarios';$('ayudaArchivosActor').textContent='Cargue uno o varios archivos de baremo en formato PDF, Excel o CSV.';$('estadoArchivosActor').textContent='Arrastre los archivos o selecciónelos desde su equipo.';$('selectorArchivosActor').accept='.pdf,.xls,.xlsx,.csv,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';$('zonaArrastreActor').querySelector('strong').textContent='Arrastre PDF, Excel o CSV aquí';$('zonaArrastreActor').querySelector('em').textContent='Formatos permitidos: PDF, Excel y CSV.';$('modalBaremo').close();$('modalArchivosActor').showModal();};
    document.querySelector('.panel-parametros-contractuales')?.addEventListener('click',evento=>{const boton=evento.target.closest('[data-abrir-baremo]');if(!boton)return;claveBaremoSeleccionado=boton.dataset.abrirBaremo;$('vistaDatosBaremo').hidden=true;renderBaremoModal();$('modalBaremo').showModal();});
    $('adjuntarBaremoModal').addEventListener('click',abrirCargaBaremo);$('verBaremoModal').addEventListener('click',()=>{$('listaBaremoModal').scrollIntoView({block:'nearest',behavior:'smooth'});});$('cerrarModalBaremo').addEventListener('click',()=>$('modalBaremo').close());$('cerrarBaremoModal').addEventListener('click',()=>$('modalBaremo').close());
    $('listaBaremoModal').addEventListener('click',async evento=>{const boton=evento.target.closest('[data-ver-archivo-baremo]');if(!boton)return;const archivo=(archivosBaremoComponentes.get(claveBaremoSeleccionado)||[])[Number(boton.dataset.verArchivoBaremo)];if(!archivo)return;if(/\.pdf$/i.test(archivo.name)){$('modalBaremo').close();abrirVisorPdfConvenio(archivo,null,false);return;}try{let filas;if(/\.csv$/i.test(archivo.name))filas=(await archivo.text()).split(/\r?\n/).filter(Boolean).map(fila=>fila.split(/[;,]/));else if(window.XLSX){const libro=XLSX.read(await archivo.arrayBuffer(),{type:'array'}),hoja=libro.Sheets[libro.SheetNames[0]];filas=XLSX.utils.sheet_to_json(hoja,{header:1,defval:''});}else filas=[];if(!filas.length)throw new Error('sin datos');const limite=filas.slice(0,100);$('vistaDatosBaremo').innerHTML=`<h3>${escapePlanificacion(archivo.name)}</h3><div><table><tbody>${limite.map((fila,i)=>`<tr>${fila.map(celda=>`<${i===0?'th':'td'}>${escapePlanificacion(String(celda??''))}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;$('vistaDatosBaremo').hidden=false;}catch{$('vistaDatosBaremo').innerHTML='<p>No se pudo leer el archivo. Verifique que el Excel o CSV tenga datos válidos.</p>';$('vistaDatosBaremo').hidden=false;}});
    let inputArchivoGISActivo=null;
    const cerrarArchivoGIS=()=>{$('modalArchivoGIS').close();inputArchivoGISActivo=null;$('selectorArchivoGIS').value='';};
    const abrirArchivoGIS=()=>{inputArchivoGISActivo=$('archivoAreasGIS');$('tituloArchivoGIS').textContent='Adjuntar archivos GIS';$('ayudaArchivoGIS').textContent='Puede cargar uno o varios planos o archivos GIS para ambos terrenos.';$('estadoArchivoGIS').textContent='Aún no se han seleccionado archivos.';$('modalArchivoGIS').showModal();};
    const registrarArchivoGIS=archivos=>{const lista=[...archivos];if(!lista.length||!inputArchivoGISActivo)return;const destino=inputArchivoGISActivo;inputArchivoGISActivo=null;const transferencia=new DataTransfer();lista.forEach(archivo=>transferencia.items.add(archivo));destino.files=transferencia.files;destino.dispatchEvent(new Event('change',{bubbles:true}));$('estadoArchivoGIS').textContent=`${lista.length} archivo${lista.length===1?'':'s'} listo${lista.length===1?'':'s'} para adjuntar.`;setTimeout(()=>$('modalArchivoGIS').close(),260);};
    $('subirArchivosGIS').addEventListener('click',abrirArchivoGIS);
    $('buscarArchivoGIS').addEventListener('click',()=>$('selectorArchivoGIS').click());
    $('archivoAreasGIS').addEventListener('change',actualizarEstadoArchivosTerrenos);$('selectorArchivoGIS').addEventListener('change',evento=>registrarArchivoGIS(evento.target.files));
    ['dragenter','dragover'].forEach(tipo=>$('zonaArrastreGIS').addEventListener(tipo,event=>{event.preventDefault();$('zonaArrastreGIS').classList.add('arrastrando');}));['dragleave','drop'].forEach(tipo=>$('zonaArrastreGIS').addEventListener(tipo,event=>{event.preventDefault();$('zonaArrastreGIS').classList.remove('arrastrando');}));$('zonaArrastreGIS').addEventListener('drop',evento=>registrarArchivoGIS(evento.dataTransfer.files));$('cerrarArchivoGIS').addEventListener('click',cerrarArchivoGIS);$('cancelarArchivoGIS').addEventListener('click',cerrarArchivoGIS);$('modalArchivoGIS').addEventListener('click',evento=>{if(evento.target===$('modalArchivoGIS'))cerrarArchivoGIS();});
    const seleccionarTerrenoEnMapa=(terreno,editar=false)=>{terrenoActivoProyecto=terreno;$('seleccionarTerrenoA').classList.toggle('activo',terreno==='A');$('seleccionarTerrenoB').classList.toggle('activo',terreno==='B');const geometria=leerGeometriaTerreno(terreno);$('nombreZonaProyecto').value=geometria?.nombre||`Terreno ${terreno}`;modoDibujoAreaProyecto=geometria?.tipo==='Círculo'?'circulo':geometria?.tipo==='Polilínea'?'polilinea':geometria?.tipo==='Línea'?'linea':'poligono';$('modoDibujoAreaProyecto').value=modoDibujoAreaProyecto;circuloDibujoUbicacion=editar&&geometria?.tipo==='Círculo'&&geometria?.centro?{centro:L.latLng(geometria.centro[0],geometria.centro[1]),radio:geometria.radioM}:null;puntosPoligonoUbicacion=editar&&geometria?.coordenadas?.length?geometria.coordenadas.map(([lat,lng])=>L.latLng(lat,lng)):[];renderPoligonoUbicacion();};
    const abrirTerrenosInfluencia=async()=>{origenMapaCrearProyecto=true;const selector=$('proyectoZonaObjetivo');selector.replaceChildren(new Option(`${$('proyectoCodigo').value||'BORRADOR'} · ${$('proyectoNombre').value||'Proyecto en creación'}`,'borrador'));seleccionarTerrenoEnMapa('A');$('modalDibujoArea').showModal();iniciarMapaUbicacionProyecto();try{await mostrarDepartamentosMapaProyecto();}catch(error){$('estadoZonaProyecto').textContent='No se pudieron cargar los límites territoriales del Perú.';}};
    const desactivarHerramientaDibujoArea=()=>{herramientaDibujoAreaActiva=false;document.querySelectorAll('[data-modo-dibujo-mapa]').forEach(control=>control.classList.remove('activo'));};
    const quitarUltimoVerticeArea=()=>{if(modoDibujoAreaProyecto==='circulo'){if(circuloDibujoUbicacion?.radio){circuloDibujoUbicacion.radio=0;}else{circuloDibujoUbicacion=null;}}else{puntosPoligonoUbicacion.pop();}renderPoligonoUbicacion();};
    $('abrirMapaUbicacionProyecto').addEventListener('click',()=>{desactivarHerramientaDibujoArea();abrirTerrenosInfluencia();});$('seleccionarTerrenoA').addEventListener('click',()=>{desactivarHerramientaDibujoArea();seleccionarTerrenoEnMapa('A');});$('seleccionarTerrenoB').addEventListener('click',()=>{desactivarHerramientaDibujoArea();seleccionarTerrenoEnMapa('B');});$('editarTerrenoMapa').addEventListener('click',()=>seleccionarTerrenoEnMapa(terrenoActivoProyecto,true));
    $('mapaDepartamentoProyecto').addEventListener('change',()=>{actualizarFiltrosMapaProyecto();});$('mapaProvinciaProyecto').addEventListener('change',actualizarFiltrosMapaProyecto);$('mapaDistritoProyecto').addEventListener('change',actualizarFiltrosMapaProyecto);$('modoDibujoAreaProyecto').addEventListener('change',evento=>{modoDibujoAreaProyecto=evento.target.value;puntosPoligonoUbicacion=[];circuloDibujoUbicacion=null;renderPoligonoUbicacion();});$('reiniciarPoligonoProyecto').addEventListener('click',()=>{puntosPoligonoUbicacion=[];circuloDibujoUbicacion=null;renderPoligonoUbicacion();});
    document.querySelectorAll('[data-modo-dibujo-mapa]').forEach(boton=>boton.addEventListener('click',()=>{herramientaDibujoAreaActiva=true;const selector=$('modoDibujoAreaProyecto');selector.value=boton.dataset.modoDibujoMapa;selector.dispatchEvent(new Event('change',{bubbles:true}));document.querySelectorAll('[data-modo-dibujo-mapa]').forEach(control=>control.classList.toggle('activo',control===boton));}));
    document.querySelectorAll('[data-accion-barra-area]').forEach(boton=>boton.addEventListener('click',()=>{const controles={subir:'subirArchivosGIS',editar:'editarTerrenoMapa',limpiar:'reiniciarPoligonoProyecto'};$(controles[boton.dataset.accionBarraArea])?.click();}));
    $('modalDibujoArea').addEventListener('keydown',evento=>{if(evento.key==='Escape'&&(puntosPoligonoUbicacion.length||circuloDibujoUbicacion)){evento.preventDefault();quitarUltimoVerticeArea();}});
    $('volverNivelMapaProyecto').addEventListener('click',async()=>{puntosPoligonoUbicacion=[];renderPoligonoUbicacion();if(nivelMapaProyecto==='distrito'&&provinciaMapaProyecto){await seleccionarProvinciaMapaProyecto(provinciaMapaProyecto);return;}if(nivelMapaProyecto==='provincia'&&departamentoMapaProyecto){await seleccionarDepartamentoMapaProyecto(departamentoMapaProyecto);return;}await mostrarDepartamentosMapaProyecto();});
    const volverAccionesGeometria=()=>{
      $('modalDibujoArea').close();
      if(origenMapaCrearProyecto){origenMapaCrearProyecto=false;mostrarPasoAsistenteProyecto(1);return;}
      if(geometriaProyectoBorrador&&!$('modalAccionesGeometria').open)$('modalAccionesGeometria').showModal();
    };
    $('cerrarDibujoArea').addEventListener('click',volverAccionesGeometria);
    $('cancelarDibujoArea').addEventListener('click',volverAccionesGeometria);
    $('cerrarAccionesGeometria').addEventListener('click',eliminarGeometriaProyectoBorrador);
    $('guardarGeometriaMapa').addEventListener('click',()=>{
      if(!geometriaProyectoBorrador)return;
      const selector=$('proyectoZonaObjetivo'),valor=proyectoSeleccionado?.codigo||selector.value;
      selector.replaceChildren(...ciudades.map(proyecto=>new Option(`${proyecto.codigo} · ${proyecto.nombre}`,proyecto.codigo)));
      if([...selector.options].some(opcion=>opcion.value===valor))selector.value=valor;
      $('nombreZonaProyecto').value='';$('estadoZonaProyecto').textContent='Indique el nombre, tipo de objeto y proyecto que recibirá el área.';$('estadoZonaProyecto').classList.remove('exito');
      $('modalAccionesGeometria').close();
      $('modalDibujoArea').showModal();
    });
    $('editarGeometriaMapa').addEventListener('click',activarEdicionGeometriaProyecto);
    $('finalizarEdicionGeometria').addEventListener('click',finalizarEdicionGeometriaProyecto);
    $('eliminarGeometriaMapa').addEventListener('click',eliminarGeometriaProyectoBorrador);
    $('guardarZonaProyecto').addEventListener('click',()=>{
      if(origenMapaCrearProyecto&&guardarMapaUbicacionProyecto())return;
      const nombre=$('nombreZonaProyecto').value.trim(),tipo=$('tipoZonaProyecto').value,codigoProyecto=$('proyectoZonaObjetivo').value;
      const estado=$('estadoZonaProyecto');
      if(!codigoProyecto){estado.textContent='Seleccione el proyecto o subproyecto que recibirá la geometría.';estado.classList.remove('exito');return;}
      if(!nombre){estado.textContent='Escriba un nombre para la geometría antes de dibujar.';estado.classList.remove('exito');$('nombreZonaProyecto').focus();return;}
      dibujoProyectoPendiente={nombre,tipo,codigoProyecto};
      completarDibujoProyecto();
    });
    $('abrirCronogramaProyecto').addEventListener('click',()=>{
      renderCronogramaProyecto();
      mostrarPasoAsistenteProyecto(5);
    });
    $('cerrarCronogramaProyecto').addEventListener('click',()=>mostrarPasoAsistenteProyecto(1));
    $('cancelarCronogramaProyecto').addEventListener('click',()=>mostrarPasoAsistenteProyecto(1));
    $('agregarActividadCronograma').addEventListener('click',()=>{
      leerCronogramaProyecto();
      cronogramaBorrador.push({fase:$('proyectoFase').value||'Anteproyecto'});
      renderCronogramaProyecto();
    });
    $('tablaCronogramaProyecto').addEventListener('click',evento=>{
      const boton=evento.target.closest('[data-accion="eliminar-actividad"]');
      if(!boton)return;
      const indice=Number(boton.closest('tr')?.dataset.indiceCronograma);
      if(Number.isInteger(indice)){
        cronogramaBorrador.splice(indice,1);
        cronogramaSeleccionadas.clear();
        cronogramaColapsados.clear();
        renderCronogramaProyecto();
      }
    });
    $('tablaCronogramaProyecto').addEventListener('click',evento=>{
      const boton=evento.target.closest('[data-recurso-cronograma]');
      if(!boton)return;
      leerCronogramaProyecto();
      indiceRecursoCronograma=Number(boton.dataset.recursoCronograma);
      renderRecursosCronograma();
      $('modalRecursosCronograma').showModal();
    });
    $('tablaCronogramaProyecto').addEventListener('input',()=>{leerCronogramaProyecto();renderGanttCronograma();});
    $('tablaCronogramaProyecto').addEventListener('change',evento=>{if(evento.target.matches('[data-seleccion-cronograma]'))actualizarSeleccionCronograma();});
    $('seleccionarTodoCronograma').addEventListener('change',evento=>{$('tablaCronogramaProyecto').querySelectorAll('[data-seleccion-cronograma]').forEach(casilla=>{casilla.checked=evento.target.checked;const indice=Number(casilla.dataset.seleccionCronograma);evento.target.checked?cronogramaSeleccionadas.add(indice):cronogramaSeleccionadas.delete(indice);});actualizarSeleccionCronograma();});
    $('bajarNivelCronograma').addEventListener('click',()=>ajustarNivelCronograma(1));
    $('subirNivelCronograma').addEventListener('click',()=>ajustarNivelCronograma(-1));
    $('calendarioCronogramaProyecto').addEventListener('click',()=>{renderCalendarioCronograma();$('modalCalendarioCronograma').showModal();});
    $('cerrarCalendarioCronograma').addEventListener('click',()=>$('modalCalendarioCronograma').close());
    $('cancelarCalendarioCronograma').addEventListener('click',()=>$('modalCalendarioCronograma').close());
    $('semanaCalendarioCronograma').addEventListener('change',evento=>{const dia=Number(evento.target.dataset.diaCalendario);evento.target.checked?calendarioCronograma.dias.add(dia):calendarioCronograma.dias.delete(dia);renderCalendarioCronograma();});
    $('filasHorarioCronograma').addEventListener('change',evento=>{const input=evento.target;if(!input.matches('[data-horario-dia]'))return;calendarioCronograma.horarios[Number(input.dataset.horarioDia)][Number(input.dataset.horarioPosicion)]=input.value;renderCalendarioCronograma();});
    $('aplicarHorarioCronograma').addEventListener('click',()=>{const horario=[$('horaEntradaCronograma').value,$('horaInicioRefrigerioCronograma').value,$('horaFinRefrigerioCronograma').value,$('horaSalidaCronograma').value];calendarioCronograma.dias.forEach(dia=>calendarioCronograma.horarios[dia]=[...horario]);renderCalendarioCronograma();});
    $('agregarFeriadoCronograma').addEventListener('click',()=>{const fecha=$('fechaFeriadoCronograma').value,nombre=$('nombreFeriadoCronograma').value.trim()||'Día no laborable';if(!fecha)return;calendarioCronograma.feriados.push({fecha,nombre});$('fechaFeriadoCronograma').value='';$('nombreFeriadoCronograma').value='';renderCalendarioCronograma();});
    $('listaFeriadosCronograma').addEventListener('click',evento=>{const boton=evento.target.closest('[data-eliminar-feriado]');if(!boton)return;calendarioCronograma.feriados.splice(Number(boton.dataset.eliminarFeriado),1);renderCalendarioCronograma();});
    $('guardarCalendarioCronograma').addEventListener('click',()=>{$('estadoImportacionCronograma').textContent=`Calendario aplicado: ${calendarioCronograma.dias.size} día(s) laborables por semana y ${calendarioCronograma.feriados.length} feriado(s).`;$('modalCalendarioCronograma').close();});
    $('cerrarRecursosCronograma').addEventListener('click',()=>{$('modalRecursosCronograma').close();renderCronogramaProyecto();});
    $('guardarRecursosCronograma').addEventListener('click',()=>{$('modalRecursosCronograma').close();renderCronogramaProyecto();});
    $('agregarRecursoCronograma').addEventListener('click',()=>{
      const actividad=cronogramaBorrador[indiceRecursoCronograma],nombre=$('nombreRecursoCronograma').value.trim();
      if(!actividad||!nombre)return;
      (actividad.recursos??=[]).push({nombre,tipo:$('tipoRecursoCronograma').value,cantidad:$('cantidadRecursoCronograma').value||'1',horas:$('horasRecursoCronograma').value||'8'});
      $('nombreRecursoCronograma').value='';renderRecursosCronograma();
    });
    $('listaRecursosCronograma').addEventListener('click',evento=>{
      const boton=evento.target.closest('[data-eliminar-recurso-cronograma]');if(!boton)return;
      cronogramaBorrador[indiceRecursoCronograma]?.recursos?.splice(Number(boton.dataset.eliminarRecursoCronograma),1);renderRecursosCronograma();
    });
    $('deslizadorTablaCronograma').addEventListener('input',evento=>{const panel=document.querySelector('.tabla-cronograma-proyecto');if(panel)panel.scrollLeft=Number(evento.target.value);});
    $('deslizadorGanttCronograma').addEventListener('input',evento=>{const panel=document.querySelector('.gantt-cronograma-proyecto');if(panel)panel.scrollLeft=Number(evento.target.value);});
    document.querySelector('.tabla-cronograma-proyecto')?.addEventListener('scroll',evento=>{const deslizador=$('deslizadorTablaCronograma');if(document.activeElement!==deslizador)deslizador.value=evento.currentTarget.scrollLeft;});
    document.querySelector('.gantt-cronograma-proyecto')?.addEventListener('scroll',evento=>{const deslizador=$('deslizadorGanttCronograma');if(document.activeElement!==deslizador)deslizador.value=evento.currentTarget.scrollLeft;});
    $('importarCronogramaProyecto').addEventListener('change',async evento=>{
      const archivo=evento.target.files?.[0];if(!archivo)return;
      try{
        const buffer=await archivo.arrayBuffer();let filas=[];
        if(/\.xlsx$/i.test(archivo.name)&&window.XLSX){const libro=XLSX.read(buffer,{type:'array'});filas=XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]],{header:1});}
        else if(/\.xml$/i.test(archivo.name)){
          const xml=new DOMParser().parseFromString(new TextDecoder().decode(buffer),'application/xml');
          filas=[['Código','Actividad','Fase','Inicio','Fin','Predecesora','Sucesora','Avance'],...[...xml.querySelectorAll('Task')].filter(t=>t.querySelector('Name')?.textContent).map((t,i)=>[t.querySelector('UID')?.textContent||`ACT-${String(i+1).padStart(2,'0')}`,t.querySelector('Name')?.textContent||'', $('proyectoFase').value||'Anteproyecto',(t.querySelector('Start')?.textContent||'').slice(0,10),(t.querySelector('Finish')?.textContent||'').slice(0,10),'','',t.querySelector('PercentComplete')?.textContent||0])];
        } else filas=new TextDecoder().decode(buffer).split(/\r?\n/).map(linea=>linea.split(/[;,]/));
        const datos=filas.slice(1).map((fila,i)=>({codigo:String(fila[0]||`ACT-${String(i+1).padStart(2,'0')}`).trim(),actividad:String(fila[1]||'').trim(),fase:String(fila[2]||$('proyectoFase').value||'Anteproyecto').trim(),inicio:String(fila[3]||'').trim(),fin:String(fila[4]||'').trim(),predecesora:String(fila[5]||'').trim(),sucesora:String(fila[6]||'').trim(),avance:Number(fila[7]||0)})).filter(item=>item.actividad||item.inicio);
        if(!datos.length)throw new Error('sin filas válidas');
        cronogramaBorrador=datos;renderCronogramaProyecto();$('estadoImportacionCronograma').textContent=`${datos.length} actividad(es) importadas desde ${archivo.name}.`;
      }catch(error){$('estadoImportacionCronograma').textContent='No se pudo importar el archivo. Use columnas: código, actividad, fase, inicio, fin, predecesora, sucesora, avance.';}
      evento.target.value='';
    });
    $('exportarCronogramaProyecto').addEventListener('click',()=>{
      leerCronogramaProyecto();
      const Pdf=window.jspdf?.jsPDF;
      if(!Pdf){$('estadoImportacionCronograma').textContent='La exportación PDF no está disponible.';return;}
      const pdf=new Pdf({orientation:'landscape'});pdf.setFontSize(16);pdf.text('Cronograma del proyecto',14,16);pdf.setFontSize(9);
      const filas=cronogramaBorrador.map((item,indice)=>[indice+1,item.actividad,item.inicio,item.fin,item.predecesora||'',item.sucesora||'',`${item.avance||0}%`,(item.recursos||[]).map(recurso=>recurso.nombre).join(', ')]);
      if(typeof pdf.autoTable==='function')pdf.autoTable({head:[['N°','Actividad','Inicio','Fin','Pred.','Suc.','Avance','Recursos']],body:filas,startY:22,styles:{fontSize:7},headStyles:{fillColor:[33,96,128]}});
      else filas.forEach((fila,i)=>pdf.text(fila.join(' | '),14,28+i*7));
      const conFechas=cronogramaBorrador.filter(item=>item.inicio&&item.fin);
      let y=(pdf.lastAutoTable?.finalY||28+filas.length*7)+12;
      if(y+conFechas.length*10>195){pdf.addPage();y=18;}
      pdf.setFontSize(11);pdf.setTextColor(26,42,68);pdf.text('Diagrama Gantt / avance',14,y);y+=7;
      if(conFechas.length){const dia=86400000,fechas=conFechas.flatMap(item=>[new Date(`${item.inicio}T00:00:00`),new Date(`${item.fin}T00:00:00`)]),inicio=new Date(Math.min(...fechas)),fin=new Date(Math.max(...fechas)),span=Math.max(1,Math.round((fin-inicio)/dia)+1),x=62,ancho=210,colores=[[77,174,186],[240,146,88],[216,94,176],[99,127,224]];pdf.setFontSize(6);conFechas.forEach((item,indice)=>{const desde=new Date(`${item.inicio}T00:00:00`),hasta=new Date(`${item.fin}T00:00:00`),izquierda=x+Math.max(0,Math.round((desde-inicio)/dia))/span*ancho,barra=Math.max(6,(Math.round((hasta-desde)/dia)+1)/span*ancho),color=colores[indice%colores.length];pdf.setTextColor(34,48,76);pdf.text(`${indice+1}. ${(item.actividad||item.codigo).slice(0,26)}`,14,y+5);pdf.setFillColor(...color);pdf.roundedRect(izquierda,y,barra,4,1,1,'F');pdf.setFillColor(82,199,122);pdf.roundedRect(izquierda,y+4.8,barra*Math.max(0,Math.min(100,Number(item.avance||0)))/100,1.5,.5,.5,'F');y+=10;});}
      pdf.save(`cronograma-${$('proyectoCodigo').value||'proyecto'}.pdf`);
    });
    $('guardarCronogramaProyecto').addEventListener('click',()=>{
      leerCronogramaProyecto();
      mostrarPasoAsistenteProyecto(1);
    });
    $('buscarProyectoEdicion')?.addEventListener('input',renderListaProyectosEdicion);
    $('listaProyectosEdicion')?.addEventListener('click',e=>{
      const accion=e.target.closest('[data-accion]');
      if(!accion)return;
      const proyecto=ciudades.find(p=>p.codigo===accion.dataset.codigo);
      if(!proyecto)return;
      if(accion.dataset.accion==='editar-proyecto')cargarProyectoEnFormulario(proyecto);
      if(accion.dataset.accion==='crear-subproyecto'){
        limpiarFormularioProyecto();
        $('proyectoPadre').value=proyecto.codigo;
        proponerSubproyecto(proyecto.codigo);
      }
      if(accion.dataset.accion==='eliminar-proyecto')abrirModalEliminarProyecto(proyecto);
    });
    $('cerrarConfirmarEliminarProyecto').addEventListener('click',()=>$('modalConfirmarEliminarProyecto').close());
    $('cancelarEliminarProyecto').addEventListener('click',()=>$('modalConfirmarEliminarProyecto').close());
    $('confirmarEliminarProyecto').addEventListener('click',eliminarProyectoPendiente);
    $('proyectoDepartamento').addEventListener('change',poblarUbicacionesProyecto);
    $('proyectoProvincia').addEventListener('change',poblarUbicacionesProyecto);
    document.querySelector('.campo-pap-proyecto')?.addEventListener('click',evento=>{const boton=evento.target.closest('[data-valor-pap]');if(boton)actualizarSeleccionPap(boton.dataset.valorPap);});
    const agregarPersonaEquipo=()=>{const persona=$('selectorPersonaEquipo').value;if(!persona)return;const opcion=[...$('proyectoEquipo').options].find(item=>item.value===persona);if(opcion)opcion.selected=true;$('selectorPersonaEquipo').value='';actualizarResumenEquipoProyecto();};
    $('selectorPersonaEquipo').addEventListener('change',agregarPersonaEquipo);
    $('proyectoEquipo').addEventListener('change',actualizarResumenEquipoProyecto);
    $('listaEquipoProyecto').addEventListener('click',evento=>{const boton=evento.target.closest('[data-quitar-persona-equipo]');if(!boton)return;const opcion=[...$('proyectoEquipo').options].find(item=>item.value===boton.dataset.quitarPersonaEquipo);if(opcion)opcion.selected=false;actualizarResumenEquipoProyecto();});
    const previsualizarFases=()=>{const fases=leerFasesFormulario();document.querySelectorAll('.fila-fase-proyecto').forEach(fila=>fila.classList.toggle('seleccionada',Boolean(fila.querySelector('input[type="checkbox"]')?.checked)));renderLineaTiempoFases(fases);};
    $('abrirFasesProyecto').addEventListener('click',()=>{actualizarVistaFasesProyecto();$('modalFasesProyecto').showModal();});
    $('modalFasesProyecto').addEventListener('input',previsualizarFases);
    $('modalFasesProyecto').addEventListener('change',previsualizarFases);
    $('agregarFaseProyecto').addEventListener('click',()=>{const lista=document.querySelector('.lista-fases-proyecto'),indice=lista.querySelectorAll('.fila-fase-proyecto').length;lista.insertAdjacentHTML('beforeend',crearFilaFaseProyecto({activa:true,sugerencia:`Fase ${indice+1}`},indice));previsualizarFases();lista.lastElementChild?.querySelector('.nombre-fase-proyecto')?.focus();});
    let fasePendienteEliminar=null;
    const cerrarConfirmacionEliminarFase=()=>{$('modalConfirmarEliminarFase').close();fasePendienteEliminar=null;};
    document.querySelector('.lista-fases-proyecto').addEventListener('click',evento=>{const boton=evento.target.closest('.eliminar-fase-proyecto');if(!boton)return;fasePendienteEliminar=boton.closest('.fila-fase-proyecto');$('modalConfirmarEliminarFase').showModal();});
    $('cerrarConfirmarEliminarFase').addEventListener('click',cerrarConfirmacionEliminarFase);
    $('cancelarEliminarFase').addEventListener('click',cerrarConfirmacionEliminarFase);
    $('confirmarEliminarFase').addEventListener('click',()=>{fasePendienteEliminar?.remove();cerrarConfirmacionEliminarFase();previsualizarFases();});
    $('cerrarFasesProyecto').addEventListener('click',()=>$('modalFasesProyecto').close());
    $('cancelarFasesProyecto').addEventListener('click',()=>$('modalFasesProyecto').close());
    $('guardarFasesProyecto').addEventListener('click',()=>{aplicarFasesProyecto();$('modalFasesProyecto').close();});
    $('modalFasesProyecto').addEventListener('click',evento=>{if(evento.target===$('modalFasesProyecto'))$('modalFasesProyecto').close();});
    $('agregarBeneficiarioProyecto').addEventListener('click',()=>{
      if($('tablaBeneficiariosProyecto').querySelector('.fila-vacia-beneficiarios'))$('tablaBeneficiariosProyecto').replaceChildren();
      agregarFilaBeneficiarioProyecto();
    });
    $('tablaBeneficiariosProyecto').addEventListener('click',e=>{
      const boton=e.target.closest('[data-accion="eliminar-beneficiario"]');
      if(!boton)return;
      boton.closest('tr')?.remove();
      if(!$('tablaBeneficiariosProyecto').children.length)limpiarBeneficiariosProyecto();
      else actualizarIndicesBeneficiariosProyecto();
    });
    $('tablaBeneficiariosProyecto').addEventListener('input',actualizarIndicesBeneficiariosProyecto);
    $('excelProyecto').addEventListener('change',e=>cargarBeneficiariosDesdeExcelProyecto(e.target.files[0]));
    $('guardarCrearProyecto').addEventListener('click',()=>{
      const datos=obtenerDatosFormularioProyecto();
      if(!datos.codigo||!datos.nombre)return;
      const codigoAnterior=proyectoEdicionSeleccionado?.codigo||'';
      sincronizarBeneficiariosProyecto(codigoAnterior||datos.codigo);
      if(proyectoEdicionSeleccionado){
        Object.assign(proyectoEdicionSeleccionado,datos);
        prepararVersionesProyecto(proyectoEdicionSeleccionado);
        Object.assign(proyectoEdicionSeleccionado.versiones[versionCartograficaActiva],{estado:datos.estado,avance:datos.avance,longitud:datos.longitud,elementos:datos.elementos});
        if(codigoAnterior&&codigoAnterior!==datos.codigo){
          const beneficiariosPrevios=beneficiariosEdicionPorProyecto.get(codigoAnterior);
          beneficiariosEdicionPorProyecto.delete(codigoAnterior);
          if(beneficiariosPrevios)beneficiariosEdicionPorProyecto.set(datos.codigo,beneficiariosPrevios);
        }
      } else {
        prepararVersionesProyecto(datos);
        Object.assign(datos.versiones[versionCartograficaActiva],{estado:datos.estado,avance:datos.avance,longitud:datos.longitud,elementos:datos.elementos});
        aplicarVersionCartografica(datos,versionCartograficaActiva);
        ciudades.unshift(datos);
        proyectoEdicionSeleccionado=datos;
      }
      actualizarFiltros();
      actualizar();
      renderListaProyectosEdicion();
      cargarBeneficiariosDelProyecto(datos.codigo);
      $('contadorMapa').textContent=`Proyecto guardado: ${datos.codigo} · ${$('tablaBeneficiariosProyecto').querySelectorAll('tr:not(.fila-vacia-beneficiarios)').length} beneficiario(s)`;
      cerrarVistaCrearProyecto();
    });
    const modalSubirCapa=$('modalSubirCapa'), archivoGis=$('archivoGisModal');
    const cerrarModalCapa=()=>{$('botonSubir').setAttribute('aria-expanded','false');modalSubirCapa.close();};
    $('botonSubir').addEventListener('click',()=>{document.querySelectorAll('.panel-flotante').forEach(p=>p.hidden=true);$('botonSubir').setAttribute('aria-expanded','true');modalSubirCapa.showModal();});
    $('cerrarSubirCapa').addEventListener('click',cerrarModalCapa);
    $('cancelarSubirCapa').addEventListener('click',cerrarModalCapa);
    $('seleccionarArchivoCapa').addEventListener('click',()=>archivoGis.click());
    archivoGis.addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const extension=file.name.split('.').pop().toLowerCase();const tipos={gpx:'GPX · Ruta o puntos',geojson:'GeoJSON · Datos geográficos',json:'JSON · Datos geográficos',kml:'KML · Capa geográfica',zip:'ZIP · Paquete GIS'};$('estadoCargaModal').textContent=file.name;$('tipoCapaDetectado').textContent=tipos[extension]||extension.toUpperCase();$('mensajeSubirCapa').textContent='Archivo listo para cargar en el mapa.';if(!$('nombreCapa').value)$('nombreCapa').value=file.name.replace(/\.[^.]+$/,'');});
    $('cargarCapa').addEventListener('click',async()=>{const file=archivoGis.files[0];if(!file){$('mensajeSubirCapa').textContent='Selecciona un archivo antes de cargar la capa.';return;}const boton=$('cargarCapa');boton.disabled=true;boton.textContent='Cargando...';const ok=await cargarArchivo(file);boton.disabled=false;boton.textContent='Cargar capa';if(ok){$('mensajeSubirCapa').textContent='Capa cargada correctamente en el mapa.';setTimeout(cerrarModalCapa,350);}});
    modalSubirCapa.addEventListener('click',e=>{if(e.target===modalSubirCapa)cerrarModalCapa();});
    $('buscarProyecto').addEventListener('input',actualizar);
    ['filtroProyecto','filtroDepartamento','filtroProvincia','filtroDistrito','filtroEstado'].forEach(id=>$(id).addEventListener('change',()=>{
      if(id==='filtroDepartamento'||id==='filtroProvincia')actualizarFiltros();
      actualizar();
      if(id==='filtroProyecto'&&$('filtroProyecto').value){
        const proyecto=ciudades.find(p=>`${p.codigo} · ${p.nombre}`===$('filtroProyecto').value);
        if(proyecto)mostrarDetalle(proyecto);
      }
    }));
    $('filtrosMasificacion').addEventListener('reset',()=>setTimeout(()=>{actualizarFiltros();actualizar();restablecerTodo();},0));
    $('cerrarDetalle').addEventListener('click',cerrarProyecto);
    const volverAlProyecto=()=>{if(proyectoSeleccionado)mostrarDetalle(proyectoSeleccionado);};
    $('cerrarBeneficiario').addEventListener('click',volverAlProyecto);
    $('volverProyecto').addEventListener('click',volverAlProyecto);
    botonResumenMasificacion.addEventListener('click', alternarResumenMasificacion);
    $('abrirHerramientas').addEventListener('click',()=>{const abrir=$('grupoHerramientas').hidden;$('grupoHerramientas').hidden=!abrir;$('abrirHerramientas').setAttribute('aria-expanded',String(abrir));});
    document.querySelectorAll('[data-herramienta]').forEach(b=>b.addEventListener('click',()=>activarHerramienta(b.dataset.herramienta,b)));
    $('limpiarSeleccion').addEventListener('click',limpiarSeleccion);
    mapa.on('click',clickDibujo);mapa.on('mousemove',moverDibujo);mapa.on('dblclick',evento=>{
      if(herramientaActiva){cerrarDibujo(evento);return;}
      evento.originalEvent?.preventDefault();
      const proyecto=proyectoSeleccionado||ciudades[0];
      document.querySelector('.enlace-menu[href="#satcontrol"]')?.click();
      if(proyecto)mostrarDetalle(proyecto);
      $('tituloSubirCapa').textContent='Subir avance GIS';
      $('modalSubirCapa').querySelector('header p').textContent=`Cargue el avance GIS para ${proyecto?`${proyecto.codigo} · ${proyecto.nombre}`:'el proyecto seleccionado'}. Se indexará en SATCONTROL.`;
      $('nombreCapa').value=proyecto?`Avance GIS · ${proyecto.codigo}`:'';
      $('mensajeSubirCapa').textContent='Seleccione un archivo GPX, GeoJSON, KML o ZIP para registrar el avance en SATCONTROL.';
      if(!$('modalSubirCapa').open)$('modalSubirCapa').showModal();
    });
    document.addEventListener('keydown',evento=>{
      if(evento.key!=='Escape')return;
      evento.preventDefault();document.querySelectorAll('dialog[open]').forEach(modal=>modal.close());
      $('accionesGeometriaMapa').hidden=true;geometriaProyectoBorrador=null;desactivarHerramientasMapa(true);restablecerTodo();
    });
    let arrastreHerramientas=null;
    $('grupoHerramientas').addEventListener('pointerdown',e=>{
      if(!e.target.closest('[data-herramienta="mover"]'))return;
      const barra=$('grupoHerramientas'),rect=barra.getBoundingClientRect();
      arrastreHerramientas={dx:e.clientX-rect.left,dy:e.clientY-rect.top};
      barra.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    $('grupoHerramientas').addEventListener('pointermove',e=>{
      if(!arrastreHerramientas)return;
      const barra=$('grupoHerramientas');
      barra.style.position='fixed';
      barra.style.left=Math.max(8,Math.min(innerWidth-barra.offsetWidth-8,e.clientX-arrastreHerramientas.dx))+'px';
      barra.style.top=Math.max(8,Math.min(innerHeight-barra.offsetHeight-8,e.clientY-arrastreHerramientas.dy))+'px';
      barra.style.right='auto';
      barra.style.bottom='auto';
      barra.style.zIndex='1600';
    });
    $('grupoHerramientas').addEventListener('pointerup',()=>arrastreHerramientas=null);
    $('grupoHerramientas').addEventListener('pointercancel',()=>arrastreHerramientas=null);
    $('cambiarZonaExpediente').addEventListener('click',cambiarZonaExpediente);
    document.querySelectorAll('[data-cerrar-modal]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.cerrarModal).close()));
    document.querySelectorAll('dialog.modal-masificacion').forEach(modal=>modal.addEventListener('click',e=>{if(e.target===modal)modal.close();}));
    $('excelLiquidacion').addEventListener('change',e=>{
      $('estadoLiquidacion').textContent=e.target.files[0]?`${e.target.files[0].name} cargado · 4 partidas reconocidas · 4 objetos GIS vinculados`:'Modelo listo para carga masiva y vinculación espacial.';
    });
    $('liquidacionTotal').addEventListener('change',actualizarLiquidacion);
    $('porcentajeLiquidacion').addEventListener('input',actualizarLiquidacion);
    $('liquidacionProyecto').addEventListener('change',()=>vincularLiquidacionProyecto($('liquidacionProyecto').value));
    $('liquidacionTipoProceso').addEventListener('change',configurarLiquidacionPsr);
    $('hitoPsr').addEventListener('change',configurarLiquidacionPsr);
    $('estadoHitoPsr').addEventListener('change',configurarLiquidacionPsr);
    document.querySelectorAll('[data-documento-psr]').forEach(control=>control.addEventListener('change',configurarLiquidacionPsr));
    document.querySelectorAll('[data-documento-redes],[data-documento-tc],[data-suministro-tc]').forEach(control=>control.addEventListener('change',validarRequisitosLiquidacion));
    $('redesMetradoEjecutado').addEventListener('input',validarRequisitosLiquidacion);
    $('redesMetradoAsBuilt').addEventListener('input',validarRequisitosLiquidacion);
    document.querySelectorAll('[data-estado-documento]').forEach(boton=>boton.addEventListener('click',()=>{const listo=boton.classList.toggle('cargado');boton.querySelector('small').textContent=listo?'Cargado ✓':'Pendiente';}));
    document.querySelectorAll('[data-accion-psr]').forEach(boton=>boton.addEventListener('click',()=>{const accion=boton.dataset.accionPsr,documentos=[...document.querySelectorAll('[data-documento-psr]')].every(x=>x.checked),conforme=['Conforme por interventor','Enviado a Administración','Pagado'].includes($('estadoHitoPsr').value);if(!documentos){$('mensajeHitoPsr').textContent='No puede avanzar: complete los documentos obligatorios del hito.';return;}if(['administracion','pagado'].includes(accion)&&!conforme){$('mensajeHitoPsr').textContent='No puede avanzar: el interventor debe dar conformidad antes de enviar a Administración.';return;}const pasos={presentar:1,derivar:2,conforme:3,administracion:5,pagado:6};actualizarFlujoPsr(pasos[accion]||1);}));
    $('agregarObservacionPsr').addEventListener('click',registrarObservacionPsr);
    $('guardarBorradorLiquidacion').addEventListener('click',()=>{$('estadoLiquidacion').textContent='Borrador de liquidación guardado.';});
    $('exportarLiquidacionCsv').addEventListener('click',exportarLiquidacionCsv);
    $('exportarLiquidacionPdf').addEventListener('click',exportarLiquidacionPdf);
    document.querySelectorAll('[data-vista-informe]').forEach(boton=>boton.addEventListener('click',()=>{
      const vista=boton.dataset.vistaInforme;
      document.querySelectorAll('[data-vista-informe]').forEach(item=>item.classList.toggle('activa',item===boton));
      document.querySelectorAll('[data-panel-informe]').forEach(panel=>panel.hidden=panel.dataset.panelInforme!==vista);
    }));
    $('partidasLiquidacion').addEventListener('click',e=>{if(e.target.classList.contains('eliminar-partida'))e.target.closest('tr').remove();});
    $('agregarPartida').addEventListener('click',()=>{
      const fila=document.createElement('tr');
      fila.innerHTML='<td><input aria-label="Código VNR" value="NUEVO-VNR"></td><td><textarea aria-label="Partida">Nueva partida de liquidación</textarea></td><td><input aria-label="Unidad" value="m"></td><td><input aria-label="Cantidad" type="number" value="0"></td><td><input aria-label="Tarifa Osinergmin" type="number" value="0"></td><td><input aria-label="Objeto GIS" value="GIS pendiente"></td><td><select aria-label="Vinculación GIS"><option>GIS vinculado</option><option selected>Por vincular</option></select></td><td class="monto-liquidacion" data-total="0">US$ 0.00</td><td><button class="eliminar-partida">Eliminar</button></td>';
      $('partidasLiquidacion').append(fila);
    });
    actualizarLiquidacion();
  }
  async function prepararDatosGeo(){
    const respuesta=await fetch('datos_masificacion.geojson');
    if(!respuesta.ok) throw new Error('GeoJSON no disponible');
    datosGeo=(await respuesta.json()).features;
    ciudades=restaurarProyectosSatcontrol(construirCatalogoProyectosDesdeGeojson(datosGeo));
    ciudades.forEach(proyecto=>aplicarVersionCartografica(proyecto,versionCartograficaActiva));
    const respuestaManzanas=await fetch('manzanas_urbanas_masificacion.geojson');
    if(respuestaManzanas.ok){
      manzanasUrbanas=(await respuestaManzanas.json()).features || [];
    }
    const respuestaEstratos=await fetch('../../geo/masificacion_estratos_inei.geojson');
    if(!respuestaEstratos.ok)throw new Error('Estratos INEI no disponibles');
    estratosInei=(await respuestaEstratos.json()).features || [];
  }
  async function cargarDatosDashboardNagasco(){
    try{
      const respuesta=await fetch('datos_dashboard_nagasco.json');
      if(!respuesta.ok)throw new Error('JSON no disponible');
      datosDashboardNagasco=await respuesta.json();
      if(!vistaDashboardMasificacion.hidden)renderDashboardMasificacion();
    }catch(error){
      datosDashboardNagasco.periodo='No fue posible cargar datos demostrativos';
      if(!vistaDashboardMasificacion.hidden)renderDashboardMasificacion();
    }
  }
  if(typeof L==='undefined'){ $('contadorMapa').textContent='No se pudo cargar el mapa'; return; }
  function iniciarControlesSatMasificacion(){
    const modal=$('modalControlProyecto');
    const contenido=$('contenidoControlProyecto');
    const titulo=$('tituloControlProyecto');
    const subtitulo=$('subtituloControlProyecto');
    const proyectoActual=()=>proyectoSeleccionado||ciudades[0]||{codigo:'MAS-001',nombre:'Proyecto de Masificación'};
    document.querySelectorAll('[data-version-proyecto]').forEach(boton=>boton.addEventListener('click',()=>{
      cambiarVersionCartografica(boton.dataset.versionProyecto);
    }));
    $('botonVersionesMapa')?.addEventListener('click',()=>{
      const selector=$('proyectoVersionMapa');
      selector.replaceChildren(...ciudades.map(p=>new Option(`${p.codigo} · ${p.nombre}`,p.codigo)));
      selector.value=proyectoSeleccionado?.codigo||ciudades[0]?.codigo||'';
      document.querySelectorAll('[data-version-modal]').forEach(boton=>boton.classList.toggle('activo',boton.dataset.versionModal===versionCartograficaActiva));
      $('modalVersionesMapa').showModal();
      renderizarMapasVersiones(selector.value);
    });
    $('proyectoVersionMapa')?.addEventListener('change',event=>renderizarMapasVersiones(event.target.value));
    document.querySelectorAll('[data-version-modal]').forEach(boton=>boton.addEventListener('click',()=>{
      cambiarVersionCartografica(boton.dataset.versionModal);
      $('modalVersionesMapa').close();
    }));
    const plantillas={
      checklist:p=>({titulo:'Checklist de aptitud técnica',subtitulo:`${p.codigo} · evaluación del terreno con evidencia georreferenciada`,html:`
        <div class="mc-kpis"><article><small>Ítems evaluados</small><strong>12</strong></article><article><small>Conformes</small><strong>9</strong></article><article><small>Observados</small><strong>2</strong></article><article><small>No aplica</small><strong>1</strong></article></div>
        <table><thead><tr><th>Verificación</th><th>Resultado</th><th>Coordenadas</th><th>Evidencia</th></tr></thead><tbody><tr><td>Acceso para maquinaria</td><td>Conforme</td><td>${p.lat?.toFixed?.(5)||'-12.04'}, ${p.lng?.toFixed?.(5)||'-77.03'}</td><td>Foto 01</td></tr><tr><td>Estabilidad del terreno</td><td>Conforme</td><td>Georreferenciada</td><td>Foto 02</td></tr><tr><td>Interferencias existentes</td><td>Observado</td><td>Georreferenciada</td><td>Foto 03</td></tr><tr><td>Disponibilidad del derecho de vía</td><td>Conforme</td><td>Georreferenciada</td><td>Foto 04</td></tr></tbody></table><div class="mc-acciones"><button>Agregar evidencia</button><button class="principal">Guardar checklist</button></div>`}),
      informe:p=>({titulo:'Informe diario de supervisión',subtitulo:`${p.codigo} · revisión previa del registro fotográfico`,html:`<div class="mc-kpis"><article><small>Fotos recibidas</small><strong>8</strong></article><article><small>Seleccionadas</small><strong>6</strong></article><article><small>Descartadas</small><strong>2</strong></article><article><small>Avance diario</small><strong>3.8%</strong></article></div><div class="mc-fotos"><article class="mc-foto"><b>Frente de excavación</b><small>08:20 · GPS validado</small><button>Eliminar del informe</button></article><article class="mc-foto"><b>Tendido de tubería</b><small>11:45 · GPS validado</small><button>Eliminar del informe</button></article><article class="mc-foto"><b>Reposición de pavimento</b><small>16:10 · GPS validado</small><button>Eliminar del informe</button></article></div><div class="mc-acciones"><button>Vista previa</button><button class="principal">Descargar reporte final</button></div>`}),
      documentos:p=>({titulo:'Documentos clave del proyecto',subtitulo:`Acceso directo desde la cabecera de ${p.codigo}`,html:`<table><thead><tr><th>Documento</th><th>Versión</th><th>Fecha</th><th>Acceso</th></tr></thead><tbody><tr><td>Cronograma de ejecución</td><td>V.04</td><td>20/07/2026</td><td><button class="mc-enlace">Abrir PDF</button></td></tr><tr><td>Ingeniería básica</td><td>V.02</td><td>15/07/2026</td><td><button class="mc-enlace">Ver plano</button></td></tr><tr><td>Ingeniería de detalle</td><td>V.01</td><td>22/07/2026</td><td><button class="mc-enlace">Ver plano</button></td></tr><tr><td>Memoria descriptiva</td><td>Final</td><td>25/07/2026</td><td><button class="mc-enlace">Abrir PDF</button></td></tr></tbody></table>`}),
      avance:p=>({titulo:'Seguimiento porcentual periódico',subtitulo:`${p.codigo} · comparación de alcance proyectado frente a avance real`,html:`<div class="mc-kpis"><article><small>Alcance proyectado</small><strong>100%</strong></article><article><small>Avance real</small><strong>${p.avance||62}%</strong></article><article><small>Desviación</small><strong>-${Math.max(0,100-(p.avance||62))}%</strong></article><article><small>Periodo</small><strong>P5</strong></article></div><table><thead><tr><th>Periodo</th><th>Planificado</th><th>Real</th><th>Variación</th></tr></thead><tbody><tr><td>P1</td><td>20%</td><td>18%</td><td>-2%</td></tr><tr><td>P2</td><td>40%</td><td>37%</td><td>-3%</td></tr><tr><td>P3</td><td>60%</td><td>55%</td><td>-5%</td></tr><tr><td>P4</td><td>80%</td><td>${Math.min(79,p.avance||68)}%</td><td>-${Math.max(1,80-Math.min(79,p.avance||68))}%</td></tr><tr><td>P5</td><td>100%</td><td>${p.avance||62}%</td><td>-${Math.max(0,100-(p.avance||62))}%</td></tr></tbody></table><div class="mc-acciones"><button>Exportar tabla</button><button class="principal">Generar dashboard</button></div>`})
    };
    document.querySelectorAll('[data-control-proyecto]').forEach(boton=>boton.addEventListener('click',()=>{
      const vista=plantillas[boton.dataset.controlProyecto](proyectoActual());
      titulo.textContent=vista.titulo;subtitulo.textContent=vista.subtitulo;contenido.innerHTML=vista.html;modal.showModal();
    }));
    contenido.addEventListener('click',e=>{
      const botonEliminar=e.target.closest('.mc-foto button');
      if(!botonEliminar)return;
      botonEliminar.closest('.mc-foto')?.remove();
      const restantes=contenido.querySelectorAll('.mc-foto').length;
      const seleccionadas=contenido.querySelector('.mc-kpis article:nth-child(2) strong');
      const descartadas=contenido.querySelector('.mc-kpis article:nth-child(3) strong');
      if(seleccionadas)seleccionadas.textContent=String(restantes);
      if(descartadas)descartadas.textContent=String(Math.max(0,8-restantes));
    });
    $('cerrarControlProyecto').addEventListener('click',()=>modal.close());
    modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
  }
  iniciarControlesSatMasificacion();
  cargarDatosDashboardNagasco();
  // Un recurso cartográfico ausente no debe bloquear las hojas de creación,
  // parámetros contractuales ni el resto del módulo.
  prepararDatosGeo().then(iniciar).catch(()=>{
    $('contadorMapa').textContent='No se pudo cargar datos_masificacion.geojson';
    iniciar();
  });
})();
