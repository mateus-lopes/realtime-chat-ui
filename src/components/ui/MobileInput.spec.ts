import { mount } from '@vue/test-utils';
import MobileInput from './MobileInput.vue';

describe('MobileInput', () => {
  it('renders input with default props', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: ''
      }
    });

    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.classes()).toContain('mobile-input-wrapper');
  });

  it('displays label when provided', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        label: 'Test Label'
      }
    });

    expect(wrapper.find('label').text()).toContain('Test Label');
  });

  it('shows required asterisk when required', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        required: true
      }
    });

    expect(wrapper.find('.required-asterisk').exists()).toBe(true);
  });

  it('applies error styles when error is present', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        error: 'This field is required'
      }
    });

    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--error');
    expect(wrapper.find('.mobile-input-message--error').text()).toBe('This field is required');
  });

  it('shows hint when provided and no error', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        hint: 'This is a hint'
      }
    });

    expect(wrapper.find('.mobile-input-message').text()).toBe('This is a hint');
    expect(wrapper.find('.mobile-input-message').classes()).not.toContain('mobile-input-message--error');
  });

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: ''
      }
    });

    const input = wrapper.find('input');
    await input.setValue('test value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value']);
  });

  it('emits focus event', async () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.find('input').trigger('focus');
    expect(wrapper.emitted('focus')).toBeTruthy();
  });

  it('emits blur event', async () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.find('input').trigger('blur');
    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('applies disabled state correctly', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        disabled: true
      }
    });

    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--disabled');
  });

  it('applies readonly state correctly', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        readonly: true
      }
    });

    expect(wrapper.find('input').attributes('readonly')).toBeDefined();
    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--readonly');
  });

  it('applies correct size classes', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        size: 'lg'
      }
    });

    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--lg');
  });

  it('applies correct variant classes', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        variant: 'filled'
      }
    });

    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--filled');
  });

  it('shows password toggle for password type', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        type: 'password'
      }
    });

    expect(wrapper.find('.password-toggle').exists()).toBe(true);
  });

  it('toggles password visibility', async () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        type: 'password'
      }
    });

    const input = wrapper.find('input');
    const toggle = wrapper.find('.password-toggle');

    expect(input.attributes('type')).toBe('password');

    await toggle.trigger('click');
    expect(input.attributes('type')).toBe('text');

    await toggle.trigger('click');
    expect(input.attributes('type')).toBe('password');
  });

  it('applies focused state correctly', async () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--focused');

    await wrapper.find('input').trigger('blur');
    expect(wrapper.find('.mobile-input').classes()).not.toContain('mobile-input--focused');
  });

  it('sets correct input attributes', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        placeholder: 'Enter text',
        maxlength: 100,
        minlength: 5,
        pattern: '[0-9]*',
        autocomplete: 'email',
        inputmode: 'email'
      }
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('Enter text');
    expect(input.attributes('maxlength')).toBe('100');
    expect(input.attributes('minlength')).toBe('5');
    expect(input.attributes('pattern')).toBe('[0-9]*');
    expect(input.attributes('autocomplete')).toBe('email');
    expect(input.attributes('inputmode')).toBe('email');
  });

  it('renders prefix icon when provided', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        prefixIcon: 'icon-search'
      }
    });

    expect(wrapper.find('.mobile-input-prefix').exists()).toBe(true);
    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--has-prefix');
  });

  it('renders suffix icon when provided', () => {
    const wrapper = mount(MobileInput, {
      props: {
        modelValue: '',
        suffixIcon: 'icon-clear'
      }
    });

    expect(wrapper.find('.mobile-input-suffix').exists()).toBe(true);
    expect(wrapper.find('.mobile-input').classes()).toContain('mobile-input--has-suffix');
  });
});
