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
import { ToastsModule } from '@/store/modules/toasts'

export interface IUser {
  id: string
  name: string
  surname: string
  email: string
  isTeacher: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule {
  id = ''
  name = ''
  surname = ''
  email = ''
  isTeacher = false
  emailVerified = false

  get signed() {
    return this.id !== ''
  }

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
  SET_EMAIL_VERIFIED(emailVerified: boolean) {
    this.emailVerified = emailVerified
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
  public async SetUser(user: any) {
    if (user) {
      const userRef = await FIRESTORE.collection('users').doc(user.uid).get()
      const userData: any = userRef.data()

      this.SET_ID(user.uid)
      this.SET_EMAIL_VERIFIED(user.emailVerified)
      this.SET_EMAIL(userData.email)
      this.SET_NAME(userData.name)
      this.SET_SURNAME(userData.surname)
      this.SET_IS_TEACHER(userData.isTeacher)
    }
  }

  @Action
  public Login(options: { email: string; password: string }) {
    return this.TryDoOrToastError(async () => {
      await AUTH.signInWithEmailAndPassword(options.email, options.password)
    })
  }

  @Action
  public LoginWithGoogle() {
    return this.TryDoOrToastError(async () => {
      const googleProvider = new firebase.auth.GoogleAuthProvider()
      await AUTH.signInWithPopup(googleProvider)
    })
  }

  @Action
  public async Logout() {
    location.reload()
    await AUTH.signOut()
  }

  @Action
  public Register(options: {
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
  public RestorePassword(options: { email: string }) {
    return this.TryDoOrToastError(async () => {
      await AUTH.sendPasswordResetEmail(options.email, {
        url: 'https://project-scimitar.web.app/login'
      })
      ToastsModule.Toast({ message: 'Ссылка востановления отправлена' })
    })
  }

  @Action
  public VerifyEmail() {
    return this.TryDoOrToastError(async () => {
      await AUTH.currentUser?.sendEmailVerification()
      ToastsModule.Toast({ message: 'Ссылка подтверждения отправлена' })
    })
  }

  @Action
  public UpdateProfile(options: { name: string; surname: string }) {
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
      await AUTH.signInWithEmailAndPassword(this.email, options.password)
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
      await AUTH.signInWithEmailAndPassword(this.email, passwords.old)
      await AUTH.currentUser?.updatePassword(passwords.new)
      ToastsModule.Toast({ message: 'Пароль успешно изменен' })
    })
  }
}

export const UserModule = getModule(User)
