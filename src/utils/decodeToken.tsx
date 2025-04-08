const decodeToken = (token: string) => {
    try {
        const [, payload] = token.split(".");

        const decodedPayload = JSON.parse(decodeURIComponent(escape(window.atob(payload))));

        return decodedPayload;
    } catch (error: any) {
        console.error("Error al decodificar el token:", error.message);
        return null;
    }
};

export default decodeToken;