<template>
  <q-layout class="forgot-layout">
    <q-page-container>
      <q-page class="forgot-page">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <div class="forgot-container">
          <!-- Left Side - Info -->
          <div class="left-section">
            <div class="info-content">
              <!-- Logo -->
              <div class="brand-logo">
                <div class="logo-icon">
                  <q-icon name="lock_reset" size="64px" />
                </div>
                <h1 class="brand-title">Recuperar Acesso</h1>
                <p class="brand-subtitle">Sistema de Poupança Coletiva</p>
              </div>

              <!-- Help Message -->
              <div class="help-box">
                <div class="help-icon">
                  <q-icon name="help_outline" size="32px" />
                </div>
                <h2 class="help-title">Esqueceu sua Senha?</h2>
                <p class="help-text">
                  Não se preocupe! Você pode recuperar acesso à sua conta em
                  alguns passos simples usando seu número de telefone
                </p>
              </div>

              <!-- Steps -->
              <div class="steps-list">
                <div class="step-item">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h3>Insira seu Telefone</h3>
                    <p>Número associado à sua conta</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h3>Receba o Código</h3>
                    <p>SMS com código de 6 dígitos</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h3>Nova Senha</h3>
                    <p>Defina sua nova senha</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h3>Pronto!</h3>
                    <p>Faça login com a nova senha</p>
                  </div>
                </div>
              </div>

              <!-- Security Info -->
              <div class="security-info">
                <q-icon name="security" />
                <span>Seus dados estão protegidos com encriptação de nível bancário</span>
              </div>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="right-section">
            <div class="form-wrapper">
              <!-- Form Header -->
              <div class="form-header">
                <h2 class="form-title">Recuperar Senha</h2>
                <p class="form-subtitle">Preencha os dados abaixo</p>
              </div>

              <!-- Form Card -->
              <q-card class="forgot-card">
                <q-card-section class="q-pa-lg">
                  <!-- Step 1: Phone -->
                  <div v-show="currentStep === 1" class="form-step">
                    <h3 class="step-title">Seu Número de Telefone</h3>

                    <div class="input-group">
                      <label class="input-label">Número de Telefone</label>
                      <div class="phone-input-wrapper">
                        <span class="phone-prefix">+258</span>
                        <q-input
                          v-model="form.phone"
                          placeholder="84 123 4567"
                          outlined
                          dense
                          type="tel"
                          class="phone-input"
                          prefix-icon="phone"
                          @keyup.enter="handleRequestCode"
                          :rules="[
                            (val) =>
                              (val && val.trim().length > 0) ||
                              'Telefone é obrigatório',
                            (val) =>
                              (val && val.length >= 9) ||
                              'Número deve ter pelo menos 9 dígitos',
                          ]"
                        />
                      </div>
                      <p class="input-hint">
                        📱 Insira o telefone associado à sua conta
                      </p>
                    </div>

                    <q-btn
                      label="Solicitar Código"
                      color="primary"
                      :loading="auth.loading"
                      :disable="!isPhoneValid"
                      @click="handleRequestCode"
                      class="action-btn q-mt-lg full-width"
                      size="lg"
                      no-caps
                      unelevated
                    />
                  </div>

                  <!-- Step 2: OTP -->
                  <div v-show="currentStep === 2" class="form-step">
                    <h3 class="step-title">Verificar Código OTP</h3>

                    <div class="otp-section">
                      <p class="otp-message">
                        Código enviado para
                        <strong>+258 {{ maskPhone(form.phone) }}</strong>
                      </p>

                      <div class="otp-input-group">
                        <label class="input-label">Código de Verificação</label>
                        <p class="otp-instruction">Insira os 6 dígitos do SMS</p>

                        <div class="otp-inputs">
                          <q-input
                            v-for="(digit, index) in 6"
                            :key="index"
                            v-model="otpDigits[index]"
                            maxlength="1"
                            type="text"
                            inputmode="numeric"
                            class="otp-digit-input"
                            @input="handleDigitInput(index, $event)"
                            @keydown="handleKeyDown(index, $event)"
                          />
                        </div>

                        <!-- Time Info -->
                        <div v-if="!isOTPExpired" class="time-remaining">
                          ⏱️ Código expira em: <strong>{{ timeRemaining }}s</strong>
                        </div>
                        <div v-else class="time-expired">
                          ⚠️ Código expirou. Solicite um novo.
                        </div>
                      </div>

                      <q-btn
                        label="Verificar Código"
                        color="primary"
                        :loading="auth.loading"
                        :disable="!isOTPComplete || isOTPExpired"
                        @click="handleVerifyOTP"
                        class="action-btn q-mt-lg full-width"
                        size="lg"
                        no-caps
                        unelevated
                      />

                      <!-- Resend OTP -->
                      <div class="resend-section q-mt-md">
                        <p class="resend-text">Não recebeu o código?</p>
                        <q-btn
                          label="Reenviar Código"
                          flat
                          color="primary"
                          no-caps
                          size="sm"
                          :loading="auth.loading"
                          :disable="!canResendOTP"
                          @click="handleResendOTP"
                        />
                        <p v-if="canResendOTP === false" class="resend-timer">
                          Pode reenviar em {{ resendTimer }}s
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Step 3: New Password -->
                  <div v-show="currentStep === 3" class="form-step">
                    <h3 class="step-title">Nova Senha</h3>

                    <!-- New Password -->
                    <div class="input-group">
                      <label class="input-label">Nova Senha</label>
                      <q-input
                        v-model="form.newPassword"
                        placeholder="Mínimo 8 caracteres"
                        outlined
                        dense
                        :type="showPassword ? 'text' : 'password'"
                        class="form-input"
                        prefix-icon="lock"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="
                              showPassword ? 'visibility' : 'visibility_off'
                            "
                            class="cursor-pointer"
                            @click="showPassword = !showPassword"
                          />
                        </template>
                      </q-input>

                      <!-- Password Strength -->
                      <div class="password-strength q-mt-xs">
                        <div
                          class="strength-bar"
                          :style="{ width: passwordStrength + '%' }"
                          :class="'strength-' + passwordLevel"
                        ></div>
                      </div>
                      <p class="input-hint">
                        {{
                          form.newPassword.length === 0
                            ? 'Mínimo 8 caracteres'
                            : `Força: ${passwordLevel}`
                        }}
                      </p>
                    </div>

                    <!-- Confirm Password -->
                    <div class="input-group q-mt-md">
                      <label class="input-label">Confirmar Senha</label>
                      <q-input
                        v-model="form.confirmPassword"
                        placeholder="Repita sua senha"
                        outlined
                        dense
                        :type="showPassword ? 'text' : 'password'"
                        class="form-input"
                        prefix-icon="lock"
                        :rules="[
                          (val) =>
                            (val && val === form.newPassword) ||
                            'As senhas não coincidem',
                        ]"
                      >
                        <template v-slot:append>
                          <q-icon
                            v-if="form.confirmPassword"
                            :name="
                              form.confirmPassword === form.newPassword
                                ? 'check_circle'
                                : 'cancel'
                            "
                            :color="
                              form.confirmPassword === form.newPassword
                                ? 'positive'
                                : 'negative'
                            "
                          />
                        </template>
                      </q-input>
                    </div>

                    <q-btn
                      label="Redefinir Senha"
                      color="primary"
                      :loading="auth.loading"
                      :disable="!isPasswordValid"
                      @click="handleResetPassword"
                      class="action-btn q-mt-lg full-width"
                      size="lg"
                      no-caps
                      unelevated
                    />
                  </div>

                  <!-- Step 4: Success -->
                  <div v-show="currentStep === 4" class="form-step success-step">
                    <div class="success-icon">
                      <q-icon name="check_circle" size="80px" />
                    </div>

                    <h3 class="success-title">Senha Redefinida!</h3>
                    <p class="success-message">
                      Sua senha foi alterada com sucesso. Você pode fazer login
                      agora.
                    </p>

                    <q-btn
                      label="Ir para Login"
                      color="primary"
                      @click="router.push('/login')"
                      class="action-btn q-mt-lg full-width"
                      size="lg"
                      no-caps
                      unelevated
                    />
                  </div>

                  <!-- Error Message -->
                  <q-banner
                    v-if="auth.error"
                    class="error-banner q-mt-md"
                    dense
                  >
                    <template v-slot:avatar>
                      <q-icon name="error" color="negative" />
                    </template>
                    {{ auth.error }}
                    <template v-slot:action>
                      <q-icon
                        name="close"
                        size="sm"
                        class="cursor-pointer"
                        @click="auth.error = null"
                      />
                    </template>
                  </q-banner>
                </q-card-section>
              </q-card>

              <!-- Back to Login -->
              <div v-if="currentStep < 4" class="back-section q-mt-lg">
                <q-btn
                  label="Voltar para Login"
                  flat
                  color="grey-7"
                  no-caps
                  @click="router.push('/login')"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';

// Router & Store
const router = useRouter();
const auth = useAuthStore();

// Form State
const currentStep = ref(1);
const form = ref({
  phone: '',
  newPassword: '',
  confirmPassword: '',
});

// OTP State
const otpDigits = ref(['', '', '', '', '', '']);
const timeRemaining = ref(600);
const resendTimer = ref(0);
const canResendOTP = ref(true);
const showPassword = ref(false);

let timerInterval: NodeJS.Timeout | null = null;
let resendTimerInterval: NodeJS.Timeout | null = null;

// Computed
const isPhoneValid = computed(() => {
  return form.value.phone.trim().length >= 9;
});

const isOTPComplete = computed(() => {
  return otpDigits.value.every((digit) => digit !== '');
});

const isOTPExpired = computed(() => {
  return timeRemaining.value <= 0;
});

const isPasswordValid = computed(() => {
  return (
    form.value.newPassword.length >= 8 &&
    form.value.newPassword === form.value.confirmPassword
  );
});

const passwordStrength = computed(() => {
  let strength = 0;
  const pwd = form.value.newPassword;

  if (pwd.length >= 8) strength += 25;
  if (pwd.length >= 12) strength += 25;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
  if (/[0-9]/.test(pwd)) strength += 12.5;
  if (/[!@#$%^&*]/.test(pwd)) strength += 12.5;

  return Math.min(strength, 100);
});

const passwordLevel = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'fraco';
  if (strength < 70) return 'medio';
  return 'forte';
});

// Methods
const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return `${cleaned.substring(0, 2)} *** ${cleaned.substring(cleaned.length - 4)}`;
};

const handleRequestCode = async () => {
  try {
   await auth.forgotPassword(form.value.phone);

    // Sucesso - ir para passo 2 (OTP)
    currentStep.value = 2;
    otpDigits.value = ['', '', '', '', '', ''];
    timeRemaining.value = 600;
    startTimer();
    startResendTimer();
  } catch (error) {
    console.error('Erro ao solicitar código:', error);
  }
};

const handleDigitInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, '');

  if (value) {
    otpDigits.value[index] = value;

    if (index < 5) {
      const nextInput = document.querySelectorAll('.otp-digit-input')[
        index + 1
      ] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  } else {
    otpDigits.value[index] = '';
  }
};

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpDigits.value[index]) {
    if (index > 0) {
      const prevInput = document.querySelectorAll('.otp-digit-input')[
        index - 1
      ] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  if (event.key === 'ArrowLeft' && index > 0) {
    const prevInput = document.querySelectorAll('.otp-digit-input')[
      index - 1
    ] as HTMLInputElement;
    if (prevInput) {
      prevInput.focus();
    }
  } else if (event.key === 'ArrowRight' && index < 5) {
    const nextInput = document.querySelectorAll('.otp-digit-input')[
      index + 1
    ] as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  if (event.key === 'Enter' && isOTPComplete.value) {
    handleVerifyOTP();
  }
};

const handleVerifyOTP = async () => {
  try {
    const otp = otpDigits.value.join('');

    if (otp.length !== 6) {
      auth.error = 'Por favor, insira os 6 dígitos';
      return;
    }

    // Verificar OTP (reutilizar função do store)
    await auth.verifyOTP(otp);

    // Sucesso - ir para passo 3 (Nova senha)
    currentStep.value = 3;
  } catch (error) {
    console.error('Erro ao verificar OTP:', error);
  }
};

const handleResendOTP = async () => {
  try {
    const result = await auth.resendOTP();

    otpDigits.value = ['', '', '', '', '', ''];
    timeRemaining.value = 600;
    startTimer();

    console.log(result.message);
  } catch (error) {
    console.error('Erro ao reenviar OTP:', error);
  }
};

const handleResetPassword = async () => {
  try {
    const otp = otpDigits.value.join('');

    await auth.resetPassword(otp, form.value.newPassword);

    // Sucesso - ir para passo 4 (Confirmação)
    currentStep.value = 4;
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
  }
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeRemaining.value--;

    if (timeRemaining.value <= 0) {
      if (timerInterval) clearInterval(timerInterval);
      timeRemaining.value = 0;
    }
  }, 1000);
};

const startResendTimer = () => {
  canResendOTP.value = false;
  resendTimer.value = 60;

  if (resendTimerInterval) clearInterval(resendTimerInterval);

  resendTimerInterval = setInterval(() => {
    resendTimer.value--;

    if (resendTimer.value <= 0) {
      if (resendTimerInterval) clearInterval(resendTimerInterval);
      canResendOTP.value = true;
    }
  }, 1000);
};

// Lifecycle
onMounted(() => {
  // Focus no primeiro input
  setTimeout(() => {
    const firstInput = document.querySelector(
      '.phone-input input'
    ) as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, 100);
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (resendTimerInterval) clearInterval(resendTimerInterval);
});
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$primary-light: #f0f2ff;
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.forgot-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

// ============== BACKGROUND ==============
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(91, 114, 255, 0.05) 0%,
    rgba(0, 217, 255, 0.05) 100%
  );
  pointer-events: none;
  z-index: 0;
}

// ============== ORBS ==============
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, $primary, $secondary);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, $secondary, $primary);
  bottom: 100px;
  right: -50px;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, $primary, #a78bfa);
  bottom: 20%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
}

// ============== CONTAINER ==============
.forgot-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

// ============== LEFT SECTION ==============
.left-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  animation: slideInLeft 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 0;
    text-align: center;
  }
}


// Brand Logo
.brand-logo {
  margin-bottom: 40px;

  .logo-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $primary, $secondary);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba($primary, 0.2);

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
    }
  }

  .brand-title {
    font-size: 42px;
    font-weight: 700;
    color: $dark;
    margin: 0;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  .brand-subtitle {
    font-size: 16px;
    color: #6b7280;
    margin: 8px 0 0 0;
    font-weight: 500;
  }
}

// Help Box
.help-box {
  background: linear-gradient(135deg, rgba($primary, 0.08), rgba($secondary, 0.08));
  border: 1px solid rgba($primary, 0.15);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);

  .help-icon {
    color: $primary;
    margin-bottom: 15px;
  }

  .help-title {
    font-size: 20px;
    font-weight: 600;
    color: $dark;
    margin: 0 0 10px 0;
  }

  .help-text {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
}

// Steps List
.steps-list {
  margin-bottom: 40px;

  .step-item {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid $border;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba($primary, 0.3);
    }

    .step-number {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, $primary, $secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-content {
      h3 {
        font-size: 14px;
        font-weight: 600;
        color: $dark;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 12px;
        color: #9ca3af;
        margin: 0;
      }
    }
  }
}

// Security Info
.security-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #6b7280;
  padding: 15px;
  background: rgba($success, 0.05);
  border: 1px solid rgba($success, 0.15);
  border-radius: 12px;

  i {
    color: $success;
    flex-shrink: 0;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// ============== RIGHT SECTION ==============
.right-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: slideInRight 0.8s ease-out;

  @media (max-width: 768px) {
    animation: slideInUp 0.8s ease-out;
  }
}

.form-wrapper {
  width: 100%;
}

// Form Header
.form-header {
  margin-bottom: 30px;

  .form-title {
    font-size: 28px;
    font-weight: 700;
    color: $dark;
    margin: 0 0 8px 0;
  }

  .form-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

// Forgot Card
.forgot-card {
  border: 1px solid $border;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  &:hover {
    box-shadow: 0 20px 60px rgba(91, 114, 255, 0.1);
    border-color: rgba($primary, 0.2);
  }
}

// Form Steps
.form-step {
  animation: fadeIn 0.3s ease-out;

  .step-title {
    font-size: 16px;
    font-weight: 600;
    color: $dark;
    margin: 0 0 20px 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== INPUTS ==============
.input-group {
  margin-bottom: 20px;

  .input-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: $dark;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-hint {
    font-size: 12px;
    color: #9ca3af;
    margin: 6px 0 0 0;
    font-weight: 500;
  }
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;

  .phone-prefix {
    position: absolute;
    left: 12px;
    font-weight: 600;
    color: $dark;
    font-size: 14px;
  }

  .phone-input {
    flex: 1;

    :deep(.q-field__control) {
      padding-left: 50px;
    }
  }
}

// ============== OTP ==============
.otp-section {
  .otp-message {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 20px 0;

    strong {
      color: $primary;
      font-weight: 600;
    }
  }

  .otp-input-group {
    margin-bottom: 20px;

    .otp-instruction {
      font-size: 13px;
      color: #9ca3af;
      margin: 0 0 20px 0;
    }
  }
}

.otp-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    gap: 8px;
  }
}

.otp-digit-input {
  flex: 1;
  max-width: 60px;

  :deep(.q-field__control) {
    height: 60px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 700;
  }

  :deep(input) {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    caret-color: $primary;
  }

  @media (max-width: 480px) {
    max-width: 50px;

    :deep(.q-field__control) {
      height: 50px;
      font-size: 20px;
    }
  }
}

// Time Info
.time-remaining,
.time-expired {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  margin-top: 15px;
}

.time-remaining {
  color: #6b7280;

  strong {
    color: $primary;
    font-weight: 700;
  }
}

.time-expired {
  color: $danger;
}

// Password Strength
.password-strength {
  height: 4px;
  background: $light;
  border-radius: 2px;
  overflow: hidden;

  .strength-bar {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;

    &.strength-fraco {
      background: $danger;
    }

    &.strength-medio {
      background: #f59e0b;
    }

    &.strength-forte {
      background: $success;
    }
  }
}

// Resend Section
.resend-section {
  text-align: center;

  .resend-text {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 8px 0;
  }

  .resend-timer {
    font-size: 12px;
    color: #9ca3af;
    margin: 8px 0 0 0;
  }
}

// Action Button
.action-btn {
  background: linear-gradient(135deg, $primary, #4f5ae4);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba($primary, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba($primary, 0.3);
  }

  &:disabled {
    opacity: 0.6;
  }
}

// Error Banner
.error-banner {
  background: linear-gradient(135deg, rgba($danger, 0.1), rgba($danger, 0.05));
  border: 1px solid rgba($danger, 0.2);
  border-radius: 12px;
  color: #7f1d1d;

  :deep(.q-banner__content) {
    font-weight: 500;
    font-size: 13px;
  }
}

// Success Step
.success-step {
  text-align: center;
  padding: 40px 20px !important;

  .success-icon {
    color: $success;
    margin-bottom: 20px;
  }

  .success-title {
    font-size: 24px;
    font-weight: 700;
    color: $dark;
    margin: 0 0 12px 0;
  }

  .success-message {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }
}

// Back Section
.back-section {
  text-align: center;
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-field__outlined) {
  border-radius: 12px;
}

:deep(.q-field__control) {
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.q-field__native),
:deep(.q-field__input) {
  color: $dark;

  &::placeholder {
    color: #d1d5db;
  }
}

:deep(.q-field--outlined.q-field--focused .q-field__control::before) {
  border-color: $primary;
  box-shadow: 0 0 0 3px rgba($primary, 0.1);
}

:deep(.q-field--outlined .q-field__control::before) {
  border-color: $border;
  transition: all 0.3s ease;
}

:deep(.q-field--outlined .q-field__control:hover::before) {
  border-color: rgba($primary, 0.3);
}
</style>
