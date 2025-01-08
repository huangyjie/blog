export const contentStyles = `
  /* 中文字体 */
  @font-face {
    font-family: '宋体';
    src: local('SimSun');
  }

  @font-face {
    font-family: '黑体';
    src: local('SimHei');
  }

  @font-face {
    font-family: '楷体';
    src: local('KaiTi');
  }

  @font-face {
    font-family: '微软雅黑';
    src: local('Microsoft YaHei');
  }

  @font-face {
    font-family: '仿宋';
    src: local('FangSong');
  }

  /* 确保字体回退机制 */
  .prose span[style*="font-family"] {
    font-family: inherit;
  }
`; 