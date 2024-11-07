import { firebase } from '@/firebase/config'
import { z } from 'astro/zod'
import { defineAction } from 'astro:actions'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  type AuthError
} from 'firebase/auth'

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional()
  }),
  handler: async (input, { cookies }) => {
    const { name, password, remember_me, email } = input
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
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      // Actualizar el nombre (displayName)
      await updateProfile(firebase.auth.currentUser!, {
        displayName: name
      })

      // Verificar el correo electrónico
      await sendEmailVerification(firebase.auth.currentUser!, {
        url: `${import.meta.env.WEB_SITE}/protected?emailVerified=true`
      })

      // return user : se cae
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
