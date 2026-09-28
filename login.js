(()=>{
  const $=id=>document.getElementById(id);
  const destinos={masificacion:'modulos/MASIFICACION/masificacion.html',contratista:'CONTRATISTA/index.html',interventor:'INTERVENTOR/index.html',supervisor:'SUPERVISOR_PETROPERU/index.html'};
  const clave='paulet-masificacion-usuarios';
  const iniciales=[{nombre:'Usuario Masificación',usuario:'masificacion',clave:'123456',rol:'masificacion'},{nombre:'Usuario Contratista',usuario:'contratista',clave:'123456',rol:'contratista'},{nombre:'Usuario Interventor',usuario:'interventor',clave:'123456',rol:'interventor'},{nombre:'Supervisor PETROPERÚ',usuario:'supervisor',clave:'123456',rol:'supervisor'}];
  const leer=()=>{
    const guardados=JSON.parse(localStorage.getItem(clave)||'null');
    if(!guardados)return iniciales;
    return [...iniciales.filter(inicial=>!guardados.some(usuario=>usuario.usuario.toLowerCase()===inicial.usuario)),...guardados];
  };
  const guardar=usuarios=>localStorage.setItem(clave,JSON.stringify(usuarios));
  const mensaje=(id,texto,error=false)=>{const nodo=$(id);nodo.textContent=texto;nodo.classList.toggle('error',error)};
  let rol='';
  $('verClave').onclick=()=>{const visible=$('claveLogin').type==='text';$('claveLogin').type=visible?'password':'text';$('verClave').setAttribute('aria-label',visible?'Mostrar contraseña':'Ocultar contraseña');};
  $('formLogin').addEventListener('submit',evento=>{evento.preventDefault();const usuario=$('usuarioLogin').value.trim().toLowerCase(),claveIngresada=$('claveLogin').value;const cuenta=leer().find(item=>item.usuario.toLowerCase()===usuario&&item.clave===claveIngresada);if(!cuenta){mensaje('mensajeLogin','Usuario o contraseña incorrectos.',true);return;}sessionStorage.setItem('paulet-masificacion-sesion',JSON.stringify({nombre:cuenta.nombre,rol:cuenta.rol}));location.href=destinos[cuenta.rol];});
  $('mostrarRegistro').onclick=()=>{rol='';mensaje('mensajeRegistro','');$('formRegistro').reset();document.querySelectorAll('[data-rol]').forEach(boton=>boton.classList.remove('seleccionado'));$('modalRegistro').showModal();};
  $('modalRegistro').querySelector('header button').onclick=()=>$('modalRegistro').close();
  document.querySelectorAll('[data-rol]').forEach(boton=>boton.onclick=()=>{rol=boton.dataset.rol;document.querySelectorAll('[data-rol]').forEach(item=>item.classList.toggle('seleccionado',item===boton));});
  $('formRegistro').addEventListener('submit',evento=>{evento.preventDefault();const nombre=$('nombreRegistro').value.trim(),usuario=$('usuarioRegistro').value.trim().toLowerCase(),claveNueva=$('claveRegistro').value,usuarios=leer();if(!rol){mensaje('mensajeRegistro','Seleccione el módulo del usuario.',true);return;}if(usuarios.some(item=>item.usuario.toLowerCase()===usuario)){mensaje('mensajeRegistro','Ese usuario ya existe.',true);return;}usuarios.push({nombre,usuario,clave:claveNueva,rol});guardar(usuarios);$('modalRegistro').close();$('usuarioLogin').value=usuario;$('claveLogin').value='';mensaje('mensajeLogin','Usuario creado. Ingrese su contraseña para continuar.');});
})();
