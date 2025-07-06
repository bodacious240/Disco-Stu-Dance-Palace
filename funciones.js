// Reacciones de votación (modo estático por ahora)
document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = btn.querySelector('span');
        let count = parseInt(span.innerText);
        span.innerText = ++count;
});
});

// filtros de la galeria
$(document).on('change', '#filter', function() {
  switch ($('#filter').val()) {
    case "all":
      $('.gal').show();
      break;
    case "out":
      $('.ext').show();
      $('.int').hide();
      break;
    case "in":
      $('.ext').hide();
      $('.int').show();
      break;
    case "dance":
      $('.bail').show();
      $('.gal:not(.bail)').hide();
      break;
  }
});


const song = document.getElementById("song");
let isMuted = false;

window.addEventListener('click', () => {
  song.play();
});

// Función para mutear/desmutear
function toggleMute() {
  isMuted = !isMuted;
  song.muted = isMuted;
}

// Función para regular el volumen
function setVolume(volumen) {
  song.volume = volumen;
}

// esta es la función que llaman los botones del navbar en el index.html
function cargarCont(ruta) {
  $('#contenido').load(ruta, () => {
    cargarTodosLosComentarios();
    cargarVotosMeEncanto();
    cargarVotosMeEncanto();
  });
}

$(document).on('click', '.btn-meEncanto', function () {
  const id = $(this).data('id');
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    alert("Debes iniciar sesión para reaccionar.");
    return;
  }
  toggleMeEncanto(id);
});

$(document).on('click', '.btn-comentarios', function () {
  const id = $(this).data('id');
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    alert("Debes iniciar sesión para comentar.");
    return;
  }
  mostrarPopupComentarios(id);
});

// todo este codigo corre al abrir la pagina
$(document).ready(function(){
  cargarCont("vistas/inicio.html");
});


//comentarios local storage

// 🔁 Variables globales para paginación en popup
let paginaActual = 1;
let comentariosPorPagina = 5;
let comentariosTemporales = [];
let popupIdActivo = null;

// 👤 Mostrar ventana emergente de comentarios
function mostrarPopupComentarios(id) {
  popupIdActivo = id;
  comentariosTemporales = JSON.parse(localStorage.getItem(`comentarios-${id}`)) || [];
  paginaActual = 1;
  renderizarPopupComentarios();
}

// 🪟 Renderizar contenido en el popup con paginación
function renderizarPopupComentarios() {
  const inicio = (paginaActual - 1) * comentariosPorPagina;
  const fin = inicio + comentariosPorPagina;
  const comentariosPagina = comentariosTemporales.slice(inicio, fin);

  const listaComentarios = comentariosPagina.map(com => `
    <div class="border rounded p-2 mb-2 bg-light text-dark">${com}</div>
  `).join("");

  const totalPaginas = Math.ceil(comentariosTemporales.length / comentariosPorPagina);
  const botones = `
    <div class="d-flex justify-content-between align-items-center mt-3">
      <button class="btn btn-sm btn-secondary" ${paginaActual === 1 ? 'disabled' : ''} onclick="cambiarPagina(-1)">⬅ Anterior</button>
      <span class="text-light">Página ${paginaActual} de ${totalPaginas}</span>
      <button class="btn btn-sm btn-secondary" ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(1)">Siguiente ➡</button>
    </div>
  `;

  const contenido = `
    <textarea class="form-control mb-2" id="popupInput-${popupIdActivo}" rows="2" placeholder="Escribe tu comentario..."></textarea>
    <button class="btn btn-sm btn-primary" onclick="guardarComentarioPopup(${popupIdActivo})">Publicar</button>
    <div class="mt-3">${listaComentarios}</div>
    ${botones}
  `;

  document.getElementById("popupContenido").innerHTML = contenido;
  document.getElementById("popupComentarios").style.display = "flex";
}

// 🔄 Cambiar página en el popup
function cambiarPagina(direccion) {
  paginaActual += direccion;
  renderizarPopupComentarios();
}

// 📝 Guardar comentario desde popup
function guardarComentarioPopup(id) {
  const textarea = document.getElementById(`popupInput-${id}`);
  const comentario = textarea.value.trim();
  if (!comentario) return;

  const usuarioActivo = localStorage.getItem("usuarioActivo") || "Invitado";
  const comentarioConUsuario = `<span class="usuario-etiqueta">@${usuarioActivo}</span>: ${comentario}`;

  const clave = `comentarios-${id}`;
  const comentarios = JSON.parse(localStorage.getItem(clave)) || [];
  comentarios.push(comentarioConUsuario);
  localStorage.setItem(clave, JSON.stringify(comentarios));

  comentariosTemporales = comentarios;
  textarea.value = "";
  renderizarPopupComentarios();
  cargarTodosLosComentarios();
}
function cargarVotosMeEncanto() {
  for (let id = 1; id <= 3; id++) {
    const total = parseInt(localStorage.getItem(`meEncantoTotal-${id}`)) || 0;
    const contadorSpan = document.getElementById(`vote${id}`);
    if (contadorSpan) {
      contadorSpan.innerText = total;
    }

    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const yaVoto = localStorage.getItem(`meEncanto-${usuarioActivo}-${id}`) === "true";
    const btn = document.querySelector(`.btn-meEncanto[data-id="${id}"]`);
    if (btn && usuarioActivo) {
      btn.classList.toggle("btn-activo", yaVoto);
    }
  }
}

// ❌ Cerrar ventana de comentarios
function cerrarPopup() {
  document.getElementById("popupComentarios").style.display = "none";
  cargarTodosLosComentarios(); // 👈 AÑADE ESTO TAMBIÉN
}

function cargarTodosLosComentarios() {
  // Itera por cada tarjeta (asumiendo 3 por ahora, puedes ajustarlo dinámicamente)
  for (let id = 1; id <= 3; id++) {
    const comentarios = JSON.parse(localStorage.getItem(`comentarios-${id}`)) || [];
    const contadorSpan = document.getElementById(`contador-${id}`);
    if (contadorSpan) {
      contadorSpan.innerText = comentarios.length;
    }
  }
}

// me encanta botones

function toggleMeEncanto(id) {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    alert("Debes iniciar sesión para reaccionar.");
    return;
  }

  const claveUsuario = `meEncanto-${usuarioActivo}-${id}`;
  const claveTotal = `meEncantoTotal-${id}`;
  const yaVoto = localStorage.getItem(claveUsuario) === "true";

  let total = parseInt(localStorage.getItem(claveTotal)) || 0;

  if (yaVoto) {
    localStorage.setItem(claveUsuario, "false");
    total = Math.max(0, total - 1);
  } else {
    localStorage.setItem(claveUsuario, "true");
    total += 1;
  }

  localStorage.setItem(claveTotal, total.toString());

  // 🟡 Actualiza el contador visual
  const contadorSpan = document.getElementById(`vote${id}`);
  if (contadorSpan) contadorSpan.innerText = total;

  // 🟡 Actualiza la clase visual del botón
  const btn = document.querySelector(`.btn-meEncanto[data-id="${id}"]`);
  if (btn) {
    btn.classList.toggle("btn-activo", !yaVoto);
  }
}

function actualizarReacciones() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) return;

  for (let id = 1; id <= 3; id++) {
    const clave = `meEncanto-${usuarioActivo}-${id}`;
    const voto = localStorage.getItem(clave) === "true";
    const contadorSpan = document.getElementById(`vote${id}`);
    let actual = parseInt(contadorSpan.innerText);
    contadorSpan.innerText = voto ? actual : actual; // puedes usar un sistema más avanzado para sumar votos globales
  }
}





//   registro y login 

function register(event) {
  event.preventDefault();

  const user = document.getElementById("register-user").value;
  const pass = document.getElementById("register-pass").value;

  // 🛑 Validación: ¿el usuario ya existe?
  if (localStorage.getItem("usuario") === user) {
    alert("Ese usuario ya está registrado.");
    return; // Salimos de la función
  }

  // ✅ Si no existe, lo registramos
  localStorage.setItem("usuario", user);
  localStorage.setItem("clave", pass);
  alert("Usuario registrado correctamente");

  // Puedes redirigir al login si quieres:
  // cargarCont('vistas/login.html');
}

function login(event) {
  event.preventDefault();

  const user = document.getElementById("login-user").value;
  const pass = document.getElementById("login-pass").value;
  const storedUser = localStorage.getItem("usuario");
  const storedPass = localStorage.getItem("clave");

  if (user === storedUser && pass === storedPass) {
    alert("¡Bienvenido, " + user + "!");
    localStorage.setItem("usuarioActivo", user); // 🆕 Guarda el usuario activo
    cargarCont("vistas/inicio.html");

    // Opcional: Espera breve antes de actualizar navbar si cargarCont reemplaza contenido
    setTimeout(actualizarNavbar, 500); 
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function actualizarNavbar() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const userInfo = document.getElementById("user-info");

  // Mostrar o ocultar los botones de login/registro
  const btnSignin = document.getElementById("btn-signin");
  const btnSignup = document.getElementById("btn-signup");

  if (usuarioActivo) {
    if (userInfo) {
      userInfo.innerHTML = `
        🕺 ${usuarioActivo}
        <button class="btn btn-sm btn-outline-light ms-2" onclick="logout()">Cerrar Sesión</button>
      `;
    }

    if (btnSignin) btnSignin.style.display = "none";
    if (btnSignup) btnSignup.style.display = "none";

  } else {
    if (userInfo) userInfo.innerHTML = "";
    if (btnSignin) btnSignin.style.display = "block";
    if (btnSignup) btnSignup.style.display = "block";
  }
}

function verificarAcceso(callback) {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    alert("Debes iniciar sesión para usar esta función.");
    // Si tienes una vista login podrías redirigir aquí:
    // cargarCont("vistas/login.html");
    return;
  }
  if (typeof callback === "function") callback();
}

function logout() {
  localStorage.removeItem("usuarioActivo");
  document.getElementById("user-info").innerHTML = "";
  cargarCont("vistas/inicio.html");
  
  // 🔁 Asegura que se actualice el navbar después de recargar
  setTimeout(actualizarNavbar, 300); // puedes ajustar el tiempo si lo necesitas
  alert("Has cerrado sesión.");
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);
