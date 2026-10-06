(()=>{
  const $=id=>document.getElementById(id);
  const formatos={psr:['P02 · Inspección de terreno PSR-GNL asignada',['Fecha,Área o sistema,GPS,Motivo','Resultado,Observaciones,Fotos,RNC requerida']],redes:['P02 · Visita de supervisión Redes',['Fecha,Tramo o frente,GPS,Actividad','Estado,Fotos,Observaciones,RNC']],tc:['P02 · Visita / muestra de TCs',['N° suministro,Dirección,GPS','TC instalada,Habilitación,Fotos,Observaciones']]};
  const claveNc='supervisor-petroperu.movil.nc';
  const ir=id=>{document.querySelectorAll('.vista').forEach(v=>v.classList.toggle('activa',v.id===id));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('activo',b.dataset.ir===id));$('.contenido').scrollTo({top:0,behavior:'smooth'});};
  const avisar=texto=>{$('aviso').textContent=texto;$('aviso').classList.add('visible');setTimeout(()=>$('aviso').classList.remove('visible'),2800);};
  const campo=nombre=>/foto/.test(nombre.toLowerCase())?`<label>${nombre}<input type="file" accept="image/*" multiple></label>`:/observ/.test(nombre.toLowerCase())?`<label>${nombre}<textarea></textarea></label>`:/fecha/.test(nombre.toLowerCase())?`<label>${nombre}<input type="date"></label>`:`<label>${nombre}<input></label>`;
  const pintarVisita=()=>{const dato=formatos[$('infra').value];$('formato').innerHTML=`<option>${dato[0]}</option>`;$('campos').innerHTML=dato[1].map((grupo,indice)=>`<section><h3>${indice?'Resultado y evidencia':'Datos de la visita asignada'}</h3>${grupo.split(',').map(campo).join('')}</section>`).join('');};
  const registrosNc=()=>{try{return JSON.parse(localStorage.getItem(claveNc)||'[]');}catch{return[];}};
  const actualizarConteo=()=>{const total=2+registrosNc().length;$('contadorNc').textContent=total;$('kpiNc').textContent=total;};
  document.querySelectorAll('[data-ir]').forEach(b=>b.addEventListener('click',()=>ir(b.dataset.ir)));
  $('infra').addEventListener('change',pintarVisita);
  $('formVisita').addEventListener('submit',evento=>{evento.preventDefault();avisar('Visita de supervisión enviada correctamente.');ir('inicio');});
  $('formNcMovil').addEventListener('submit',evento=>{evento.preventDefault();const datos=Object.fromEntries(new FormData(evento.currentTarget).entries());const actuales=registrosNc();actuales.unshift({...datos,fechaRegistro:new Date().toISOString()});localStorage.setItem(claveNc,JSON.stringify(actuales));evento.currentTarget.reset();actualizarConteo();avisar('NC guardada. Disponible para seguimiento en Supervisor.');ir('inicio');});
  pintarVisita();actualizarConteo();
})();
