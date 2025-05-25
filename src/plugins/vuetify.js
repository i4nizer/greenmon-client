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
import { VFileUpload } from 'vuetify/labs/VFileUpload'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    VBtn: { class: 'text-none' },
    VForm: { class: 'border-md border-md-primary rounded' },
    VTextField: { variant: 'outlined', density: 'compact', class: 'mt-1' },
    VNumberInput: { variant: 'outlined', density: 'compact', class: 'mt-1' },
    VSelect: { variant: 'outlined', density: 'compact', class: 'mt-1' },
    VTextarea: { variant: 'outlined', density: 'compact', class: 'mt-1' },
  },
  components: {
    VTimePicker,
    VFileUpload,
  }
})
