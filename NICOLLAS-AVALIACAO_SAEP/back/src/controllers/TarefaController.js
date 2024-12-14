import Tarefa from '../models/TarefaModel.js';

export const TarefaController = {
    novaTarefa: async (req, res) => {
        try {
            const { id_usuario, descricao, setor, prioridade } = req.body;
            const status= "NÃO INICIADO"
            const tarefa = new Tarefa({ id_usuario, descricao, setor, prioridade, status })
            const result = await tarefa.insertTarefa()
            console.log(result);
            
            res.json({ result });
        } catch (error) {
            res.json({ message: error })
        }
    },

    listarUsuarios: async (req, res) => {
        try {
            
            const users = await Usuario.listarUsuarios();
            console.log(users);
            
            res.json({ users });
        } catch (error) {
            res.json({ message: error })
        }
    },

    listarTarefas: async (req, res) => {
        try {
            console.log("oiytfytfdyfdyrd");
            const tarefas = await Tarefa.listarTarefas()
            console.log("yyyyyyyy",tarefas);
            
            res.json({ tarefas });
        } catch (error) {
            res.json({ message: error })
        }
    },

    atualizarStatus: async (req, res) => {
        try {
          const {id} = req.params;
          const {status} = req.body;
          const newStatus = status.toUpperCase();
          const tarefas = await Tarefa.atualizarStatus(id, newStatus);
          res.json({ tarefas });
        } catch (error) {
          res.json({ message: error });
        }
    },

    deleteTarefa: async (req, res) => {
        try {
          const {id} = req.params;
          const result = await Tarefa.deleteTarefa(id);
          res.json({ result });
        } catch (error) {
            console.log(error);
          res.json({ message: error });
        }
    },

    listarTarefa: async (req, res) => {
        try {
            const {id}=req.params;
            console.log("oowejwed",id);
            const tarefa = await Tarefa.listarTarefa(id);

            
            res.json({ tarefa });
        } catch (error) {
            res.json({ message: error })
        }
    },

   atualizarTarefa: async (req, res) => {
        try {
            const {id} = req.params;
            const { id_usuario, descricao, setor, prioridade } = req.body;
            console.log(req.body);
            const tarefa = new Tarefa({ id_usuario, descricao, setor, prioridade})
            console.log("46546464",id);

            const result = await tarefa.atualizarTarefa(id);
            console.log(result);
            
            res.json({ result });
        } catch (error) {
            res.json({ message: error })
        }
    }
    
} 