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