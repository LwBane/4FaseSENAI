import api from "./api"; 

export const create = async (form) => {
    try {

        const response = await api.post("/create", form);
        console.log("Usuário criado: ", response); 

        return response.data; 

    }   catch (error) {
        console.error("Erro interno: ", error); 
    }
}