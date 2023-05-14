export let PermisosUtils = {
    /**
     * Metodo utilizado para guardar el id pagina en el local storage
     * @param idPagina que se desea guardar
     */
    GuardarPagina(idPagina: number): void {
        const idPaginaEncode = btoa(idPagina + "");
        localStorage.setItem('view', '');
        localStorage.setItem('view', idPaginaEncode);
    },
    /**
     * metodo utilazado para obtener la pagina
     * @returns el numero del idPagina
     */
    ObtenerPagina(): number {
        if (localStorage.getItem('view')) {
            const idPaginaDecode = atob(localStorage.getItem('view') || '');
            return +idPaginaDecode;
        }
        return 0;
    },
}
