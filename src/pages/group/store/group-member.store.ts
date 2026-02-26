/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export interface Member {
  member_id: string;
  user_id: string;
  name?: string; // opcional, caso tenha
  role?: string; // opcional, caso tenha
  is_active?: boolean;
}

export const useGroupMemberStore = defineStore('group-member', {
  state: () => ({
    loading: false,

    groupMembers: [] as Member[],

    error: null as string | null,
  }),

  getters: {
    hasGroupMembers: (state) => state.groupMembers.length > 0,
  },

  actions: {
    async fetchGroupMembers(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(
          `/contribution-group-members/group/${groupId}/payments`
        );

        this.groupMembers = data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Erro ao carregar grupos';
      } finally {
        this.loading = false;
      }
    },
    async addMemberToGroup(body: object) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post('/contribution-group-members', body);

        return data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Erro ao adicionar membro';
      } finally {
        this.loading = false;
      }
    },
  },
});
