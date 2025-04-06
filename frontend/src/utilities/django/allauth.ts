// This code is a modified version of the example code from django-allauth.
// https://github.com/pennersr/django-allauth/blob/main/examples/react-spa/frontend/src/lib/allauth.js


import { getCSRFToken } from './cstf'

export const Client = Object.freeze({
  APP: 'app',
  BROWSER: 'browser'
})

export const settings = {
  client: Client.BROWSER,
  baseUrl: `/_allauth/${Client.BROWSER}/v1`,
  withCredentials: false
}

const ACCEPT_JSON = {
  accept: 'application/json'
}

export const AuthProcess = Object.freeze({
  LOGIN: 'login',
  CONNECT: 'connect'
})

export const Flows = Object.freeze({
  LOGIN: 'login',
  LOGIN_BY_CODE: 'login_by_code',
  MFA_AUTHENTICATE: 'mfa_authenticate',
  MFA_REAUTHENTICATE: 'mfa_reauthenticate',
  MFA_TRUST: 'mfa_trust',
  MFA_WEBAUTHN_SIGNUP: 'mfa_signup_webauthn',
  PASSWORD_RESET_BY_CODE: 'password_reset_by_code',
  PROVIDER_REDIRECT: 'provider_redirect',
  PROVIDER_SIGNUP: 'provider_signup',
  REAUTHENTICATE: 'reauthenticate',
  SIGNUP: 'signup',
  VERIFY_EMAIL: 'verify_email',
})

export const URLs = Object.freeze({
  // Meta
  CONFIG: '/config',

  // Account management
  CHANGE_PASSWORD: '/account/password/change',
  EMAIL: '/account/email',
  PROVIDERS: '/account/providers',

  // Account management: 2FA
  AUTHENTICATORS: '/account/authenticators',
  RECOVERY_CODES: '/account/authenticators/recovery-codes',
  TOTP_AUTHENTICATOR: '/account/authenticators/totp',

  // Auth: Basics
  LOGIN: '/auth/login',
  REQUEST_LOGIN_CODE: '/auth/code/request',
  CONFIRM_LOGIN_CODE: '/auth/code/confirm',
  SESSION: '/auth/session',
  REAUTHENTICATE: '/auth/reauthenticate',
  REQUEST_PASSWORD_RESET: '/auth/password/request',
  RESET_PASSWORD: '/auth/password/reset',
  SIGNUP: '/auth/signup',
  VERIFY_EMAIL: '/auth/email/verify',

  // Auth: 2FA
  MFA_AUTHENTICATE: '/auth/2fa/authenticate',
  MFA_REAUTHENTICATE: '/auth/2fa/reauthenticate',
  MFA_TRUST: '/auth/2fa/trust',

  // Auth: Social
  PROVIDER_SIGNUP: '/auth/provider/signup',
  REDIRECT_TO_PROVIDER: '/auth/provider/redirect',
  PROVIDER_TOKEN: '/auth/provider/token',

  // Auth: Sessions
  SESSIONS: '/auth/sessions',

  // Auth: WebAuthn
  REAUTHENTICATE_WEBAUTHN: '/auth/webauthn/reauthenticate',
  AUTHENTICATE_WEBAUTHN: '/auth/webauthn/authenticate',
  LOGIN_WEBAUTHN: '/auth/webauthn/login',
  SIGNUP_WEBAUTHN: '/auth/webauthn/signup',
  WEBAUTHN_AUTHENTICATOR: '/account/authenticators/webauthn'
})

export const AuthenticatorType = Object.freeze({
  TOTP: 'totp',
  RECOVERY_CODES: 'recovery_codes',
  WEBAUTHN: 'webauthn'
})

const postForm = (action: string, data: Record<string, any>) => {
  const f = document.createElement('form')
  f.method = 'POST'
  f.action = settings.baseUrl + action

  for (const key in data) {
    const d = document.createElement('input')
    d.type = 'hidden'
    d.name = key
    d.value = data[key]
    f.appendChild(d)
  }
  document.body.appendChild(f)
  f.submit()
}

const tokenStorage = window.sessionStorage

export const getSessionToken = () => {
  return tokenStorage.getItem('sessionToken')
}

const request = async (method: string, path: string, data?: Record<string, any>, headers?: Record<string, string>) => {
  const options: Record<string, any> = {
    method,
    headers: {
      ...ACCEPT_JSON,
      ...headers
    }
  }
  if (settings.withCredentials) {
    options.credentials = 'include'
  }
  // Don't pass along authentication related headers to the config endpoint.
  if (path !== URLs.CONFIG) {
    if (settings.client === Client.BROWSER) {
      options.headers['X-CSRFToken'] = getCSRFToken()
    } else if (settings.client === Client.APP) {
      // IMPORTANT!: Do NOT use `Client.APP` in a browser context, as you will
      // be vulnerable to CSRF attacks. This logic is only here for
      // development/demonstration/testing purposes...
      options.headers['User-Agent'] = 'django-allauth example app'
      const sessionToken = getSessionToken()
      if (sessionToken) {
        options.headers['X-Session-Token'] = sessionToken
      }
    }
  }

  if (typeof data !== 'undefined') {
    options.body = JSON.stringify(data)
    options.headers['Content-Type'] = 'application/json'
  }
  const resp = await fetch(settings.baseUrl + path, options)
  const msg = await resp.json()
  if (msg.status === 410) {
    tokenStorage.removeItem('sessionToken')
  }
  if (msg.meta?.session_token) {
    tokenStorage.setItem('sessionToken', msg.meta.session_token)
  }
  if ([401, 410].includes(msg.status) || (msg.status === 200 && msg.meta?.is_authenticated)) {
    const event = new CustomEvent('allauth.auth.change', { detail: msg })
    document.dispatchEvent(event)
  }
  return msg
}

export const login = async (data: Record<string, any>) => {
  return await request('POST', URLs.LOGIN, data)
}

export const reauthenticate = async (data: Record<string, any>) => {
  return await request('POST', URLs.REAUTHENTICATE, data)
}

export const logout = async () => {
  return await request('DELETE', URLs.SESSION)
}

export const signUp = async (data: Record<string, any>) => {
  return await request('POST', URLs.SIGNUP, data)
}

export const signUpByPasskey = async (data: Record<string, any>) => {
  return await request('POST', URLs.SIGNUP_WEBAUTHN, data)
}

export const providerSignup = async (data: Record<string, any>) => {
  return await request('POST', URLs.PROVIDER_SIGNUP, data)
}

export const getProviderAccounts = async () => {
  return await request('GET', URLs.PROVIDERS)
}

export const disconnectProviderAccount = async (providerId: string, accountUid: string) => {
  return await request('DELETE', URLs.PROVIDERS, { provider: providerId, account: accountUid })
}

export const requestPasswordReset = async (email: string) => {
  return await request('POST', URLs.REQUEST_PASSWORD_RESET, { email })
}

export const requestLoginCode = async (email: string) => {
  return await request('POST', URLs.REQUEST_LOGIN_CODE, { email })
}

export const confirmLoginCode = async (code: string) => {
  return await request('POST', URLs.CONFIRM_LOGIN_CODE, { code })
}

export const getEmailVerification = async (key: string ) => {
  return await request('GET', URLs.VERIFY_EMAIL, undefined, { 'X-Email-Verification-Key': key })
}

export const getEmailAddresses = async () => {
  return await request('GET', URLs.EMAIL)
}

export const getSessions = async () => {
  return await request('GET', URLs.SESSIONS)
}

export const endSessions = async (ids: string[]) => {
  return await request('DELETE', URLs.SESSIONS, { sessions: ids })
}

export const getAuthenticators = async () => {
  return await request('GET', URLs.AUTHENTICATORS)
}

export const getTOTPAuthenticator = async () => {
  return await request('GET', URLs.TOTP_AUTHENTICATOR)
}

export const mfaAuthenticate = async (code: string) => {
  return await request('POST', URLs.MFA_AUTHENTICATE, { code })
}

export const mfaReauthenticate = async (code: string) => {
  return await request('POST', URLs.MFA_REAUTHENTICATE, { code })
}

export const mfaTrust = async (trust: boolean) => {
  return await request('POST', URLs.MFA_TRUST, { trust })
}

export const activateTOTPAuthenticator = async (code: string) => {
  return await request('POST', URLs.TOTP_AUTHENTICATOR, { code })
}

export const deactivateTOTPAuthenticator = async () => {
  return await request('DELETE', URLs.TOTP_AUTHENTICATOR)
}

export const getRecoveryCodes = async () => {
  return await request('GET', URLs.RECOVERY_CODES)
}

export const generateRecoveryCodes = async () => {
  return await request('POST', URLs.RECOVERY_CODES)
}

export const getConfig = async () => {
  return await request('GET', URLs.CONFIG)
}

export const addEmail = async (email: string) => {
  return await request('POST', URLs.EMAIL, { email })
}

export const deleteEmail = async (email: string) => {
  return await request('DELETE', URLs.EMAIL, { email })
}

export const markEmailAsPrimary = async (email: string) => {
  return await request('PATCH', URLs.EMAIL, { email, primary: true })
}

export const requestEmailVerification = async (email: string) => {
  return await request('PUT', URLs.EMAIL, { email })
}

export const verifyEmail = async (key: string) => {
  return await request('POST', URLs.VERIFY_EMAIL, { key })
}

export const getPasswordReset = async (key: string) => {
  return await request('GET', URLs.RESET_PASSWORD, undefined, { 'X-Password-Reset-Key': key })
}

export const resetPassword = async (data: Record<string, any>) => {
  return await request('POST', URLs.RESET_PASSWORD, data)
}

export const changePassword = async (data: Record<string, any>) => {
  return await request('POST', URLs.CHANGE_PASSWORD, data)
}

export const getAuth = async () => {
  return await request('GET', URLs.SESSION)
}

export const authenticateByToken = async (providerId: string, token: string, process = AuthProcess.LOGIN) => {
  return await request('POST', URLs.PROVIDER_TOKEN, {
    provider: providerId,
    token,
    process
  })
}

export const redirectToProvider = (providerId: string, callbackURL: string, process = AuthProcess.LOGIN) => {
  postForm(URLs.REDIRECT_TO_PROVIDER, {
    provider: providerId,
    process,
    callback_url: window.location.protocol + '//' + window.location.host + callbackURL,
    csrfmiddlewaretoken: getCSRFToken()
  })
}

export const getWebAuthnCreateOptions = async (passwordless: boolean) => {
  let url = URLs.WEBAUTHN_AUTHENTICATOR
  if (passwordless) {
    url += '?passwordless'
  }
  return await request('GET', url)
}

export const getWebAuthnCreateOptionsAtSignup = async () => {
  return await request('GET', URLs.SIGNUP_WEBAUTHN)
}

export const addWebAuthnCredential = async (name: string, credential: Record<string, any>) => {
  return await request('POST', URLs.WEBAUTHN_AUTHENTICATOR, {
    name,
    credential
  })
}

export const signupWebAuthnCredential = async (name: string, credential: Record<string, any>) => {
  return await request('PUT', URLs.SIGNUP_WEBAUTHN, {
    name,
    credential
  })
}

export const deleteWebAuthnCredential = async (ids: string[]) => {
  return await request('DELETE', URLs.WEBAUTHN_AUTHENTICATOR, { authenticators: ids })
}

export const updateWebAuthnCredential = async (id: string, data: Record<string, any>) => {
  return await request('PUT', URLs.WEBAUTHN_AUTHENTICATOR, { id, ...data })
}

export const getWebAuthnRequestOptionsForReauthentication = async () => {
  return await request('GET', URLs.REAUTHENTICATE_WEBAUTHN)
}

export const reauthenticateUsingWebAuthn = async (credential: Record<string, any>) => {
  return await request('POST', URLs.REAUTHENTICATE_WEBAUTHN, { credential })
}

export const authenticateUsingWebAuthn = async (credential: Record<string, any>) => {
  return await request('POST', URLs.AUTHENTICATE_WEBAUTHN, { credential })
}

export const loginUsingWebAuthn = async (credential: Record<string, any>) => {
  return await request('POST', URLs.LOGIN_WEBAUTHN, { credential })
}

export const getWebAuthnRequestOptionsForLogin = async () => {
  return await request('GET', URLs.LOGIN_WEBAUTHN)
}

export const getWebAuthnRequestOptionsForAuthentication = async () => {
  return await request('GET', URLs.AUTHENTICATE_WEBAUTHN)
}

export const setup = (client: any, baseUrl: string, withCredentials: boolean) => {
  settings.client = client
  settings.baseUrl = baseUrl
  settings.withCredentials = withCredentials
}
