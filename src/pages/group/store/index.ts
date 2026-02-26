/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export interface Rule {
  id: string;
  code: string;
  name: string;
  value_type: 'STRING' | 'BOOLEAN' | 'NUMBER';
}
export interface GroupRule {
  id: string;
  value: string; // vem como string da API
  group_id: string;
  rule_id: string;
  rule: Rule;
}
export interface Owner {
  id: string;
  name: string;
  phone: string;
}

export interface GroupTotals {
  payments: number;
  receivals: number;
  loanPrincipal: number;
  loanInterest: number;
  loansRequested: number;
  loanPayments: number;
  currentMonthPayments: number;
}
export interface Group {
  id: string;
  name: string;
  type_id: string;
  description: string;
  monthly_value: string; // vem como string "1100.00"
  start_date: string;
  cicle: number;
  cicle_number: number;
  due: number;
  organizer_id: string;
  status: string;
  payout_trigger: string | null;
  is_public: boolean;
  created_at: string;

  groupRules: GroupRule[];
  owner: Owner;

  cycleName: string;
  currentCycle: number;
  totals: GroupTotals;

  balance: number;
  interestRate: number | null;
  isOwner: boolean;
}

export interface GroupType {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  is_active: boolean;
  role: string; // Ex.: "Administrador", "Membro"
}

export interface Groups {
  id: string;
  name: string;
  type_id: string;
  description: string;
  monthly_value: string; // se quiser trabalhar como número, use number
  start_date: string;
  cicle: number;
  cicle_number: number;
  due: number;
  organizer_id: string;
  status: string;
  payout_trigger: string | null;
  created_at: string;

  type: GroupType;               // Subobjeto tipo do grupo
  groupMembers: GroupMember[];   // Lista de membros do grupo

  progress: number;              // Percentual de progresso (ex.: 9)
  cycleName: string;             // Nome do ciclo (ex.: "Mensal")
  totalMembers: number;
  paidMembers: number;
  pendingMembers: number;
   balance: number;
}

export const useGroupStore = defineStore('group', {
  state: () => ({
    loading: false,

    groups: [] as Groups[],
   group: {} as Group,
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
