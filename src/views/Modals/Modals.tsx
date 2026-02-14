import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

type TtypeAlertInModal = | 'loading' | 'success' | 'error' | 'info' | 'selectOption' | 'closeAlert' | 'loaderBackground' | 'confirm';

export interface PropsModal {
    typeAlert: TtypeAlertInModal;
    message?: string;
    title?: string;
    btnAccept?: string;
    btnCancel?: string;
    callbackAcept?: (value?: any) => void;
    callbackCancel?: () => void;
    options?: Record<string, string>; // para el selectOption
}

const MySwal = withReactContent(Swal);

export default function showAlert({
    typeAlert,
    message,
    title,
    btnAccept = 'Aceptar',
    btnCancel = 'Cancelar',
    callbackAcept,
    callbackCancel,
    options,
}: PropsModal): void {
    switch (typeAlert) {
        case 'loading':
            MySwal.fire({
                title: title || 'Cargando...',
                text: message || 'Por favor espera mientras procesamos tu solicitud.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
            break;

        case 'success':
            MySwal.fire({
                icon: 'success',
                title: title || '¡Acción exitosa 🎉!',
                text: message || 'La operación se completó correctamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: btnAccept,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result: any) => {
                if (result.isConfirmed && callbackAcept) callbackAcept();
            });
            break;

        case 'error':
            MySwal.fire({
                icon: 'error',
                title: title || 'Oops...',
                text: message || 'Ocurrió un error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: btnAccept,
            }).then((result: any) => {
                if (result.isConfirmed && callbackAcept) callbackAcept();
            });
            break;

        case 'confirm':
            MySwal.fire({
                icon: 'warning',
                title: title || '¡Confirma!',
                text: message || '¿Estás seguro de realizar esta acción?',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                showCancelButton: true,
                allowOutsideClick: false,
                confirmButtonText: btnAccept,
                cancelButtonText: btnCancel,
            }).then((result: any) => {
                if (result.isConfirmed && callbackAcept) callbackAcept();
                if (!result.isConfirmed && callbackCancel) callbackCancel();
            });
            break;

        case 'info':
            MySwal.fire({
                icon: 'info',
                title: title || 'Información!',
                text: message || 'Texto informativo',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                showCancelButton: true,
                allowOutsideClick: false,
                confirmButtonText: btnAccept,
                cancelButtonText: btnCancel,
            }).then((result: any) => {
                if (result.isConfirmed && callbackAcept) callbackAcept();
                if (!result.isConfirmed && callbackCancel) callbackCancel();
            });
            break;

        case 'selectOption':
            MySwal.fire({
                title: title || 'Selecciona una opción',
                input: 'select',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                allowOutsideClick: false,
                confirmButtonText: btnAccept,
                inputOptions: options,
                inputPlaceholder: message || 'Selecciona una opción',
                showCancelButton: true,
                inputValidator: (value: any) => {
                    return new Promise<void>((resolve, reject) => {
                        if (value) {
                            resolve();
                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: '¡Necesitas seleccionar una opción!',
                            });
                            if (callbackCancel) callbackCancel();
                            reject('¡Necesitas seleccionar una opción!');
                        }
                    });
                },
            })
                .then((result: any) => {
                    if (result.isConfirmed && result.value && callbackAcept) {
                        callbackAcept(result.value);
                    } else if (result.dismiss === Swal.DismissReason.cancel && callbackCancel) {
                        callbackCancel();
                    }
                })
                .catch((error: any) => {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error,
                    });
                });
            break;

        case 'closeAlert':
            MySwal.close();
            if (callbackAcept) callbackAcept();
            break;

        case 'loaderBackground':
            MySwal.fire({
                title: '...',
                width: 600,
                padding: '3em',
                color: '#716add',
                background: '#fff url(https://sweetalert2.github.io/#handling-dismissalsimages/trees.png)',
                backdrop: `
          rgba(0,0,123,0.4)
          url("https://sweetalert2.github.io/#handling-dismissalsimages/nyan-cat.gif")
          left top
          no-repeat
        `,
            });
            break;

        default:
            MySwal.fire({
                icon: 'error',
                title: 'Revisa el typeAlert',
                text: `${typeAlert} no coincide con ningún case`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: btnAccept,
            });
            break;
    }
}
