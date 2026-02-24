import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,

    totals: {
      payments: 0,
      receivals: 0,
      loansRequested: 0,
      loanPayments: 0,
    },

    balance: 0,

    nextPayments: {
      payment: null as null | {
        groupName: string;
        groupType: string;
        cycleNumber: number;
        cycleDate: string;
        paid: boolean;
        amountPaid: number;
      },
      loanPayment: null as null | {
        loadId: string;
        interestRate: number;
        installmentNumber: number;
        dueDate: string;
        amount: number;
        status: string;
      },
    },

    activeGroupsCount: 0,

    activityLogs: [] as unknown[],
  }),

  getters: {
    /** Totais prontos para cards */
    dashboardCards(state) {
      return [
        { label: 'Pagamentos', value: state.totals.payments },
        { label: 'Recebimentos', value: state.totals.receivals },
        { label: 'Empréstimos', value: state.totals.loansRequested },
        {
          label: 'Pagamentos de Empréstimos',
          value: state.totals.loanPayments,
        },
      ];
    },

    /** Saldo formatado */
    formattedBalance: (state) =>
      new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'MZN',
      }).format(state.balance),

    /** Próximo pagamento do grupo */
    nextGroupPayment(state) {
      if (!state.nextPayments.payment) return null;

      return {
        ...state.nextPayments.payment,
        date: new Date(state.nextPayments.payment.cycleDate),
      };
    },

    /** Próximo pagamento de empréstimo */
    nextLoanPayment(state) {
      return state.nextPayments.loanPayment;
    },
  },

  actions: {
    async fetchDashboard() {
      this.loading = true;
      try {
        const { data } = await api.get('/dashboard');

        this.totals = data.totals;
        this.balance = data.balance;
        this.nextPayments = data.nextPayments;
        this.activeGroupsCount = data.activeGroupsCount;
        this.activityLogs = data.activityLogs;
      } finally {
        this.loading = false;
      }
    },
  },
});
