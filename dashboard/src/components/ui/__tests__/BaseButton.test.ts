import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders the slot text', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('is disabled when loading', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Save' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('bg-primary-600')
  })

  it('applies danger variant classes', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'danger' },
      slots: { default: 'Delete' },
    })
    expect(wrapper.classes()).toContain('bg-red-600')
  })
})
