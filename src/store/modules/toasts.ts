import store from '@/store'
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'

export interface IToastOptions {
  message: string
  error?: boolean
  needsTranslation?: boolean
}

@Module({ dynamic: true, store, name: 'toasts' })
class Toasts extends VuexModule {
  toasted = false
  message = ''
  error = false
  needsTranslation = false

  @Mutation
  private SET_TOAST(options: IToastOptions) {
    this.toasted = true
    this.message = options.message
    this.error = options.error ?? false
    this.needsTranslation = options.needsTranslation ?? false
  }

  @Mutation
  private UNSET_TOAST() {
    this.toasted = false
  }

  @Action
  public Toast(options: IToastOptions) {
    this.SET_TOAST({
      message: options.message,
      error: options.error ?? false,
      needsTranslation: options.needsTranslation ?? false
    })
  }

  @Action
  public UnToast() {
    this.UNSET_TOAST()
  }
}

export const ToastsModule = getModule(Toasts)
