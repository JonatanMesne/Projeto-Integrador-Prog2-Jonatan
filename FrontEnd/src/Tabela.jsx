// Importação de componentes externos
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SimpleText from "./simpleText";
import { ptBR } from '@mui/x-data-grid/locales';

// Componente de tabela genérica usando DataGrid do Material UI
export default function Tabela({ entidade, linhas, colunas, idFunc, onRowSelect = () => {} }) {

    // Renderização da tabela com paginação, seleção e tradução para português
    return (
        <Box sx={{ height: '100%', width: { xs: 400, md: 1000 } }}>
            {/* Título da tabela */}
            <SimpleText text={entidade} component={"h2"}/>
            <DataGrid
                rows={linhas}
                columns={colunas}
                getRowId={(row) => idFunc(row)}
                initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                disableMultipleRowSelection
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                    // Quando uma linha é selecionada, chama o callback com o id da primeira linha selecionada
                    if(newSelection.ids.size > 0) {
                        let idArray = Array.from(newSelection.ids);
                        onRowSelect(idArray[0]);
                    }
                }}
            />
        </Box>
    )
}