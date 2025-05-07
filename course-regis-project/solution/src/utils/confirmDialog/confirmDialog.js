import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; 
import './confirmDialog.css'

const confirmDialog = async ({
  title,
  confirmText = 'Đồng ý',
  cancelText = 'Hủy',
}) => {
  return await Swal.fire({
    title: title,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      title: 'custom-swal-title',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
    },
    didOpen: () => {
      const popup = document.querySelector('.swal2-popup');
      if (popup) popup.style.fontSize = '1.6rem';
    },
  }).then((result) => {
    return result.isConfirmed;
  });
};

export default confirmDialog;
