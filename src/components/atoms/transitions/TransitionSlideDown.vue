<template>
  <Transition name="slide-down">
    <slot />
  </Transition>
</template>

<style lang="scss" scoped>
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(-100px);
}

.slide-up-enter-active {
  transition: all 1s cubic-bezier(0, 1, 0, 1);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
}

.slide-up-leave-to {
  opacity: 0;
}
</style>
