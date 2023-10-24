const inputContrasenia = document.querySelector("#constrasenia");
const inputUsuario = document.querySelector("#usuario");
const body = document.querySelector("body")


function ingresar() {
    console.log(inputContrasenia.value);
       if (localStorage.getItem(inputUsuario.value, JSON.stringify(inputContrasenia.value))) {
          // Abrir otro archivo HTML en la misma pestaña
          window.location.href = 'memoria.html';
      
        } else {
          body.innerHTML=`<h1>SU USUARIO NO REGISTRADOS</h1>`;
        }
      
}


