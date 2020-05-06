import { isMobile } from '@/assets/functions'

export const mobileClass = {
  inserted(el, { value }) {
    if (isMobile()) {
      el.classList = value
    }
  }
}
