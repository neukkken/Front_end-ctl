import { Finca } from "../../types/fincas.ts";
import { Nucleo } from "../../types/nucleo.ts";
import { Zona } from "../../types/zonas";
import axios from '../axios.ts'

export const ZonasService = {
    async getAll(): Promise<Zona[]> {
        const { data } = await axios.get('/ctl/zonas');
        return data.data;
    },

    async create(zona: Zona): Promise<Zona[]> {
        const { data } = await axios.post('/ctl/zonas', zona);
        return data.data;
    },

    async update(zona: Zona): Promise<Zona[]> {
        const { data } = await axios.put(`/ctl/zonas/edit/${zona._id}`)
        return data.data;
    },

    async delete(_id: string): Promise<Zona[]> {
        const { data } = await axios.delete(`/ctl/zonas/${_id}`);
        return data.data;
    }
}

export const NucleosService = {
    async getAll(): Promise<Nucleo[]> {
        const { data } = await axios.get('/ctl/nucleos');
        return data.data;
    },

    async create(nucleo: Nucleo): Promise<Nucleo[]> {
        const { data } = await axios.post('/ctl/nucleos', nucleo);
        return data.data;
    },

    async update(nucleo: Nucleo): Promise<Nucleo[]> {
        const { data } = await axios.put(`/ctl/nucleos/edit/${nucleo._id}`)
        return data.data;
    },

    async delete(_id: string): Promise<Nucleo[]> {
        const { data } = await axios.delete(`/ctl/nucleos/${_id}`);
        return data.data;
    }
}

export const FincasService = {
    async getAll(): Promise<Finca[]> {
        const { data } = await axios.get('/ctl/fincas');
        return data.data;
    },

    async create(finca: Finca): Promise<Finca[]> {
        const { data } = await axios.post('/ctl/fincas', finca);
        return data.data;
    },

    async update(finca: Finca): Promise<Finca[]> {
        const { data } = await axios.put(`/ctl/fincas/edit/${finca._id}`)
        return data.data;
    },

    async delete(_id: string): Promise<Finca[]> {
        const { data } = await axios.delete(`/ctl/fincas/${_id}`);
        return data.data;
    }
}