
export const routes = {
    home: '/home',
    publicNets: '/public',
    login: '/login',
    myFiles: '/user/files',
    accountSettings: '/user/settings',
    myProfile: '/user/profile',
    editFile: (fileId: number | string) => `/editor/${fileId}`
}
