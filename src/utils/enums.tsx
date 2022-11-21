enum RelationValue {
    Support = 'SUPPORTS',
    Sources = 'SOURCES',
    Contradicts = 'CONTRADICTS',
    Disproves = 'DISPROVES',
    Nuances = 'NUANCES',
    Relates = 'RELATES',
    Expands = 'EXPANDS',
    FollowsUp = 'FOLLOWS_UP',
    Comprehensive = 'COMPREHENSIVE',
    Causal = 'CAUSAL',
}

interface RelationOption {
    value: RelationValue
    label: string,
    color: string,
    labelInfix?: string
    optionGroup: 'positive' | 'negative' | 'neutral' | 'timely',
    directional: boolean
}

const relationOptions: Record<RelationValue, RelationOption> = {
    [RelationValue.Support]: {
        value: RelationValue.Support,
        label: 'Supports',
        optionGroup: 'positive',
        directional: false,
        color: '#7ed6df',
    },
    [RelationValue.Causal]: {
        value: RelationValue.Causal,
        label: 'Causes',
        optionGroup: 'positive',
        directional: true,
        color: '#7ed6df',
    },
    [RelationValue.Comprehensive]: {
        value: RelationValue.Comprehensive,
        label: 'is better explained in',
        optionGroup: 'positive',
        directional: true,
        color: '#7ed6df',
    },
    [RelationValue.Contradicts]: {
        value: RelationValue.Contradicts,
        label: 'Contradicts',
        optionGroup: 'negative',
        directional: false,
        color: '#eb4d4b',
    },
    [RelationValue.Disproves]: {
        value: RelationValue.Disproves,
        label: 'Disproves',
        optionGroup: 'negative',
        directional: true,
        color: '#ff7979',
    },
    [RelationValue.Sources]: {
        value: RelationValue.Sources,
        label: 'Is a source for',
        optionGroup: 'positive',
        directional: true,
        color: '#4834d4',
    },
    [RelationValue.Nuances]: {
        value: RelationValue.Nuances,
        label: 'Nuances',
        optionGroup: 'neutral',
        directional: false,
        color: '#7ed6df',
    },
    [RelationValue.Relates]: {
        value: RelationValue.Relates,
        label: 'Relates to',
        optionGroup: 'neutral',
        directional: false,
        color: '#95afc0',
    },
    [RelationValue.Expands]: {
        value: RelationValue.Expands,
        label: 'Expands',
        optionGroup: 'neutral',
        directional: true,
        color: '#535c68',
    },
    [RelationValue.FollowsUp]: {
        value: RelationValue.FollowsUp,
        label: 'Follows up',
        optionGroup: 'neutral',
        directional: true,
        color: '#c7ecee',
    },
}

export {
    RelationValue,
    relationOptions,
}
