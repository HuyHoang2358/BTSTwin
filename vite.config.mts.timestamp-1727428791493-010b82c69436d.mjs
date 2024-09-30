// vite.config.mts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/vite/dist/node/index.js";
import vue from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/unplugin-vue-components/dist/resolvers.js";
import { resolve, dirname } from "node:path";
import VueI18nPlugin from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import cesium from "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/node_modules/vite-plugin-cesium/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///home/hoangth33/Projects/BTS/gitlab/bts-web/vite.config.mts";
var hash = Math.floor(Math.random() * 9e4) + 1e4;
var vite_config_default = defineConfig({
  server: {
    port: 5173,
    // You can change the port number
    host: "0.0.0.0"
    // You can change the host address
  },
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
          // css in js
        })
      ]
    }),
    cesium(),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "src/utils/i18n/locales")
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  test: {
    setupFiles: "src/components/__tests__/setup.ts",
    coverage: {
      provider: "istanbul"
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
        entryFileNames: `[name]${hash}.js`,
        chunkFileNames: `[name]${hash}.js`,
        assetFileNames: `[name]${hash}.[ext]`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvaG9hbmd0aDMzL1Byb2plY3RzL0JUUy9naXRsYWIvYnRzLXdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvaG9hbmd0aDMzL1Byb2plY3RzL0JUUy9naXRsYWIvYnRzLXdlYi92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvaG9hbmd0aDMzL1Byb2plY3RzL0JUUy9naXRsYWIvYnRzLXdlYi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnO1xuaW1wb3J0IGNlc2l1bSBmcm9tICd2aXRlLXBsdWdpbi1jZXNpdW0nO1xuXG5jb25zdCBoYXNoID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOTAwMDApICsgMTAwMDA7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLCAvLyBZb3UgY2FuIGNoYW5nZSB0aGUgcG9ydCBudW1iZXJcbiAgICBob3N0OiAnMC4wLjAuMCcsIC8vIFlvdSBjYW4gY2hhbmdlIHRoZSBob3N0IGFkZHJlc3NcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKHtcbiAgICAgICAgICBpbXBvcnRTdHlsZTogZmFsc2UsIC8vIGNzcyBpbiBqc1xuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgY2VzaXVtKCksXG4gICAgVnVlSTE4blBsdWdpbih7XG4gICAgICAvKiBvcHRpb25zICovXG4gICAgICAvLyBsb2NhbGUgbWVzc2FnZXMgcmVzb3VyY2UgcHJlLWNvbXBpbGUgb3B0aW9uXG4gICAgICBpbmNsdWRlOiByZXNvbHZlKGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSwgJ3NyYy91dGlscy9pMThuL2xvY2FsZXMnKSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgc2V0dXBGaWxlczogJ3NyYy9jb21wb25lbnRzL19fdGVzdHNfXy9zZXR1cC50cycsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAnaXN0YW5idWwnLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNjAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgW25hbWVdJHtoYXNofS5qc2AsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBgW25hbWVdJHtoYXNofS5qc2AsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgW25hbWVdJHtoYXNofS5bZXh0XWBcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVCxTQUFTLGVBQWUsV0FBVztBQUV4VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMsU0FBUyxlQUFlO0FBQ2pDLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sWUFBWTtBQVQ0SyxJQUFNLDJDQUEyQztBQVdoUCxJQUFNLE9BQU8sS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUssSUFBSTtBQUdqRCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxNQUNULFdBQVc7QUFBQSxRQUNULHFCQUFxQjtBQUFBLFVBQ25CLGFBQWE7QUFBQTtBQUFBLFFBQ2YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxJQUNQLGNBQWM7QUFBQTtBQUFBO0FBQUEsTUFHWixTQUFTLFFBQVEsUUFBUSxjQUFjLHdDQUFlLENBQUMsR0FBRyx3QkFBd0I7QUFBQSxJQUNwRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUNaLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsdUJBQXVCO0FBQUEsSUFDdkIsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBQ2YsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLG1CQUFPLEdBQUcsU0FBUyxFQUFFLE1BQU0sZUFBZSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsU0FBUztBQUFBLFVBQ3hFO0FBQUEsUUFDRjtBQUFBLFFBQ0EsZ0JBQWdCLFNBQVMsSUFBSTtBQUFBLFFBQzdCLGdCQUFnQixTQUFTLElBQUk7QUFBQSxRQUM3QixnQkFBZ0IsU0FBUyxJQUFJO0FBQUEsTUFDL0I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
