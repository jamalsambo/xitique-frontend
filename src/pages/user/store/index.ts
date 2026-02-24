import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as unknown[],
    loading: false,
    searchTerm: '',
  }),

  actions: {
    async searchUsers(term: string) {
      this.searchTerm = term;

      if (!term || term.length < 2) {
        this.users = [];
        return;
      }

      try {
        this.loading = true;

        const { data } = await api.get('/users/search', {
          params: { q: term },
        });

        this.users = data;
        return data;
      } catch (error) {
        console.error('Erro ao pesquisar usuários', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUsers() {
      try {
        this.loading = true;
        const { data } = await api.get('/users');
        this.users = data;
      } finally {
        this.loading = false;
      }
    },

    async getUserFinancialStats(groupId: string) {
      try {
        this.loading = true;
        const { data } = await api.get(
          `/users/group/${groupId}/financial-summary`
        );
        return data;
      } catch (error) {
        console.error('Erro ao pesquisar usuários', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
