import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const initialized = ref(false)

  async function initialize() {
    if (!supabase || initialized.value) return
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
    initialized.value = true
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    user.value = null
  }

  return { user, initialized, initialize, signOut }
}, { persist: { pick: ['user'] } })
