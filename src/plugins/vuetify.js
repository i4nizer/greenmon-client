/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme: {
        dark: true,
        colors: {
          primary: colors.green.base,
          secondary: colors.green.darken2,
          accent: colors.green.lighten2,
          background: "#000000",
          surface: '#000000',
          text: colors.green.darken1,
          border: colors.green.lighten3,
        }
      }
    }
  },
  defaults: {
    VBtn: { color: 'primary', class: 'text-none' },
    VForm: { class: 'border-md border-md-primary rounded' },
    VTextField: { variant: 'outlined', density: 'compact', class: 'mt-1' },
    VNumberInput: { variant: 'outlined', density: 'compact', class: 'mt-1' },
    VSelect: { variant: 'outlined', density: 'compact', class: 'mt-1' },
    VTextarea: { variant: 'outlined', density: 'compact', class: 'mt-1' },
  },
  components: {
    VTimePicker,
  }
})
