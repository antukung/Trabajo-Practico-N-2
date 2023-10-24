const inputContraseniaRegistro = document.querySelector("#constrasenia-registro");
const inputUsuarioRegistro = document.querySelector("#usuario-registro");




function registrarse() {
    console.log(inputContraseniaRegistro.value)
    console.log(typeof(inputUsuarioRegistro.value))
    if (inputContraseniaRegistro.value != null && inputUsuarioRegistro.value != null ) {
        localStorage.setItem(inputUsuarioRegistro.value, JSON.stringify(inputContraseniaRegistro.value));
        //window.location.href = 'index.html';
        console.log("validado");
    }
}
