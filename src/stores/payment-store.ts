import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    loading: false,
    paymentCycles: [],
    paymentCycleInformation: {},
    error: null as string | null,
  }),

  getters: {},

  actions: {
    async create(body: object) {
      this.loading = true;
      this.error = null;

      try {
        await api.post('/payments', body);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao Efectuar Pagamento';
        throw new Error(err?.response?.data?.message);
      } finally {
        this.loading = false;
      }
    },
    async update(id:string, body: object) {
      this.loading = true;
      this.error = null;

      try {
        await api.patch(`/payments/${id}`, body);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao Efectuar Pagamento';
        throw new Error(err?.response?.data?.message);
      } finally {
        this.loading = false;
      }
    },
    async fetchPaymentCycles(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/payments/cycles/${groupId}`);

        this.paymentCycles = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ||
          'Erro ao carregar ciclos de pagamento';
      } finally {
        this.loading = false;
      }
    },
    async fetchCyclePaymentInformation(groupId: string, cycleId: number) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(
          `/payments/group/${groupId}/cycle/${cycleId}`
        );

        this.paymentCycleInformation = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ||
          'Erro ao carregar ciclos de pagamento';
      } finally {
        this.loading = false;
      }
    },
  },
});
