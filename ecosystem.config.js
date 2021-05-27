module.exports = {
  apps : [{
    name: 'list_page', // 名称
    script: 'src/app.js', // 启动脚本文件
    instances: 1, //实例数
    autorestart: true, // 启用/禁用应用程序崩溃或退出时自动重启
    watch: false, // 是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件。
    max_memory_restart: '1G', // 重启时最大的启动内存
  }],
};
