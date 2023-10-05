import { mergeDeep } from "../utils/merge-deep";
import { ConfigName } from "../interfaces/config-name.model";
import { Config } from "../interfaces/config.model";

const defaultConfig: any = {
  id: ConfigName.apollo,
  name: "Apollo",

  layout: "horizontal",
  boxed: false,
  sidenav: {
    title: "VEX",
    imageUrl: "assets/img/demo/logo.svg",
    showCollapsePin: true,
    state: "expanded",
  },
  toolbar: {
    fixed: true,
  },
  navbar: {
    position: "below-toolbar",
  },
  footer: {
    visible: true,
    fixed: true,
  },
};

export const configs: Config[] = [
  defaultConfig,
  mergeDeep(
    { ...defaultConfig },
    {
      id: ConfigName.hermes,
      name: "Hermes",

      layout: "vertical",
      boxed: true,
      toolbar: {
        fixed: false,
      },
      footer: {
        fixed: false,
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: ConfigName.ares,
      name: "Ares",

      toolbar: {
        fixed: false,
      },
      navbar: {
        position: "in-toolbar",
      },
      footer: {
        fixed: false,
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: ConfigName.zeus,
      name: "Zeus",

      sidenav: {
        state: "collapsed",
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: ConfigName.ikaros,
      name: "Ikaros",

      layout: "vertical",
      boxed: true,
      toolbar: {
        fixed: false,
      },
      navbar: {
        position: "in-toolbar",
      },
      footer: {
        fixed: false,
      },
    }
  ),
];
