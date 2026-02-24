import { useQuasar } from 'quasar';

export default function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (message: string) => {
    $q.notify({
      type: 'positive',
      message: message || 'All right',
    });
  };

  const notifyError = (message: string) => {
    $q.notify({
      type: 'negative',
      message: message || 'Failed',
    });
  };

  const notifyInfo = (message: string) => {
    $q.notify({
      type: 'info',
      message: message || 'Failed',
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
  };
}
