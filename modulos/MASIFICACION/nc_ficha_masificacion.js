(()=>{
  const clave='masificacion.interventor.no-conformidades';
  const porDefecto=[
    {codigo:'NC-001',componente:'Redes de distribución',tipo:'Incumplimiento técnico',fecha:'28/09/2026',estado:'Cerrada',accion:'Evidencia validada por el Interventor.'},
    {codigo:'NC-002',componente:'PSR-GNL',tipo:'Seguridad y medio ambiente',fecha:'24/09/2026',estado:'Abierta',accion:'Presentar plan de limpieza y registro fotográfico.'},
    {codigo:'NC-003',componente:'Tuberías de conexión',tipo:'Incumplimiento técnico',fecha:'18/09/2026',estado:'Pendiente de verificación',accion:'Validar la subsanación presentada.'}
  ];
  const leer=()=>{try{const datos=JSON.parse(localStorage.getItem(clave)||'[]');return Array.isArray(datos)&&datos.length?datos:porDefecto;}catch{return porDefecto;}};
  const esc=valor=>String(valor??'—').replace(/[&<>"']/g,caracter=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[caracter]));
  const clase=estado=>String(estado||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll(' ','-');
  const componentes=[
    ['COMPONENTE 01','PSR-GNL','Hallazgos de planta'],
    ['COMPONENTE 02','Redes de distribución','Hallazgos de obra'],
    ['COMPONENTE 03','Tuberías de conexión','Hallazgos de habilitación']
  ];
  const filas=(nombre,datos)=>datos.filter(nc=>nc.componente===nombre).map(nc=>`<tr><td><strong>${esc(nc.codigo||nc.codigoNC)}</strong></td><td>${esc(nc.hito||'Sin hito vinculado')}</td><td>${esc(nc.tipo||nc.tipoNC)}</td><td>${esc(nc.fecha||nc.fechaDeteccion)}</td><td><span class="estado-seguimiento ${clase(nc.estado)}">${esc(nc.estado)}</span></td><td>${esc(nc.accion||nc.accionRequerida||nc.descripcion)}</td></tr>`).join('')||'<tr><td colspan="6">No se registraron no conformidades para este componente.</td></tr>';
  const plantilla=()=>{const datos=leer();return `<section class="nc-ficha-masificacion" data-nc-masificacion>${componentes.map(([codigo,nombre,detalle])=>`<details><summary><span><small>${codigo}</small><strong>${nombre}</strong><i>${detalle}</i></span><b aria-hidden="true"></b></summary><div class="detalle-liquidacion"><table class="tabla-nc-ficha"><thead><tr><th>Código NC</th><th>Hito vinculado</th><th>Tipo</th><th>Fecha de detección</th><th>Estado</th><th>Acción requerida</th></tr></thead><tbody>${filas(nombre,datos)}</tbody></table></div></details>`).join('')}</section>`;};
  const estilos=()=>{if(document.getElementById('estilosNcFichaMasificacion'))return;document.head.insertAdjacentHTML('beforeend',`<style id="estilosNcFichaMasificacion">
    .nc-ficha-masificacion{display:grid;gap:14px;padding:14px 18px 18px}
    .nc-ficha-masificacion details{overflow:hidden;border-radius:16px}
    .nc-ficha-masificacion details>summary{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:18px;min-height:92px;padding:16px 86px 16px 28px!important;list-style:none}
    .nc-ficha-masificacion details>summary::-webkit-details-marker{display:none}
    .nc-ficha-masificacion details>summary::after{content:none!important;display:none!important}
    .nc-ficha-masificacion details>summary>span{display:flex!important;flex:1;flex-direction:column!important;align-items:flex-start!important;justify-content:center;gap:5px;min-width:0}
    .nc-ficha-masificacion details>summary>span small{margin:0!important}
    .nc-ficha-masificacion details>summary>span strong{margin:0!important}
    .nc-ficha-masificacion details>summary>span i{margin:0!important;color:#c5d9ee!important;font-size:.7rem!important;font-style:normal!important}
    .nc-ficha-masificacion details>summary>b{position:absolute!important;right:28px!important;top:50%!important;display:grid!important;place-items:center!important;margin:0!important;width:42px!important;height:42px!important;padding:0!important;border:1px solid rgba(235,246,255,.55)!important;border-radius:11px!important;color:transparent!important;background:rgba(8,24,53,.30)!important;font-size:0!important;line-height:1!important;transform:translateY(-50%)!important}
    .nc-ficha-masificacion details>summary>b::before{content:''!important;display:block!important;width:12px!important;height:12px!important;border-right:3px solid #fff!important;border-bottom:3px solid #fff!important;transform:rotate(45deg) translate(-2px,-2px)!important}
    .nc-ficha-masificacion details[open]>summary>b::before{transform:rotate(225deg) translate(-2px,-2px)!important}
    .nc-ficha-masificacion .detalle-liquidacion{padding:0 18px 18px!important;background:transparent!important;border:0!important;box-shadow:none!important}
    .nc-ficha-masificacion .detalle-liquidacion::before,.nc-ficha-masificacion .detalle-liquidacion::after{display:none!important;content:none!important}
    .nc-ficha-masificacion .detalle-liquidacion .tabla-nc-ficha{width:100%!important;min-width:100%!important;table-layout:fixed!important}
    .nc-ficha-masificacion .tabla-nc-ficha th:nth-child(1){width:10%}.nc-ficha-masificacion .tabla-nc-ficha th:nth-child(2){width:19%}.nc-ficha-masificacion .tabla-nc-ficha th:nth-child(3){width:16%}.nc-ficha-masificacion .tabla-nc-ficha th:nth-child(4){width:13%}.nc-ficha-masificacion .tabla-nc-ficha th:nth-child(5){width:15%}.nc-ficha-masificacion .tabla-nc-ficha th:nth-child(6){width:27%}
    .nc-ficha-masificacion .detalle-liquidacion th,.nc-ficha-masificacion .detalle-liquidacion td{padding:11px 12px!important;white-space:normal!important}
  </style>`);};
  const panel=()=>document.querySelector('.documentos-liquidacion-resumen [data-panel-liquidacion="no-conformidades"]');
  const actualizar=(forzar=false)=>{const destino=panel();if(!destino)return;if(forzar||!destino.querySelector('[data-nc-masificacion]'))destino.innerHTML=plantilla();};
  const iniciar=()=>{estilos();actualizar();new MutationObserver(()=>actualizar()).observe(document.body,{childList:true,subtree:true});window.addEventListener('storage',evento=>{if(evento.key===clave)actualizar(true);});window.addEventListener('focus',()=>actualizar(true));};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
