import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Profile = {
  id: string
  username: string
  role: 'admin' | 'operator'
  is_active: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const initialized = ref(false)

  async function refreshProfile() {
    if (!supabase || !user.value) {
      profile.value = null
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, role, is_active')
      .eq('id', user.value.id)
      .maybeSingle()
    profile.value = error ? null : data as Profile | null
  }

  async function initialize() {
    if (!supabase || initialized.value) return
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    await refreshProfile()
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      void refreshProfile()
    })
    initialized.value = true
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  return { user, profile, initialized, initialize, refreshProfile, signOut }
}, { persist: { pick: ['user'] } })
