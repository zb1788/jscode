'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //测试环境
  // PLS_BASE_PREFIX: '"/pls_proxy"',
  // SSO_BASE_PREFIX: '"/sso_proxy"',
  // TMS_BASE_PREFIX: '"http://plszb.yjt361.com:8777/tms_proxy"',
  // TQMS_BASE_PREFIX: '"/tqms_proxy"',
  // OLMS_BASE_PREFIX: '"/tqms_proxy"',
  // WEBMAIL_BASE_PREFIX: '"/webmail_proxy"',
  // JXFX_BASE_PREFIX: '"http://plszb.yjt361.com:8777/jxfx_proxy"',
  // TIS_BASE_PREFIX: '"/tis_proxy"',
  // MICRO_BASE_PREFIX: '"/micro_proxy"',
  // RLMS_BASE_PREFIX: '"/rlms_proxy"',
  // AREA_BASE_PREFIX: '"/area_proxy"',
  // ESLEANR_BASE_PREFIX: '"/esleanr_proxy"',
  // PORTAL_BASE_PREFIX: '"/portal_proxy"',
  // UCSAPI_BASE_PREFIX: '"/ucsapi_proxy"',
  // GW_BASE_PREFIX: '"/gw_proxy"',
  // NODE_BASE_PREFIX: '"/node_proxy"',
  // UCSAPIKF_BASE_PREFIX: '"/ucsapi_proxy"',
  //开发环境
  // PLS_BASE_PREFIX: '"/kf_pls_proxy"',
  // SSO_BASE_PREFIX: '"/kf_sso_proxy"',
  // TMS_BASE_PREFIX: '"/kf_tms_proxy"',
  // TQMS_BASE_PREFIX: '"/kf_tqms_proxy"',
  // OLMS_BASE_PREFIX: '"/kf_tqms_proxy"',
  // WEBMAIL_BASE_PREFIX: '"/kf_webmail_proxy"',
  // JXFX_BASE_PREFIX: '"/kf_jxfx_proxy"',
  // TIS_BASE_PREFIX: '"/kf_tis_proxy"',
  // MICRO_BASE_PREFIX: '"/kf_micro_proxy"',
  // RLMS_BASE_PREFIX: '"/kf_rlms_proxy"',
  // AREA_BASE_PREFIX: '"/kf_area_proxy"',
  // ESLEANR_BASE_PREFIX: '"/kf_esleanr_proxy"',
  // UCSAPI_BASE_PREFIX: '"/kf_ucsapi_proxy"',
  // PORTAL_BASE_PREFIX: '"/kf_portal_proxy"',
  // GW_BASE_PREFIX: '"/kf_gw_proxy"',
  // NODE_BASE_PREFIX: '"/kf_node_proxy"',
  // VFS_BASE_PREFIX: '"/kf_vfs_proxy"',
  // UCSAPIKF_BASE_PREFIX: '"/kf_ucsapi_proxy"',


  //河南环境

  // PLS_BASE_PREFIX: '"http://plszb.czbanbantong.com:8777/henan_pls_proxy"',
  // SSO_BASE_PREFIX: '"/henan_sso_proxy"',
  // TMS_BASE_PREFIX: '"http://plszb.czbanbantong.com:8777/henan_tms_proxy"',
  // TQMS_BASE_PREFIX: '"/henan_tqms_proxy"',
  // OLMS_BASE_PREFIX: '"/henan_tqms_proxy"',
  // WEBMAIL_BASE_PREFIX: '"/henan_webmail_proxy"',
  // JXFX_BASE_PREFIX: '"http://plszb.czbanbantong.com:8777/henan_jxfx_proxy"',
  // TIS_BASE_PREFIX: '"/henan_tis_proxy"',
  // MICRO_BASE_PREFIX: '"/henan_micro_proxy"',
  // RLMS_BASE_PREFIX: '"/henan_rlms_proxy"',
  // AREA_BASE_PREFIX: '"/henan_area_proxy"',
  // ESLEANR_BASE_PREFIX: '"/henan_esleanr_proxy"',
  // UCSAPI_BASE_PREFIX: '"http://plszb.czbanbantong.com:8777/henan_ucsapi_proxy"',
  // PORTAL_BASE_PREFIX: '"/henan_portal_proxy"',




    //开发环境node
    // PLS_BASE_PREFIX: '"/kf_node/plsapi"',
    // SSO_BASE_PREFIX: '"/kf_node"',
    // TMS_BASE_PREFIX: '"/kf_node"',
    // TQMS_BASE_PREFIX: '"/kf_node"',
    // OLMS_BASE_PREFIX: '"/kf_node"',
    // WEBMAIL_BASE_PREFIX: '"/webmailapi"',
    // JXFX_BASE_PREFIX: '"/kf_node"',
    // TIS_BASE_PREFIX: '"/kf_node"',
    // MICRO_BASE_PREFIX: '"/kf_node"',
    // RLMS_BASE_PREFIX: '"/kf_node"',
    // AREA_BASE_PREFIX: '"/kf_area_proxy"',
    // ESLEANR_BASE_PREFIX: '"/kf_node/esleanrapi"',
    // UCSAPI_BASE_PREFIX: '"/kf_ucsapi_proxy"',
    // GW_BASE_PREFIX: '"/kf_gw_proxy"',
    // VFS_BASE_PREFIX: '"/node/"',
    // UCSAPIKF_BASE_PREFIX: '"/kf_ucsapi_proxy"',




  //测试环境node
  // PLS_BASE_PREFIX: '"/cs_node/plsapi"',
  // SSO_BASE_PREFIX: '"/cs_node"',
  // TMS_BASE_PREFIX: '"/cs_node"',
  // TQMS_BASE_PREFIX: '"/cs_node"',
  // OLMS_BASE_PREFIX: '"/cs_node"',
  // WEBMAIL_BASE_PREFIX: '"/webmailapi"',
  // JXFX_BASE_PREFIX: '"/cs_node"',
  // TIS_BASE_PREFIX: '"/cs_node"',
  // MICRO_BASE_PREFIX: '"/cs_node"',
  // RLMS_BASE_PREFIX: '"/cs_node"',
  // AREA_BASE_PREFIX: '"/cs_area_proxy"',
  // ESLEANR_BASE_PREFIX: '"/cs_node/esleanrapi"',
  // UCSAPI_BASE_PREFIX: '"/cs_ucsapi_proxy"',
  // GW_BASE_PREFIX: '"/cs_gw_proxy"',
  // VFS_BASE_PREFIX: '"/node/"',
  // UCSAPIKF_BASE_PREFIX: '"/cs_ucsapi_proxy"',      
})
