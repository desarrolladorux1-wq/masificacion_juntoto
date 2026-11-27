(() => {
  const $ = id => document.getElementById(id);
  const iconos = {
    inicio: '<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    proyectos: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM8 8h8M8 12h5M8 16h7"/></svg>',
    psr: '<svg viewBox="0 0 24 24"><path d="M4 20h16M6 20V9h12v11M9 9V4h6v5M9 13h.01M12 13h.01M15 13h.01"/></svg>',
    redes: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 11 10-4M7 13l10 4"/></svg>',
    tc: '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/></svg>',
    movil: '<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></svg>',
    perfil: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21c.7-4 3.1-6 7.5-6s6.8 2 7.5 6"/></svg>',
    salir: '<svg viewBox="0 0 24 24"><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></svg>'
  };
  const icono = tipo => `<span class="menu-icono-petro" aria-hidden="true">${iconos[tipo]}</span>`;
  const nav = document.querySelector('.menu nav');
  if (!nav) return;
  const ponerIcono = (selector, tipo) => {
    const item = nav.querySelector(selector);
    if (item && !item.querySelector('.menu-icono-petro')) item.insertAdjacentHTML('afterbegin', icono(tipo));
  };
  ponerIcono('[data-vista="inicio"]', 'inicio');
  ponerIcono('#toggleFormularios', 'proyectos');
  ponerIcono('[data-grupo="psr"]', 'psr');
  ponerIcono('[data-grupo="redes"]', 'redes');
  ponerIcono('[data-grupo="tc"]', 'tc');
  ponerIcono('a[href*="appmovil"]', 'movil');
  const cabeceraProyectos = $('#toggleFormularios');
  if (cabeceraProyectos) cabeceraProyectos.querySelector('span').textContent = 'Proyectos';

  const pie = document.querySelector('.menu footer');
  if (pie) pie.innerHTML = `<button class="menu-perfil-petro" type="button">${icono('perfil')}<span>Perfil</span></button><a class="menu-sesion-petro" href="../../index.html">${icono('salir')}<span>Cerrar sesión</span></a>`;

  const clave = 'petroperu.supervisor.perfil';
  const porDefecto = { nombres: 'Valeria', apellidos: 'Cárdenas', direccion: 'Av. República de Panamá 3591', correo: 'valeria.cardenas@petroperu.com.pe', telefono: '999 555 222' };
  const leer = () => { try { return { ...porDefecto, ...JSON.parse(localStorage.getItem(clave) || '{}') }; } catch (_) { return porDefecto; } };
  const aviso = texto => { const nodo = $('aviso'); if (!nodo) return; nodo.textContent = texto; nodo.classList.add('visible'); setTimeout(() => nodo.classList.remove('visible'), 2600); };
  const perfil = $('perfilSupervisor');
  const mostrar = vista => {
    document.querySelectorAll('main > .vista').forEach(seccion => { seccion.hidden = seccion !== vista; seccion.classList.toggle('activa', seccion === vista); });
    $('titulo').textContent = vista === perfil ? 'Mi perfil' : vista.id === 'inicio' ? 'Inicio' : 'Formularios';
    document.querySelector('.menu nav .activo')?.classList.remove('activo');
  };
  const abrirPerfil = () => {
    const datos = leer();
    Object.entries(datos).forEach(([nombre, valor]) => { $('formDatosPerfilPetro').elements[nombre].value = valor; });
    mostrar(perfil);
    pie?.querySelector('.menu-perfil-petro')?.classList.add('activo');
  };
  pie?.querySelector('.menu-perfil-petro')?.addEventListener('click', abrirPerfil);
  $('volverPerfilPetro')?.addEventListener('click', () => { mostrar($('inicio')); nav.querySelector('[data-vista="inicio"]')?.classList.add('activo'); });
  $('formDatosPerfilPetro')?.addEventListener('submit', evento => {
    evento.preventDefault(); localStorage.setItem(clave, JSON.stringify(Object.fromEntries(new FormData(evento.currentTarget)))); aviso('Datos personales actualizados correctamente.');
  });
  $('formSeguridadPerfilPetro')?.addEventListener('submit', evento => {
    evento.preventDefault(); const datos = new FormData(evento.currentTarget);
    if (!datos.get('nueva') || datos.get('nueva') !== datos.get('repetir')) { aviso('Las nuevas contraseñas deben coincidir.'); return; }
    evento.currentTarget.reset(); aviso('Contraseña actualizada correctamente.');
  });

  document.head.insertAdjacentHTML('beforeend', '<style>:root{--menu-ancho:260px}.menu{width:var(--menu-ancho)!important;background:#151d36!important}.marca{min-height:250px;justify-content:center;align-items:center;flex-direction:column;padding:20px!important;border-bottom:1px solid #344266!important}.marca img{width:154px!important;height:154px!important;padding:13px!important;border-radius:30px!important}.marca strong{font-size:24px!important}.marca small{display:none}.menu nav{gap:10px!important;padding:54px 28px!important}.menu nav button,.menu nav a{display:grid!important;grid-template-columns:36px minmax(0,1fr) auto!important;align-items:center!important;gap:15px!important;min-height:58px!important;margin:0!important;padding:12px 14px!important;color:#c7d2e8!important;border:1px solid transparent!important;border-radius:13px!important;background:transparent!important;font-size:.86rem!important;line-height:1.28!important}.menu nav button:hover,.menu nav a:hover,.menu nav button.activo,.menu-perfil-petro.activo{color:#fff!important;border-color:#6387bb!important;border-left:5px solid #79c3eb!important;background:#354775!important;box-shadow:none!important}.menu-icono-petro{display:grid;width:30px;height:30px;place-items:center;color:currentColor}.menu-icono-petro svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.menu-formularios>button b{grid-column:3}.menu-formularios #submenusFormularios{display:grid;gap:11px;margin:8px 0 8px 16px!important;padding:0 0 0 14px!important;border-left:1px solid #6281ae!important}.menu-formularios #submenusFormularios button{grid-template-columns:30px minmax(0,1fr)!important;min-height:64px!important;padding:11px 12px!important;font-size:.8rem!important}.menu-formularios #submenusFormularios .menu-icono-petro{width:26px;height:26px}.menu footer{display:grid!important;gap:17px!important;margin-top:auto!important;padding:28px 16px!important;border-top:1px solid #344266!important}.menu-perfil-petro,.menu-sesion-petro{display:grid!important;grid-template-columns:36px minmax(0,1fr)!important;align-items:center!important;gap:15px!important;min-height:60px!important;padding:13px 16px!important;color:#d2dcf0!important;border:1px solid transparent!important;border-radius:13px!important;background:transparent!important;font:inherit!important;font-size:.86rem!important;text-align:left!important;text-decoration:none!important;cursor:pointer!important}.menu-perfil-petro:hover,.menu-sesion-petro:hover{color:#fff!important;background:#354775!important}main{margin-left:var(--menu-ancho)!important}.vista-perfil-petro{padding:24px 32px 48px!important;background:#0b1123!important;min-height:calc(100vh - 82px)}.perfil-hero-petro{display:flex!important;align-items:center!important;gap:18px!important;margin:0 0 28px!important;padding:25px 34px!important;color:#fff!important;border:1px solid #48679a!important;border-radius:24px!important;background:#202f55!important}.perfil-icono-petro{display:grid;width:76px;height:76px;place-items:center;color:#fff;border-radius:22px;background:#65add0;font-size:42px}.perfil-hero-petro small{color:#bbcaed!important;font-size:11px!important;font-weight:900!important;letter-spacing:.09em}.perfil-hero-petro h2{margin:6px 0!important;color:#fff!important;font-size:32px!important}.perfil-hero-petro p{margin:0!important;color:#a9c4ef!important}.perfil-hero-petro button{margin-left:auto;padding:15px 26px;color:#fff;border:1px solid #6685b8;border-radius:13px;background:#293c68;font-weight:800;cursor:pointer}.perfil-paneles-petro{display:grid;grid-template-columns:1.2fr 1fr;gap:28px}.perfil-panel-petro{padding:28px;border:1px solid #49699d;border-radius:24px;background:#1d2d52}.perfil-panel-petro>header{display:flex!important;align-items:flex-start!important;gap:15px!important;padding:0 0 24px!important;background:none!important;border:0!important}.perfil-panel-petro>header>b{display:grid;width:48px;height:48px;place-items:center;color:#d7e7ff;border-radius:13px;background:#304a81}.perfil-panel-petro h3{margin:3px 0 6px;color:#fff;font-size:22px}.perfil-panel-petro p{margin:0;color:#bdd0ef;line-height:1.4}.perfil-campos-petro{display:grid;grid-template-columns:1fr 1fr;gap:20px}.perfil-campos-petro label{display:grid;gap:9px;color:#e3edff;font-size:12px;font-weight:900;text-transform:uppercase}.perfil-campos-petro label.ancho{grid-column:1/-1}.perfil-campos-petro input{min-height:58px;padding:13px 17px;color:#fff;border:1px solid #5b7db3;border-radius:13px;background:#142344;font:700 16px Arial}.perfil-campos-petro.una-columna{grid-template-columns:1fr}.guardar-perfil-petro,.modificar-clave-petro{width:100%;min-height:58px;margin-top:30px;color:#fff;border:0;border-radius:15px;background:linear-gradient(105deg,#579cca,#69bf7f);font:800 16px Arial;cursor:pointer}.modificar-clave-petro{background:#304a81}@media(max-width:980px){.perfil-paneles-petro{grid-template-columns:1fr}.menu{width:240px!important}.marca{min-height:180px}.marca img{width:106px!important;height:106px!important}main{margin-left:240px!important}}@media(max-width:760px){.menu{transform:translateX(-100%)}.menu-plegado .menu{transform:none}.menu-plegado main,main{margin-left:0!important}.vista-perfil-petro{padding:15px}.perfil-hero-petro{padding:18px!important}.perfil-hero-petro h2{font-size:25px!important}.perfil-hero-petro button{padding:11px}.perfil-panel-petro{padding:18px}.perfil-campos-petro{grid-template-columns:1fr}}</style>');
})();
