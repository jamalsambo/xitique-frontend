<template>
  <q-layout class="otp-layout">
    <q-page-container>
      <q-page class="otp-page">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <div class="otp-container">
          <!-- Card Principal -->
          <q-card class="otp-card">
            <!-- Header -->
            <q-card-section class="otp-header text-center">
              <div class="otp-icon">
                <q-icon name="verified_user" size="64px" />
              </div>
              <h1 class="otp-title">Verificar Telefone</h1>
              <p class="otp-subtitle">
                Insira o código enviado para
                <strong>+258 {{ maskPhone(auth.otpPhone) }}</strong>
              </p>
            </q-card-section>

            <!-- Form Section -->
            <q-card-section class="otp-form q-pa-lg">
              <!-- OTP Input -->
              <div class="otp-input-group">
                <label class="input-label">Código de Verificação</label>
                <p class="otp-instruction">Insira os 6 dígitos do SMS</p>

                <!-- Individual Digit Inputs -->
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
                    :autofocus="index === 0"
                  />
                </div>

                <!-- Time Remaining -->
                <div v-if="!isOTPExpired" class="time-remaining">
                  ⏱️ Código expira em: <strong>{{ timeRemaining }}s</strong>
                </div>
                <div v-else class="time-expired">
                  ⚠️ Código expirou. Solicite um novo.
                </div>
              </div>

              <!-- Verify Button -->
              <q-btn
                label="Verificar"
                color="primary"
                :loading="auth.loading"
                @click="handleVerifyOTP"
                class="verify-btn q-mt-lg full-width"
                size="lg"
                no-caps
                unelevated
              />

              <!-- Error Message -->
              <q-banner v-if="auth.error" class="error-banner q-mt-md" dense>
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

              <!-- Attempts Counter -->
              <div v-if="auth.otpAttempts > 0" class="attempts-info q-mt-md">
                <p class="attempts-text">
                  Tentativas restantes: {{ 5 - auth.otpAttempts }}/5
                </p>
                <q-linear-progress
                  :value="(5 - auth.otpAttempts) / 5"
                  color="primary"
                  rounded
                />
              </div>
            </q-card-section>

            <q-separator />

            <!-- Footer -->
            <q-card-section class="otp-footer">
              <!-- Resend OTP -->
              <div class="resend-section">
                <p class="resend-text">Não recebeu o código?</p>
                <q-btn
                  label="Reenviar Código"
                  flat
                  color="primary"
                  no-caps
                  :loading="auth.loading"
                  :disable="!canResendOTP"
                  @click="handleResendOTP"
                />

                <p v-if="canResendOTP === false" class="resend-timer">
                  Pode reenviar em {{ resendTimer }}s
                </p>
              </div>

              <!-- Back Link -->
              <div class="back-section q-mt-md">
                <q-btn
                  label="Voltar para Registro"
                  flat
                  color="grey-7"
                  no-caps
                  @click="router.push('/register')"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Info Box -->
          <div class="info-box q-mt-lg">
            <q-icon name="info" />
            <span>Verifique sua pasta de SPAM se não encontrar o SMS</span>
          </div>
        </div>

        <!-- Floating Orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';
import useNotify from 'src/composables/UseNotify';

// Router & Store
const router = useRouter();
const auth = useAuthStore();
const { notifyInfo } = useNotify();

// OTP State
const otpDigits = ref(['', '', '', '', '', '']);
const timeRemaining = ref(600); // 10 minutos
const resendTimer = ref(0);
const canResendOTP = ref(true);
let timerInterval: NodeJS.Timeout | null = null;
let resendTimerInterval: NodeJS.Timeout | null = null;

// Computed
const isOTPComplete = computed(() => {
  return otpDigits.value.every((digit) => digit !== '');
});

const isOTPExpired = computed(() => {
  return auth.isOTPExpired();
});

// Methods
const handleDigitInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, ''); // Apenas números

  if (value) {
    otpDigits.value[index] = value;

    // Mover para próximo input
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
  // Backspace - mover para input anterior
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

  // Arrow keys
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

  // Enter - submeter
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
    await auth.verifyOTP(otp);
    // Sucesso - redirecionar para home
    router.push('/');
  } catch (error) {
    // Erro já está em auth.error
    console.error('Erro ao verificar OTP:', error);
  }
};

const handleResendOTP = async () => {
  try {
    const result = await auth.resendOTP();
    // Resetar OTP inputs
    otpDigits.value = ['', '', '', '', '', ''];
    // Resetar timer
    timeRemaining.value = 600;
    startTimer();
    // Mostrar feedback
    notifyInfo(result.message);
    console.log(result.message);
  } catch (error) {
    console.error('Erro ao reenviar OTP:', error);
  }
};
const maskPhone = (phone: string | null): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  // Formatar: 84 *** ****
  return `${cleaned.substring(0, 2)} *** ${cleaned.substring(
    cleaned.length - 4
  )}`;
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
  // Verificar se está vindo do registro
  if (!auth.otpSent) {
    router.push('/register');
    return;
  }

  // Iniciar timer do OTP
  startTimer();

  // Iniciar timer de resend
  startResendTimer();

  // Focus no primeiro input
  setTimeout(() => {
    const firstInput = document.querySelector(
      '.otp-digit-input'
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
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.otp-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.otp-page {
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
.otp-container {
  max-width: 500px;
  width: 100%;
  position: relative;
  z-index: 10;
  animation: slideInUp 0.8s ease-out;
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

// ============== CARD ==============
.otp-card {
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

// ============== HEADER ==============
.otp-header {
  padding: 40px 20px 20px !important;
  background: linear-gradient(
    135deg,
    rgba($primary, 0.05),
    rgba($secondary, 0.05)
  );

  .otp-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $primary, $secondary);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 20px;
    box-shadow: 0 10px 30px rgba($primary, 0.2);
  }

  .otp-title {
    font-size: 28px;
    font-weight: 700;
    color: $dark;
    margin: 0 0 8px 0;
  }

  .otp-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;

    strong {
      color: $primary;
      font-weight: 600;
    }
  }
}

// ============== FORM ==============
.otp-form {
  .input-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: $dark;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .otp-instruction {
    font-size: 13px;
    color: #9ca3af;
    margin: 0 0 20px 0;
  }
}

// ============== OTP INPUTS ==============
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

  :deep(.q-field) {
    height: 100%;
  }

  :deep(.q-field__control) {
    height: 60px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  :deep(input) {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    caret-color: $primary;
  }

  :deep(.q-field--outlined .q-field__control::before) {
    border-color: $border;
    border-width: 2px;
    transition: all 0.3s ease;
  }

  :deep(.q-field--focused .q-field__control::before) {
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  @media (max-width: 480px) {
    max-width: 50px;

    :deep(.q-field__control) {
      height: 50px;
      font-size: 20px;
    }

    :deep(input) {
      font-size: 20px;
    }
  }
}

// ============== TIME INFO ==============
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

  strong {
    color: $danger;
  }
}

// ============== VERIFY BUTTON ==============
.verify-btn {
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

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
  }
}

// ============== ERROR BANNER ==============
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

// ============== ATTEMPTS ==============
.attempts-info {
  .attempts-text {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 8px 0;
    font-weight: 500;
  }

  :deep(.q-linear-progress) {
    border-radius: 6px;
  }
}

// ============== FOOTER ==============
.otp-footer {
  background: rgba($light, 0.5);

  .resend-section {
    text-align: center;

    .resend-text {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 8px 0;
    }

    :deep(.q-btn) {
      font-size: 13px;
      font-weight: 600;
    }

    .resend-timer {
      font-size: 12px;
      color: #9ca3af;
      margin: 8px 0 0 0;
      font-weight: 500;
    }
  }

  .back-section {
    text-align: center;

    :deep(.q-btn) {
      font-size: 13px;
    }
  }
}

// ============== INFO BOX ==============
.info-box {
  background: rgba($primary, 0.05);
  border: 1px solid rgba($primary, 0.15);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;

  i {
    color: $primary;
    flex-shrink: 0;
  }

  span {
    line-height: 1.5;
  }
}
</style>
