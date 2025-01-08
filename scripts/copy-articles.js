const fs = require('fs')
const path = require('path')

function copyFolderRecursive(source, target) {
  // 创建目标文件夹
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }

  // 读取源文件夹中的所有内容
  const files = fs.readdirSync(source)

  files.forEach(file => {
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)

    // 判断是文件还是文件夹
    if (fs.lstatSync(sourcePath).isDirectory()) {
      // 如果是文件夹，递归复制
      copyFolderRecursive(sourcePath, targetPath)
      console.log(`Copied directory ${file} to ${targetPath}`)
    } else {
      // 如果是文件，直接复制
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`Copied file ${file} to ${targetPath}`)
    }
  })
}

try {
  // 源文件夹和目标文件夹
  const sourceDir = path.join(__dirname, '../article')
  const publicDir = path.join(__dirname, '../public')
  const targetDir = path.join(publicDir, 'article')

  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
    console.log('Created public directory')
  }

  // 确保 public/article 目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
    console.log('Created public/article directory')
  }

  // 确保源目录存在
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory does not exist:', sourceDir)
    process.exit(1)
  }

  // 复制整个文件夹及其内容
  copyFolderRecursive(sourceDir, targetDir)

  // 特别确保 Source code 目录被复制
  const sourceCodeDir = path.join(sourceDir, 'Source code')
  const targetSourceCodeDir = path.join(targetDir, 'Source code')
  if (fs.existsSync(sourceCodeDir)) {
    copyFolderRecursive(sourceCodeDir, targetSourceCodeDir)
    console.log('Copied Source code directory successfully')
  }

  console.log('All files and resources copied successfully')
} catch (error) {
  console.error('Error copying files:', error)
  process.exit(1)
} 