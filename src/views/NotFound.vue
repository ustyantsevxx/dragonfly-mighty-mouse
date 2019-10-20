<template>
  <main>
    <h1 id="msg">404</h1>
  </main>
</template>


<script>

export default {
}
</script>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  z-index: -100;
  position: absolute;
  top: 0;

  #msg {
    position: absolute;
    background-color: #343a40;
    color: white;
    font-family: "Lucida Console";
    top: 50%;
    left: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    font-size: 5vw;
  }
}

@media only screen and (max-width: 768px) {
  main {
    #msg {
      font-size: 8vw;
      white-space: nowrap;
    }
  }
}
</style>