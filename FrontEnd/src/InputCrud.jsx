import { TextField } from "@mui/material";
import StringMask from "string-mask";

export default function InputCrud({ nomeCampo, value, setValue, maxLength = 50, disabled = false, numero=false, 
    cpfCnpj=false, telefone=false, dinheiro=false, data=false}) {
    function removeMask(text) {
        return text.replace(/\D/g, '');
    }

    const maskCpf = new StringMask('000.000.000-00');
    const maskCnpj = new StringMask('00.000.000/0000-00');
    const maskTelefoneSmall = new StringMask('(00) 0000-0000');
    const maskTelefoneBig = new StringMask('(00) 00000-0000');
    const maskDinheiro = new StringMask('R\$ #.##0,00', {reverse: true});
    const maskData = new StringMask('00/00/0000')

    return (
        <TextField
            disabled={disabled}
            id={`${nomeCampo}`}
            label={`${nomeCampo}`}
            size="normal"
            sx={{ minWidth: '100px' }}
            value={value}
            onChange={(event) => {
                if(value.length > event.target.value.length) { // Deleting characters
                    setValue(event.target.value);
                } else { // Adding characters
                    if(cpfCnpj) {
                        const unmaskedValue = removeMask(event.target.value);
                        if(unmaskedValue.length <= 11) {
                            setValue(maskCpf.apply(unmaskedValue));
                        } else {
                            setValue(maskCnpj.apply(unmaskedValue));
                        }
                    } else if(telefone) {
                        const unmaskedValue = removeMask(event.target.value);
                        if(unmaskedValue.length <= 10) {
                            setValue(maskTelefoneSmall.apply(unmaskedValue));
                        } else {
                            setValue(maskTelefoneBig.apply(unmaskedValue));
                        }
                    } else if(dinheiro) {
                        const unmaskedValue = removeMask(event.target.value);
                        setValue(maskDinheiro.apply(unmaskedValue));
                    } else if(data) {
                        const unmaskedValue = removeMask(event.target.value);
                        setValue(maskData.apply(unmaskedValue));
                    } else if (value.length <= maxLength) {
                        // If within limit, update the state normally
                        if(numero) {
                            const isNumber = /^[0-9]*$/.test(event.target.value);
                            if(isNumber) {
                                setValue(event.target.value);
                            }
                        } else {
                            setValue(event.target.value);
                        }
                    } else {
                    // If it exceeds (e.g., due to pasting), truncate the string
                    // This ensures the state is *always* the limited length
                        setValue(event.target.value.slice(0, maxLength));
                    }
                }
            }}
        />
    )
}

