import { Especie } from '../../types/especies.ts';
import axios from '../axios.ts';

export const EspeciesService = {
    async getAll(): Promise<Especie[]> {
        const { data } = await axios.get('/ctl/especies');
        return data.data;
    },

    async create(especie: Especie): Promise<Especie[]> {
        const { data } = await axios.post('/ctl/especies', especie);
        return data.data;
    },

    async update(especie: Especie): Promise<Especie[]> {
        const { data } = await axios.put(`/ctl/especies/edit/${especie._id}`, especie);
        return data.data;
    },

    async delete(_id: string): Promise<Especie[]> {
        const { data } = await axios.delete(`/ctl/especies/${_id}`);
        return data.data;
    }
}