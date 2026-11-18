(()=>{
  const $=id=>document.getElementById(id),clave='petroperu.movil.no-conformidades';
  const avisar=texto=>{const aviso=$('aviso');aviso.textContent=texto;aviso.classList.add('visible');setTimeout(()=>aviso.classList.remove('visible'),2600)};
  const leer=()=>{try{const datos=JSON.parse(localStorage.getItem(clave)||'[]');return Array.isArray(datos)?datos:[]}catch(_){return []}};
  const guardar=datos=>localStorage.setItem(clave,JSON.stringify(datos));
  const escapar=valor=>String(valor||'').replace(/[&<>]/g,caracter=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[caracter]));
  const render=()=>{const datos=leer(),lista=$('listaNcPetroMovil');$('codigoNcPetro').value=`NC-${String(datos.length+1).padStart(3,'0')}`;$('contadorNcAbiertas').textContent=datos.length;lista.innerHTML=datos.length?datos.map(nc=>`<article class="nc-petro-item"><small>ABIERTA · ${escapar(nc.codigo)}</small><b>${escapar(nc.tipo)}</b><span>${escapar(nc.componente)} · ${escapar(nc.fecha.split('-').reverse().join('/'))}</span><p>${escapar(nc.descripcion)}</p></article>`).join(''):'<p class="nc-vacio">No hay No Conformidades registradas.</p>';};
  const ir=vista=>{document.querySelectorAll('.vista').forEach(seccion=>seccion.classList.toggle('activa',seccion.id===vista));document.querySelectorAll('nav button').forEach(boton=>boton.classList.toggle('activo',boton.dataset.ir===vista));document.querySelector('.contenido').scrollTo({top:0,behavior:'smooth'});};
  document.querySelectorAll('[data-ir]').forEach(boton=>boton.addEventListener('click',()=>ir(boton.dataset.ir)));
  $('formLoginPetro').addEventListener('submit',evento=>{evento.preventDefault();$('pantallaLoginPetro').hidden=true;$('app').hidden=false;ir('inicio');avisar('Sesión iniciada.');});
  $('olvidoClavePetro').addEventListener('click',()=>avisar('Ingrese su correo Gmail para recuperar la contraseña.'));
  $('formNcPetro').addEventListener('submit',evento=>{evento.preventDefault();const form=evento.currentTarget;if(!form.reportValidity())return;const datos=leer();datos.unshift({codigo:$('codigoNcPetro').value,proyecto:$('proyectoNcPetro').value,componente:$('componenteNcPetro').value,tipo:$('tipoNcPetro').value,fecha:$('fechaNcPetro').value,ubicacion:$('ubicacionNcPetro').value,descripcion:$('descripcionNcPetro').value,accion:$('accionNcPetro').value});guardar(datos);form.reset();$('fechaNcPetro').value=new Date().toLocaleDateString('en-CA');render();avisar('No Conformidad registrada y comunicada al contratista.');});
  $('formPerfilPetro').addEventListener('submit',evento=>{evento.preventDefault();avisar('Datos del perfil guardados.');});
  $('cerrarSesionPetro').addEventListener('click',()=>{$('app').hidden=true;$('pantallaLoginPetro').hidden=false;avisar('Sesión cerrada.');});
  $('fechaNcPetro').value=new Date().toLocaleDateString('en-CA');render();
})();
