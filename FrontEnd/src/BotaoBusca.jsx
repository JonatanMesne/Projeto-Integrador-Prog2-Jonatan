// Importação de hooks e bibliotecas externas
import { Button } from "@mui/material";

// Componente para padronizar um botão de busca de entidades 
export default function BotaoBusca({ texto, funcao, disabled=false }) {
    return (
        <Button
            variant="contained"
            onClick={funcao}
            style={{ width: "150px" }}
            disabled={disabled}
        >
            {texto}
        </Button>
    )
}