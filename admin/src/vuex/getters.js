const getters = {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    sidebar: state => state.app.sidebar,
    routers: state => state.limit.routers
}

export default getters