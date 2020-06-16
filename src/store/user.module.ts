import firebase from 'firebase/app'
import { FIRESTORE, AUTH } from '@/main'
import store from '@/store'
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import ToastsModule from './toasts.module'

export interface IUserState {
  id: string
  name: string
  surname: string
  email: string
  isTeacher: boolean
  isEmailVerified: boolean
}

@Module({ dynamic: true, store, name: 'user' })
class UserModule extends VuexModule implements IUserState {
  id = ''
  name = ''
  surname = ''
  email = ''
  isTeacher = false
  isEmailVerified = false

  @Mutation
  SET_ID(id: string) {
    this.id = id
  }

  @Mutation
  SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  SET_SURNAME(surname: string) {
    this.surname = surname
  }

  @Mutation
  SET_EMAIL(email: string) {
    this.email = email
  }

  @Mutation
  SET_IS_TEACHER(isTeacher: boolean) {
    this.isTeacher = isTeacher
  }

  @Mutation
  SET_IS_EMAIL_VERIFIED(isEmailVerified: boolean) {
    this.isEmailVerified = isEmailVerified
  }

  @Action
  private async TryDoOrToastError<T>(fn: () => Promise<T>) {
    try {
      await fn()
      return true
    } catch (e) {
      ToastsModule.Toast({
        error: true,
        message: e.message,
        needsTranslation: true
      })
      return false
    }
  }

  @Action
  async SetUser(user: any) {
    if (user) {
      const userRef = await FIRESTORE.collection('users').doc(user.uid).get()
      const userData: any = userRef.data()

      this.SET_ID(user.uid)
      this.SET_IS_EMAIL_VERIFIED(user.emailVerified)
      this.SET_EMAIL(userData.email)
      this.SET_NAME(userData.name)
      this.SET_SURNAME(userData.surname)
      this.SET_IS_TEACHER(userData.isTeacher)
    }
  }

  @Action
  Login(options: { email: string; password: string }): Promise<boolean> {
    return this.TryDoOrToastError(async () => {
      await AUTH.signInWithEmailAndPassword(options.email, options.password)
    })
  }

  @Action
  LoginWithGoogle() {
    return this.TryDoOrToastError(async () => {
      const googleProvider = new firebase.auth.GoogleAuthProvider()
      await AUTH.signInWithPopup(googleProvider)
    })
  }

  @Action
  Logout() {
    location.reload()
    AUTH.signOut()
  }

  @Action
  Register(options: {
    email: string
    password: string
    name: string
    surname: string
    isTeacher: boolean
  }) {
    return this.TryDoOrToastError(async () => {
      const creds: any = await AUTH.createUserWithEmailAndPassword(
        options.email,
        options.password
      )
      await FIRESTORE.collection('users').doc(creds.user.uid).set({
        name: options.name,
        surname: options.surname,
        email: options.email,
        isTeacher: options.isTeacher
      })
    })
  }

  @Action
  RestorePassword(options: { email: string }) {
    return this.TryDoOrToastError(async () => {
      await AUTH.sendPasswordResetEmail(options.email, {
        url: 'https://project-scimitar.web.app/login'
      })
      ToastsModule.Toast({ message: 'Ссылка востановления отправлена' })
    })
  }

  @Action
  VerifyEmail() {
    return this.TryDoOrToastError(async () => {
      await AUTH.currentUser?.sendEmailVerification()
      ToastsModule.Toast({ message: 'Ссылка подтверждения отправлена' })
    })
  }

  @Action
  UpdateProfile(options: { name: string; surname: string }) {
    return this.TryDoOrToastError(async () => {
      const userRef = FIRESTORE.collection('users').doc(this.id)
      await userRef.update({
        name: options.name,
        surname: options.surname
      })
      const changedUserDoc = await userRef.get()
      const data: any = changedUserDoc.data()
      this.SET_NAME(data.name)
      this.SET_SURNAME(data.surname)
      ToastsModule.Toast({ message: 'Имя успешно изменено' })
    })
  }

  @Action
  UpdateEmail(options: { password: string; newEmail: string }) {
    return this.TryDoOrToastError(async () => {
      const user = await AUTH.signInWithEmailAndPassword(
        this.email,
        options.password
      )
      await AUTH.currentUser?.updateEmail(options.newEmail)
      await FIRESTORE.collection('users').doc(this.id).update({
        email: options.newEmail
      })
      await AUTH.currentUser?.sendEmailVerification()
      this.SET_EMAIL(options.newEmail)
      ToastsModule.Toast({ message: 'Запрос на смену эл. почты отправлен' })
    })
  }

  @Action
  UpdatePassword(passwords: { old: string; new: string }) {
    return this.TryDoOrToastError(async () => {
      const user = await AUTH.signInWithEmailAndPassword(
        this.email,
        passwords.old
      )
      await AUTH.currentUser?.updatePassword(passwords.new)
      ToastsModule.Toast({ message: 'Пароль успешно изменен' })
    })
  }
}

export default getModule(UserModule)
