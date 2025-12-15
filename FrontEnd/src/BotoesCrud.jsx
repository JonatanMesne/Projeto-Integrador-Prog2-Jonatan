import {  Stack, Button, ButtonGroup } from "@mui/material";

export default function BotoesCrud({ entidade, incluir, alterar=null, excluir }) {
    return (
        <Stack spacing={2} direction="row">
            <ButtonGroup variant="outlined" aria-label="CRUD">
                <Button
                    onClick={incluir}
                    style={{ width: "100px" }}
                >
                    Incluir {entidade}
                </Button>
                { alterar != null && 
                    <Button
                        onClick={alterar}
                        style={{ width: "100px" }}
                    >
                        Alterar {entidade}
                    </Button>
                }
                <Button
                    onClick={excluir}
                    style={{ width: "100px" }}
                >
                    Excluir {entidade}
                </Button>
            </ButtonGroup>
        </Stack>
    )
}

