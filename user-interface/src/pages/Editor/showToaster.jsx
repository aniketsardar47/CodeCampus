import { toast } from 'react-toastify';

export const showToast = (title, description, type = 'default') => {
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    };

    switch (type) {
        case 'success':
            toast.success(`${title}\n${description}`, toastOptions);
            break;
        case 'error':
            toast.error(`${title}\n${description}`, toastOptions);
            break;
        case 'warning':
            toast.warning(`${title}\n${description}`, toastOptions);
            break;
        case 'info':
            toast.info(`${title}\n${description}`, toastOptions);
            break;
        default:
            toast(`${title}\n${description}`, toastOptions);
    }
};