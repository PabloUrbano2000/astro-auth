import { firebase } from '@/firebase/config'
import { z } from 'astro/zod'
import { defineAction } from 'astro:actions'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'

export const loginWithGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials)

    if (!credential) throw new Error('Google Sign In falló')

    await signInWithCredential(firebase.auth, credential)

    return { ok: true }
  }
})
