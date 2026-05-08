import { Button } from "../../components/ui/button";

interface Props {
    clickBtnPrimary: () => void;
    clickBtnSecondary: () => void;
    btnPrimarytDisabled?: boolean;
    btnSecondaryDisabled?: boolean;
    labelBtnPrimary?: string;
    labelBtnBSecondary?: string;
}

export default function PairButtons(propsControls: Props) {

    const { clickBtnPrimary, clickBtnSecondary, btnPrimarytDisabled = false,
        btnSecondaryDisabled = false, labelBtnPrimary = "Cancelar", labelBtnBSecondary = "Enviar" } = propsControls;
    return (
        <div className="max-w-full flex justify-between mt-5">
            <Button
                variant="outline"
                onClick={clickBtnSecondary}
                className="p-5"
                disabled={btnSecondaryDisabled}
            >
                {labelBtnBSecondary}
            </Button>

            <Button
                onClick={clickBtnPrimary}
                disabled={btnPrimarytDisabled}
            >
                {labelBtnPrimary}
            </Button>
        </div>

    )
}
