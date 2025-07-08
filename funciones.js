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

//cuenta regresiva



function timer () {
    switch($(".countdown").attr('id')) {
      case "cdEvent1":
        var targetDate = new Date("July 13 2025 21:45:00").getTime();
        break;
      case "cdEvent2":
        var targetDate = new Date("July 20 2025 22:30:00").getTime();
        break;
      case "cdEvent3":
        var targetDate = new Date("July 27 2025 21:25:00").getTime();
        break;
      default:
        console.log("oopsi");
    }

    const currentDate = new Date().getTime();
    const distance = targetDate - currentDate;

    const days = Math.floor(distance / 1000 / 60 / 60 / 24);
    const hours = Math.floor(distance / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(distance / 1000 / 60) % 60;
    const seconds = Math.floor(distance / 1000) % 60;

    $("#days").text(days);
    $("#hours").text(hours);
    $("#minutes").text(minutes);
    $("#seconds").text(seconds);

    if(distance < 0){
        $("#days").text("00");
        $("#hours").text("00");
        $("#minutes").text("00");
        $("#seconds").text("00");
    }

    setInterval(timer, 1000);
};


const usuario = localStorage.getItem("usuarioActivo");

function reservar() {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) {
    alert("Debes iniciar sesión para reservar.");
    return false;
  }

  const nombre = document.getElementById("nombres").value.trim();
  const apellido = document.getElementById("apellidos").value.trim();
  const correo = document.getElementById("email").value.trim();
  const fono = document.getElementById("fono").value.trim();

  if (!nombre || !apellido || !correo || !fono) {
    document.getElementById("alerta").classList.remove("d-none");
    return false;
  }

  const nombreEvento = document.getElementById("tituloEvento")?.innerText || "Evento desconocido";
  const fechaEvento = document.querySelector(".card-date")?.innerText.replace("Fecha: ", "") || "Fecha desconocida";
  const eventoActual = `${nombreEvento} – ${fechaEvento}`;

  const reserva = {
    evento: eventoActual,
    nombre,
    apellido,
    correo,
    fono
  };

  // ✅ Diagnóstico visual en consola
  console.log("Usuario activo:", usuario);
  console.log("Reserva a guardar:", reserva);
  console.log("Guardando en clave:", "reservas_" + usuario);

  const clave = "reservas_" + usuario;
  const reservasUsuario = JSON.parse(localStorage.getItem(clave)) || [];
  reservasUsuario.push(reserva);
  localStorage.setItem(clave, JSON.stringify(reservasUsuario));

  alert("Reserva guardada correctamente.");
  document.getElementById("formulario").reset();
  document.getElementById("alerta").classList.add("d-none");
  return true;
}

const song = document.getElementById("song");
song.volume = 0.15;
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

    // Verifica si la ruta es de reservas y llama a la función
    if (ruta.includes("reservas.html")) {
      mostrarReservas();
    }
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
  timer();
  song.play();
});


//comentarios local storage

// variables globales para paginación en popup
let paginaActual = 1;
let comentariosPorPagina = 5;
let comentariosTemporales = [];
let popupIdActivo = null;

// mostrar ventana emergente de comentarios
function mostrarPopupComentarios(id) {
  popupIdActivo = id;
  comentariosTemporales = JSON.parse(localStorage.getItem(`comentarios-${id}`)) || [];
  paginaActual = 1;
  renderizarPopupComentarios();
}

// renderizar contenido en el popup con paginación
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

//cambiar página en el popup
function cambiarPagina(direccion) {
  paginaActual += direccion;
  renderizarPopupComentarios();
}

// guardar comentario desde popup
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

// Cerrar ventana de comentarios
function cerrarPopup() {
  document.getElementById("popupComentarios").style.display = "none";
  cargarTodosLosComentarios(); 
}

function cargarTodosLosComentarios() {
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

  // actualiza el contador visual
  const contadorSpan = document.getElementById(`vote${id}`);
  if (contadorSpan) contadorSpan.innerText = total;

  // actualiza la clase visual del botón
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

  // validacion si ya existe usuario
  if (localStorage.getItem("usuario") === user) {
    alert("Ese usuario ya está registrado.");
    return; 
  }

  // si no existe lo regista¿ra
  localStorage.setItem("usuario", user);
  localStorage.setItem("clave", pass);
  alert("Usuario registrado correctamente");

}

function login(event) {
  event.preventDefault();

  const user = document.getElementById("login-user").value;
  const pass = document.getElementById("login-pass").value;
  const storedUser = localStorage.getItem("usuario");
  const storedPass = localStorage.getItem("clave");

  if (user === storedUser && pass === storedPass) {
    alert("¡Bienvenido, " + user + "!");
    localStorage.setItem("usuarioActivo", user); //guarda el usuario activo
    cargarCont("vistas/inicio.html");


    setTimeout(actualizarNavbar, 500); 
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function actualizarNavbar() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const userInfo = document.getElementById("user-info");

  const btnSignin = document.getElementById("btn-signin");
  const btnSignup = document.getElementById("btn-signup");

  // ⬇️ Botón de reservas dinámico
  let reservasBtn = document.getElementById("btn-reservas");

  if (usuarioActivo) {
    if (userInfo) {
      userInfo.innerHTML = `
        🕺 ${usuarioActivo}
        <button class="btn btn-sm btn-outline-light ms-2" onclick="logout()">Cerrar Sesión</button>
      `;
    }

    if (btnSignin) btnSignin.style.display = "none";
    if (btnSignup) btnSignup.style.display = "none";

    // Si no existe ya, lo crea
    if (!reservasBtn) {
      const navList = document.querySelector(".navbar-nav");
      const newItem = document.createElement("li");
      newItem.className = "nav-item";
      newItem.id = "btn-reservas";
      newItem.innerHTML = `<a class="nav-link" onclick="mostrarPopupHistorialReservas()">Mis reservas</a>`;
      navList.appendChild(newItem);
    }

  } else {
    if (userInfo) userInfo.innerHTML = "";
    if (btnSignin) btnSignin.style.display = "block";
    if (btnSignup) btnSignup.style.display = "block";

    // Ocultar botón si no hay sesión
    if (reservasBtn) reservasBtn.remove();
  }
}

function verificarAcceso(callback) {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    alert("Debes iniciar sesión para usar esta función.");
    return;
  }
  if (typeof callback === "function") callback();
}

function logout() {
  localStorage.removeItem("usuarioActivo");
  document.getElementById("user-info").innerHTML = "";
  cargarCont("vistas/inicio.html");
  
  setTimeout(actualizarNavbar, 300); 
  alert("Has cerrado sesión.");
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);



// RESERVAS

function guardarReserva(reserva) {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) return;

  // Obtener reservas existentes del usuario
  let reservas = JSON.parse(localStorage.getItem("reservas_" + usuario)) || [];

  // Agregar nueva reserva
  reservas.push(reserva);

  // Guardar actualizadas
  localStorage.setItem("reservas_" + usuario, JSON.stringify(reservas));
  alert("¡Reserva guardada correctamente!");
}

let paginaReserva = 1;
const reservasPorPagina = 5;

function mostrarPopupHistorialReservas() {
  verificarAcceso(() => {
    const usuario = localStorage.getItem("usuarioActivo");
    const reservas = JSON.parse(localStorage.getItem("reservas_" + usuario)) || [];

    const lista = document.getElementById("listaHistorialReservas");
    const nav = document.getElementById("navegacionReservas");

    if (!lista || !nav) return;

    lista.innerHTML = "";
    nav.innerHTML = "";

    const totalPaginas = Math.ceil(reservas.length / reservasPorPagina);
    const inicio = (paginaReserva - 1) * reservasPorPagina;
    const fin = inicio + reservasPorPagina;
    const reservasPagina = reservas.slice(inicio, fin);

    if (reservasPagina.length === 0) {
      const li = document.createElement("li");
      li.className = "list-group-item text-muted";
      li.textContent = "No tienes reservas registradas.";
      lista.appendChild(li);
    } else {
      reservasPagina.forEach((r, i) => {
        const li = document.createElement("li");
        li.className = "list-group-item bg-dark text-light";
        li.innerHTML = `
          <strong>#${inicio + i + 1}</strong> – ${r.evento}<br>
          👤 ${r.nombre} ${r.apellido}<br>
          📧 ${r.correo} | 📞 ${r.fono}
        `;
        lista.appendChild(li);
      });
    }

    // Navegación
    const btnAnterior = document.createElement("button");
    btnAnterior.className = "btn btn-sm btn-secondary";
    btnAnterior.textContent = "⬅ Anterior";
    btnAnterior.disabled = paginaReserva === 1;
    btnAnterior.onclick = () => {
      paginaReserva--;
      mostrarPopupHistorialReservas();
    };

    const btnSiguiente = document.createElement("button");
    btnSiguiente.className = "btn btn-sm btn-secondary";
    btnSiguiente.textContent = "Siguiente ➡";
    btnSiguiente.disabled = paginaReserva === totalPaginas || totalPaginas === 0;
    btnSiguiente.onclick = () => {
      paginaReserva++;
      mostrarPopupHistorialReservas();
    };

    const texto = document.createElement("span");
    texto.className = "text-light";
    texto.textContent = `Página ${paginaReserva} de ${totalPaginas}`;

    nav.appendChild(btnAnterior);
    nav.appendChild(texto);
    nav.appendChild(btnSiguiente);

    document.getElementById("popupHistorialReservas").style.display = "flex";
  });
}

function cerrarPopupHistorialReservas() {
  paginaReserva = 1; // Reinicia al cerrar
  document.getElementById("popupHistorialReservas").style.display = "none";
}

