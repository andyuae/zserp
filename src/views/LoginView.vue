<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight, BarChart3, ShieldCheck, Sparkles } from 'lucide-vue-next'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const mode = ref<'login' | 'signup'>('login')
const username = ref('')
const password = ref('')
const submitting = ref(false)
const authDomain = (import.meta.env.VITE_AUTH_EMAIL_DOMAIN ?? '').trim().toLowerCase().replace(/^@/, '')
const configState = computed(() => !supabaseConfigured ? '等待连接 Supabase' : authDomain ? '已配置 Supabase' : '等待配置登录域名')

function authEmail(value: string) {
  return `${value.trim().toLowerCase()}@${authDomain}`
}

async function submit() {
  if (!supabase) {
    ElMessage.warning('还未配置 Supabase 项目。你提供项目连接信息后即可启用登录。')
    return
  }
  if (!authDomain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(authDomain)) {
    ElMessage.warning('需要先在部署配置中设置公司实际拥有的登录域名。')
    return
  }
  const normalizedUsername = username.value.trim().toLowerCase()
  if (!/^[a-z0-9][a-z0-9._-]{2,29}$/.test(normalizedUsername)) {
    ElMessage.warning('用户名需为 3–30 位，以字母或数字开头，只能包含字母、数字、点、下划线和短横线。')
    return
  }
  submitting.value = true
  try {
    const result = mode.value === 'login'
      ? await supabase.auth.signInWithPassword({ email: authEmail(normalizedUsername), password: password.value })
      : await supabase.auth.signUp({
          email: authEmail(normalizedUsername),
          password: password.value,
          options: { data: { username: normalizedUsername } },
        })
    if (result.error) throw result.error
    await auth.initialize()
    if (mode.value === 'signup' && !result.data.session) {
      ElMessage.warning('注册成功，但 Supabase 仍要求邮箱验证。请在 Supabase Auth 设置中关闭邮箱确认后再注册。')
    } else {
      await auth.refreshProfile()
      if (auth.profile?.is_active) {
        await router.push('/workspace')
      } else {
        await auth.signOut()
        ElMessage.info(mode.value === 'signup' ? '账号已创建，等待管理员启用后即可登录。' : '账号正在等待管理员启用。')
      }
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请检查账户信息。')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-aside">
      <div class="brand-lockup">
        <div class="brand-mark"><BarChart3 :size="19" :stroke-width="2.4" /></div>
        <span>运营数据工作台</span>
      </div>
      <div class="aside-copy">
        <p class="eyebrow">AMAZON OPERATIONS · BI</p>
        <h1>让每个商品的<br />表现都清晰可见。</h1>
        <p class="aside-description">整合多店铺运营数据，快速定位变化，把分析转化为团队行动。</p>
        <div class="feature-list">
          <div><span class="feature-icon cyan"><BarChart3 :size="16" /></span><span>跨店铺 ASIN 周表现</span></div>
          <div><span class="feature-icon coral"><ShieldCheck :size="16" /></span><span>运营事项与处理进度</span></div>
          <div><span class="feature-icon gold"><Sparkles :size="16" /></span><span>AI 辅助洞察与建议</span></div>
        </div>
      </div>
      <div class="aside-footer">内部运营系统 <span>·</span> 私有工作空间</div>
    </section>

    <section class="login-main">
      <div class="login-card">
        <div class="login-heading">
          <p class="eyebrow">WELCOME BACK</p>
          <h2>{{ mode === 'login' ? '登录工作台' : '创建账户' }}</h2>
          <p>{{ mode === 'login' ? '使用公司分配的账户继续工作' : '注册后由管理员确认你的工作权限' }}</p>
        </div>
        <div class="mode-switch" role="tablist" aria-label="登录或注册">
          <button :class="{ active: mode === 'login' }" @click="mode = 'login'">登录</button>
          <button :class="{ active: mode === 'signup' }" @click="mode = 'signup'">注册</button>
        </div>
        <form class="login-form" @submit.prevent="submit">
          <label for="username">用户名</label>
          <el-input id="username" v-model="username" autocomplete="username" placeholder="请输入用户名" size="large" required minlength="3" maxlength="30" />
          <label for="password">密码</label>
          <el-input id="password" v-model="password" type="password" :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'" placeholder="至少 8 位" size="large" show-password required minlength="8" />
          <button class="submit-button" type="submit" :disabled="submitting">
            {{ submitting ? '正在连接…' : mode === 'login' ? '登录工作台' : '注册账户' }}
            <ArrowRight :size="17" />
          </button>
        </form>
        <div class="connection-state" :class="{ connected: supabaseConfigured && authDomain }">
          <span class="state-dot"></span>
          <span>{{ configState }}</span>
        </div>
        <p v-if="!supabaseConfigured" class="config-note">连接配置完成后，将启用真实账号认证。当前可先查看界面预览。</p>
        <RouterLink to="/preview" class="preview-link">打开界面预览 <ArrowRight :size="15" /></RouterLink>
      </div>
      <div class="login-bottom">© 2026 运营数据工作台 <span>·</span> Saudi Arabia & United Arab Emirates</div>
    </section>
  </main>
</template>
