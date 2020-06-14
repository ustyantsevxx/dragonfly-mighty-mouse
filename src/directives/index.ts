import { isMobile } from '@/utils'
import { DirectiveOptions } from 'vue'

export const mobileClass: DirectiveOptions = {
  inserted(el, { value }) {
    if (isMobile()) {
      el.classList.value = value
    }
  }
}
