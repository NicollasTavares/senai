const usuarios = [
    {
        login: 'adm',
        pass: 'adm'
    },

    {
        login: 'paciente',
        pass: 'paciente'
    },

    {
        login: 'medico',
        pass: 'medico'
    }
]

let botao = document.getElementById('btnLogar')

botao.addEventListener('click', function logar(){

    let pegaUsuario = document.getElementById('usuario').value
    let pegaSenha = document.getElementById('senha').value
    let validalogin = false

    for(let i in usuarios){

        if(pegaUsuario == usuarios[i].login && pegaSenha == usuarios[i].pass){
            validalogin = true
            break
        }else{
            validalogin = false
            break
        }

    }

    if(validalogin == true){
        location.href = 'home.html'
    }else{
        alert('Usuario e senha incorretos')
    }

})