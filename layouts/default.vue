<template>
  <div>
    <header class="header">
      <div class="container">
        <nuxt-link to="/" class="header__logo" exact-active-class="">
          <Logo />
        </nuxt-link>
        <ul class="header__menu">
          <li class="header__menu-item">
            <nuxt-link
              class="header__menu-link"
              exact-active-class="header__menu-link--active"
              to="/"
              >Главная</nuxt-link
            >
          </li>
          <li class="header__menu-item">
            <nuxt-link
              class="header__menu-link"
              exact-active-class="header__menu-link--active"
              to="/options"
              >Настройки</nuxt-link
            >
          </li>
        </ul>
      </div>
    </header>
    <main class="content">
      <Nuxt />
    </main>
  </div>
</template>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
html {
  overflow: hidden;
}

.header {
  display: flex;
  height: 96px;
  width: 100%;
  justify-content: center;
  padding: 0 16px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.1);

  .container {
    display: flex;
    width: 1280px;
    justify-content: space-between;
    align-items: center;
  }

  &__menu {
    display: flex;
    list-style: none;

    &-link {
      color: #000;
      text-decoration: none;

      @keyframes fadein {
        from {
          width: 0%;
        }
        to {
          width: 100%;
        }
      }

      &--active::after {
        content: '';
        display: block;
        animation: fadein 1.5s;
        height: 2px;
        background: #c4c4c4;
      }
    }

    &-item + &-item {
      margin-left: 16px;
    }
  }
}

.content {
  display: flex;
  width: 100%;
  margin-top: 48px;
  justify-content: center;
}

@media (max-width: 600px) {
  .header {
    .container {
      max-width: 600px;
      width: 100% !important;
      flex-direction: column;
      justify-content: center;
    }
  }

  .content {
    margin-top: 32px;
  }
}

@media (min-width: 600px) and (max-width: 960px) {
  .header {
    .container {
      max-width: 960px;
      width: 100%;
      padding: 0 16px;
    }
  }
}
</style>
