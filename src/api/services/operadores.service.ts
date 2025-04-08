import { Operador } from '../../types/operador.ts'
import axios from '../axios.ts'

export const OperadorService = {
    async getAll(): Promise<Operador[]> {
        const { data } = await axios.get('/ctl/operadores');
        return data.data;
    },

    async create(operador: Operador): Promise<Operador[]> {
        const { data } = await axios.post('/ctl/operadores', operador);
        return data.data
    },

    async update(operador: Operador): Promise<Operador[]> {
        const { data } = await axios.put(`/ctl/operadores/edit/${operador._id}`, operador);
        return data.data
    },

    async delete(_id: string): Promise<Operador[]> {
        const { data } = await axios.delete(`/ctl/operadores/${_id}`);
        return data.data;
    }
}