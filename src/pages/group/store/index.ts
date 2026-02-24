/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useGroupStore = defineStore('group', {
  state: () => ({
    loading: false,

    groups: [] as unknown[],
    group: {},
    groupTypes: [],

    // controla o limit no frontend
    limit: 3, // 👈 default do frontend (opcional)

    error: null as string | null,
  }),

  getters: {
    hasGroups: (state) => state.groups.length > 0,
  },

  actions: {
    async create(boby: any) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post('groups', boby);
        this.group = data;
        return data;
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Erro ao criar grupo';
      } finally {
        this.loading = false;
      }
    },
    async fetchGroups() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get('/groups');

        this.groups = data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Erro ao carregar grupos';
      } finally {
        this.loading = false;
      }
    },
    async fetchGroup(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/groups/${groupId}`);

        this.group = data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Erro ao carregar grupos';
      } finally {
        this.loading = false;
      }
    },
    async fetchGroupTypes() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get('group-types');

        this.groupTypes = data;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar tipos de grupos';
      } finally {
        this.loading = false;
      }
    },
  },
});
