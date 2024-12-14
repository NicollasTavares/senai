import connection from '../config/db.js';

class Tarefa {
    constructor(pTarefa) {
        this.id_usuario = pTarefa.id_usuario;
        this.descricao = pTarefa.descricao;
        this.setor = pTarefa.setor;
        this.prioridade = pTarefa.prioridade;
        this.status = pTarefa.status;

    }

    async insertTarefa() {
        try {
            console.log("oooi");
            console.log("jjjjjjjj",this.id_usuario, this.descricao, this.setor, this.prioridade, this.status);
            const conn = await connection();
            const pSql = `INSERT INTO TAREFA (ID_USUARIO, DESCRICAO, SETOR, PRIORIDADE, STATUS) VALUES (?,?,?,?,?);`;
            const pValues = [this.id_usuario, this.descricao, this.setor, this.prioridade, this.status];
            const [result] = await conn.query(pSql, pValues);
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async listarUsuarios() {
        try {
            const conn = await connection();
            const [rows] = await conn.query('SELECT id_usuario, nome FROM USUARIO');
            console.log(rows);

            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async listarTarefas() {
        try {
            const conn = await connection();
            const [rows] = await conn.query(`SELECT T.id_tarefa, T.id_usuario, T.descricao,
                 T.setor, T.prioridade, T.data_cadastro, T.status, U.nome
                 FROM TAREFA t
                 INNER JOIN USUARIO U
                 ON T.id_usuario =U.id_usuario;`);
            console.log(rows);

            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async atualizarStatus(id, status) {
        try {
            const conn = await connection();
            const pSql = `UPDATE TAREFA SET status=? WHERE id_tarefa=?`;
            const pValues = [status, id];
            const [result] = await conn.query(pSql, pValues)

            console.log(rows);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteTarefa(id) {
        try {
            const conn = await connection();
            const pSql = `DELETE FROM TAREFA WHERE id_tarefa=?`;
            const pValues = [id];
            const [result] = await conn.query(pSql, pValues)
            console.log(rows);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async listarTarefa(id) {
        try {
            const conn = await connection();
            const [rows] = await conn.query(`SELECT T.id_tarefa, T.id_usuario,
                 T.descricao, T.setor, T.prioridade, T.data_cadastro, T.status, U.nome
                 FROM TAREFA t
                 INNER JOIN USUARIO U
                 ON T.id_usuario =U.id_usuario WHERE ID_TAREFA=?;`, [id]);
            console.log(rows);

            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async atualizarTarefa(id_tarefa) {
        try {
            const conn = await connection();
            const pSql = `UPDATE TAREFA SET id_usuario=?, descricao=?, setor=?, prioridade=?
            WHERE id_tarefa=?;`;
            const pValues = [this.id_usuario, this.descricao, this.setor, this.prioridade, id_tarefa];
            const [result] = await conn.query(pSql, pValues);
            console.log(result);

            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}



export default Tarefa;