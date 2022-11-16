export type ValueType = string;

export interface OptionInterface {
    value: ValueType,
    label: string,
    optionGroup?: string
}
export interface GroupedOptions {
    [k: string]: OptionInterface[]
}

export function groupByOptionGroup(options: OptionInterface[]) {
    const hasOptionGroups = options.find(o => o.optionGroup);
    if (!hasOptionGroups) {
        return undefined;
    }
    const groupedOptions: GroupedOptions = {};
    return options.reduce(
        (list, item) => {
            const optionGroup = item.optionGroup || '';
            if (list.hasOwnProperty(optionGroup) === false) {
                list[optionGroup] = [item];
            } else {
                list[optionGroup].push(item);
            }
            return list;
        },
        groupedOptions
    );
}
