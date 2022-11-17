enum RelationValue {
    Support = 'SUPPORTS',
    Sources = 'SOURCES',
    Contradicts = 'CONTRADICTS',
    Disproves = 'DISPROVES',
    Nuances = 'NUANCES',
    Relates = 'RELATES',
    Expands = 'EXPANDS',
    FollowsUp = 'FOLLOWS_UP',
}

interface RelationOption {
    value: RelationValue
    label: string,
    labelInfix?: string
    optionGroup: 'positive' | 'negative' | 'neutral',
    directional: boolean
}

const relationOptions: Record<RelationValue, RelationOption> = {
    [RelationValue.Support]: {
        value: RelationValue.Support,
        label: 'Supports',
        optionGroup: 'positive',
        directional: false,
    },
    [RelationValue.Contradicts]: {
        value: RelationValue.Contradicts,
        label: 'Contradicts',
        optionGroup: 'negative',
        directional: false,
    },
    [RelationValue.Disproves]: {
        value: RelationValue.Disproves,
        label: 'Disproves',
        optionGroup: 'negative',
        directional: true
    },
    [RelationValue.Sources]: {
        value: RelationValue.Sources,
        label: 'Is a source for',
        optionGroup: 'positive',
        directional: true,
    },
    [RelationValue.Nuances]: {
        value: RelationValue.Nuances,
        label: 'Nuances',
        optionGroup: 'neutral',
        directional: false,
    },
    [RelationValue.Relates]: {
        value: RelationValue.Relates,
        label: 'Relates to',
        optionGroup: 'neutral',
        directional: false,
    },
    [RelationValue.Expands]: {
        value: RelationValue.Expands,
        label: 'Expands',
        optionGroup: 'neutral',
        directional: true
    },
    [RelationValue.FollowsUp]: {
        value: RelationValue.FollowsUp,
        label: 'Follows up',
        optionGroup: 'neutral',
        directional: true
    },
}

export {
    RelationValue,
    relationOptions,
}
