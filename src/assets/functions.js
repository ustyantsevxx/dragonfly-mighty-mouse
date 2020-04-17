export const num2str = (n, forms) => {
  n = Math.abs(n) % 100
  let n1 = n % 10
  let index
  if (n > 10 && n < 20) index = 2
  else if (n1 > 1 && n1 < 5) index = 1
  else if (n1 == 1) index = 0
  else index = 2
  return n + ' ' + forms[index]
}

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent)
}
