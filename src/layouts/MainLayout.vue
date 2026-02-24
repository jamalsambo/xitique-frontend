<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">

    <q-header class="bg-white-transparent backdrop-blur text-grey-9" flat bordered>
      <q-toolbar class="q-py-sm">
        <q-btn flat round dense icon="menu" class="q-mr-sm lt-md" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title class="text-weight-bolder text-h5 letter-spacing-tight">
          <span class="text-primary">Xitique</span><span class="text-positive">+</span>
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row no-wrap items-center">
          <q-btn flat round dense icon="notifications_none" color="grey-7">
            <q-badge color="negative" floating rounded borderless>2</q-badge>
            <q-menu transition-show="jump-down" transition-hide="jump-up" class="rounded-20">
               <q-list style="min-width: 250px">
                  <q-item-label header>Notificações</q-item-label>
                  <q-item clickable v-ripple>
                    <q-item-section>Novo pagamento no Grupo Central</q-item-section>
                  </q-item>
               </q-list>
            </q-menu>
          </q-btn>

          <q-avatar size="38px" class="cursor-pointer shadow-1 transition-hover">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
            <q-menu anchor="bottom right" self="top right" transition-show="flip-right" transition-hide="flip-left" class="rounded-15 shadow-20">
              <div class="row no-wrap q-pa-md">
                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="https://cdn.quasar.dev/img/avatar.png">
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs text-weight-bold">Usuário Master</div>
                  <q-btn color="primary" label="Sair" push size="sm" v-close-popup @click="logout" icon="logout" />
                </div>
              </div>
            </q-menu>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above width="280" class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list padding class="q-px-md">
          <q-item-label header class="text-overline q-pt-lg text-grey-6 letter-spacing-1">GERAL</q-item-label>

          <q-item
            v-for="item in menuItems"
            :key="item.to"
            clickable
            v-ripple
            :to="item.to"
            exact
            active-class="active-menu-item"
            class="rounded-borders q-mb-sm sidebar-item"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="22px" />
            </q-item-section>
            <q-item-section class="text-weight-bold">
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <q-footer v-if="$q.screen.xs" class="bg-transparent q-pa-lg">
      <q-tabs
        dense
        indicator-color="transparent"
        active-color="primary"
        class="bg-white text-grey-6 shadow-20 rounded-pill q-py-xs"
        align="justify"
      >
        <q-route-tab to="/" icon="grid_view" />
        <q-route-tab to="/groups" icon="group_work" />
        <q-route-tab to="/contributions" icon="account_balance_wallet" />
        <q-route-tab to="/settings" icon="settings" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/pages/auth/stores';

const auth = useAuthStore()

const leftDrawerOpen = ref(false);
const router = useRouter();

const menuItems = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Meus Grupos', to: '/groups', icon: 'style' },
  { label: 'Extrato', to: '/contributions', icon: 'account_balance_wallet' },
  { label: 'Configurações', to: '/settings', icon: 'settings_suggest' },
];

onMounted(() => {
  auth.refreshToken();
});

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style lang="scss">
// Efeito de Vidro Fosco
.bg-white-transparent {
  background: rgba(255, 255, 255, 0.85) !important;
}
.backdrop-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

// Tipografia e Espaçamento
.letter-spacing-tight { letter-spacing: -0.5px; }
.letter-spacing-1 { letter-spacing: 1px; }

// Menu Ativo Moderno
.active-menu-item {
  background: white !important;
  color: var(--q-primary) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--q-primary);

  .q-icon {
    color: var(--q-primary);
  }
}

.sidebar-item {
  transition: all 0.3s ease;
  color: #64748b;
  &:hover {
    background: rgba(99, 102, 241, 0.05);
  }
}

// Arredondamentos e Sombras
.rounded-15 { border-radius: 15px !important; }
.rounded-20 { border-radius: 20px !important; }
.rounded-pill { border-radius: 50px !important; }

.shadow-20 {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.transition-hover {
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
}
</style>
