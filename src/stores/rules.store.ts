import { defineStore } from 'pinia';
import { api } from 'boot/axios';

interface Rule {
  name: string;
  enabled: boolean;
  id: string;
  value: string;
  code: string;
  value_type: string;
  description: string
}

export const useRuleStore = defineStore('rule', {
  state: () => ({
    loading: false,
    rules: [] as Rule[],
    error: null as string | null,
  }),
  getters: {},
  actions: {
    async fetchRulesByGroup(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/rules/${groupId}`);

        this.rules = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar as regras do grupo';
      } finally {
        this.loading = false;
      }
    },
    async toggleRule(
      ruleId: string,
      groupId: string,
      enabled: boolean,
      ruleValue: string
    ) {
      this.loading = true;
      this.error = null;

      try {
        await api.patch(`/rules/${ruleId}/group/${groupId}/toggle`, {
          enabled: enabled,
          value: ruleValue ?? null,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar as regras do grupo';
      } finally {
        this.loading = false;
      }
    },
  },
});
