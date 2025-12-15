import { Button } from "@mui/material";

export default function BotaoBusca({ texto, funcao }) {
    return (
        <Button
            variant="contained"
            onClick={funcao}
            style={{ width: "150px" }}
        >
            {texto}
        </Button>
    )
}