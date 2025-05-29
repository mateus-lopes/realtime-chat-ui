import { mount } from "@vue/test-utils";
import App from "./App.vue";

describe("App.vue", () => {
  it("renders without crashing", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it("matches snapshot", () => {
    const wrapper = mount(App);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
