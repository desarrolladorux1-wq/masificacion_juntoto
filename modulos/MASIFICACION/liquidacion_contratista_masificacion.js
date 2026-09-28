(()=>{
  const clave='masificacion.contratista.liquidacion';
  const leer=()=>{try{return JSON.parse(localStorage.getItem(clave)||'{}')}catch{return {}}};
  const escapar=valor=>String(valor||'PDF adjunto').replace(/[&<>"']/g,caracter=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[caracter]));
  const marcarArchivo=(contenedor,nombre)=>{
    if(!contenedor||!nombre)return;
    const vista=contenedor.querySelector('.ver-pdf-ficha')?.outerHTML||'<button type="button" class="ver-documento-liquidacion ver-pdf-ficha" title="Ver archivo adjunto" aria-label="Ver archivo adjunto">◉</button>';
    contenedor.innerHTML=`<span class="archivo-contratista" title="Archivo cargado por el contratista">${escapar(nombre)}</span>${vista}`;
  };
  const actualizar=()=>{
    const datos=leer(),panel=document.querySelector('.documentos-liquidacion-resumen [data-panel-liquidacion="documentos"]');
    if(!panel)return;
    const aplicarEstado=(tabla,valor)=>{
      tabla?.querySelectorAll('th').forEach(cabecera=>{if(cabecera.textContent.trim()==='Seguimiento')cabecera.textContent='Estado';});
      const etiqueta=tabla?.querySelector('.estado-seguimiento');
      if(etiqueta&&valor){etiqueta.textContent=valor;etiqueta.className=`estado-seguimiento ${valor.toLowerCase().replaceAll(' ','-')}`;}
    };
    panel.querySelectorAll('details').forEach((detalle,indice)=>{
      const adjuntos=datos[indice]?.adjuntos||{},tablas=detalle.querySelectorAll('.subtablas-ficha-final>div');
      aplicarEstado(tablas[0],datos[indice]?.estadoHito);
      aplicarEstado(tablas[1],datos[indice]?.estadoServicio);
      marcarArchivo(tablas[0]?.querySelector('.sustento-final'),adjuntos.hito);
      marcarArchivo(tablas[1]?.querySelector('.sustento-final'),adjuntos.servicio);
      tablas[0]?.querySelectorAll('.requisitos-ficha-final .sustento-final').forEach((nodo,numero)=>marcarArchivo(nodo,adjuntos[`hito-requisito-${numero}`]));
      tablas[1]?.querySelectorAll('.requisitos-ficha-final .sustento-final').forEach((nodo,numero)=>marcarArchivo(nodo,adjuntos[`servicio-requisito-${numero}`]));
    });
  };
  const iniciar=()=>{actualizar();new MutationObserver(actualizar).observe(document.body,{childList:true,subtree:true});window.addEventListener('storage',evento=>{if(evento.key===clave)actualizar();});document.addEventListener('click',evento=>{const boton=evento.target.closest('.archivo-contratista + .ver-pdf-ficha');if(boton)alert(`Archivo recibido del contratista: ${boton.previousElementSibling.textContent}`);});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
