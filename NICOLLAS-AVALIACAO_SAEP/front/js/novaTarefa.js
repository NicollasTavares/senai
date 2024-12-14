$(document).ready(function () {
    axios
      .get(`${localStorage.getItem("ipApi")}listarUsuarios`)
      .then((response) => {
        console.log(response.data);
  
        const userSelect = $("#nomeUser");
  
        userSelect.empty();
        userSelect.append('<option value="">Selecione um usuario</option>');
  
        const users = response.data.users;
        users.forEach((user) => {
          userSelect.append(
            `<option value="${user.id_usuario}">${user.nome}</option>`
          );
        });
        carregarDadosTarefa();
  
        
      })
      .catch((error) => {
        console.log(error);
  
      });
  
    const taskId = sessionStorage.getItem("taskId");
    console.log("Editar Tarefa:", taskId);

    function carregarDadosTarefa() {
      if (taskId) {
        axios.get(`${localStorage.getItem("ipApi")}listarTarefa/${taskId}`)
          .then((response) => {
            const tarefa = response.data.tarefa[0];
            document.getElementById("descricao").value = tarefa.descricao;
            document.getElementById("equipe").value = tarefa.equipe;
  
            const nomeUserSelect = document.getElementById("nomeUser");
            nomeUserSelect.value = tarefa.id_usuario;
  
            const prioridadeSelect = document.getElementById("prioridade");
            prioridadeSelect.value = tarefa.prioridade;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  
    $(document).off("submit", "#formNovaTarefa");
    $(document).on("submit", "#formNovaTarefa", async function (event) {
      event.preventDefault();
  
      console.log(localStorage.getItem("ipApi"));
  
      const formData = {
        id_usuario: document.getElementById("nomeUser").value,
        descricao: document.getElementById("descricao").value,
        equipe: document.getElementById("equipe").value,
        prioridade: document.getElementById("prioridade").value,
      };
  
      if (!taskId) {
        axios.post(`${localStorage.getItem("ipApi")}novaTarefa`, formData)
          .then((response) => {
            console.log(response.data);
            alert("Tarefa cadastrada com sucesso!");
          })
          .catch((error) => {
            console.log(error);
            alert("Ocorreu um erro ao cadastrar a tarefa.");
          });
      } else {
        axios.put(`${localStorage.getItem("ipApi")}atualizarTarefa/${taskId}`,formData)
          .then((response) => {
            console.log(response.data);
            alert("Tarefa cadastrada com sucesso!");
          })
          .catch((error) => {
            console.log(error);
            alert("Ocorreu um erro ao alterar a tarefa.");
          });
          sessionStorage.removeItem("taskId");
      }
    });
  });