import { isMobile } from '@/assets/js/functions'

export const mobileClass = {
  inserted(el, { value }) {
    if (isMobile()) {
      el.classList = value
    }
  }
}
