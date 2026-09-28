(()=>{
 const reubicar=()=>{
  const original=window.__cronogramaContratistaOriginal,vista=document.getElementById('cronograma-actividades'),boton=document.querySelector('[data-vista="cronograma-actividades"]');if(!original||!vista||!boton)return;
  const nc=document.createElement('section');nc.id='no-conformidades';nc.className='vista vista-no-conformidades';nc.hidden=true;while(vista.firstChild)nc.append(vista.firstChild);vista.insertAdjacentElement('afterend',nc);
  vista.className=original.clase;vista.setAttribute('aria-labelledby',original.aria||'tituloCronogramaContratista');vista.innerHTML=original.html;boton.dataset.etiqueta=original.etiqueta||'Cronograma y actividades';boton.querySelector('.enlace-texto').textContent=original.texto||'Cronograma y actividades';
  const botonNc=boton.cloneNode(true);botonNc.dataset.vista='no-conformidades';botonNc.dataset.etiqueta='No Conformidades';botonNc.querySelector('.enlace-texto').textContent='No Conformidades';boton.insertAdjacentElement('afterend',botonNc);
  const mostrar=id=>{document.querySelectorAll('.vista').forEach(item=>{item.hidden=item.id!==id;item.classList.toggle('activa',item.id===id)});document.querySelectorAll('[data-vista]').forEach(item=>item.classList.toggle('activo',item.dataset.vista===id));const titulo=document.getElementById('tituloVista'),cabecera=document.querySelector('.cabecera-satcontrol-identidad>strong');if(id==='no-conformidades'){if(titulo)titulo.textContent='Mis No Conformidades';if(cabecera)cabecera.innerHTML='MASIFICACIÓN <i>·</i> NO CONFORMIDADES';}history.replaceState(null,'',`#${id}`);window.scrollTo({top:0,behavior:'smooth'});};
  botonNc.addEventListener('click',()=>mostrar('no-conformidades'));
  boton.addEventListener('click',()=>setTimeout(()=>{const titulo=document.getElementById('tituloVista'),cabecera=document.querySelector('.cabecera-satcontrol-identidad>strong');if(titulo)titulo.textContent='Cronograma y actividades';if(cabecera)cabecera.innerHTML='MASIFICACIÓN <i>·</i> CRONOGRAMA Y ACTIVIDADES';},0));
  if(location.hash==='#no-conformidades')mostrar('no-conformidades');
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reubicar);else reubicar();
})();
