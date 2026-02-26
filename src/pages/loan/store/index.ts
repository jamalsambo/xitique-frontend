/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export interface Group {
  name: string
}
export interface Loans {
  id:string;
  name:string;
paidInstallments: number;
installments: number;
progress: number;
totalPaid: number;
amount_requested: number;
group: Group
}

export const useLoanStore = defineStore('loan', {
  state: () => ({
    loading: false,

    loans: [] as Loans[],
    groupLoans: [] as unknown[],

    // controla o limit no frontend
    limit: 3, // 👈 default do frontend (opcional)

    error: null as string | null,
  }),

  getters: {
    hasLoans: (state) => state.loans.length > 0,
  },

  actions: {
    async create(body: object) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post('/loan', body);
        return data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Erro ao solicitar empréstimo';

        this.error = message;

        // 🔥 IMPORTANTE
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
    async update(id: string, body: object) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.patch(`/loan/${id}`, body);
        return data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Erro ao solicitar empréstimo';

        this.error = message;

        // 🔥 IMPORTANTE
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchLoans(customLimit?: number) {
      this.loading = true;
      this.error = null;

      try {
        const limit = customLimit ?? this.limit;

        const { data } = await api.get('/loan/me', {
          params: {
            limit, // 👈 se não vier, backend usa o default
          },
        });

        this.loans = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || 'Erro ao carregar empréstimos';
      } finally {
        this.loading = false;
      }
    },
    async fetchGroupLoans(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/loan/group/${groupId}`);

        this.groupLoans = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ||
          'Erro ao carregar empréstimos do grupo';
      } finally {
        this.loading = false;
      }
    },
    async createLoanPayment(loanId: string, body: object) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post(`/loan/${loanId}/payment`, body);

        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ||
          'Erro ao pagar a parcela de emprestimo';
      } finally {
        this.loading = false;
      }
    },

    async updateLoanPayment(loanId: string, body: object) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.patch(`/loan/${loanId}/payment`, body);

        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ||
          'Erro ao pagar a parcela de emprestimo';
      } finally {
        this.loading = false;
      }
    },
  },
});
