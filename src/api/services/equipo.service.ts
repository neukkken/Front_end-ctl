import { Equipo } from "../../types/equipo";
import axios from '../axios.ts'

export const EquipoService = {
    async getAll(): Promise<Equipo[]>{
        const { data } = await axios.get('/ctl/equipos');
        return data.data;
    },
    
    async create (equipo: Equipo): Promise<Equipo[]>{
        const { data } = await axios.post(`/ctl/equipos`, equipo);
        return data.data;
    },

    async update (equipo: Equipo): Promise<Equipo[]>{
        const { data } = await axios.put(`/ctl/equipos/edit/${equipo._id}`, equipo);
        return data.data;
    },
    
    async delete (_id: string): Promise<Equipo[]>{
        const { data } = await axios.delete(`/ctl/equipos/${_id}`);
        return data.data;
    }
}