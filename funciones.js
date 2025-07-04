// Reacciones de votación (modo estático por ahora)
document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = btn.querySelector('span');
        let count = parseInt(span.innerText);
        span.innerText = ++count;
});
});

showFilter = false;


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
function cargarCont(e) {
  $('#contenido').load(e);
};

function toggleFilter() {
  showFilter = !showFilter;
  if (showFilter) {
    $('.filt').show();
  } else {
    $('.filt').hide();
  }
  
}

// todo este codigo corre al abrir la pagina
$(document).ready(function(){
  cargarCont("vistas/inicio.html");
});


//comentarios local storage

// Mostrar u ocultar los comentarios de una tarjeta
function toggleComentarios(id) {
  const zona = document.getElementById(`zonaComentarios-${id}`);
  const visible = zona.style.display === "block";
  zona.style.display = visible ? "none" : "block";
}

// Guardar comentario y actualizar contador y vista
function guardarComentario(id) {
  const textarea = document.getElementById(`comentarioInput-${id}`);
  const comentario = textarea.value.trim();
  if (comentario === "") return;

  const clave = `comentarios-${id}`;
  const comentarios = JSON.parse(localStorage.getItem(clave)) || [];

  comentarios.push(comentario);
  localStorage.setItem(clave, JSON.stringify(comentarios));

  textarea.value = "";
  cargarComentarios(id);
}

// Cargar comentarios desde localStorage y actualizar contador
function cargarComentarios(id) {
  const contenedor = document.getElementById(`comentariosGuardados-${id}`);
  const comentarios = JSON.parse(localStorage.getItem(`comentarios-${id}`)) || [];

  contenedor.innerHTML = comentarios.map(coment => `
    <div class="border rounded p-2 mb-2 bg-light">
      ${coment}
    </div>
  `).join("");

  const contador = document.getElementById(`contador-${id}`);
  if (contador) contador.textContent = comentarios.length;
}

// Cargar todos los comentarios al iniciar la página
window.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll("[id^='comentarioInput-']");
  tarjetas.forEach(textarea => {
    const id = textarea.id.split("-")[1];
    cargarComentarios(id);
  });
});