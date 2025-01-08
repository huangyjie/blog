// 定义全局样式来隐藏滚动条
export const globalStyles = `
  /* 隐藏默认滚动条 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* 为了兼容 Firefox */
  * {
    scrollbar-width: none;
  }

  /* 为了兼容 IE */
  * {
    -ms-overflow-style: none;
  }

  /* 为了兼容移动设备 */
  body, html {
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }

  /* 兼容更多浏览器 */
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* 确保在所有设备上隐藏滚动条 */
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: hidden;
  }
`; 