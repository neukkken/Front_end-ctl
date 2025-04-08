import { Contratista } from '../../types/contratista.ts'
import axios from '../axios.ts'

export const ContratistaService = {
    async getAll(): Promise<Contratista[]> {
        const { data } = await axios.get('/ctl/contratistas');
        return data.data;
    },

    async create( contratista: Contratista ): Promise<Contratista[]> {
        const { data } = await axios.post('/ctl/contratistas', contratista);
        return data.data;
    },

    async update( contratista: Contratista ): Promise<Contratista[]> {
        const { data } = await axios.put(`/ctl/contratistas/edit/${contratista._id}`, contratista);
        return data.data;
    },

    async delete( _id: string ): Promise<Contratista[]> {
        const { data } = await axios.delete(`/ctl/contratistas/${_id}`);
        return data.data;
    }
}