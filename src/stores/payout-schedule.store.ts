import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const usePayoutScheduleStore = defineStore('payout-schedule', {
  state: () => ({
    loading: false,
    nextReceived: [],
    cycleReceiveds: [],
    userItems: [],
    error: null as string | null,
  }),

  getters: {
    hasNextReceived: (state) => state.nextReceived.length > 0,
  },

  actions: {
    async fetchAll(groupId: string, cycle: number, receiverId?: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/payout-schedule/group/${groupId}`, {
          params: { cycle: cycle, userId: receiverId },
        });

        this.cycleReceiveds = data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },
    async fetchNextReceived(groupId: string, currentCycle: number) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(
          `/payout-schedule/group/${groupId}/next-received/${currentCycle}`
        );

        this.nextReceived = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },
    async addReceiverToCycle(groupId: string, body: object) {
      this.loading = true;
      this.error = null;

      try {
        return await api.post(`/payout-schedule/group/${groupId}/`, body);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },

    async createScheduleItem(body: object) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post('/payout-schedule/items', body);
        this.userItems = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },
    async fetchUserItem(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(
          `/payout-schedule/items/group/${groupId}/user`
        );
        this.userItems = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },

    async removeUserItem(item: string) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`payout-schedule/items/${item}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },

    async removeReceiverFromCycle(
      groupId: string,
      cycleId: number,
      receiverId: string
    ) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(
          `payout-schedule/group/${groupId}/cycles/${cycleId}/receivers/${receiverId}`
        );

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
