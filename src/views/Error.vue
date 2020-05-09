<template>
  <main>
    <h1 id="msg">Запрашиваемого пути не существует</h1>
  </main>
</template>

<style lang="scss" scoped>
@media only screen and (max-width: var(--breakpoint-sm)) {
  main {
    #msg {
      font-size: 4vw;
      white-space: nowrap;
    }
  }
}

main {
  width: 100%;
  height: 100%;
  z-index: 312;
  position: absolute;
  top: 0;

  #msg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    font-size: 3vw;
  }
}
</style>
