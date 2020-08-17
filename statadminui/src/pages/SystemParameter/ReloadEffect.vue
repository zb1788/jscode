<template>
  <vcom-panel>
    <vcom-table
      :data="data"
      :columns="columns"
    >
    <template slot="header">
      <span>如用户中心为LVS双机需要分别登录两台用户中心操作才能保证全部生效</span>
    </template>
    </vcom-table>
  </vcom-panel>
</template>

<script type="text/jsx">
export default {
  data () {
    return {
      data: [
        { reloadOption: 'email.properties',
          desc: '优教通用户中心关于系统发送邮件的配置，包括：stmp服务器、用户名、密码等； 配置文件路径：pstim.war/WEB-INF/classes'
        },
        { reloadOption: 'yjt_interface.properties',
          desc: '用户中心配置的优教通其他子系统端口、应用名、接口；当优教通其他子系统IP有变更时也可使之立即生效； 配置文件路径：pstim.war/WEB-INF/classes/cfg/app_cfg'
        }
      ],
      columns: [
        { prop: 'reloadOption', label: '重新加载项' },
        { prop: 'desc', label: '描述' },
        { label: '操作',
          render () {
            return <span>
              <vcom-button type="primary" ghost={true}>立即生效</vcom-button>
            </span>;
          }
        }
      ]
    };
  }
};
</script>
