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
const email = ref('')
const password = ref('')
const submitting = ref(false)
const configState = computed(() => supabaseConfigured ? '已配置 Supabase' : '等待连接 Supabase')

async function submit() {
  if (!supabase) {
    ElMessage.warning('还未配置 Supabase 项目。你提供项目连接信息后即可启用登录。')
    return
  }
  submitting.value = true
  try {
    const result = mode.value === 'login'
      ? await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
      : await supabase.auth.signUp({ email: email.value, password: password.value })
    if (result.error) throw result.error
    await auth.initialize()
    if (mode.value === 'signup' && !result.data.session) {
      ElMessage.success('注册请求已提交，请查看邮箱完成验证。')
    } else {
      await router.push('/workspace')
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
          <label for="email">邮箱</label>
          <el-input id="email" v-model="email" type="email" autocomplete="email" placeholder="name@company.com" size="large" required />
          <label for="password">密码</label>
          <el-input id="password" v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码" size="large" show-password required minlength="8" />
          <button class="submit-button" type="submit" :disabled="submitting">
            {{ submitting ? '正在连接…' : mode === 'login' ? '登录工作台' : '注册账户' }}
            <ArrowRight :size="17" />
          </button>
        </form>
        <div class="connection-state" :class="{ connected: supabaseConfigured }">
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
