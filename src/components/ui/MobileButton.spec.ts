import { mount } from '@vue/test-utils';
import MobileButton from './MobileButton.vue';
import LoadingSpinner from './LoadingSpinner.vue';

// Mock LoadingSpinner component
jest.mock('./LoadingSpinner.vue', () => ({
  name: 'LoadingSpinner',
  template: '<div data-testid="loading-spinner"></div>'
}));

describe('MobileButton', () => {
  it('renders button with default props', () => {
    const wrapper = mount(MobileButton, {
      slots: {
        default: 'Click me'
      }
    });

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Click me');
    expect(wrapper.classes()).toContain('mobile-button--primary');
    expect(wrapper.classes()).toContain('mobile-button--md');
  });

  it('applies correct variant classes', () => {
    const wrapper = mount(MobileButton, {
      props: {
        variant: 'secondary'
      },
      slots: {
        default: 'Button'
      }
    });

    expect(wrapper.classes()).toContain('mobile-button--secondary');
  });

  it('applies correct size classes', () => {
    const wrapper = mount(MobileButton, {
      props: {
        size: 'lg'
      },
      slots: {
        default: 'Button'
      }
    });

    expect(wrapper.classes()).toContain('mobile-button--lg');
  });

  it('shows loading spinner when loading', () => {
    const wrapper = mount(MobileButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Button'
      },
      global: {
        components: {
          LoadingSpinner
        }
      }
    });

    expect(wrapper.findComponent(LoadingSpinner).exists()).toBe(true);
    expect(wrapper.classes()).toContain('mobile-button--loading');
  });

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(MobileButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Button'
      }
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('mobile-button--disabled');
  });

  it('is disabled when loading', () => {
    const wrapper = mount(MobileButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Button'
      },
      global: {
        components: {
          LoadingSpinner
        }
      }
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(MobileButton, {
      slots: {
        default: 'Button'
      }
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click when disabled', async () => {
    const wrapper = mount(MobileButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Button'
      }
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });

  it('does not emit click when loading', async () => {
    const wrapper = mount(MobileButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Button'
      },
      global: {
        components: {
          LoadingSpinner
        }
      }
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });

  it('applies full width class when fullWidth is true', () => {
    const wrapper = mount(MobileButton, {
      props: {
        fullWidth: true
      },
      slots: {
        default: 'Button'
      }
    });

    expect(wrapper.classes()).toContain('mobile-button--full-width');
  });

  it('sets correct button type', () => {
    const wrapper = mount(MobileButton, {
      props: {
        type: 'submit'
      },
      slots: {
        default: 'Button'
      }
    });

    expect(wrapper.find('button').attributes('type')).toBe('submit');
  });

  it('handles touch events for mobile', async () => {
    const wrapper = mount(MobileButton, {
      slots: {
        default: 'Button'
      }
    });

    await wrapper.find('button').trigger('touchstart');
    expect(wrapper.classes()).toContain('mobile-button--pressed');

    await wrapper.find('button').trigger('touchend');
    expect(wrapper.classes()).not.toContain('mobile-button--pressed');
  });

  it('does not apply pressed state when disabled', async () => {
    const wrapper = mount(MobileButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Button'
      }
    });

    await wrapper.find('button').trigger('touchstart');
    expect(wrapper.classes()).not.toContain('mobile-button--pressed');
  });
});
