import { asyncRouterMap, constantRouterMap } from '@/router/index';


function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
      return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
      return true
    }
}


const limit = {
    state: {
      routers: constantRouterMap,
      addRouters: []
    },
    mutations: {
      SET_ROUTERS: (state, routers) => {
        state.addRouters = routers;
        state.routers = constantRouterMap.concat(routers);
      }
    },
    actions: {
      GenerateRoutes({ commit }, data) {
        return new Promise(resolve => {
          const { roles } = data;
          const accessedRouters = asyncRouterMap.filter(v => {
            if (roles.indexOf('admin') >= 0) return true;//如果是admin，则有所有权限
            if (hasPermission(roles, v)) {
              if (v.children && v.children.length > 0) {
                v.children = v.children.filter(child => {
                  if (hasPermission(roles, child)) {
                    return child
                  }
                  return false;
                });
                return v
              } else {
                return v
              }
            }
            return false;
          });
          commit('SET_ROUTERS', accessedRouters);
          resolve();
        })
      }
    }
  };
  
  export default limit;