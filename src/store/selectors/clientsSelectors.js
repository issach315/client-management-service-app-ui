
export const selectClientsList       = (state) => state.clients.clients;
export const selectClientsTotalPages = (state) => state.clients.totalPages;
export const selectClientsTotalItems = (state) => state.clients.totalElements;
export const selectClientsListLoading= (state) => state.clients.listLoading;
export const selectClientsListError  = (state) => state.clients.listError;

export const selectSelectedClient    = (state) => state.clients.selectedClient;
export const selectDetailLoading     = (state) => state.clients.detailLoading;
export const selectDetailError       = (state) => state.clients.detailError;

export const selectMutating          = (state) => state.clients.mutating;
export const selectMutateError       = (state) => state.clients.mutateError;
export const selectLastMutateSuccess = (state) => state.clients.lastMutateSuccess;