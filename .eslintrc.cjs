/* eslint-env node */

module.exports = {
  root: true,
  env: {
    node: true,  // 指定環境為 Node.js
    es2021: true // 使用 ES2021 語法支持
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    // 禁止在語句末尾使用分號
    semi: [0],
    'comma-dangle': [0], // 不要求或禁止使用掛尾逗號
    'max-len': 'off', // 不限制行的最大長度
    'no-trailing-spaces': ['warn'], // 行末不允許有空格
    'no-multiple-empty-lines': ['warn', { max: 2 }], // 限制連續空行的數量
    quotes: [0], // 不強制使用單引號或雙引號
    indent: [0], // 不強制縮進
    'spaced-comment': "off", // 註釋前的空格不強制
    eqeqeq: "off", // 不強制使用 === 和 !==
    'no-unused-vars': "off", // 允許有未使用的變數
    'no-dupe-keys': "off", // 允許物件字面量中出現重複的鍵
    'key-spacing': ['warn'], // 強制在物件字面量的鍵和值之間使用一致的空格
    'eol-last': 'off', // 文件末尾存在或不存在新行不強制
  },
  parserOptions: {
    ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
    sourceType: 'module', // 允許使用 ES6 模塊語法
  }
}
