
export const routes = {
    home: '/home',
    publicNets: '/public',
    login: '/login',
    myFiles: '/user/files',
    myLabels: '/user/labels',
    myOrganisations: '/user/organisations.tsx',
    accountSettings: '/user/settings',
    myProfile: '/user/profile',
    editFile: (fileId: number | string) => `/editor/${fileId}`,
    viewRelation: (fileId: number | string, relationId: number | string) => `/editor/${fileId}?relation_id=${relationId}`,
}
