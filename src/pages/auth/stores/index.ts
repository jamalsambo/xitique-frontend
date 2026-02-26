/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { LocalStorage } from 'quasar';

interface User {
  id: string;
  role: string;
}

export interface Log {
  id: string;
  group: string;
  type: string;
  createdAt: string;
  amount: number;
  label: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: LocalStorage.getItem('accessToken') as string | null,
    loading: false,
    error: <string | null>null,

    otpSent: false,
    otpPhone: <string | null>null,
    otpAttempts: 0,
    otpExpiresAt: <number | null>null,
    nextStep: <string | null>null,

    logs: [] as Log[],
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    // 🔑 LOGIN
    async login(phone: string, password: string) {
      this.loading = true;
      try {
        const { data } = await api.post('/auth/login', {
          phone,
          password,
        });

        // 🔥 AQUI está a correção principal
        this.accessToken = data.accessToken;
        this.user = data.user ?? null;

        LocalStorage.set('accessToken', data.accessToken);
        LocalStorage.set('refreshToken', data.refreshToken);
      } finally {
        this.loading = false;
      }
    },

    async register(data: {
      fullName: string;
      phone: string;
      password: string;
    }) {
      try {
        this.loading = true;
        this.error = null;

        // Validar dados
        if (!data.fullName || !data.phone || !data.password) {
          throw new Error('Todos os campos são obrigatórios');
        }

        if (data.fullName.trim().split(' ').length < 2) {
          throw new Error('Por favor, insira seu nome completo');
        }

        if (data.phone.replace(/\D/g, '').length < 9) {
          throw new Error('Número de telefone inválido');
        }

        if (data.password.length < 8) {
          throw new Error('Senha deve ter mínimo 8 caracteres');
        }

        // Chamar endpoint de registro
        const response = await api.post('/auth/register', {
          name: data.fullName,
          phone: data.phone,
          password: data.password,
        });

        this.otpPhone = data.phone;
        this.otpSent = true;
        this.otpAttempts = 0;
        this.nextStep = response.data.nextStep;

        this.otpExpiresAt = Date.now() + 10 * 60 * 1000;
      } catch (err: any) {
        const errorMessage = this.extractErrorMessage(err);
        this.error = 'errorMessage';
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async verifyOTP(otp: string) {
      try {
        this.loading = true;
        this.error = null;

        // Validar OTP
        if (!otp || otp.length !== 6) {
          throw new Error('Código deve ter exatamente 6 dígitos');
        }

        if (!this.otpPhone) {
          throw new Error('Nenhum telefone registrado para verificação');
        }

        // Verificar se OTP expirou
        if (this.otpExpiresAt && Date.now() > this.otpExpiresAt) {
          throw new Error('Código expirou. Solicite um novo código.');
        }

        // Chamar endpoint de verificação OTP
        const response = await api.post('/auth/verify-otp', {
          phone: this.otpPhone,
          otp: otp,
        });

        // Guardar token
        const { accessToken, refreshToken, user } = response.data;

        if (!accessToken) {
          throw new Error('Token não recebido do servidor');
        }

        this.accessToken = accessToken;
        this.user = user;

        LocalStorage.set('accessToken', accessToken);
        LocalStorage.set('refreshToken', refreshToken);
        // Limpar dados de OTP
        this.clearOTPState();
      } catch (err: any) {
        this.otpAttempts++;

        // Bloquear após 5 tentativas
        if (this.otpAttempts >= 5) {
          this.error = 'Muitas tentativas. Solicite um novo código.';
          throw new Error(this.error);
        }

        const errorMessage = this.extractErrorMessage(err);
        this.error = errorMessage;

        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async resendOTP() {
      try {
        this.loading = true;
        this.error = null;

        if (!this.otpPhone) {
          throw new Error('Nenhum telefone registrado');
        }

        // Chamar endpoint para reenviar OTP
        const response = await api.post('/auth/resend-otp', {
          phone: this.otpPhone,
        });

        // Resetar tentativas
        this.otpAttempts = 0;

        // Renovar tempo de expiração
        this.otpExpiresAt = Date.now() + 10 * 60 * 1000;

        return {
          success: true,
          message:
            response.data.message || 'Novo código enviado para seu telefone!',
        };
      } catch (err: any) {
        const errorMessage = this.extractErrorMessage(err);
        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(phone: string) {
      try {
        this.loading = true;
        this.error = null;

        const response = await api.post('/auth/forgot-password', {
          phone: phone,
        });

        // Armazenar telefone para verificação OTP
        this.otpPhone = phone;
        this.otpSent = true;
        this.otpAttempts = 0;
        this.otpExpiresAt = Date.now() + 10 * 60 * 1000;

        return {
          success: true,
          message: response.data.message || 'Código enviado para seu telefone!',
        };
      } catch (err: any) {
        const errorMessage = this.extractErrorMessage(err);
        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(otp: string, newPassword: string) {
      try {
        this.loading = true;
        this.error = null;

        if (newPassword.length < 8) {
          throw new Error('Nova senha deve ter mínimo 8 caracteres');
        }

        if (!this.otpPhone) {
          throw new Error('Nenhum telefone registrado');
        }

        const response = await api.post('/auth/reset-password', {
          phone: this.otpPhone,
          otp,
          newPassword,
        });

        // Limpar estado OTP
        this.clearOTPState();

        return {
          success: true,
          message: response.data.message || 'Senha redefinida com sucesso!',
        };
      } catch (err: any) {
        const errorMessage = this.extractErrorMessage(err);
        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async fetchLogs(limit: number) {
      try {
        this.loading = true;
        this.error = null;

        // Chamar endpoint para reenviar OTP
        const { data } = await api.get('/logs/my', {
          params: {
            limit, // 👈 se não vier, backend usa o default
          },
        });

        this.logs = data;
      } catch (err: any) {
        const errorMessage = this.extractErrorMessage(err);
        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    getOTPTimeRemaining() {
      if (!this.otpExpiresAt) return 0;

      const remaining = this.otpExpiresAt - Date.now();
      return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    },

    isOTPExpired() {
      return this.getOTPTimeRemaining() <= 0;
    },

    async ActionCheckToken() {
      if (this.accessToken) {
        console.log('aqui to');
        return this.accessToken;
      }

      const token = LocalStorage.getItem('accessToken');

      if (!token) {
        return Promise.reject(new Error('Token Inválido'));
      }

      LocalStorage.set('accessToken', token);
      return this.refreshToken();
    },

    // 🔄 REFRESH TOKEN
    async refreshToken() {
      const refreshToken = LocalStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await api.post('/auth/refresh', {
        refreshToken,
      });

      this.accessToken = data.accessToken;
      this.user = data.user ?? null;
      LocalStorage.set('accessToken', data.accessToken);

      if (data.refreshToken) {
        LocalStorage.set('refreshToken', data.refreshToken);
      }
    },

    // 🚪 LOGOUT
    logout() {
      this.accessToken = null;
      this.user = null;
      LocalStorage.remove('accessToken');
      LocalStorage.remove('refreshToken');
    },

    clearOTPState() {
      this.otpSent = false;
      this.otpPhone = null;
      this.otpAttempts = 0;
      this.otpExpiresAt = null;
    },

    extractErrorMessage(err: any): string {
      if (err.response?.data?.message) {
        return err.response.data.message;
      }

      if (err.response?.data?.error) {
        return err.response.data.error;
      }

      if (err.message) {
        return err.message;
      }

      return 'Erro na operação. Por favor, tente novamente.';
    },
  },
});
