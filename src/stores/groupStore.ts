/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useGroupStore = defineStore('groups', () => {
  // Carrega dados do localStorage se existir
  const savedGroups = localStorage.getItem('xitique_groups')

  const groups = ref(savedGroups ? JSON.parse(savedGroups) : [
    {
      id: 1,
      name: 'Xitique do Bairro',
      members: 15,
      amount: 500,
      lastMessage: 'João contribuiu 500 MZN',
      lastTime: '10:30',
      unread: 2,
      status: 'Ativo',
      collected: 7500,
      target: 7500
    },
    {
      id: 2,
      name: 'Poupança Vestuário',
      members: 8,
      amount: 1000,
      lastMessage: 'Sorteio desta semana',
      lastTime: '09:15',
      unread: 0,
      status: 'Ativo',
      collected: 6000,
      target: 8000
    },
    {
      id: 3,
      name: 'Grupo Alimentos',
      members: 12,
      amount: 250,
      lastMessage: 'Você recebeu 3000 MZN',
      lastTime: 'Ontem',
      unread: 5,
      status: 'Ativo',
      collected: 2500,
      target: 3000
    }
  ])

  // Salva no localStorage sempre que muda
  const saveToLocal = () => {
    localStorage.setItem('xitique_groups', JSON.stringify(groups.value))
  }

  const totalMembers = computed(() =>
    groups.value.reduce((sum: any, g: any) => sum + g.members, 0)
  )

  const totalCollected = computed(() =>
    groups.value.reduce((sum: any, g: any) => sum + g.collected, 0)
  )

  const totalTarget = computed(() =>
    groups.value.reduce((sum: any, g: any) => sum + g.target, 0)
  )

  function addGroup(group: any) {
    const newGroup = {
      ...group,
      id: Date.now(),
      lastMessage: 'Novo grupo criado',
      lastTime: 'Agora',
      unread: 0,
      collected: 0,
      target: group.members * group.amount
    }
    groups.value.unshift(newGroup)
    saveToLocal()
  }

  function deleteGroup(id: string) {
    groups.value = groups.value.filter((g: { id: string }) => g.id !== id)
    saveToLocal()
  }

  function updateGroup(id: any, updates: any) {
    const index = groups.value.findIndex((g: { id: any }) => g.id === id)
    if (index !== -1) {
      groups.value[index] = { ...groups.value[index], ...updates }
      saveToLocal()
    }
  }

  return {
    groups,
    totalMembers,
    totalCollected,
    totalTarget,
    addGroup,
    deleteGroup,
    updateGroup
  }
})
