(()=>{
  const $=id=>document.getElementById(id);
  const claveVisitas='supervision.movil.visitas';
  const terrenos={
    'terreno-1':{nombre:'Terreno matriz San Jerónimo',ubicacion:'Av. La Cultura · Cusco',coordenadas:[-13.5411,-71.8876]},
    'terreno-2':{nombre:'Predio de ampliación Saylla',ubicacion:'Sector Huayllapampa · Cusco',coordenadas:[-13.5688,-71.8292]},
    'terreno-3':{nombre:'Terreno operativo Oropesa',ubicacion:'Vía Cusco–Urcos · Cusco',coordenadas:[-13.5931,-71.7714]}
  };
  let terrenoActivo='terreno-1';
  let mapaVisitas,marcadoresVisitas={};
  const requisitosTerreno=[
    ['a','Área del terreno','≥ 3,500 m²'],
    ['b','Geometría del terreno','De preferencia rectangular aprox. (60 m × 60 m)'],
    ['c','Pendiente del terreno','≤ 5%'],
    ['d','Disponibilidad de planos del terreno','De ubicación, área y perímetro'],
    ['e','Partida registral del terreno','De preferencia con vigencia de tres meses'],
    ['f','Zonificación o tipo de uso del terreno','Rural, urbano, industrial o de uso múltiple'],
    ['g','Estudio de mecánica de suelos (EMS) del terreno','Información del subsuelo, napa freática y relleno sanitario'],
    ['h','Interferencias en superficie del terreno','Edificaciones, árboles y cables aéreos'],
    ['i','Interferencias subterráneas en el terreno','Cauces de agua, canales o acequias'],
    ['j','Vía de acceso para el abastecimiento de GNL','Ancho mínimo entre 4 m y 6 m'],
    ['k','Factibilidad de suministro eléctrico para PSR','12 kW – 45 kW'],
    ['l','Distancia aprox. entre PSR y residencias','≤ 5 km'],
    ['m','Puntos de reunión concentrada cerca a la PSR','Iglesia, estadio u otros']
  ];
  const tramitesComplementarios=[
    ['tupa-regional','TUPA / autorización regional','GORE · Declaración de Impacto Ambiental'],
    ['tupa-local','TUPA provincial y distrital','Licencias y autorizaciones municipales'],
    ['escombrera','Escombrera autorizada','Disposición de residuos de construcción']
  ];
  const ir=id=>{if(id==='formularios')pintarVisita();document.querySelectorAll('.vista').forEach(v=>v.classList.toggle('activa',v.id===id));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('activo',b.dataset.ir===id));$('.contenido').scrollTo({top:0,behavior:'smooth'});};
  const avisar=texto=>{$('aviso').textContent=texto;$('aviso').classList.add('visible');setTimeout(()=>$('aviso').classList.remove('visible'),2800);};
  const campo=nombre=>/foto/.test(nombre.toLowerCase())?`<label>${nombre}<input type="file" accept="image/*" multiple></label>`:/observ/.test(nombre.toLowerCase())?`<label>${nombre}<textarea></textarea></label>`:/fecha/.test(nombre.toLowerCase())?`<label>${nombre}<input type="date" value="${new Date().toLocaleDateString('en-CA')}"></label>`:`<label>${nombre}<input></label>`;
  const pintarRequisitos=()=>{$('listaRequisitos').innerHTML=requisitosTerreno.map(([codigo,nombre,parametro])=>`<details class="requisito-terreno"><summary><span class="indice-requisito">${codigo}</span><span><b>${nombre}</b><small>${parametro}</small></span><span class="estado-inicial">Pendiente</span></summary><div class="detalle-requisito"><label>Resultado<select name="requisito-${codigo}-estado"><option value="Pendiente">Pendiente</option><option value="Cumple">Cumple</option><option value="No cumple">No cumple</option></select></label><label>Comentarios<textarea name="requisito-${codigo}-comentario" placeholder="Registre la observación de campo."></textarea></label><div class="cargas-evidencia"><label class="carga-archivo"><span>▣ Subir fotos</span><input data-nombre-archivo type="file" name="requisito-${codigo}-fotos" accept="image/*" multiple><small>Sin fotos adjuntas</small></label><label class="carga-archivo"><span>▤ Adjuntar documento</span><input data-nombre-archivo type="file" name="requisito-${codigo}-documentos" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" multiple><small>Sin documentos adjuntos</small></label></div></div></details>`).join('');};
  const pintarTramites=()=>{$('listaTramites').innerHTML=tramitesComplementarios.map(([codigo,nombre,referencia],indice)=>`<details class="tramite-complementario"><summary><span class="indice-tramite">${indice+1}</span><span><b>${nombre}</b><small>${referencia}</small></span><span class="estado-inicial">Pendiente</span></summary><div class="detalle-requisito"><label>Estado<select name="tramite-${codigo}-estado"><option value="Pendiente">Pendiente</option><option value="En revisión">En revisión</option><option value="Conforme">Conforme</option><option value="Observado">Observado</option></select></label><label>Comentarios<textarea name="tramite-${codigo}-comentario" placeholder="Registre el estado o la observación del trámite."></textarea></label><div class="cargas-evidencia"><label class="carga-archivo"><span>▣ Subir fotos</span><input data-nombre-archivo type="file" name="tramite-${codigo}-fotos" accept="image/*" multiple><small>Sin fotos adjuntas</small></label><label class="carga-archivo"><span>▤ Adjuntar documento</span><input data-nombre-archivo type="file" name="tramite-${codigo}-documentos" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" multiple><small>Sin documentos adjuntos</small></label></div></div></details>`).join('');};
  const pintarVisita=()=>{const terreno=terrenos[terrenoActivo];$('campos').innerHTML=`<section><small class="referencia-visita">TERRENO ASIGNADO</small><h3>${terreno.nombre}</h3><p class="ubicacion-visita">⌖ ${terreno.ubicacion}</p>${'Fecha de inspección'.split(',').map(campo).join('')}</section>`;pintarRequisitos();pintarTramites();};
  document.querySelectorAll('[data-ir]').forEach(b=>b.addEventListener('click',()=>ir(b.dataset.ir)));
  const seleccionarTerreno=id=>{terrenoActivo=id;document.querySelectorAll('.terreno-item').forEach(elemento=>elemento.classList.toggle('seleccionado',elemento.dataset.terreno===id));Object.entries(marcadoresVisitas).forEach(([clave,marcador])=>marcador.getElement()?.classList.toggle('marcador-activo',clave===id));};
  const iniciarMapaVisitas=()=>{if(!window.L||mapaVisitas)return;mapaVisitas=L.map('mapaVisitasMovil',{zoomControl:true,attributionControl:false}).setView([-13.565,-71.83],12);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(mapaVisitas);Object.entries(terrenos).forEach(([id,terreno])=>{const icono=L.divIcon({className:'icono-marcador-leaflet',html:'<span>⌖</span>',iconSize:[36,36],iconAnchor:[18,18]});const marcador=L.marker(terreno.coordenadas,{icon:icono,title:terreno.nombre}).addTo(mapaVisitas).bindTooltip(terreno.nombre,{direction:'top',offset:[0,-16]});marcador.on('click',()=>seleccionarTerreno(id));marcadoresVisitas[id]=marcador;});seleccionarTerreno(terrenoActivo);};
  document.querySelectorAll('[data-inspeccionar]').forEach(boton=>boton.addEventListener('click',()=>{seleccionarTerreno(boton.dataset.inspeccionar);pintarVisita();ir('formularios');}));
  $('formVisita').addEventListener('change',evento=>{if(!evento.target.matches('[data-nombre-archivo]'))return;const texto=evento.target.closest('.carga-archivo').querySelector('small');const archivos=[...evento.target.files].map(archivo=>archivo.name);texto.textContent=archivos.length?`${archivos.length} archivo${archivos.length===1?'':'s'}: ${archivos.join(', ')}`:'Sin archivos adjuntos';});
  $('formVisita').addEventListener('submit',evento=>{evento.preventDefault();const form=evento.currentTarget;const requisitos=requisitosTerreno.map(([codigo,nombre,parametro])=>({codigo,nombre,parametro,estado:form.elements[`requisito-${codigo}-estado`].value,comentario:form.elements[`requisito-${codigo}-comentario`].value.trim(),fotos:[...form.elements[`requisito-${codigo}-fotos`].files].map(archivo=>archivo.name),documentos:[...form.elements[`requisito-${codigo}-documentos`].files].map(archivo=>archivo.name)}));const tramites=tramitesComplementarios.map(([codigo,nombre,referencia])=>({codigo,nombre,referencia,estado:form.elements[`tramite-${codigo}-estado`].value,comentario:form.elements[`tramite-${codigo}-comentario`].value.trim(),fotos:[...form.elements[`tramite-${codigo}-fotos`].files].map(archivo=>archivo.name),documentos:[...form.elements[`tramite-${codigo}-documentos`].files].map(archivo=>archivo.name)}));const visitas=JSON.parse(localStorage.getItem(claveVisitas)||'[]');visitas.unshift({infraestructura:'Visita al terreno',terreno:terrenos[terrenoActivo],formato:'P02 · Inspección de terreno',fechaRegistro:new Date().toISOString(),requisitos,tramites});localStorage.setItem(claveVisitas,JSON.stringify(visitas));avisar('Visita enviada con los 13 requisitos y 3 trámites complementarios.');ir('inicio');});
  document.title='Supervisión móvil | FISE';
  const tituloAplicacion=document.querySelector('#app header h1'),rolPerfil=document.querySelector('.perfil-cabecera p'),rolDato=document.querySelector('.perfil-datos div:nth-child(3) b');
  if(tituloAplicacion)tituloAplicacion.textContent='Supervisión';
  if(rolPerfil)rolPerfil.textContent='Supervisora de campo';
  if(rolDato)rolDato.textContent='Supervisora de campo';
  const marcaAplicacion=document.querySelector('#app header>b');
  if(marcaAplicacion)marcaAplicacion.textContent='SC';
  pintarVisita();iniciarMapaVisitas();
})();

/* Acceso independiente para la aplicación móvil de Supervisión. */
(()=>{
  const app=document.getElementById('app'),telefono=document.querySelector('.telefono');
  if(!app||!telefono)return;
  const pantalla=document.createElement('section');
  pantalla.id='pantallaLoginSupervision';
  pantalla.className='pantalla-login-supervision';
  pantalla.innerHTML='<div class="marca-login-supervision"><img src="../logo_fise.png" alt="FISE"></div><form id="formLoginSupervision"><p>MASIFICACIÓN DE GAS NATURAL</p><h1>Bienvenido<br>Supervisión</h1><label>Correo Gmail<input type="email" placeholder="nombre@gmail.com"></label><label>Contraseña<input type="password" placeholder="Ingrese su contraseña"></label><button type="button" class="enlace-login-supervision">¿Olvidó su contraseña?</button><button class="ingresar-supervision" type="submit">Ingresar</button></form><small>Aplicativo móvil de Supervisión</small>';
  telefono.prepend(pantalla);app.hidden=true;
  document.head.insertAdjacentHTML('beforeend','<style>.pantalla-login-supervision{display:flex;flex-direction:column;height:100%;color:#fff;background:#142342}.marca-login-supervision{position:relative;display:grid;flex:0 0 42%;place-items:center;background:#fff}.marca-login-supervision:before{position:absolute;top:30px;content:"";width:128px;height:28px;border-radius:20px;background:#050b18}.marca-login-supervision img{width:220px;height:220px;object-fit:contain}.pantalla-login-supervision form{display:grid;flex:1;gap:16px;padding:42px 34px 20px;background:linear-gradient(145deg,#1f315b,#101c37)}.pantalla-login-supervision form>p{margin:0;color:#7390c3;font-size:.78rem;font-weight:900;letter-spacing:.12em}.pantalla-login-supervision h1{margin:0 0 8px;color:#fff;font-size:2.4rem;line-height:1.06}.pantalla-login-supervision label{display:grid;gap:7px;color:#fff;font-size:.78rem;font-weight:800}.pantalla-login-supervision input{height:54px;padding:0 13px;color:#fff;border:1px solid #5b6e94;border-radius:14px;background:#ffffff12;font:inherit;font-size:.9rem}.pantalla-login-supervision input::placeholder{color:#a4b9d5}.enlace-login-supervision{justify-self:start;padding:0;color:#82cff0;border:0;background:transparent;font:inherit;font-size:.76rem;font-weight:800;text-decoration:underline}.ingresar-supervision{height:62px;color:#10243e;border:0;border-radius:20px;background:#72d492;font:900 1.1rem Arial}.pantalla-login-supervision>small{padding:10px;color:#b4c8e4;background:#101c37;text-align:center;font-size:.72rem}.pantalla-login-supervision[hidden]{display:none!important}</style>');
  const avisar=texto=>{const aviso=document.getElementById('aviso');aviso.textContent=texto;aviso.classList.add('visible');setTimeout(()=>aviso.classList.remove('visible'),2600);};
  pantalla.querySelector('form').addEventListener('submit',evento=>{evento.preventDefault();pantalla.hidden=true;app.hidden=false;avisar('Sesión iniciada.');});
  pantalla.querySelector('.enlace-login-supervision').addEventListener('click',()=>avisar('Ingrese su correo Gmail para recuperar la contraseña.'));
})();
