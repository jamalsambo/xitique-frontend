/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const usePayoutConfirmationStore = defineStore('payout-confirmation', {
  state: () => ({
    loading: false,

    error: null as string | null,
  }),

  getters: {},

  actions: {
    async create(groupId: string, body: any) {
      this.loading = true;
      this.error = null;

      try {
        await api.post(`payout-confirmation/${groupId}`, body);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },
  },
});
