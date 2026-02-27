<template>
  <q-layout class="history-layout">
        <q-page-container>
    <q-page class="bg-grey-1 q-pa-lg">
      <!-- Header -->
      <div class="row items-center q-mb-lg">
        <q-btn
          icon="arrow_back"
          flat
          round
          dense
          v-go-back="'/'"
          class="q-mr-sm"
        />
        <div>
          <div class="text-h5 text-weight-bold">Termos de Uso</div>
          <div class="text-caption text-grey-7">Versão Beta - Xitique+</div>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Sidebar - Navegação -->
        <div class="col-12 col-md-3">
          <q-card flat bordered class="rounded-20 sticky-top">
            <q-card-section class="q-pa-md">
              <div class="text-subtitle2 text-weight-bold q-mb-md">
                Conteúdo
              </div>
              <q-list separator dense>
                <q-item
                  v-for="section in sections"
                  :key="section.id"
                  clickable
                  @click="scrollToSection(section.id)"
                  :active="activeSection === section.id"
                  active-class="bg-primary text-white"
                >
                  <q-item-section class="text-caption text-weight-medium">
                    {{ section.title }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Conteúdo Principal -->
        <div class="col-12 col-md-9">
          <q-card flat bordered class="rounded-20 bg-white">
            <!-- Header do Documento -->
            <q-card-section class="bg-gradient text-white q-pa-lg">
              <div class="text-h4 text-weight-bold q-mb-sm">
                TERMOS DE USO - VERSÃO BETA
              </div>
              <div class="text-subtitle2 opacity-80 q-mb-md">
                Xitique+ - Aplicação de Gestão de Grupos de Poupança
              </div>
              <q-chip
                color="white"
                text-color="primary"
                icon="info"
                label="Versão 1.0 Beta"
                class="q-mb-md"
              />
              <div class="text-caption opacity-80">
                Última atualização: {{ currentDate }}
              </div>
            </q-card-section>

            <q-separator />

            <!-- Introdução -->
            <q-card-section class="q-pa-lg">
              <div class="text-body1 text-grey-8 line-height-lg">
                <p class="q-mb-md">
                  Bem-vindo ao <strong>Xitique+</strong>! Ao utilizar esta
                  aplicação, você concorda com os termos e condições
                  apresentados abaixo. Por favor, leia atentamente antes de
                  utilizar o serviço.
                </p>
                <p
                  class="text-caption text-grey-6 q-pa-md bg-blue-1 rounded-10"
                >
                  <q-icon name="warning" color="info" />
                  Esta é uma versão Beta. Funcionalidades podem sofrer
                  alterações e melhorias contínuas.
                </p>
              </div>
            </q-card-section>

            <!-- Seção 1 -->
            <q-card-section id="section-1" class="q-pa-lg border-top">
              <div class="section-header q-mb-md">
                <q-icon name="info" color="primary" size="md" class="q-mr-sm" />
                <h2 class="text-h6 text-weight-bold">1. Natureza do Serviço</h2>
              </div>

              <div class="text-body1 text-grey-8 line-height-lg q-ml-lg">
                <p class="q-mb-md">
                  O <strong>Xitique+</strong> é uma ferramenta tecnológica de
                  gestão e organização de grupos de poupança (Xitique). A
                  aplicação funciona como um sistema de:
                </p>

                <ul class="q-pl-md q-my-md">
                  <li class="q-mb-sm">
                    Registro e acompanhamento de contribuições
                  </li>
                  <li class="q-mb-sm">Gestão de ciclos de pagamento</li>
                  <li class="q-mb-sm">Controle de membros e empréstimos</li>
                  <li class="q-mb-sm">
                    Visualização de histórico e relatórios
                  </li>
                </ul>

                <p class="q-mb-md text-weight-bold text-primary">
                  ⚠️ IMPORTANTE: A aplicação NÃO é uma instituição financeira e
                  NÃO realiza a custódia (guarda) de valores monetários.
                </p>

                <p
                  class="bg-orange-1 q-pa-md rounded-10 text-orange-9 text-weight-medium"
                >
                  Todo e qualquer dinheiro permanece sob responsabilidade dos
                  membros do grupo. A Xitique+ apenas organiza e regista as
                  informações.
                </p>
              </div>
            </q-card-section>

            <!-- Seção 2 -->
            <q-card-section id="section-2" class="q-pa-lg border-top">
              <div class="section-header q-mb-md">
                <q-icon
                  name="people"
                  color="primary"
                  size="md"
                  class="q-mr-sm"
                />
                <h2 class="text-h6 text-weight-bold">
                  2. Responsabilidade dos Membros
                </h2>
              </div>

              <div class="text-body1 text-grey-8 line-height-lg q-ml-lg">
                <p class="q-mb-md">
                  A decisão de formar um grupo e confiar dinheiro a outros
                  membros é de
                  <strong>inteira responsabilidade dos utilizadores</strong>.
                </p>

                <q-timeline color="primary" class="q-my-lg">
                  <q-timeline-entry
                    title="Formação do Grupo"
                    subtitle="Decisão coletiva"
                    icon="group_add"
                  >
                    Cada membro decide voluntariamente participar e contribuir
                    ao grupo.
                  </q-timeline-entry>

                  <q-timeline-entry
                    title="Gestão de Fundos"
                    subtitle="Responsabilidade compartilhada"
                    icon="savings"
                  >
                    Os membros são responsáveis por guardar e gerenciar o
                    dinheiro coletado.
                  </q-timeline-entry>

                  <q-timeline-entry
                    title="Cumprimento de Regras"
                    subtitle="Obrigações"
                    icon="rule"
                  >
                    O grupo estabelece suas próprias regras e o Xitique+ apenas
                    facilita o acompanhamento.
                  </q-timeline-entry>

                  <q-timeline-entry
                    title="Resolução de Conflitos"
                    subtitle="Entre membros"
                    icon="gavel"
                  >
                    Disputas devem ser resolvidas entre os membros, fora da
                    plataforma.
                  </q-timeline-entry>
                </q-timeline>

                <div
                  class="bg-red-1 q-pa-md rounded-10 text-negative text-weight-medium q-mt-lg"
                >
                  <q-icon name="error" size="sm" class="q-mr-sm" />
                  O Xitique+ NÃO se responsabiliza por:
                </div>

                <ul class="q-pl-md q-my-md text-negative text-weight-medium">
                  <li class="q-mb-sm">Incumprimentos ou falta de pagamento</li>
                  <li class="q-mb-sm">Má gestão financeira dos membros</li>
                  <li class="q-mb-sm">Desvio ou perda de fundos</li>
                  <li class="q-mb-sm">Conflitos entre membros</li>
                  <li class="q-mb-sm">
                    Descumprimento de promessas ou acordos verbais
                  </li>
                </ul>
              </div>
            </q-card-section>

            <!-- Seção 3 -->
            <q-card-section id="section-3" class="q-pa-lg border-top">
              <div class="section-header q-mb-md">
                <q-icon
                  name="bug_report"
                  color="primary"
                  size="md"
                  class="q-mr-sm"
                />
                <h2 class="text-h6 text-weight-bold">3. Exactidão dos Dados</h2>
              </div>

              <div class="text-body1 text-grey-8 line-height-lg q-ml-lg">
                <p class="q-mb-md">
                  Durante esta fase de testes (<strong>Beta</strong>), o
                  utilizador reconhece que o sistema pode apresentar:
                </p>

                <div class="row q-col-gutter-md q-mb-lg">
                  <div class="col-12 col-sm-6">
                    <q-card flat bordered class="bg-grey-1">
                      <q-card-section>
                        <q-icon
                          name="warning"
                          color="warning"
                          size="lg"
                          class="q-mb-sm"
                        />
                        <div class="text-subtitle2 text-weight-bold q-mb-xs">
                          Instabilidades
                        </div>
                        <div class="text-caption text-grey-7">
                          Erros de cálculo, sincronização ou perda de dados
                          temporária
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-card flat bordered class="bg-grey-1">
                      <q-card-section>
                        <q-icon
                          name="cached"
                          color="info"
                          size="lg"
                          class="q-mb-sm"
                        />
                        <div class="text-subtitle2 text-weight-bold q-mb-xs">
                          Mudanças
                        </div>
                        <div class="text-caption text-grey-7">
                          Interface, funcionalidades ou fluxos podem ser
                          alterados
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <div
                  class="bg-blue-1 q-pa-md rounded-10 text-blue-9 text-weight-medium q-mt-lg"
                >
                  <q-icon name="check_circle" size="sm" class="q-mr-sm" />
                  <strong>O que esperamos de você:</strong>
                </div>

                <ol class="q-pl-md q-my-md">
                  <li class="q-mb-sm">
                    <strong>Verifique regularmente</strong> os cálculos e dados
                    no sistema
                  </li>
                  <li class="q-mb-sm">
                    <strong>Comunique imediatamente</strong> qualquer
                    discrepância ao suporte
                  </li>
                  <li class="q-mb-sm">
                    <strong>Mantenha registros físicos</strong> ou alternativos
                    durante a Beta
                  </li>
                  <li class="q-mb-sm">
                    <strong>Envie feedback</strong> para ajudar a melhorar a
                    aplicação
                  </li>
                </ol>

                <q-banner class="bg-info text-white q-mt-lg rounded-10">
                  <template v-slot:avatar>
                    <q-icon name="lightbulb" />
                  </template>
                  Sua participação durante o Beta é crucial para identificar e
                  corrigir problemas.
                </q-banner>
              </div>
            </q-card-section>

            <!-- Seção 4 -->
            <q-card-section id="section-4" class="q-pa-lg border-top">
              <div class="section-header q-mb-md">
                <q-icon
                  name="security"
                  color="primary"
                  size="md"
                  class="q-mr-sm"
                />
                <h2 class="text-h6 text-weight-bold">
                  4. Privacidade e Segurança
                </h2>
              </div>

              <div class="text-body1 text-grey-8 line-height-lg q-ml-lg">
                <p class="q-mb-md">
                  O utilizador compromete-se a fornecer
                  <strong>dados verdadeiros e atualizados</strong> e a manter a
                  <strong>segurança da sua palavra-passe</strong>.
                </p>

                <div class="row q-col-gutter-md q-mb-lg">
                  <div class="col-12 col-sm-6">
                    <div class="bg-success-light q-pa-md rounded-10">
                      <q-icon
                        name="verified_user"
                        color="positive"
                        size="lg"
                        class="q-mb-sm"
                      />
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">
                        Suas Responsabilidades
                      </div>
                      <ul class="q-pl-md text-caption q-my-sm">
                        <li>Proteger sua palavra-passe</li>
                        <li>Não compartilhar credenciais</li>
                        <li>Fazer logout em dispositivos públicos</li>
                        <li>Reportar acessos suspeitos</li>
                      </ul>
                    </div>
                  </div>

                  <div class="col-12 col-sm-6">
                    <div class="bg-info-light q-pa-md rounded-10">
                      <q-icon
                        name="lock"
                        color="info"
                        size="lg"
                        class="q-mb-sm"
                      />
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">
                        Acesso ao Grupo
                      </div>
                      <ul class="q-pl-md text-caption q-my-sm">
                        <li>Link de convite gerado pelo Administrador</li>
                        <li>Link pode ser compartilhado com novos membros</li>
                        <li>Administrador controla quem entra/sai</li>
                        <li>Link pode ser revogado a qualquer momento</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p
                  class="text-weight-bold text-negative q-p-md bg-red-1 rounded-10"
                >
                  ⚠️ O Xitique+ não pode recuperar credenciais perdidas. Guarde
                  sua palavra-passe num local seguro.
                </p>
              </div>
            </q-card-section>

            <!-- Seção 5 -->
            <q-card-section id="section-5" class="q-pa-lg border-top">
              <div class="section-header q-mb-md">
                <q-icon
                  name="attach_money"
                  color="primary"
                  size="md"
                  class="q-mr-sm"
                />
                <h2 class="text-h6 text-weight-bold">5. Taxas de Serviço</h2>
              </div>

              <div class="text-body1 text-grey-8 line-height-lg q-ml-lg">
                <div
                  class="bg-positive text-white q-pa-md rounded-10 q-mb-lg text-weight-bold"
                >
                  <q-icon name="check_circle" size="md" class="q-mr-sm" />
                  Durante a fase Beta, o uso da aplicação é
                  <strong>TOTALMENTE GRATUITO</strong>.
                </div>

                <p class="q-mb-md">Futuras atualizações poderão incluir:</p>

                <div class="row q-col-gutter-md q-mb-lg">
                  <div class="col-12 col-sm-6">
                    <q-card flat bordered>
                      <q-card-section>
                        <div
                          class="text-caption text-weight-bold text-primary q-mb-xs"
                        >
                          Taxa de Manutenção
                        </div>
                        <div class="text-body2">
                          Percentagem pequena (ex: 1-3%) sobre os fundos para
                          cobrir custos operacionais
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-card flat bordered>
                      <q-card-section>
                        <div
                          class="text-caption text-weight-bold text-primary q-mb-xs"
                        >
                          Plano Premium
                        </div>
                        <div class="text-body2">
                          Funcionalidades avançadas como relatórios, integração
                          bancária, etc.
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <q-banner class="bg-warning text-dark q-mt-lg rounded-10">
                  <template v-slot:avatar>
                    <q-icon name="info" />
                  </template>
                  <strong>Compromisso:</strong> Qualquer mudança de preço será
                  comunicada com
                  <strong>pelo menos 30 dias de antecedência</strong>.
                </q-banner>
              </div>
            </q-card-section>

            <!-- Seção 6 -->
            <q-card-section id="section-6" class="q-pa-lg border-top">
              <div class="section-header q-mb-md">
                <q-icon
                  name="gavel"
                  color="primary"
                  size="md"
                  class="q-mr-sm"
                />
                <h2 class="text-h6 text-weight-bold">6. Foro e Jurisdição</h2>
              </div>

              <div class="text-body1 text-grey-8 line-height-lg q-ml-lg">
                <p class="q-mb-md">
                  Para a resolução de qualquer litígio ou disputa relacionada ao
                  uso desta aplicação, as partes elegem o foro da
                  <strong>Comarca de Maputo, Moçambique</strong>, com exclusão
                  de qualquer outro.
                </p>

                <div class="bg-grey-1 q-pa-md rounded-10 q-mb-lg">
                  <p class="text-weight-bold text-grey-9 q-mb-sm">
                    Lei Aplicável:
                  </p>
                  <ul class="q-pl-md">
                    <li class="q-mb-sm">Leis da República de Moçambique</li>
                    <li class="q-mb-sm">
                      Códigos Civil e Comercial Moçambicanos
                    </li>
                    <li class="q-mb-sm">
                      Regulamentações de Proteção de Dados Pessoais
                    </li>
                  </ul>
                </div>

                <p class="text-caption text-grey-6 q-p-md bg-blue-1 rounded-10">
                  ℹ️ Nota: Este documento está simplificado. Para informações
                  legais completas, consulte um advogado.
                </p>
              </div>
            </q-card-section>

            <!-- Aceitação Final -->
            <q-card-section class="q-pa-lg border-top bg-blue-1 rounded-20">
              <div class="row items-center q-gutter-md">
                <q-icon name="check_circle" color="positive" size="lg" />
                <div class="col">
                  <div class="text-subtitle2 text-weight-bold">
                    Você concorda com estes Termos?
                  </div>
                  <div class="text-caption text-grey-7">
                    Ao usar a aplicação, você automaticamente concorda com estes
                    termos.
                  </div>
                </div>
              </div>

              <div class="row q-gutter-md q-mt-lg">
                <q-btn
                  color="primary"
                  label="Aceitar e Continuar"
                  rounded
                  class="col-12 col-sm-auto"
                  @click="acceptTerms"
                />
                <q-btn
                  color="grey-7"
                  label="Ler Novamente"
                  rounded
                  outline
                  class="col-12 col-sm-auto"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Footer -->
          <div class="text-center q-mt-lg q-mb-lg text-caption text-grey-6">
            <p>
              Termos de Uso – Xitique+ Versão 1.0 Beta | Última atualização:
              {{ currentDate }}
            </p>
            <p>
              Para dúvidas ou questões legais, contacte:
              <strong>legal@xiquiteplus.com</strong>
            </p>
          </div>
        </div>
      </div>
    </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeSection = ref('section-1');
const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const sections = [
  {
    id: 'section-1',
    title: '1. Natureza do Serviço',
  },
  {
    id: 'section-2',
    title: '2. Responsabilidade dos Membros',
  },
  {
    id: 'section-3',
    title: '3. Exactidão dos Dados',
  },
  {
    id: 'section-4',
    title: '4. Privacidade e Segurança',
  },
  {
    id: 'section-5',
    title: '5. Taxas de Serviço',
  },
  {
    id: 'section-6',
    title: '6. Foro e Jurisdição',
  },
];

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const acceptTerms = () => {
  // Guardar no localStorage que o utilizador aceitou
  localStorage.setItem('termsAccepted', 'true');
  localStorage.setItem('termsAcceptedDate', new Date().toISOString());

  // Redirecionar ou fechar modal
  console.log('Termos aceitos!');
  // router.push('/dashboard')
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.rounded-20 {
  border-radius: 20px;
}

.rounded-10 {
  border-radius: 10px;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.line-height-lg {
  line-height: 1.8;
}

.section-header {
  display: flex;
  align-items: center;
}

.sticky-top {
  position: sticky;
  top: 80px;
}

ul,
ol {
  list-style-position: inside;
}

li {
  text-align: justify;
}

.bg-success-light {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.bg-info-light {
  background-color: #e3f2fd;
  color: #1565c0;
}

.text-orange-9 {
  color: #e65100;
}

.bg-orange-1 {
  background-color: #ffe0b2;
}

.text-blue-9 {
  color: #0d47a1;
}

.bg-blue-1 {
  background-color: #bbdefb;
}

.text-negative {
  color: #c41c3b;
}

.bg-red-1 {
  background-color: #ffebee;
}

@media (max-width: 600px) {
  .sticky-top {
    position: static;
    top: auto;
  }
}
</style>
