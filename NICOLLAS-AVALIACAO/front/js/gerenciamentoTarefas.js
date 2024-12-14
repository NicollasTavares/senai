$(document).ready(async function () {

    const board = {
        "A Fazer": document.querySelector("#a-fazer"),
        "Fazendo": document.querySelector("#fazendo"),
        "Pronto": document.querySelector("#pronto")
    }

    const statusMap = {
        "a Fazer": "A Fazer",
        "fazendo": "Fazendo",
        "pronto": "Pronto"
    }

    async function buscarTarefas() {

        Object.values(board).forEach(column => {
            const card = column.querySelectorAll('.card');
            card.forEach(card => card.remove());
        })
        try {
            const response = await axios.get(`${localStorage.getItem('ipApi')}listarTarefas`)
            const tasks = response.data.tarefas;

            tasks.forEach((tarefa => {
                const mappedStatus = statusMap[tarefa.status?.toLowerCase()]
                const column = board[mappedStatus];

                if (column) {
                    const card = document.createElement("div");
                    card.className = 'card';
                    card.innerHTML = `
                    <h3>Descrição: ${tarefa.descricao}</h3>
                    <p>Setor: ${tarefa.setor}</p>
                    <p>Prioridade: ${tarefa.prioridade}</p>
                    <p>Vinculado a: ${tarefa.nome}</p>
                    <div class="card-actions">

                        <button 
                        class="btn-edit" 
                        onclick="carregarPagina('novaTarefa')" 
                        href="#"
                        data-id="${tarefa.id_tarefa}">
                        Editar
                        </button>

                        <button 
                        class="btn-delete" 
                        href="#"
                        data-id="${tarefa.id_tarefa}">
                        Delete
                        </button>

                    </div>
                    <div class="card-status">
                        <select class="status-dropdown" data-id="${tarefa.id_tarefa}">
                            <option value="A Fazer" ${mappedStatus === "A Fazer" ? "selected" : ""}>A Fazer</option>
                            <option value="Em Desenvolvimento" ${mappedStatus === "Em Desenvolvimento" ? "selected" : ""}>Em Desenvolvimento</option>
                            <option value="Finalizado" ${mappedStatus === "Finalizado" ? "selected" : ""}>Finalizado</option>
                        </select>
                        <button class="btn-save-status" data-id="${tarefa.id_tarefa}">Salvar</button>
                    </div>
                    `;
                    column.appendChild(card);
                } else {
                    console.warn("Status desconhecido ou coluna não encontrada", tarefa.status);
                }
            }))

        } catch (error) {
            console.log("Erro ao buscar terefas", error);
        }
    }

    await buscarTarefas();

    $(document).off('click', '.btn-salvar');
    $(document).on('click', '.btn-salvar', async function () {
        const taskId = $(this).data('id');
       
        const status = $(`.status-dropdown[data-id='${taskId}']`).val();

        try {
            await axios.put(`${localStorage.getItem('ipApi')}atualizarStatus/${taskId}`, { status: status });
            await buscarTarefas();
        } catch (error) {

        }

    })

})