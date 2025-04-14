import { Turno } from "../../types/turno";
import axios from '../axios.ts';

export const TurnosService = {
    async getAll(): Promise<Turno[]> {
        const { data } = await axios.get('/ctl/turnos');
        return data.data;
    },

    async create(turno: Turno): Promise<Turno[]> {
        const { data } = await axios.post('/ctl/turnos', turno);
        return data.data;
    },

    async update(turno: Turno): Promise<Turno[]> {
        const { data } = await axios.put(`/ctl/turnos/edit/${turno._id}`, turno)
        return data.data;
    },

    async delete(_id: string): Promise<Turno[]> {
        const { data } = await axios.delete(`/ctl/turnos/${_id}`);
        return data.data;
    }
}