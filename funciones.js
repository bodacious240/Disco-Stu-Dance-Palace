// Reacciones de votación (modo estático por ahora)
document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = btn.querySelector('span');
        let count = parseInt(span.innerText);
        span.innerText = ++count;
});
});

window.addEventListener('click',()=>{
    document.getElementById("song").play()
})

// esta es la función que llaman los botones del navbar en el index.html
function cargarCont(e) {
  $('#contenido').load(e);
};

// todo este codigo corre al abrir la pagina
$(document).ready(function(){
  cargarCont("vistas/inicio.html");
});


//comentarios local storage

// Cargar comentarios existentes al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  cargarComentarios(1); // Repite con ID 2, 3, etc. si tienes más tarjetas
});

function guardarComentario(id) {
  const textarea = document.getElementById(`comentarioInput-${id}`);
  const comentario = textarea.value.trim();
  if (comentario === "") return;

  // Obtener comentarios previos
  const clave = `comentarios-${id}`;
  const comentarios = JSON.parse(localStorage.getItem(clave)) || [];

  // Agregar nuevo comentario
  comentarios.push(comentario);
  localStorage.setItem(clave, JSON.stringify(comentarios));

  textarea.value = ""; // Limpiar textarea
  cargarComentarios(id); // Recargar comentarios
}

function cargarComentarios(id) {
  const contenedor = document.getElementById(`comentariosGuardados-${id}`);
  const comentarios = JSON.parse(localStorage.getItem(`comentarios-${id}`)) || [];

  contenedor.innerHTML = comentarios.map(c => `
    <div class="border rounded p-2 mb-2 bg-light">
      ${c}
    </div>
  `).join("");
}