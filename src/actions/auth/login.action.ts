import { firebase } from '@/firebase/config'
import { z } from 'astro/zod'
import { defineAction } from 'astro:actions'
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth'

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional()
  }),
  handler: async (input, { cookies }) => {
    const { password, remember_me, email } = input
    if (remember_me) {
      cookies.set('email', email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año
        path: '/'
      })
    } else {
      cookies.delete('email', {
        path: '/'
      })
    }

    // Creación de usuario
    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      return {
        uid: user.user.uid,
        email: user.user.email,
        displayName: user.user.displayName
      }
    } catch (error) {
      console.log('error en servidor', error)

      const firebaseError = error as AuthError

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('El correo ya está en uso')
      }

      throw new Error('Auxilio! algo salió mal')
    }
  }
})
