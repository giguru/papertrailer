
export const routes = {
    home: '/home',
    publicNets: '/public',
    login: '/login',
    mySources: '/user/sources',
    accountSettings: '/user/settings',
    myProfile: '/user/profile',
    editFile: (fileId: number | string) => `/editor/${fileId}`
}
