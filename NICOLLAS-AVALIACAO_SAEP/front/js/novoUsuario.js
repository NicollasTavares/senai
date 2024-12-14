$(document).ready(function () {
    $(document).off('submit', '#formUsuario');
    $(document).on('submit', '#formUsuario', async function (event) {
        event.preventDefault();
        const form = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value
        }
        console.log(localStorage.getItem('ipApi'));


        axios.post(`${localStorage.getItem('ipApi')}novoUsuario`, form)
            .then(response => {
                console.log(response);

                alert('Usuario cadastrado com sucesso');
            }).catch(error => {
                console.log(error);

                alert('Ocorreu um erro');
            })
    })
})